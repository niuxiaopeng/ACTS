import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'adep/components';

@Component({
    selector: 'system-error-component',
    templateUrl: 'system-error.component.html'
})
export class SystemErrorComponent extends BaseComponent implements OnInit {

    constructor() {
        super();
    }

    public ngOnInit(): void {
        console.log('system error init.');
    }
}
