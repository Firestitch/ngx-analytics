export interface PurchaseEvent {
  transactionId?: string,
  total?: number,
  shipping?: number,
  tax?: number,
  currency?: string,
  products?: PurchaseEventProduct[]
}

export interface PurchaseEventProduct {
  id?: string,
  name?: string,
  price?: number,
  quantity?: number,
  category?: string,
  category2?: string,
}
