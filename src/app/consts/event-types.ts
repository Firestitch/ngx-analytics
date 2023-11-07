import { EventType } from "../enums";

export const EventTypes = [
  { name: EventType.BeginCheckout, value: EventType.BeginCheckout, ecommerce: true },
  { name: EventType.AddToCart, value: EventType.AddToCart, ecommerce: true },
  { name: EventType.RemoveFromCart, value: EventType.RemoveFromCart, ecommerce: true },
  { name: EventType.AddPayment, value: EventType.AddPayment, ecommerce: true },
  { name: EventType.Purcahse, value: EventType.Purcahse, ecommerce: true },
];