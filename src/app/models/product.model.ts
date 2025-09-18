export interface Product {
  id: number;
  productName: string;
  category: string;
  price: number;
  productCode: string;
  discountRate: number;
  minimumQuantity: number;
  path: string;  // new field; make sure backend returns this
}
