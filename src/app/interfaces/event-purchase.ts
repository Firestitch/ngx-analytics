export interface PurchaseEvent {
  transactionId?: number,
  total?: number,
  shipping?: number,
  tax?: number,
  currency?: number,
  products?: PurchaseEventProduct[]
}

export interface PurchaseEventProduct {
  id?: number,
  name?: string,
  price?: number,
  quantity?: number,
}
