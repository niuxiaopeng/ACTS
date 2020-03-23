import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions} from '@angular/http';
import { Action, Dispatcher } from 'adep/flux';
import { JsonTypeMapper } from 'adep/json/';
import { AppProperties } from 'app.properties';
import { HomeEntity } from '../entity/home.entity';

export namespace HomeActionType {
    export const LOGIN: string = 'HomeActionType_LOGIN';
    export const ERROR: string = 'HomeActionType_ERROR';
    export const GET_ACCOUNT_INFO: string = 'HomeActionType_GET_ACCOUNT_INFO';
}

/**
 * トップページのログイン画面(タブ)のAction。
 */
@Injectable()
export class HomeAction extends Action {
    constructor(private http: Http) {
        super();
    }

   /**
    * ログインする
    * @param {string} email Eメール
    * @param {string} loginPassword ログインパスワード
    */
    public login(email: string, loginPassword: string) {
        console.log('home.action.login');

        // ここでServerのAPIを呼び出す。postの第一引数はAPIのURL、第二引数はリクエストパラメータ(json)
        this.http.post(AppProperties.API_ROOT + '/auth/login',
                                        {email: email, loginPassword: loginPassword}).subscribe(
            (response) => {
                // ここでは、APIが正常終了した場合の処理を記述する
                // 厳密にはレスポンスのstatus=SUCCESSとなっている場合となるが、
                // ハンドリングはHttpService#post()で行っている
                const payload = response.json();

                // 正常終了した場合は、ActionType(HomeActionType.LOGIN)で紐付けたStoreにディスパッチする
                // dataには、Storeにディスパッチする際に連携するデータ、ここではAPIのレスポンス内容をEntityにマッピングした上で連携している
                this.dispatcher.dispatch({
                    actionType: HomeActionType.LOGIN,
                    data: JsonTypeMapper.parse(HomeEntity, payload.result)
                });
            },
            (response) => {
                // ここでは、APIが異常終了した場合の処理を記述する
                // 具体的にはレスポンスのstatusがSUCCESS以外(VALIDATION_FAILUREとか)の場合
                const payload = response.json();

                // ディスパッチの仕方は正常終了時と同様
                this.dispatcher.dispatch({
                    actionType: HomeActionType.ERROR,
                    data: payload.errors
                });
            }
        );
    }
}
