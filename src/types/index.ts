export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type PaymentMethod = 'cash' | 'online' ;

export type OrderForm = Omit<IOrder, 'total' | 'items'>;

// tslint:disable-next-line
export type CardId = Omit<IProduct, 'id'>

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IEvents {
    on<T extends object>(event: string, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

export interface IPaymentForm {
    payment: PaymentMethod;
    address: string;
}
export interface IContactsForm {
    email: string;
    phone: string;
}

export interface IOrder extends IPaymentForm, IContactsForm {
    items: string[];
    total: number;
}

export interface IBasket {
    items: string[];
    total: number;
}

export interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null;
}

export interface IOrderResult {
    id: string;
    total: number | null;
}

export interface ISuccess {
    total: number;
}

export interface IActions {
    onClick: () => void;
}

export interface IModal {
    content: HTMLElement;
}

export interface ILarekAPI {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>
}

export interface IPage {
    catalog: HTMLElement[];
    counter: number;
    locked: boolean;
}