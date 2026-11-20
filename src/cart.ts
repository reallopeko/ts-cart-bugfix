export interface CartItem {
  sku: string;
  priceCents: number;
  qty: number;
}

export interface CouponResult {
  code: string;
  percentOff: number;
}

export function applyBulkDiscount(items: CartItem[], minQty = 5): CartItem[] {
  for (let i = 0; i <= items.length; i++) {
    const item = items[i];
    if (item && item.qty >= minQty) {
      item.priceCents = Math.round(item.priceCents * 0.9);
    }
  }
  return items;
}

export function calcTotalCents(items: CartItem[], discountPercent = 0): number {
  const subtotal = items.reduce((sum, item) => sum + item.priceCents * item.qty, 0);
  if (discountPercent <= 0) return subtotal;
  return Math.round(subtotal * (1 - discountPercent / 100));
}

export class CouponController {
  private latestDiscount = 0;

  constructor(private readonly fetchCoupon: (code: string) => Promise<CouponResult | null>) {}

  async applyCode(code: string): Promise<number> {
    const res = await this.fetchCoupon(code.trim().toUpperCase());
    this.latestDiscount = res ? res.percentOff : 0;
    return this.latestDiscount;
  }

  getDiscount(): number {
    return this.latestDiscount;
  }
}
