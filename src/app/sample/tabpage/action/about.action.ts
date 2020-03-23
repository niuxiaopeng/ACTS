import { Injectable } from '@angular/core';
import { Action, Dispatcher } from 'adep/flux';

export namespace AboutActionType {
    export const INIT: string = 'AboutActionType_INIT';
}

@Injectable()
export class AboutAction extends Action {
    constructor() {
        super();
    }

    public retrieveAboutMessage() {
        this.dispatcher.dispatch(
            {
                actionType: AboutActionType.INIT,
                data: { message: 'Hello WebApp' }
            }
        );
    }
}
