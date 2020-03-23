import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { Action, Dispatcher } from 'adep/flux';
import { JsonTypeMapper } from 'adep/json/';
import { AppProperties } from 'app.properties';
import { CustomerSearch, CustomerSearchListEntity, CustomerSelectConditionForm } from '../entity/customer-search.entity';
import { Observable } from "rxjs/Observable";

export namespace CustomerSearchActionType {
    export const GET_CUSTOMER_LIST: string = 'CustomerSearchActionType_GET_CUSTOMER_LIST';
    export const SET_EDIT_INFO: string = 'CustomerSearchActionType_SET_EDIT_INFO';
    export const ERROR: string = 'CustomerSearchActionType_ERROR';
}

/**
 * 顧客検索画面のAction
 */
@Injectable()
export class CustomerSearchAction extends Action {
    constructor(private http: Http) {
        super();
    }

   /**
    * 顧客情報検索結果を取得する
    * @param {CustomerSelectConditionForm} customerSelectConditionForm 検索条件
    */
    public getCustomerList(customerSelectConditionForm: CustomerSelectConditionForm) {
        console.log('customer-search.action.getCustomerList');

        // Serverの顧客一覧検索APIを実行する
        this.http.post(AppProperties.API_ROOT + '/customer/list/select',
                                        customerSelectConditionForm).subscribe(
            (response) => {
                // APIが正常終了した場合
                const payload = response.json();
                this.dispatcher.dispatch({
                    actionType: CustomerSearchActionType.GET_CUSTOMER_LIST,
                    data: JsonTypeMapper.parse(CustomerSearch, payload.result)
                });
            },
            (response) => {
                // APIがエラーで終了した場合
                const payload = response.json();
                this.dispatcher.dispatch({
                        actionType: CustomerSearchActionType.ERROR,
                        data: payload.errors
                });
            }
        );
    }

    /**
     * CSV文字列を取得し、ファイル化してダウンロードする
     *
     * @param customerSelectConditionForm サーバに渡す
     */
    public downloadCsv(customerSelectConditionForm: CustomerSelectConditionForm): Observable<Object[]> {
        var f = new FormData()
        for (var k in customerSelectConditionForm) {
            f.append(k, customerSelectConditionForm[k]);
        }
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", AppProperties.API_ROOT + '/customer/list/downloadCsv', true);
            // ダウンロードする文字列をSJIS化
            xhr.overrideMimeType("text/csv;charset=Shift-JIS");
            xhr.setRequestHeader("Accept", "*/*");
            // xhr.setRequestHeader("Accept-Charset", "Shift_JIS");
            xhr.setRequestHeader('Content-Type', 'application/json');
            // FWの認証チェック系を通す
            xhr.setRequestHeader("AppVersion", "1.0.0");
            // CORS
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 2) {
                    if (xhr.status === 200) {
                        // textで受ける（こうやるとExcelで化ける）
                        // xhr.responseType = "text";

                        // blobで受ける
                        xhr.responseType = "blob";
                    }
                }
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // blobで保持（こうやるとExcelで化ける）
                        // var blob = new Blob([xhr.response], { 'type' : 'text/csv;charset=sjis;' });
                        // observer.next(blob);

                        // xhr.responseがBlob
                        console.log(xhr.response);
                        observer.next(xhr.response);
                        observer.complete();
                    } else {
                        observer.error(xhr);
                    }
                }
            }
            // text形式で送信
            xhr.send(JSON.stringify(customerSelectConditionForm));
        });
    }

   /**
    * 顧客情報詳細画面へ編集情報（編集区分、顧客No）を渡す
    * @param {string} editType 編集区分
    * @param {string} customerNo 顧客No
    */
    public setEditInfo(editType: string, customerNo: string) {
        console.log('customer-search.action.setEditInfo');
        console.log(customerNo);

        // 編集モード(editType)と顧客NoをStateに保持するだけなので、ServerのAPIは不要で、そのままStoreにディスパッチしている
        this.dispatcher.dispatch({
            actionType: CustomerSearchActionType.SET_EDIT_INFO,
            data: {
                editType: editType,
                customerNo: customerNo
            }
        });
    }
}
