import { JsonProperty } from 'adep/json/';

export class HomeEntity {
    /** 認証トークン */
    public authToken: string;

    constructor() {
        this.authToken = undefined;
    }
}
