import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class SystemErrorHandler extends  ErrorHandler {
    constructor() {
        super();
    }

    public handleError(error: any): void {
        // TODO: handle error
        super.handleError(error);
    }
}
