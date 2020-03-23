import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'lazy-load-component',
    templateUrl: 'lazy-load.component.html'
})
export class LazyLoadComponent {
    constructor(private location: Location) {
    }

    public back() {
        this.location.back();
    }
}
