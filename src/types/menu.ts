/**
 * Menu domain types.
 *
 * Money is always an integer number of cents. Floating point is never used for
 * prices: 0.1 + 0.2 is not 0.3, and a menu that is a few cents off on a large
 * order is a menu nobody trusts.
 */
export type Cents = number;

/** One selectable choice inside an option group, e.g. "Extra cheese". */
export type OptionChoice = {
  id: string;
  label: string;
  /** Added to the product price when selected. Never negative. */
  priceDelta: Cents;
};

/**
 * A set of choices offered on a product. `min`/`max` bound how many of its
 * choices may be selected, so "pick up to 3 extras" and "pick exactly one
 * size" are the same structure.
 */
export type OptionGroup = {
  id: string;
  label: string;
  min: number;
  max: number;
  choices: OptionChoice[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: Cents;
  image: string;
  imageAlt: string;
  /** Unavailable products stay visible but cannot be ordered. */
  available: boolean;
  optionGroups: OptionGroup[];
};

export type Category = {
  id: string;
  label: string;
  description: string;
};

export type Restaurant = {
  name: string;
  tagline: string;
  description: string;
  /** International format, digits only, as wa.me expects. */
  whatsapp: string;
  currency: string;
  locale: string;
  hours: { day: string; hours: string }[];
  delivery: {
    enabled: boolean;
    /** No fee is invented. This is shown instead, and it says so. */
    feeNote: string;
    minimumOrder: Cents | null;
  };
};

export type Catalog = {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
};

/** How a customer wants to receive the order. */
export type Fulfilment = 'pickup' | 'delivery';

/** A product plus the exact choices made for it. */
export type CartItem = {
  /** Identity of the line: product plus its selected choices, so the same
   *  product with different choices never merges into one line. */
  lineId: string;
  productId: string;
  quantity: number;
  selectedChoiceIds: string[];
  notes: string;
};
