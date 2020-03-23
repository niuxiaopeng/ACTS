import { Injectable } from '@angular/core';

declare var jsyaml: any;

/**
 * Label Service class
 */
@Injectable()
export class LabelService {
    private _labels;
    public get labels() {
        return this._labels;
    }

    constructor() {
        this._labels = require('../../messages/message_ja.yaml');
    }
}
