import { IProduct } from "../../../types";

export class ShoppingCart {
  private products: IProduct[];

  constructor(products: IProduct[]) {
    this.products = products;
  }

  addProduct(product: IProduct): void {
    //добавить товар
    this.products.push(product);
  }

  removeProduct(id: string): void {
    //удалить товар
    this.products = this.products.filter((p) => p.id !== id);
  }

  getProductCount(): number {
    //количество товаров
    return this.products.length;
  }

  getProducts(): IProduct[] {
    //список товаров
    return this.products;
  }

  getTotalPrice(): number {
    //сумма стоимости товаров(возвращается с сервера)
    let sum = 0;

    for (const product of this.products) {
      if (product.price !== null && product.price !== undefined) {
        sum += product.price;
      } else {
        sum += 0;
      }
    }
    return sum;
  }
  hasProduct(id: string): boolean {
    //узнать наличие
    return this.products.some((p) => p.id === id);
  }
  clearCart(): void {
    //очищение корзины
    this.products = [];
  }
}
