import './scss/styles.scss';

import { LarekApi } from './components/larek_api';
import { API_URL, CDN_URL } from './utils/constants';

import { EventEmitter } from './components/base/events';

import { Page } from './components/page';
import { Modal } from './components/common/modal';
import { Basket } from './components/common/basket';
import { Success } from './components/common/succes';

import { AppData } from './components/app';
import { Card } from './components/card';
import { PaymentForm } from './components/order';
import { ContactForm } from './components/order';
import { IOrder, IContactsForm, IProduct } from './types';

import { cloneTemplate, ensureElement } from './utils/utils';

const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardsListTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppData(events);

const page = new Page(events, document.body);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const paymentForm = new PaymentForm(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactForm(cloneTemplate(contactsFormTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

events.on('order:result', () => {
    appData.clearBasket();
    modal.close();
})
events.on('card:select', (item: IProduct) => {
    appData.setPreview(item);
});
events.on('items:change', (items: IProduct[]) => {
    page.catalog = items.map(item => {
        const card = new Card(cloneTemplate(cardsListTemplate), {
            onClick: () => {
                events.emit('card:select', item);
            }
        })
        return card.render(item);
    })
})

events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            email: '',
            phone: '',
            valid: false,
            errors: [],
        }),
    });
});

events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { email, phone, address, payment } = errors;
    paymentForm.valid = !address && !payment;
    contactsForm.valid = !email && !phone;
    paymentForm.errors = Object.values({ address, payment })
        .filter((i) => !!i)
        .join('; ');
    contactsForm.errors = Object.values({ phone, email })
        .filter((i) => !!i)
        .join('; ');
});

events.on(/^contacts\..*:change/, (data: { field: keyof IContactsForm; value: string }) => {
        appData.setOrderField(data.field, data.value);
    }
);

events.on(/^order\..*:change/, (data: { field: keyof IContactsForm; value: string }) => {
    appData.setOrderField(data.field, data.value);
});

events.on('order:open', () => {
    modal.render({
        content: paymentForm.render({
            payment: 'online',
            address: '',
            valid: false,
            errors: [],
        }),
    });
});

events.on('contacts:submit', () => {
    api.orderProducts(appData.order)
        .then(result => {
            modal.render({
                content: success.render({
                    total: result.total,
                })
            })
        })
        .catch(err => console.log(err))
})


events.on('preview:change', (item: IProduct) => {
    const card = new Card(cloneTemplate(cardTemplate), {
        onClick: () => {
            if(appData.inBasket(item)) {
                appData.removeBasket(item);
                card.buttonTitle = 'В корзину';
            } else {
                appData.addBasket(item);
                card.buttonTitle = 'Убрать из корзины';
            }
        }
    })

    card.buttonTitle = appData.inBasket(item) ? 'Убрать из корзины' : 'В корзину';

    modal.render({
        content: card.render({
            title: item.title,
            description: item.description,
            image: item.image,
            price: item.price,
            category: item.category,
        }),
    });
});

events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    })
});


events.on('basket:change', () => {
    console.log('im work?');
    page.counter = appData.basket.items.length;
    basket.items = appData.basket.items.map(id => {
        const item = appData.items.find(item => item.id === id);

        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                appData.removeBasket(item);
            }
        })

        return card.render(item);
    })

    basket.total = appData.basket.total;
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

api.getProductList().then(appData.setItems.bind(appData)).catch(console.error);