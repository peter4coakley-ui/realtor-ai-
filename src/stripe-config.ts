export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'subscription' | 'payment';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_TMm1ERLhTr6XXc',
    priceId: 'price_1SQ2TjIL5Yj0JOdI7r2LcT8r',
    name: 'Enterprise',
    description: 'Real estate agencies',
    price: 99.99,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prod_TMm1Kl3iNqkmcY',
    priceId: 'price_1SQ2TCIL5Yj0JOdIeLa2KpbC',
    name: 'Pro',
    description: '200 credits',
    price: 29.99,
    currency: 'usd',
    mode: 'subscription'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const formatPrice = (price: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(price);
};