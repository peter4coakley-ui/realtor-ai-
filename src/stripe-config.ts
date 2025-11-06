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
    id: 'prod_starter',
    priceId: 'price_starter_100',
    name: 'Starter Pack',
    description: '100 credits • Perfect for trying out PropertyLens AI',
    price: 9.99,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_professional',
    priceId: 'price_professional_500',
    name: 'Professional Pack',
    description: '500 credits • Most popular choice for active agents',
    price: 39.99,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_business',
    priceId: 'price_business_1000',
    name: 'Business Pack',
    description: '1,000 credits • Best value for high-volume users',
    price: 69.99,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_TMm1Kl3iNqkmcY',
    priceId: 'price_1SQ2TCIL5Yj0JOdIeLa2KpbC',
    name: 'Pro Monthly',
    description: '200 credits per month • Automatic renewal',
    price: 29.99,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prod_TMm1ERLhTr6XXc',
    priceId: 'price_1SQ2TjIL5Yj0JOdI7r2LcT8r',
    name: 'Enterprise Monthly',
    description: 'Unlimited credits • Priority support for agencies',
    price: 99.99,
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