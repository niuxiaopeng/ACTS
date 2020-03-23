import { JsonProperty } from 'adep/json/';

export class FamilyForm {
    /** 顧客No */
    public customerNo: string;
    /** 家族No */
    public familyNo: string;
    /** 氏名漢字 */
    public nameKanji: string;
    /** 氏名カナ */
    public nameKana: string;
    /** 続柄 */
    public relationship: string;
    /** 続柄その他 */
    public relationshipOther: string;
    /** 性別 */
    public gender: string;
    /** 生年月日 */
    public birthday: string;
    /** 電話番号 */
    public telNo: string;
    /** 郵便番号 */
    public addressZip: string;
    /** 住所 */
    public address: string;
    /** Eメール */
    public email: string;

    constructor() {
        this.customerNo = undefined;
        this.familyNo = undefined;
        this.nameKanji = undefined;
        this.nameKana = undefined;
        this.relationship = undefined;
        this.relationshipOther = undefined;
        this.gender = undefined;
        this.birthday = undefined;
        this.telNo = undefined;
        this.addressZip = undefined;
        this.address = undefined;
        this.email = undefined;
    }
}

export class FamilySearchListEntity {
    @JsonProperty({ clazz: FamilyForm })
    /** 顧客情報 */
    public familyInfo: FamilyForm[];

    // コンストラクタあるのに、storeでも初期化しないといけない？
    constructor() {
        this.familyInfo = [];
    }
}
