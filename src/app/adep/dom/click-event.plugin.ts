import { Inject, Injectable } from '@angular/core';
import { DOCUMENT, EventManager, ɵd as EventManagerPlugin } from '@angular/platform-browser';

/**
 * Click event plugin to prevent double click.
 */
@Injectable()
export class ClickEventPlugin extends EventManagerPlugin {
    public manager: EventManager;
    private intervalMills = 500; // interval for click events
    private supportEvent = 'click';

    constructor(@Inject(DOCUMENT) doc: any) {
        super(doc);
    }

    public supports(eventName: string): boolean {
        return this.supportEvent === eventName;
    }

    public addEventListener(element: HTMLElement, eventName: string,
                            handler: Function): Function {
        let lastCalledTime = new Date().getTime();
        const intervalHandler = (event: any) => {

            const currentDateMills = new Date().getTime();
            if (currentDateMills - lastCalledTime > this.intervalMills) {
                lastCalledTime = currentDateMills;
                handler(event);
            }
        };
        element.addEventListener(eventName, intervalHandler, false);
        return () => { element.removeEventListener(eventName, intervalHandler, false); };
    }
}
