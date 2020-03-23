import { EventEmitter } from '@angular/core';

export class EventContainer {
    private events: { [key: string]: EventEmitter<any> } = {};

    public subscribe(eventName: string, handler: Function) {
        if (this.events[eventName]) {
            return;
        }
        const event = new EventEmitter();
        event.subscribe(handler);
        this.events[eventName] = event;
    }

    public unsubscribe(eventName?: string) {
        (eventName == null) ? this.clear() : this.unsubscribeByEventName(eventName);
    }

    public emit(eventName: string, value?: any) {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName].emit(value);
    }

    private clear() {
        for (const eventName in this.events) {
            this.unsubscribeByEventName(eventName);
        }
    }

    private unsubscribeByEventName(eventName: string) {
        if (this.events[eventName]) {
            this.events[eventName].unsubscribe();
            this.events[eventName] = null;
        }
    }

}
