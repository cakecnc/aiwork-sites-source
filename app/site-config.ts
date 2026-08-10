export const SUPPORT_EMAIL = "cakecnc@daum.net";

export const DONATION_URL =
  "https://www.paypal.com/ncp/payment/R3NBTNC3KYCVE";

export const PURCHASE_PRODUCTS = [
  {
    id: "professional",
    name: "AIWORK Professional",
  },
  {
    id: "business",
    name: "AIWORK Business",
  },
  {
    id: "smartstore-pack",
    name: "네이버 스마트스토어 실무팩",
  },
] as const;

export type PurchaseProductId = (typeof PURCHASE_PRODUCTS)[number]["id"];

export function purchaseInquiryHref(product: PurchaseProductId): string {
  return `/contact?product=${encodeURIComponent(product)}#purchase-inquiry`;
}
