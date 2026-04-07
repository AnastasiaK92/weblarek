import { IProduct } from "../../../types";

export class ProductCatalog {
  private products: IProduct[];
  private selectedCard: IProduct | null;

  constructor(products: IProduct[], selectedCard: IProduct | null) {
    this.products = products;
    this.selectedCard = selectedCard;
  }

  getProducts(): IProduct[] {
    //список товаров
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    //получение массива товаров по его id
    return this.products.find((p) => p.id === id);
  }

  setSelectedProduct(selectedCard: IProduct): void {
    //сохранить выбранную карточку
    this.selectedCard = selectedCard;
  }

  getSelectedProduct(): IProduct | null {
    //получить выбранную карточку
    return this.selectedCard;
  }

  setProducts(products: IProduct[]): void {
    //сохранить массив товаров
    this.products = products;
  }
}
