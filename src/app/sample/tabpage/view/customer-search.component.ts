import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'adep/components';
import { ObjectUtils } from 'adep/utils';
import { JtasConstants } from '../../jtas.const';
import { UserService } from '../../services/user.service';
import { CustomerSearchAction } from '../action/customer-search.action';
import { CustomerSelectConditionForm } from '../entity/customer-search.entity';
import { CustomerSearchState, CustomerSearchStore } from '../store/customer-search.store';

/**
 * 顧客検索画面のComponent
 */
@Component({
    selector: 'customer-search-component',
    templateUrl: 'customer-search.component.html'
})
export class CustomerSearchComponent  extends BaseComponent implements OnInit, OnDestroy {

    /** 画面表示情報 */
    public state: CustomerSearchState;
    /** 検索項目(入力内容) */
    public customerSelectConditionForm: CustomerSelectConditionForm;

    /** 年齢（入力内容） */
    public minAge: number;
    public maxAge: number;

    constructor(
        private action: CustomerSearchAction,
        private customerSearchStore: CustomerSearchStore,
        private userService: UserService,
        private router: Router) {
        super();
        this.state = this.customerSearchStore.getState();
        this.minAge = undefined;
        this.maxAge = undefined;
    }

    /**
     * 初期処理
     */
    public ngOnInit(): void {
        // Stateに保持している検索条件を画面内に初期表示するためにセットしている(詳細画面から戻った際に前回検索条件が表示されるようにするため)
        // State以外の情報は、画面遷移すると破棄されてしまう
        // Cloneしてクラス内変数に保持しているのは、Stateをそのまま検索フォームにバインドしてしまうと、Componentで編集されてしまい、Fluxのルール違反となるため
        this.customerSelectConditionForm = ObjectUtils.clone(this.state.customerSelectConditionForm);

        // 初期表示で検索する
        this.getCustomerList();

        // ログイン画面と同様に、イベントハンドラーを登録している
        this.customerSearchStore.registerSignalHandler('NAVIGATE_TO_CUSTOMER_DETAIL', () => this.navigateToCustomerDetail());
    }

    /**
     * Component破棄時の処理
     */
    public ngOnDestroy() {
        // ハンドラー登録解除
        this.customerSearchStore.unregisterSignalHandler('NAVIGATE_TO_CUSTOMER_DETAIL');
    }

   /**
    * 顧客情報検索結果を取得する
    */
    public getCustomerList() {
        console.log('customer-search.component.getCustomerList()');
        // 生年月日（FROM/TO）を計算する
        this.setBirthdayFromTo();
        // Actionの処理を実行
        this.action.getCustomerList(this.customerSelectConditionForm);
    }

   /**
    *  顧客情報詳細画面へ編集情報（新規登録）を渡す
    */
    public create() {
        console.log('customer-search.component.create()');
        // Actionの処理を実行
        // 編集モードを次画面に渡すため、ここで「新規登録モード」としてActionに引き渡している
        this.action.setEditInfo(JtasConstants.EDIT_TYPE_CREATE, null);
    }

    /**
     *  顧客情報詳細画面へ編集情報（編集、顧客No）を渡す
     * @param {string} customerNo 顧客No
     */
    public edit(customerNo: string) {
        console.log('customer-search.component.edit()');
        console.log(customerNo);
        // Actionの処理を実行
        // 編集モードを次画面に渡すため、ここで「更新モード」としてActionに引き渡している
        this.action.setEditInfo(JtasConstants.EDIT_TYPE_EDIT, customerNo);
    }

    /**
     * 顧客一覧をCSVファイル形式でダウンロードする
     */
    public downloadCsv() {
        // 生年月日（FROM/TO）を計算する
        this.setBirthdayFromTo();
        const ob = this.action.downloadCsv(this.customerSelectConditionForm);
        ob.subscribe(
            (response) => {
                // APIが正常終了した場合
                console.log(response);
                // CSVファイルとしてダウンロード
                const link = document.createElement('a');
                link.setAttribute('href', window.URL.createObjectURL(response));
                const fileName = 'customer-list.csv';
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            },
            (response) => {
                // APIがエラーで終了した場合
                console.log(response);
            }
        );
    }

   /**
    *  顧客情報詳細画面へ遷移する
    */
    public navigateToCustomerDetail() {
        console.log('customer-search.component.navigateToCustomerDetail()');
        // 次画面(顧客詳細画面)に遷移する。遷移先はsample-routing.module.ts参照。
        this.router.navigate(['/sample/customer-detail'], {});
    }

    /**
     * 生年月日（FROM/TO）を計算する
     */
    public setBirthdayFromTo() {
        console.log('customer-search.component.setBirthdayFromTo()');

        // Fromを計算する
        this.customerSelectConditionForm.birthdayFrom = undefined;
        if (this.maxAge !== null && this.maxAge !== undefined) {
            this.customerSelectConditionForm.birthdayFrom = new Date();
            this.customerSelectConditionForm.birthdayFrom.setDate(this.customerSelectConditionForm.birthdayFrom.getDate() + 1);
            this.customerSelectConditionForm.birthdayFrom.setFullYear(
                this.customerSelectConditionForm.birthdayFrom.getFullYear() - this.maxAge - 1);
        }

        // Toを計算する
        this.customerSelectConditionForm.birthdayTo = undefined;
        if (this.minAge !== null && this.minAge !== undefined) {
            this.customerSelectConditionForm.birthdayTo = new Date();
            this.customerSelectConditionForm.birthdayTo.setFullYear(
                this.customerSelectConditionForm.birthdayTo.getFullYear() - this.minAge);
        }
    }
}
