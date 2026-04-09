import { IBuyer } from "../../types";
import type { TPayment } from "../../types";

type ValidationField = { //тип для 1 поля
    valid: boolean;
    error?: string
  };

  type ValidationResult = {
    payment: ValidationField;
    email: ValidationField;
    phone: ValidationField;
    address: ValidationField;
  }

export class Buyer {
  private payment: TPayment = "";
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  constructor() {}

  setData(data: Partial<IBuyer>):void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  validate(): ValidationResult {
    const result: ValidationResult = {
    payment: {valid: true},
    email: {valid: true},
    phone: {valid: true},
    address: {valid: true}

    }; //валидация данных

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

  getBuyer(): IBuyer {
    //получение данных
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  save(): void {}
  
  clearBuyerData():void {
    //очистка данных получателя
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
  }
}
