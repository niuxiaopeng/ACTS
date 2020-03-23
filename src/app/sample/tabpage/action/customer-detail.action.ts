import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions} from '@angular/http';
import { Action, Dispatcher } from 'adep/flux';
import { JsonTypeMapper } from 'adep/json/';
import { AppProperties } from 'app.properties';
import { CustomerDetailForm } from '../entity/customer-detail.entity';
import { FamilyForm } from '../entity/family.entity';

export namespace CustomerDetailActionType {
    export const GET_CUSTOMER_INFO: string = 'CustomerDetailActionType_GET_CUSTOMER_INFO';
    export const GET_FAMILY_INFO: string = 'CustomerDetailActionType_GET_FAMILY_INFO';
    export const CREATE_FAMILY_INFO: string = 'CustomerDetailActionType_CREATE_FAMILY_INFO';
    export const UPDATE_FAMILY_INFO: string = 'CustomerDetailActionType_UPDATE_FAMILY_INFO';
    export const DELETE_FAMILY_INFO: string = 'CustomerDetailActionType_DELETE_FAMILY_INFO';
    export const CREATE_CUSTOMER_INFO: string = 'CustomerDetailActionType_CREATE_CUSTOMER_INFO';
    export const UPDATE_CUSTOMER_INFO: string = 'CustomerDetailActionType_UPDATE_CUSTOMER_INFO';
    export const DELETE_CUSTOMER_INFO: string = 'CustomerDetailActionType_DELETE_CUSTOMER_INFO';
    export const CREAR_STATE: string = 'CustomerDetailActionType_CREAR_STATE';
    export const ERROR: string = 'CustomerDetailActionType_ERROR';
    export const FAMILY_ERROR: string = 'CustomerDetailActionType_FAMILY_ERROR';
}

/**
 * 顧客詳細画面のAction
 */
@Injectable()
export class CustomerDetailAction extends Action {
    constructor(private http: Http) {
        super();
    }

    /**
     * 顧客詳細情報を取得する
     * @param {string} customerNo 顧客No
     */
    public getCustomerInfo(customerNo: string) {
        console.log('customer-detail.action.getCustomerInfo');
        console.log('customerNo=' + customerNo);
        // 顧客情報詳細を取得するAPIを実行する
        this.http.get(AppProperties.API_ROOT + '/customer/detail/retrieve?customerNo=' + customerNo).subscribe(
            (response) => {
                // APIが正常終了した場合
                const payload = response.json();
                this.dispatcher.dispatch({
                    actionType: CustomerDetailActionType.GET_CUSTOMER_INFO,
                    data: JsonTypeMapper.parse(CustomerDetailForm, payload.result)
                });
            },
            (response) => {
                // APIがエラーで終了した場合
                const payload = response.json();
                this.dispatcher.dispatch({
                        actionType: CustomerDetailActionType.ERROR,
                        data: payload.errors
                });
            }
        );
    }

    /**
     * 家族情報リストを取得する
     * @param {familyForm} familyForm 登録する顧客情報
     */
    public getFamilyInfo(customerNo: String) {
        console.log('customer-detail.action.getCustomerInfo');
        console.log('customerNo=' + customerNo);
        // 顧客情報を登録するAPIを実行する
        this.http.get(AppProperties.API_ROOT + '/customer/detail/retrieveFamilies?customerNo=' + customerNo).subscribe(
            (response) => {
                // APIが正常終了した場合
                const payload = response.json();
                console.log('## createFamilyInfo resp');
                JsonTypeMapper.parse(FamilyForm, payload.result);
                console.log(payload);
                this.dispatcher.dispatch({
                    actionType: CustomerDetailActionType.GET_FAMILY_INFO,
                    data: payload.result
                });
            },
            (response) => {
                // APIがエラーで終了した場合
                const payload = response.json();
                this.dispatcher.dispatch({
                        actionType: CustomerDetailActionType.ERROR,
                        data: payload.errors
                });
            }
        );
    }

    /**
     * 家族情報を新規登録する
     * @param {familyForm} familyForm 登録する顧客情報
     */
    public createFamilyInfo(familyForm: FamilyForm) {
        console.log('customer-detail.action.createCustomerInfo');
        console.log(familyForm);
        // 顧客情報を登録するAPIを実行する
        this.http.post(AppProperties.API_ROOT + '/customer/detail/createFamily',
                                        familyForm).subscribe(
            (response) => {
                // APIが正常終了した場合
                const payload = response.json();
                console.log('## createFamilyInfo resp');
                JsonTypeMapper.parse(FamilyForm, payload.result);
                console.log(payload);
                this.dispatcher.dispatch({
                    actionType: CustomerDetailActionType.CREATE_FAMILY_INFO,
                    data: payload.result
                });
            },
            (response) => {
                // APIがエラーで終了した場合

                // TODO: beanのフィールド名と、エラーハイライトの定義名が一致する必要があるため、応急処置
                const payload = this.modifyFamilyErrorField(response);

                this.dispatcher.dispatch({
                        actionType: CustomerDetailActionType.FAMILY_ERROR,
                        data: payload.errors
                });
            }
        );
    }

