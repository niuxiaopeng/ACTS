import { Inject, Injectable } from '@angular/core';
import { ActionBind, Dispatcher, State, Store } from '../../../adep/flux';
import { UserService } from '../../services/user.service';
import { CustomerSearchActionType } from '../action/customer-search.action';
import { CustomerSearch, CustomerSearchListEntity, CustomerSelectConditionForm } from '../entity/customer-search.entity';
import { CustomerDetailStore } from './customer-detail.store';

export interface CustomerSearchState extends State {
    customerSelectConditionForm: CustomerSelectConditionForm;
    customerSearchListEntity: CustomerSearchListEntity;
    errors: any;
}

/**
 * 顧客検索画面のStore
 */
@Injectable()
export class CustomerSearchStore extends Store<CustomerSearchState> {
    constructor(private customerDetailStore: CustomerDetailStore) {
        super();
        this.state = {
            customerSelectConditionForm: new CustomerSelectConditionForm(),
            customerSearchListEntity: {
                customerInfo: []
            },
            errors: undefined
        };
    }

    /**
     *  顧客情報検索APIのレスポンスを設定する
     * @param {CustomerSearch[]} data 顧客情報検索結果
     */
    @ActionBind(CustomerSearchActionType.GET_CUSTOMER_LIST)
    private setCustomerList(data: CustomerSearch[]) {
        console.log('customer-search.store.setCustomerList');
        // エラー情報をクリアする(正常終了したのに、前回エラー情報が画面に表示されてしまうため)
        this.state.errors = undefined;

        // Stateに検索結果をセットし、画面に表示する
        const customerSearchListEntity = new CustomerSearchListEntity();
        customerSearchListEntity.customerInfo = data;
        this.state.customerSearchListEntity = customerSearchListEntity;
    }

    /**
     *  顧客情報詳細画面へ引き継ぐ編集情報を設定する
     *  顧客情報詳細画面へ遷移する処理を呼び出す
     * @param {any} data 編集情報（編集区分、顧客No）
     */
    @ActionBind(CustomerSearchActionType.SET_EDIT_INFO)
    private setEditInfo(data: any) {
        console.log('customer-search.store.setEditInfo');
        console.log(data.customerNo);

        // 次画面のStateに編集モード、顧客Noをセットし、必要な情報を引き渡している
        this.customerDetailStore.getState().editType = data.editType;
        this.customerDetailStore.getState().customerNo = data.customerNo;
        // 登録しておいたイベントを発火させる
        this.sendSignal('NAVIGATE_TO_CUSTOMER_DETAIL');
    }

    /**
     *  エラーを設定する
     * @param {any} errors エラー
     */
    @ActionBind(CustomerSearchActionType.ERROR)
    private handleError(errors: any) {
        console.log('customer-search.store.handleError');
        // エラー情報を画面に表示するため、Stateにセットする
        this.state.errors = errors;
        // 前回検索結果をクリアする(検索結果が存在しなかったのに、前回検索結果が表示されると、エラー情報と不整合になるため)
        this.state.customerSearchListEntity.customerInfo = [];
    }
}
