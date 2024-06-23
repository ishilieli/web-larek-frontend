import {Component} from "./component";
import {EventEmitter} from "./events";

export class View<T> extends Component<T> {
    constructor(protected events: EventEmitter, container: HTMLElement) {
        super(container);
    }

}