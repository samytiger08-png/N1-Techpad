export type DeliveryType = 'stopDeskEcommerce' | 'domicileEcommerce';

export interface DeliveryInfo {
  code: number;
  wilaya: string;
  stopDeskEcommerce: number | null;
  domicileEcommerce: number | null;
}

export interface Order {
  id?: string;
  productName: string;
  productPrice: number;
  productsTotal: number;
  deliveryType: DeliveryType;
  deliveryLabelAr: string;
  deliveryLabelFr: string;
  deliveryFee: number;
  finalTotal: number;
  customerName: string;
  phone: string;
  wilaya: string;
  wilayaCode: number;
  commune: string;
  language: 'ar' | 'fr';
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'ECHEC_01';
  createdAt: any; // Firestore Timestamp
  color?: string;
}
