import { Inject, Injectable } from '@angular/core';
import { LabelService } from 'adep/services';
import { ActionBind, Dispatcher, State, Store } from '../../../adep/flux';
import { JtasConstants } from '../../jtas.const';
import { UserService } from '../../services/user.service';
import { CustomerDetailActionType } from '../action/customer-detail.action';
import { FamilyForm, FamilySearchListEntity } from '../entity/family.entity';
import { CustomerDetailForm } from '../entity/customer-detail.entity';

export interface CustomerDetailState extends State {
    /** 編集区分 */
    editType: string;
    /** 顧客No */
    customerNo: string;
    customerDetailForm: CustomerDetailForm;
    familySearchListEntity: FamilySearchListEntity;
    isFamEditMode: object;
    errors: any;
    /** 登録・更新結果 */
    result: string;
}

/**
 * 顧客詳細画面のStore
 */
@Injectable()
export class CustomerDetailStore extends Store<CustomerDetailState> {
    constructor(private labelService: LabelService) {
        super();
        this.state = {
            editType: undefined,
            customerNo: undefined,
            customerDetailForm: new CustomerDetailForm(),
            // ここで初期化しないといけない？
            familySearchListEntity: {
                familyInfo: []
            },
            isFamEditMode: {},
            errors: undefined,
            result: undefined
        };
    }

    /**
     *  顧客詳細情報を設定する
     */
    @ActionBind(CustomerDetailActionType.GET_CUSTOMER_INFO)
    private getCustomerInfo(data: CustomerDetailForm) {
        console.log('customer-detail.store.getCustomerInfo');
        // Stateのエラー情報をクリアする(前回エラー情報が画面に表示されることを防ぐため)
        this.state.errors = undefined;
        // 初期表示する顧客詳細情報(APIレスポンス)をStateに保持する
        this.state.customerDetailForm = data;
        // 予めComponentの初期処理で登録しておいたイベントを発火させる
        this.sendSignal('getCustomerInfo');
        window.scrollTo(0, 0);
    }

    /**
     *  家族情報の取得完了処理
     */
    @ActionBind(CustomerDetailActionType.GET_FAMILY_INFO)
    private getFamilyInfo(data: FamilyForm[]) {
        console.log('customer-detail.store.createFamilyInfo');
        // Stateのエラー情報をクリアする(前回エラー情報が画面に表示されることを防ぐため)
        this.state.errors = undefined;
        console.log(data);
        // 編集
        data = this.editFamilyInfoList(data);
        this.state.familySearchListEntity.familyInfo = data;
    }

    /**
     *  家族情報の新規登録完了処理
     */
    @ActionBind(CustomerDetailActionType.CREATE_FAMILY_INFO)
    private createFamilyInfo(data: FamilyForm[]) {
        console.log('customer-detail.store.createFamilyInfo');
        // Stateのエラー情報をクリアする(前回エラー情報が画面に表示されることを防ぐため)
        this.state.errors = undefined;
        console.log(data);
        // 編集
        data = this.editFamilyInfoList(data);
        this.state.familySearchListEntity.familyInfo = data;
        // メッセージを画面に表示するため、LabelServiceからメッセージを取得している
        this.state.result = this.labelService.labels.common.message.success_create;
    }

    /**
     *  家族情報の削除完了処理
     */
    @ActionBind(CustomerDetailActionType.DELETE_FAMILY_INFO)
    private deleteFamilyInfo(data: FamilyForm[]) {
        console.log('customer-detail.store.createFamilyInfo');
        // Stateのエラー情報をクリアする(前回エラー情報が画面に表示されることを防ぐため)
        this.state.errors = undefined;
        // 編集
        data = this.editFamilyInfoList(data);
        this.state.familySearchListEntity.familyInfo = data;
        // メッセージを画面に表示するため、LabelServiceからメッセージを取得している
        this.state.result = this.labelService.labels.common.message.success_create;
    }

    /**
     *
     * @param data
     */
    private editFamilyInfoList(data: FamilyForm[]) {
        console.log(data);
        var con = JtasConstants;
        data.forEach(function(elem) {
            var arr = con.RELATIONSHIP.filter(function( conEle ) {
                return elem.relationship == conEle.val;
            });
            if ( arr.length > 0 ) {
                elem.relationship = arr[0].disp;
            }
        });
        return data;
    }

    /**
     *  顧客情報の新規登録完了処理
     */
    @ActionBind(CustomerDetailActionType.CREATE_CUSTOMER_INFO)
    private createCustomerInfo(data: CustomerDetailForm) {
        console.log('customer-detail.store.createCustomerInfo');
        // Stateのエラー情報をクリアする(前回エラー情報が画面に表示されることを防ぐため)
        this.state.errors = undefined;
        // 新規登録→更新モードにするために、再度初期処理を実行するのではなく、初期処理実行後の状態をつくりだしている
        this.state.customerDetailForm = data;
        this.state.customerNo = this.state.customerDetailForm.customerNo;
        // メッセージを画面に表示するため、LabelServiceからメッセージを取得している
        this.state.result = this.labelService.labels.common.message.success_create;
        // 編集モードを新規登録→更新モードにする
        this.state.editType = JtasConstants.EDIT_TYPE_EDIT;
        window.scrollTo(0, 0);
    }

