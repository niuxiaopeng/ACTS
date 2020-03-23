import { JsonProperty } from 'adep/json/';

@JsonProperty({ clazz: CustomerSearch })
export class CustomerSearch {
    /** 顧客No */
    public customerNo: string;
    /** 氏名漢字 */
    public nameKanji: string;
    /** 氏名カナ */
    public nameKana: string;
    /** 性別 */
    public gender: string;
    /** 生年月日 */
    public birthday: Date;
    /** Eメール */
    public email: string;

    constructor() {
        this.customerNo = undefined;
        this.nameKanji = undefined;
        this.nameKana = undefined;
        this.gender = undefined;
        this.birthday = undefined;
        this.email = undefined;
    }
}

export class CustomerSearchListEntity {
    @JsonProperty({ clazz: CustomerSearch })
    /** 顧客情報 */
    public customerInfo: CustomerSearch[];

    constructor() {
        this.customerInfo = undefined;
    }
}

export class CustomerSelectConditionForm {
    /** 検索条件-顧客No */
    public customerNo: string;
    /** 検索条件-氏名漢字 */
    public nameKanji: string;
    /** 検索条件-氏名カナ */
    public nameKana: string;
    /** 検索条件-Eメール */
    public email: boolean;
    /** 検索条件-生年月日（From） */
    public birthdayFrom: Date;
    /** 検索条件-生年月日（To） */
    public birthdayTo: Date;
    /** 検索条件-性別 */
    public gender: string;

    constructor() {
        this.customerNo = undefined;
        this.nameKanji = undefined;
        this.nameKana = undefined;
        this.email = false;
        this.birthdayFrom = undefined;
        this.birthdayTo = undefined;
        this.gender = '';
    }
}
