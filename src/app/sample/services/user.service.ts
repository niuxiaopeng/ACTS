import { Injectable } from '@angular/core';
import { Dispatcher } from 'adep/flux';

@Injectable()
export class UserService {

    private _authToken: string;

    constructor(private dispatch: Dispatcher) {
    }

    get authToken() {
        return this._authToken;
    }
    set authToken(authToken: string) {
        this._authToken = authToken;
    }
}
