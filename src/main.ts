import "./scss/styles.scss";
import { ProductCatalog } from "./components/Models.ts/ProductCatalog";
import { apiProducts } from "./utils/data";
import { ShoppingCart } from "./components/Models.ts/ShoppingCart";
import { Buyer } from "./components/Models.ts/Buyer";
import { ShopApi } from "./components/ShopApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { Header } from "./components/View.ts/Header";
import { CardCatalog } from "./components/View.ts/Card/CardCatalog";
import { cloneTemplate } from "./utils/utils";
import { Category } from "./components/View.ts/Card/CardCatalog";
import { IProduct, ValidationResult } from "./types";
import { Modal } from "./components/View.ts/Modal";
import { CardBasket } from "./components/View.ts/Card/CardBasket";
import { Basket } from "./components/View.ts/Basket";
import { CDN_URL } from "./utils/constants";
import { CardPreview } from "./components/View.ts/Card/CardPreview";
import { Contacts } from "./components/View.ts/Forms/Contacts";
import { Order } from "./components/View.ts/Forms/Order";
import { Succes } from "./components/View.ts/Succes";

const catalog = new ProductCatalog();
const cart = new ShoppingCart([]);
const buyer = new Buyer();

const baseApi = new Api(API_URL);
const shopApi = new ShopApi(baseApi);

shopApi
  .getProducts()
  .then((data) => {
    const products = data.items; //берем массив товаров
    catalog.setProducts(products); //сохраняем в модель
  })
  .catch((err) => {
    console.log(err);
  });

//header
const headerContainer = document.querySelector(".header") as HTMLElement;
const catalogContainer = document.querySelector(".gallery") as HTMLElement;
const CardCatalogTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;

//Зависемости
const eventEmitter = new EventEmitter();
//Создаем View
const header = new Header(headerContainer, {
  onBasketClick: () => {
    eventEmitter.emit("basket:open");
  },
});
//открытие корзины
eventEmitter.on("basket:open", () => {});
//обновление счетчика
cart.events.on("cart:changed", () => {
  header.counter = cart.getProducts().length;
});
//рендер каталога
eventEmitter.on("catalog:changed", () => {
  const items = catalog.getProducts();

  const cards = items.map((item) => {
    const card = new CardCatalog(cloneTemplate(CardCatalogTemplate), {
      onClick: () => {
        eventEmitter.emit("card:preview", item);
      },
    });
    card.category = item.category as Category;
    card.title = item.title;
    card.image = `${CDN_URL}${item.image}`;
    card.price = item.price;

    return card.render();
  });
  catalogContainer.replaceChildren(...cards);
});
//инициализация данных
catalog.setProducts(apiProducts.items);
//запуск рендера
eventEmitter.emit("catalog:changed");
//модальное окно
//контейнер
const modalContainer = document.querySelector(".modal") as HTMLElement;
//создаем view
const modal = new Modal(modalContainer);
//корзина
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const basketElement = basketTemplate.content
  .querySelector(".basket")!
  .cloneNode(true) as HTMLElement;
const basket = new Basket(basketElement, {
  onClick: () => {
    eventEmitter.emit("order:open");
  },
});
//открытие корзины
eventEmitter.on("basket:open", () => {
  //формируем список товаров
  const items = cart.getProducts();
  basket.buttonDisabled = items.length === 0;
  const basketItems = items.map((item, index) => {
    const basketCard = new CardBasket(
      cloneTemplate(
        document.querySelector("#card-basket") as HTMLTemplateElement,
      ),
      {
        onBasketClick: () => {
          cart.removeProduct(item.id);
          eventEmitter.emit("cart:changed");
          eventEmitter.emit("basket:open");
        },
      },
    );
    //передаем в баскет
    basketCard.index = index + 1;
    basketCard.title = item.title;
    basketCard.price = item.price ?? 0;
    return basketCard.render();
  });
  basket.list = basketItems;
  //считаем сумму
  const total = cart.getProducts().reduce((sum, item) => {
    return sum + (item.price ?? 0);
  }, 0);
  basket.total = total;
  //вставляем в модалку
  modal.content = basketElement;
  //открываем
  modal.open();
});

