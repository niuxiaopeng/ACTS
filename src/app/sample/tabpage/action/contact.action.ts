import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Action, Dispatcher } from 'adep/flux';
import { JsonTypeMapper } from 'adep/json/';
import { AppProperties } from 'app.properties';
import { ContactListEntity } from '../entity/contact.entity';

export namespace ContactActionType {
    export const SHOW_INFO: string = 'ContactActionType_SHOW_INFO';
}

@Injectable()
export class ContactAction extends Action {
    constructor(private http: Http) {
        super();
    }

    public retrieveContactInfo() {
        this.http.get(AppProperties.API_ROOT).subscribe(
            (data) => {
                console.log('test');
            }
        );
        this.dispatcher.dispatch(
            {
                actionType: ContactActionType.SHOW_INFO,
                data: JsonTypeMapper.parse(ContactListEntity, dummyJson)
            }
        );
    }
}

const dummyJson: ContactListEntity = {
    teamName: 'supportTeam-A',
    contacts: [
        {
            email: 'support@team.com',
            name: 'general support'
        },
        {
            email: 'tech-support@team.com',
            name: 'tech support'
        }
    ]
};
