import { JsonProperty } from 'adep/json/';

class Contact {
    public email: string;
    public name: string;

    constructor() {
        this.email = undefined;
        this.name = undefined;
    }
}

export class ContactListEntity {
    public teamName: string;
    @JsonProperty({ clazz: Contact })
    public contacts: Contact[];

    constructor() {
        this.teamName = undefined;
        this.contacts = [];
    }
}