    /**
     * 家族情報を更新する
     * @param familyForm
     */
    public updateFamily(familyForm: FamilyForm) {
        console.log('customer-detail.action.updateCustomerInfo');
        console.log(familyForm);
        // 顧客情報を登録するAPIを実行する
        this.http.post(AppProperties.API_ROOT + '/customer/detail/updateFamily',
                                        familyForm).subscribe(
            (response) => {
                // APIが正常終了した場合
                const payload = response.json();
                console.log('## updateFamilyInfo resp');
                JsonTypeMapper.parse(FamilyForm, payload.result);
                console.log(payload);
                this.dispatcher.dispatch({
                    // actionType: CustomerDetailActionType.UPDATE_FAMILY_INFO,
                    actionType: CustomerDetailActionType.CREATE_FAMILY_INFO,
                    data: payload.result
                });
            },
            (response) => {
                // APIがエラーで終了した場合
                // TODO: beanのフィールド名と、エラーハイライトの定義名が一致する必要があるため、応急処置
                const payload = this.modifyFamilyErrorField(response);
                this.dispatcher.dispatch({
                        actionType: CustomerDetailActionType.FAMILY_ERROR,
                        data: payload.errors
                });
            }
        );
    }

    /**
     * 家族情報を削除する
     * @param {familyForm} familyForm 登録する顧客情報
     */
    public deleteFamilyInfo(familyForm: FamilyForm) {
        console.log('customer-detail.action.deleteCustomerInfo');
        console.log(familyForm);
        // 顧客情報を登録するAPIを実行する
        this.http.post(AppProperties.API_ROOT + '/customer/detail/deleteFamily',
                                        familyForm).subscribe(
            (response) => {
                // APIが正常終了した場合
                const payload = response.json();
                console.log('## deleteFamilyInfo resp');
                JsonTypeMapper.parse(FamilyForm, payload.result);
                console.log(payload);
                this.dispatcher.dispatch({
                    actionType: CustomerDetailActionType.DELETE_FAMILY_INFO,
                    data: payload.result
                });
            },
            (response) => {
                // APIがエラーで終了した場合
                const payload = response.json();
                this.dispatcher.dispatch({
                        actionType: CustomerDetailActionType.FAMILY_ERROR,
                        data: payload.errors
                });
            }
        );
    }

    /**
     * 顧客情報を新規登録する
     * @param {customerDetailForm} customerDetailForm 登録する顧客情報
     */
    public createCustomerInfo(customerDetailForm: CustomerDetailForm) {
        console.log('customer-detail.action.createCustomerInfo');

        // 顧客情報を登録するAPIを実行する
        this.http.post(AppProperties.API_ROOT + '/customer/detail/create',
                                        customerDetailForm).subscribe(
            (response) => {
                // APIが正常終了した場合
                const payload = response.json();
                this.dispatcher.dispatch({
                    actionType: CustomerDetailActionType.CREATE_CUSTOMER_INFO,
                    data: customerDetailForm
                });
            },
            (response) => {
                // APIがエラーで終了した場合
                const payload = response.json();
                this.dispatcher.dispatch({
                        actionType: CustomerDetailActionType.ERROR,
                        data: payload.errors
                });
            }
        );
    }

    /**
     * 顧客情報を更新する
     * @param {customerDetailForm} customerDetailForm 更新する顧客情報
     */
    public updateCustomerInfo(customerDetailForm: CustomerDetailForm) {
        console.log('customer-detail.action.updateCustomerInfo');

        // 顧客情報を更新するAPIを実行する
        this.http.post(AppProperties.API_ROOT + '/customer/detail/update',
                                        customerDetailForm).subscribe(
            (response) => {
                // APIが正常終了した場合
                const payload = response.json();
                this.dispatcher.dispatch({
                    actionType: CustomerDetailActionType.UPDATE_CUSTOMER_INFO
                });
            },
            (response) => {
                // APIがエラーで終了した場合
                const payload = response.json();
                this.dispatcher.dispatch({
                        actionType: CustomerDetailActionType.ERROR,
                        data: payload.errors
                });
            }
        );
    }

    /**
     * 顧客情報を更新する
     * @param {customerDetailForm} customerDetailForm 更新する顧客情報
     */
    public deleteCustomerInfo(customerDetailForm: CustomerDetailForm) {
        console.log('customer-detail.action.deleteCustomerInfo');

        // 顧客情報を更新するAPIを実行する
        this.http.post(AppProperties.API_ROOT + '/customer/detail/delete',
                                        customerDetailForm).subscribe(
            (response) => {
                // APIが正常終了した場合
                console.log('## deleteCustomerInfo success');
                const payload = response.json();
                this.dispatcher.dispatch({
                    actionType: CustomerDetailActionType.DELETE_CUSTOMER_INFO
                });
            },
            (response) => {
                // APIがエラーで終了した場合
                console.log('## deleteCustomerInfo fail');
                const payload = response.json();
                this.dispatcher.dispatch({
                        actionType: CustomerDetailActionType.ERROR,
                        data: payload.errors
                });
            }
        );
    }

    /**
     * Stateをクリアする
     */
    public clearState() {
        console.log('customer-detail.action.clearState');
        // Stateの情報をクリアするだけなので、Storeへディスパッチする際に連携するデータ(data)は特にない
        this.dispatcher.dispatch({
                actionType: CustomerDetailActionType.CREAR_STATE,
                data: {}
        });
    }

     /**
      *  Family用の氏名漢字にフィールド名を編集する。
      *
      * @param response
      */
    private modifyFamilyErrorField(response: any) {
        const tmp  = response.json();
        if (tmp.errors.fields && tmp.errors.fields.length > 0) {
            const idx = [];
            let cnt: number = 0;
            tmp.errors.fields.forEach((element: any) => {
                if  (element.field === 'nameKanji') {
                    idx.push(cnt);
                    const msg = tmp.errors.fields[cnt].message;
                    tmp.errors.fields.splice(cnt, 1);
                    tmp.errors.fields.splice(cnt, 0, {field: 'nameKanjiF', message: msg});
                }
                cnt++;
            });
        }
        return tmp;
    }
}
