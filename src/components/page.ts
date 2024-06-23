import {ensureElement} from "../utils/utils";
import {View} from "./base/view";
import {EventEmitter} from "./base/events";
import {IPage} from "../types";

export class Page extends View<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(events: EventEmitter, container: HTMLElement) {
        super(events, container);

        this._counter = ensureElement('.header__basket-counter');
        this._catalog = ensureElement('.gallery');
        this._wrapper = ensureElement('.page__wrapper');
        this._basket = ensureElement('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        })
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }

}