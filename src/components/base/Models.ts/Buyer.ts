import { IBuyer } from "../../../types";
import type { TPayment } from "../../../types";

export class Buyer {
  private payment: TPayment;
  private email: string;
  private phone: string;
  private address: string;

  constructor(data: IBuyer) {
    this.payment = data.payment;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
  }

  setData(data: Partial<IBuyer>) {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  validate() {
    const result: any = {}; //валидация данных

    if (this.payment) {
      result.payment = { valid: true };
    } else {
      result.payment = { valid: false, error: "payment не выбран" };
    }

    if (this.email) {
      result.email = { valid: true };
    } else {
      result.email = { valid: false, error: "email не заполнен" };
    }

    if (this.phone) {
      result.phone = { valid: true };
    } else {
      result.phone = { valid: false, error: "phone не заполнен" };
    }

    if (this.address) {
      result.address = { valid: true };
    } else {
      result.address = { valid: false, error: "address не заполнен" };
    }

    return result;
  }

  get(): IBuyer {
    //получение данных
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  save() {
    //сохранение данные
    localStorage.setItem("buyer", JSON.stringify(this.get()));
  }

  clearBuyerData() {
    //очистка данных получателя
    localStorage.removeItem("buyer");
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
  }
}
