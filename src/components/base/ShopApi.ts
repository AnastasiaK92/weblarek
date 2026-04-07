import { IApi, IProductResponse, IOrder } from "../../types";

export class ShopApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductResponse> {
    return this.api.get("/product/");
  }

  createOrder(order: IOrder) {
    return this.api.post("/order/", order);
  }
}
