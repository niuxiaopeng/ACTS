import { Inject, Injectable } from '@angular/core';
import { ActionBind, Dispatcher, State, Store } from '../../../adep/flux';
import { ContactActionType } from '../action/contact.action';
import { ContactListEntity } from '../entity/contact.entity';

export interface ContactState extends State {
    email: string;
    person: string;
}

@Injectable()
export class ContactStore extends Store<ContactState> {
    constructor() {
        super();
        this.state = {
            email: undefined,
            person: undefined
        };
    }

    @ActionBind(ContactActionType.SHOW_INFO)
    private setContactInfo(data: ContactListEntity) {
        const targetContact = data.contacts[0];
        this.state.email = targetContact.email;
        this.state.person = targetContact.name;
    }

}
