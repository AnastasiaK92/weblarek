import "./scss/styles.scss";
import { ProductCatalog } from "./components/base/Models.ts/ProductCatalog";
import { apiProducts } from "./utils/data";
import { ShoppingCart } from "./components/base/Models.ts/ShoppingCart";
import { Buyer } from "./components/base/Models.ts/Buyer";
import { ShopApi } from "./components/base/ShopApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

const catalog = new ProductCatalog(apiProducts.items, null);

catalog.setSelectedProduct(apiProducts.items[0]);
console.log("сохраненная карточка:", catalog.getSelectedProduct());

const firstId = apiProducts.items[0].id;
console.log("товаров по id", catalog.getProductById(firstId));

catalog.getProducts();
console.log("Список товаров:", catalog.getProducts());

const cart = new ShoppingCart([]);

cart.addProduct(apiProducts.items[0]);
cart.addProduct(apiProducts.items[1]);
console.log("После добавления:", cart.getProducts());

console.log("количесвто товаров:", cart.getProductCount());

console.log("общая сумма:", cart.getTotalPrice());

console.log("Есть ли первый товар:", cart.hasProduct(apiProducts.items[0].id));

cart.removeProduct(apiProducts.items[0].id);
console.log("После удаления:", cart.getProducts());

cart.clearCart();
console.log("После очистки:", cart.getProducts());

const buyer = new Buyer({
  payment: "",
  email: "",
  phone: "",
  address: "",
});

console.log("Начальные данные", buyer.get());
console.log("валидация пустых полей", buyer.validate());

buyer.setData({ email: "test@email.ru" });
console.log("Частичные данные", buyer.get());
console.log("Валидация полсе частичных данных", buyer.validate());

buyer.setData({
  payment: "card",
  phone: "+123456",
  address: "ул Мира 32",
});
console.log("После внесения всех данных:", buyer.get());
console.log("валидация полсе полного заполнения:", buyer.validate());

buyer.save();
console.log("сохраняем данные");

buyer.clearBuyerData();
console.log("После очистки:", buyer.get());

const baseApi = new Api(API_URL);
const shopApi = new ShopApi(baseApi);
shopApi
  .getProducts()
  .then((data) => {
    const products = data.items; //берем массив товаров
    catalog.setProducts(products); //сохраняем в модель

    console.log(catalog); //проверяем
  })
  .catch((err) => {
    console.log(err);
  });
