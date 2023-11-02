export interface PurchaseEvent {
  transactionId?: string,
  total?: number,
  shipping?: number,
  tax?: number,
  currency?: string,
  items?: Item[],
}

export interface BeginCheckoutEvent {
  currency?: string,
  total?: number,
  items?: Item[],
}

export interface AddToCartEvent {
  currency?: string,
  total?: number,
  items?: Item[],
}

export interface RemoveFromCartEvent {
  currency?: string,
  total?: number,
  items?: Item[],
}

export interface RemoveFromCartEvent {
  currency?: string,
  total?: number,
  items?: Item[],
}

export interface AppPaymentEvent {
  currency?: string,
  total?: number,
  paymentType?: string,
  items?: Item[],
}

export interface Item {
  id?: string,
  name?: string,
  price?: number,
  quantity?: number,
  category?: string,
  category2?: string,
}
