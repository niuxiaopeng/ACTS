import { Inject, Injectable } from '@angular/core';
import { ActionBind, Dispatcher, State, Store } from 'adep/flux';
import { AboutActionType } from '../action/about.action';

export interface AboutState extends State {
    message: string;
}

@Injectable()
export class AboutStore extends Store<AboutState> {
    constructor() {
        super();
        this.state = {
            message: undefined
        };
    }

    @ActionBind(AboutActionType.INIT)
    private initAboutState(data: any) {
        this.state = data;
    }

}