//карточка превью
const CardPreviewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;

eventEmitter.on("card:add", (item: IProduct) => {
  if (cart.hasProduct(item.id)) {
    cart.removeProduct(item.id);
  } else {
    if (item.price != null) {
      cart.addProduct(item);
    }
  }
  eventEmitter.emit("cart:changed");
});

eventEmitter.on("card:preview", (item: IProduct) => {
  const preview = new CardPreview(cloneTemplate(CardPreviewTemplate), {
    onCardClick: () => {
      eventEmitter.emit("card:add", item);
      modal.close();
    },
  });
  preview.category = item.category;
  preview.title = item.title;
  preview.text = item.description;
  preview.price = item.price;
  preview.image = `${CDN_URL}${item.image}`;
  //состояние кнопки
  if (!item.price) {
    preview.buttonText = "Недоступно";
    preview.disableButton();
  } else {
    const isInCart = cart.hasProduct(item.id);
    preview.buttonText = isInCart ? "Удалить из корзины" : "Купить";
  }
  modal.content = preview.render();
  modal.open();
});
//событие открытие формы заказа
let order: Order;
let contacts: Contacts;
eventEmitter.on("order:open", () => {
  const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;

  order = new Order(cloneTemplate(orderTemplate), {
    onInput: (data) => {
      buyer.setData({
        ...data,
        payment: data.payment ?? undefined,
      });
    },
    onSubmit: () => {
      eventEmitter.emit("order:submit");
    },
  });
  modal.content = order.render();
  modal.open();

  buyer.setData({
    address: "",
    payment: undefined,
  });
});

//валдация формы
buyer.events.on("validation:changed", (validation: ValidationResult) => {
  if (!order) return;

  const hasAddress = !validation.address;
  const hasPayment = !validation.payment;

  const isValid = hasAddress && hasPayment;
  order.valid = isValid;
  const errors = [];

  if (validation.address) errors.push(validation.address);
  if (validation.payment) errors.push(validation.payment);

  order.errors = errors.join(", ");
});

//переход на вторую форму
eventEmitter.on("order:submit", () => {
  eventEmitter.emit("contacts:open");
});
// открытие контакт
eventEmitter.on("contacts:open", () => {
  const contactsTemplate = document.querySelector(
    "#contacts",
  ) as HTMLTemplateElement;
  contacts = new Contacts(cloneTemplate(contactsTemplate), {
    onInput: (data) => {
      buyer.setData(data);
    },
    onSubmit: () => {
      eventEmitter.emit("contacts:submit");
    },
  });
  modal.content = contacts.render();
  modal.open();
});

//валидация контактс
buyer.events.on("validation:changed", (validation: ValidationResult) => {
  if (!contacts) return;

  const isValid = !validation.email && !validation.phone;
  contacts.valid = isValid;

  const errors: string[] = [];

  if (validation.email) errors.push(validation.email);

  if (validation.phone) errors.push(validation.phone);
  contacts.errors = errors.join(",");
});
eventEmitter.on("contacts:submit", () => {
  const buyerData = buyer.getBuyer();
  const items = cart.getProducts();
  //считаем сумму до очистки
  const total = items.reduce((sum, item) => {
    return sum + (item.price ?? 0);
  }, 0);

  const orderData = {
    items: items.map((item) => item.id),
    total,
    ...buyerData,
  };
  //отправка на сервер
  shopApi
    .createOrder(orderData)
    .then(() => {
      //очиска корзины
      cart.clearCart();
      //обновить шапку-счетчик
      eventEmitter.emit("cart:changed");
      //очищаем форму
      buyer.clearBuyerData();
      //закрываем текущую модалку
      modal.close();
      //открываем  succes

      eventEmitter.emit("order:success", { total });
    })
    .catch(() => {
      contacts.errors = "ошибка оплаты";
    });
});
const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;
eventEmitter.on("order:success", (data: { total: number }) => {
  const success = new Succes(cloneTemplate(successTemplate), {
    onBasketClick: () => {
      modal.close();
    },
  });
  success.total = data.total;
  modal.content = success.render();
  modal.open();
});
