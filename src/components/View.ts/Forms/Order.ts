import { ensureElement } from "../../../utils/utils";
import { Forms } from "./Forms";

export interface IOrderActions {
  onInput?: (data: {
    payment: "cash" | "card" | null;
    address: string;
  }) => void;
  onSubmit?: () => void;
}

interface OrderData {
  payment: "cash" | "card";
  address: string;
  valid: boolean;
  error: string;
}

export class Order extends Forms<OrderData> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressOrder: HTMLInputElement;
  protected selectedPayment: "cash" | "card" | null = null;

  constructor(container: HTMLElement, actions?: IOrderActions) {
    super(container, actions);

    this.cardButton = ensureElement<HTMLButtonElement>(
      '.button[name = "card"]',
      this.container,
    ); //одинаковые селекторы у кеш и кард
    this.cashButton = ensureElement<HTMLButtonElement>(
      '.button[name = "cash"]',
      this.container,
    );
    this.addressOrder = ensureElement<HTMLInputElement>(
      ".form__input",
      this.container,
    );

    //выбор оплаты картой
    this.cardButton.addEventListener("click", () => {
      this.selectedPayment = "card";

      this.cardButton.classList.add("button_alt-active");
      this.cashButton.classList.remove("button_alt-active");

      if (actions?.onInput) {
        actions.onInput({
          address: this.addressOrder.value,
          payment: this.selectedPayment,
        });
      }
    });

    //выбор оплаты кеш

    this.cashButton.addEventListener("click", () => {
      this.selectedPayment = "cash";

      this.cashButton.classList.add("button_alt-active");
      this.cardButton.classList.remove("button_alt-active");

      if (actions?.onInput) {
        actions.onInput({
          address: this.addressOrder.value,
          payment: this.selectedPayment,
        });
      }
    });
    //ввод адреса
    this.addressOrder.addEventListener("input", () => {
      if (actions?.onInput && this.selectedPayment) {
        actions.onInput({
          address: this.addressOrder.value,
          payment: this.selectedPayment,
        });
      }
    });
  }

  set payment(value: "cash" | "card") {
    this.selectedPayment = value;
    this.cardButton.classList.toggle("button_alt-active", value === "card");
    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }
  set address(value: string) {
    this.addressOrder.value = value;
  }
}
