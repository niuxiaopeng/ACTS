import { Component } from '@angular/core';
import { ContactAction } from '../action/contact.action';
import { ContactState, ContactStore } from '../store/contact.store';

@Component({
    selector: 'contact-component',
    templateUrl: 'contact.component.html'
})
export class ContactComponent {
    public state: ContactState;
    constructor(private action: ContactAction, private store: ContactStore) {
        this.state = this.store.getState();
    }

    public showInfo() {
        this.action.retrieveContactInfo();
    }

}
