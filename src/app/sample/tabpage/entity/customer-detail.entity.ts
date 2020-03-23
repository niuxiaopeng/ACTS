import { JsonProperty } from 'adep/json/';

export class CustomerDetailForm {
    /** 顧客No */
    public customerNo: string;
    /** 氏名漢字 */
    public nameKanji: string;
    /** 氏名カナ */
    public nameKana: string;
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
        this.nameKanji = undefined;
        this.nameKana = undefined;
        this.gender = undefined;
        this.birthday = undefined;
        this.telNo = undefined;
        this.addressZip = undefined;
        this.address = undefined;
        this.email = undefined;
    }
}
