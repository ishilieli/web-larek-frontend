import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { ISuccess } from '../../types';
import {EventEmitter} from "../base/events";

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _totalPrice: HTMLElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._totalPrice = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._close.addEventListener('click', () => {
            this.events.emit('order:result');
        })
    }

    set total(value: number) {
        this.setText(this._totalPrice, `Списано ${String(value)} синапсов`);
    }
}