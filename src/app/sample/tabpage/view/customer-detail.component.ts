import { Component, OnDestroy, OnInit, NgModule, Directive, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'adep/components';
import { ObjectUtils } from 'adep/utils';
// import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
// import { CalendarModule } from 'primeng/calendar';
// import { SelectItem } from 'primeng/api';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import { JtasConstants } from '../../jtas.const';
import { UserService } from '../../services/user.service';
import { CustomerDetailAction } from '../action/customer-detail.action';
import { CustomerDetailForm } from '../entity/customer-detail.entity';
import { FamilyForm } from '../entity/family.entity';
import { CustomerDetailState, CustomerDetailStore } from '../store/customer-detail.store';

/**
 * 顧客詳細画面のComponent
 */
@Component({
    selector: 'customer-detail-component',
    templateUrl: 'customer-detail.component.html'
})
export class CustomerDetailComponent  extends BaseComponent implements OnInit, OnDestroy {

    /** 画面表示情報 */
    public state: CustomerDetailState;
    public const: any;
    /** 顧客詳細情報(入力内容) */
    public customerDetailForm: CustomerDetailForm;
    /** 顧客詳細情報(入力内容) */
    public familyForm: FamilyForm;
    /** 顧客詳細情報(入力内容)  */
    public familyEditForm: FamilyForm;

    // 生年月日の入力値を取得するためのメンバ
    public birthday: Date;
    public birthdayYear: string;
    public birthdayMonth: string;
    public birthdayDay: string;
    public birthdayJp: string;

    // 電話番号の入力値を取得するためのメンバ
    public telNo1: string;
    public telNo2: string;
    public telNo3: string;

    // 郵便番号の入力値を取得するためのメンバ
    public addressZip1: string;
    public addressZip2: string;

    public myOptions: INgxMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
    };

    // Initialized to specific date (09.10.2018)
    public dpbd: any;

    constructor(
        private action: CustomerDetailAction,
        private customerDetailStore: CustomerDetailStore,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute) {
        super();
        this.state = this.customerDetailStore.getState();
        this.const = JtasConstants;
    }

    /**
     * 初期処理
     */
    public ngOnInit(): void {
        // イベントハンドラーの登録
        this.customerDetailStore.registerSignalHandler('getCustomerInfo', () => this.setCustomerInfo());
        this.customerDetailStore.registerSignalHandler('NAVIGATE_TO_CUSTOMER_SEARCH', () => this.navigateToCustomerSearch());

        // TODO: ここら辺はactionに切り出してjasmineでテストしたい
        this.customerDetailForm = new CustomerDetailForm();
        this.familyForm = new FamilyForm();
        // 初期値
        this.familyForm.relationship = '06';

        // 前画面から引き渡された編集モードを確認し、初期処理をハンドリングする
        if (this.state.editType === JtasConstants.EDIT_TYPE_EDIT) {
            // 「更新モード」の場合、顧客詳細情報を取得して画面に初期表示するため、Actionを実行する
            this.action.getCustomerInfo(this.state.customerNo);
            this.action.getFamilyInfo(this.state.customerNo);
        } else {
            // 「新規登録モード」の場合、画面入力値は基本ブランクだが、プルダウンになっている性別の初期値(男性)だけセットする
            this.customerDetailForm.gender = JtasConstants.GENDER_MALE;
        }
    }

    /**
     * Component破棄時の処理
     */
    public ngOnDestroy() {
        // ハンドラー登録解除
        this.customerDetailStore.unregisterSignalHandler('getCustomerInfo');
        this.customerDetailStore.unregisterSignalHandler('NAVIGATE_TO_CUSTOMER_SEARCH');
    }

    public showWareki(bd: any) {
        console.log('## showWareki');
        console.log(bd);

        if ( bd && bd.date && bd.jsdate) {
            this.birthdayJp = this.convCal(new Date(bd.jsdate));
            this.customerDetailForm.birthday = bd.formatted;
        } else if ( (bd && bd.jsdate) || this.isDate(bd) ) {
            this.birthdayJp = this.convCal(new Date(bd));
            this.customerDetailForm.birthday = bd.formatted ? bd.formatted : bd;
        } else {
            this.birthdayJp = null;
            this.customerDetailForm.birthday = null;
        }
    }

    /**
     * 家族情報の登録
     */
    public addFamily() {
        console.log('## familyForm');
        console.log(this.familyForm);
        this.familyForm.customerNo = this.customerDetailForm.customerNo;
        this.action.createFamilyInfo(this.familyForm);
    }

    /** 編集モードon */
    public editFam(idx: number, family: FamilyForm) {
        this.familyEditForm = new FamilyForm();

        for (var k in family) {
            this.familyEditForm[k] = family[k];
        }

        this.state.isFamEditMode[idx] = true;
        console.log('## editFam: family');
        console.log(family);
        var arr = JtasConstants.RELATIONSHIP.filter(function(conEle) {
            return conEle.disp === family.relationship;
        });
        let relationship: any;
        if (arr.length > 0) {
            relationship = arr[0].val;
        }
        this.familyEditForm.nameKanji = family.nameKanji;
        this.familyEditForm.relationship = relationship;
    }

    /** 編集モードoff */
    public cancelFam(idx: number) {
        this.state.isFamEditMode[idx] = false;
    }

    /** 編集確定 */
    public updFam(idx: number, family: FamilyForm) {
        console.log('## updFam');
        console.log(idx);
        console.log(family);
        this.state.isFamEditMode[idx] = false;
        this.action.updateFamily(family);
    }

    public delFam(family: FamilyForm) {
        console.log('## delFam');
        console.log(family);
        this.action.deleteFamilyInfo(family);
    }

    /**
     *  顧客情報の保存内容を送信する（新規登録・更新する）
     */
    public submit() {
        console.log('customer-detail.component.submit()');
        // 生年月日を整形(ゼロパディング)
        const bd = (this.customerDetailForm.birthday + '').split('-');
        const form = new CustomerDetailForm();
        for (var k in this.customerDetailForm) {
            form[k] = this.customerDetailForm[k];
        }

        const zeroPaddingBirthdayYear = bd[0] ? ('0000' + bd[0]).slice(-4) : '';
        const zeroPaddingBirthdayMonth = bd[1] ? ('00' + bd[1]).slice(-2) : '';
        const zeroPaddingBirthdayDay = bd[2] ? ('00' + bd[2]).slice(-2) : '';
        form.birthday = zeroPaddingBirthdayYear + zeroPaddingBirthdayMonth + zeroPaddingBirthdayDay;

        // 電話番号を整形
        form.telNo = this.telNo1 + this.telNo2 + this.telNo3;

        // 郵便番号を整形
        form.addressZip = this.addressZip1 + this.addressZip2;

        // 顧客情報の新規登録もしくは更新を行う
        if (this.state.editType === JtasConstants.EDIT_TYPE_CREATE) {
            // 「新規登録モード」の場合、登録処理を実行する
            this.action.createCustomerInfo(form);
        } else {
            // 「更新モード」の場合、更新処理を実行する
            this.action.updateCustomerInfo(form);
        }
    }

    public delete() {
        console.log('## delete()');
        // 「更新モード」の場合、更新処理を実行する
        this.action.deleteCustomerInfo(this.customerDetailForm);
    }

    /**
     * 顧客情報検索画面へ遷移する
     */
    public back() {
        console.log('customer-detail.component.back()');
        // 前画面に戻る前に、自身のStateに保持した情報をクリアしておくことで、再度当画面にアクセスした際に前回情報が表示されないようにしている
        this.action.clearState();
    }

   /**
    * 顧客情報の取得結果を整形・設定する
    * 初期処理で顧客詳細情報を取得した場合に、入力項目が分割されている生年月日・電話番号・郵便番号を考慮した処理を実装している
    */
    private setCustomerInfo() {
        console.log('customer-detail.confirmCustomerInfo()');
        // Cloneしているのは、Stateに保持した情報をそのまま画面の入力内容と紐付けると、ComponentでStateを編集することになり、Fluxのルール違反となる
        this.customerDetailForm = ObjectUtils.clone(this.state.customerDetailForm);

        // 生年月日を整形(年・月・日に分割)
        this.birthdayYear = this.customerDetailForm.birthday.substr(0, 4);
        this.birthdayMonth = this.customerDetailForm.birthday.substr(5, 2);
        this.birthdayDay = this.customerDetailForm.birthday.substr(8, 2);

        // 電話番号を整形(3つに分割)
        if (this.customerDetailForm.telNo) {
            this.telNo1 = this.customerDetailForm.telNo.substr(0, 3);
            this.telNo2 = this.customerDetailForm.telNo.substr(3, 4);
            this.telNo3 = this.customerDetailForm.telNo.substr(7, 4);
        }

        // 郵便番号を整形(2つに分割)
        if (this.customerDetailForm.addressZip) {
            this.addressZip1 = this.customerDetailForm.addressZip.substr(0, 3);
            this.addressZip2 = this.customerDetailForm.addressZip.substr(3, 4);
        }
        const birthdayJp = new Date(
            Number(this.birthdayYear),
            Number(this.birthdayMonth) - 1,
            Number(this.birthdayDay)).toLocaleDateString('ja-JP-u-ca-japanese');
        console.log('## wareki test: ja-JP-u-ca-japanese -> ' + birthdayJp);
        this.showWareki(this.customerDetailForm.birthday);
        this.dpbd = { date: { year: Number(this.birthdayYear), month: Number(this.birthdayMonth), day: Number(this.birthdayDay) } }
    }

   /**
    * 顧客情報検索画面に遷移する
    */
    private navigateToCustomerSearch() {
        console.log('customer-detail.navigateToCustomerSearch()');
        this.router.navigate(['/sample/customer-search'], {});
    }

    private isDate(strDate: string) {
        // 空文字は無視
        if(!strDate || strDate == "" || typeof strDate === 'object'){
            return false;
        }
        // 年/月/日の形式のみ許容する
        if (!strDate.match(/^\d{4}\-\d{1,2}\-\d{1,2}$/)) {
            return false;
        }

        // 日付変換された日付が入力値と同じ事を確認
        // new Date()の引数に不正な日付が入力された場合、相当する日付に変換されてしまうため
        //
        const date = new Date(strDate);
        if (date.getFullYear() !==  Number(strDate.split('-')[0])
            || date.getMonth() !== Number(strDate.split('-')[1]) - 1
            || date.getDate() !== Number(strDate.split('-')[2])
        ) {
            return false;
        }

        return true;
    }

    private convCal(dt: Date) {
        // 年号毎の開始日付
        const m = new Date(1868, 8, 8);	// 1868年9月8日～
        const t = new Date(1912, 6, 30);	// 1912年7月30日～
        const s = new Date(1926, 11, 25);	// 1926年12月25日～
        const h = new Date(1989, 0, 8);	// 1989年1月8日～
        const a = new Date(2019, 4, 1);	// 2019年5月1日～

        // 年号毎の開始日付
        const y = dt.getFullYear();
        const mo = ('00' + (dt.getMonth() + 1)).slice(-2); // ※
        const d = ('00' + dt.getDate()).slice(-2);       // ※
        // ※ゼロ埋めしたくない場合
        // const mo = dt.getMonth() + 1;
        // const d = dt.getDate();

        let gen = '';
        let nen: any;
        nen = 0;

        // 元号判定
        if (m <= dt && dt < t) {
            gen = '明治';
            nen = (y - m.getFullYear()) + 1;
        } else if (t <= dt && dt < s) {
            gen = '大正';
            nen = (y - t.getFullYear()) + 1;
        } else if (s <= dt && dt < h) {
            gen = '昭和';
            nen = (y - s.getFullYear()) + 1;
        } else if (h <= dt && dt < a) {
            gen = '平成';
            nen = (y - h.getFullYear()) + 1;
        } else if (a <= dt) {
            gen = '令和';
            nen = (y - a.getFullYear()) + 1;
        } else {
            gen = '';
        }

        // 1年の場合は"元"に置き換え
        if (nen === 1) {
            nen = '元';
        }

        // 日付生成
        const result = gen + nen + '年' + mo + '月' + d + '日';

        return result;
    }
}
