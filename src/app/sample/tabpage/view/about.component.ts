import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'adep/components';
import { AppProperties } from 'app.properties';
import { AboutAction } from '../action/about.action';
import { AboutState, AboutStore } from '../store/about.store';

@Component({
    selector: 'about-component',
    templateUrl: 'about.component.html'
})
export class AboutComponent extends BaseComponent implements OnInit {
    public state: AboutState;
    public rootUrl: string;

    constructor(private action: AboutAction, private store: AboutStore) {
        super();
        this.state = this.store.getState();
        this.rootUrl = AppProperties.API_ROOT;
    }

    public ngOnInit() {
        this.action.retrieveAboutMessage();
    }

}