    /**
     *  顧客情報の更新完了処理
     */
    @ActionBind(CustomerDetailActionType.UPDATE_CUSTOMER_INFO)
    private updateCustomerInfo() {
        console.log('customer-detail.store.updateCustomerInfo');
        // Stateのエラー情報をクリアする(前回エラー情報が画面に表示されることを防ぐため)
        this.state.errors = undefined;
        // 更新完了した旨のメッセージをセットし、画面に表示する
        this.state.result = this.labelService.labels.common.message.success_update;
        window.scrollTo(0, 0);
    }

    /**
     *  顧客情報の削除完了処理
     */
    @ActionBind(CustomerDetailActionType.DELETE_CUSTOMER_INFO)
    private deleteCustomerInfo() {
        console.log('customer-detail.store.deleteCustomerInfo');
        // Stateのエラー情報をクリアする(前回エラー情報が画面に表示されることを防ぐため)
        this.state.errors = undefined;
        // 更新完了した旨のメッセージをセットし、画面に表示する
        this.state.result = this.labelService.labels.common.message.success_update;
        // 編集モードを更新モード→新規登録にする
        this.state.editType = JtasConstants.EDIT_TYPE_CREATE;
        window.scrollTo(0, 0);
    }

    /**
     *  Stateをクリアする
     */
    @ActionBind(CustomerDetailActionType.CREAR_STATE)
    private clearState() {
        console.log('customer-detail.store.clearState');
        // State情報をクリアする
        this.state.editType = undefined;
        this.state.customerNo = undefined;
        this.state.customerDetailForm = new CustomerDetailForm();
        this.state.familySearchListEntity = new FamilySearchListEntity();
        this.state.errors = undefined;
        this.state.result = undefined;
        // 予めComponentの初期処理で登録しておいたイベントを発火させる
        this.sendSignal('NAVIGATE_TO_CUSTOMER_SEARCH');
    }

    /**
     *  エラーを設定する
     * @param {any} errors エラー
     */
    @ActionBind(CustomerDetailActionType.ERROR)
    private handleError(errors: any) {
        console.log('customer-detail.store.handleError');
        // 新規登録・更新が完了した際にセットしたメッセージをクリアする。(前回の完了メッセージを表示させないようにするため)
        this.state.result = undefined;
        // エラーメッセージを整形する
        // APIのエラーメッセージは、項目名が汎用的なメッセージ(ex.@@Fieldは必須項目です)になっている
        // 従って、@@Fieldを実際の項目名(message_ja.yamlの項目名)に置換する共通処理が用意されていて、このタイミングで置換処理を実行したうえで、Stateにエラー情報をセットしている
        this.replaceErrorFieldName(errors.fields, [
            { field: 'customerNo', label: this.labelService.labels.customer.customerNo },
            { field: 'nameKanji', label: this.labelService.labels.customer.nameKanji },
            { field: 'nameKana', label: this.labelService.labels.customer.nameKana },
            { field: 'gender', label: this.labelService.labels.customer.gender },
            { field: 'birthday', label: this.labelService.labels.customer.birthday },
            { field: 'telNo', label: this.labelService.labels.customer.telNo },
            { field: 'addressZip', label: this.labelService.labels.customer.addressZip },
            { field: 'address', label: this.labelService.labels.customer.address },
            { field: 'email', label: this.labelService.labels.customer.email }
        ]);
        this.state.errors = errors;
        window.scrollTo(0, 0);
    }

    /**
     *  エラーを設定する
     * @param {any} errors エラー
     */
    @ActionBind(CustomerDetailActionType.FAMILY_ERROR)
    private handleErrorFamily(errors: any) {
        console.log('customer-detail.store.handleError');
        // 新規登録・更新が完了した際にセットしたメッセージをクリアする。(前回の完了メッセージを表示させないようにするため)
        this.state.result = undefined;
        // エラーメッセージを整形する
        // APIのエラーメッセージは、項目名が汎用的なメッセージ(ex.@@Fieldは必須項目です)になっている
        // 従って、@@Fieldを実際の項目名(message_ja.yamlの項目名)に置換する共通処理が用意されていて、このタイミングで置換処理を実行したうえで、Stateにエラー情報をセットしている
        this.replaceErrorFieldName(errors.fields, [
            { field: 'customerNo', label: this.labelService.labels.family.customerNo },
            { field: 'nameKanjiF', label: this.labelService.labels.family.nameKanji },
            { field: 'genderF', label: this.labelService.labels.family.gender },
        ]);
        console.log('## errors: ');
        console.log(errors);
        this.state.errors = errors;
        window.scrollTo(0, 0);
    }
}
