export type AlertType = "price_drop" | "restock";

export interface NewAlert {
  productId: string;
  type: AlertType;
  oldValue: string;
  newValue: string;
}
