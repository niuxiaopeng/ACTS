
import { LabelService } from '../services';
import { InjectionUtils } from '../utils/injection.utils';

export abstract class BaseComponent {
    protected _labels;
    public get labels() {
        return this._labels;
    }
    constructor() {
        const labelService = InjectionUtils.injector.get(LabelService);
        this._labels = labelService.labels;
    }
}
