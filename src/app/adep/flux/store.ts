import { Router } from '@angular/router';
import { ActionBind } from 'adep/flux';
import 'reflect-metadata';
import { InjectionUtils } from '../utils';
import { SystemErrorActionType } from './action';
import { Dispatcher } from './dispatcher';
import { EventContainer } from './event';
import { State } from './state';

export abstract class Store<T extends State> {
    protected dispatcher;
    protected get state(): T {
        return this._state;
    }

    protected set state(value: T) {
        if (!this._state) {
            this._state = value;
        } else {
            Object.keys(this._state).forEach((key) => {
                delete this._state[key];
            });

            Object.keys(value).forEach((key) => {
                this._state[key] = value[key];
            });
        }
    }
    protected signalEvents = new EventContainer();

    private _state: T;

    /**
     * Replace state object with a given object.
     * Note that this method will break reference of existing state object.
     *
     * @param: value
     */
    protected replaceState(value: T) {
        this._state = value;
    }

    constructor() {
        this.dispatcher = InjectionUtils.injector.get(Dispatcher);
        this.bindActions();
    }

    public destroy() {
        this.unbindActions();
    }

    public getState(): T {
        return this._state;
    }

    public registerSignalHandler(signal: string, handler: Function) {
        this.signalEvents.subscribe(signal, handler);
    }

    public unregisterSignalHandler(signal: string) {
        this.signalEvents.unsubscribe(signal);
    }

    public sendSignal(signal: string, data?: any) {
        this.signalEvents.emit(signal, data);
    }

    /**
     * Replace a field name placeholder in error messages sent from a server.
     *
     * @param {Array<{ field: string, message: string }>} fieldErrors
     * @param {Array<{ field: string, label: string }>} fieldNameMap
     * @returns
     */
    public replaceErrorFieldName(fieldErrors: Array<{ field: string, message: string }>,
                                 fieldNameMap: Array<{ field: string, label: string }>) {
        if (!fieldErrors) {
            return;
        }
        const placeHolder = '@@Field';
        return fieldErrors.map(
            (error) => {
                const replacingLabelObj = fieldNameMap.find((item) => item.field === error.field);
                const replacingLabel = replacingLabelObj ? replacingLabelObj.label : '';
                return error.message = this.replaceStrByRegExp(error.message, placeHolder, replacingLabel);
            }
        );
    }

    private replaceStrByRegExp(target: string, token: string, replacer: string) {
        const regexp = new RegExp(token, 'gi');
        return target.replace(regexp, replacer);
    }

    @ActionBind(SystemErrorActionType.SYSTEM_ERROR)
    private systemError() {
        const router = InjectionUtils.injector.get(Router);
        router.navigate(['sample/system-error'], {});
    }

    private bindActions() {
        // tslint:disable-next-line:
        for (const m in this) {
            const decorator = Reflect.getMetadata('actionBind', this, m);
            if (decorator == null) {
                continue;
            }
            this.dispatcher.register(decorator.actionType, this, m);
        }
    }

    private unbindActions() {
        for (const m in this) {
            const decorator = Reflect.getMetadata('actionBind', this, m);
            if (decorator == null) {
                continue;
            }
            this.dispatcher.unregister(decorator.actionType, this);
        }
    }
}
