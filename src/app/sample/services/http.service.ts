import { Injectable } from '@angular/core';
import { Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend } from '@angular/http';
import { Dispatcher, SystemErrorActionType } from 'adep/flux';
import { Observable } from 'rxjs';
import {UserService} from './user.service';

@Injectable()
export class HttpService extends Http {
    private SUCCESS_STATUS = 'SUCCESS';
    private SYSTEM_ERROR_STATUS = 'SYSTEM_ERROR';

    constructor(backend: XHRBackend, options: RequestOptions, private userService: UserService, private dispatch: Dispatcher) {
        super(backend, options);
    }

    public get(url: string, options?: any): Observable<any> {
        // TODO: add headers and error handling if necessary
        const headers = new Headers({
            'Content-Type': 'application/json',
            'AppVersion': '1.0.0',
            'DeviceId': 'Browser',
            'Authorization': 'Bearer ' + this.userService.authToken});
        options = new RequestOptions({headers: headers});
        return super.get(url, options)
            .catch((res) => {
                this.dispatch.dispatch({
                    actionType: SystemErrorActionType.SYSTEM_ERROR,
                    data: null
                });
                return Observable.throw(res);
            })
            .map((res) => {
                const payload = res.json();

                if (payload.status === this.SYSTEM_ERROR_STATUS) {
                    this.dispatch.dispatch({
                        actionType: SystemErrorActionType.SYSTEM_ERROR,
                        data: null
                    });
                }
                if (payload.status !== this.SUCCESS_STATUS) {
                    // treat responce as an error if status is not 'SUCCESS'
                    throw res;
                }
                return res;
            });
    }

    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        // TODO: add headers and error handling if necessary
        const headers = new Headers({
            'Content-Type': 'application/json',
            'AppVersion': '1.0.0',
            'DeviceId': 'Browser',
            'Authorization': 'Bearer ' + this.userService.authToken});
        options = new RequestOptions({headers: headers});
        return super.post(url, body, options)
            .catch((res) => {
                this.dispatch.dispatch({
                    actionType: SystemErrorActionType.SYSTEM_ERROR,
                    data: null
                });
                return Observable.throw(res);
            })
            .map((res) => {
                const payload = res.json();

                if (payload.status === this.SYSTEM_ERROR_STATUS) {
                    this.dispatch.dispatch({
                        actionType: SystemErrorActionType.SYSTEM_ERROR,
                        data: null
                    });
                }
                if (payload.status !== this.SUCCESS_STATUS) {
                    // treat responce as an error if status is not 'SUCCESS'
                    throw res;
                }
                return res;
            });
    }
}
