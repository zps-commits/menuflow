import type { Catalog } from '@/types/menu';

/**
 * Demonstration catalog.
 *
 * Mesa Nove is a fictional restaurant invented for this portfolio piece. The
 * WhatsApp number is a placeholder (9 followed by zeros) and is not a real
 * line: replace it before using this with an actual business. No real personal
 * data appears anywhere in this file.
 */
export const catalog: Catalog = {
  restaurant: {
    name: 'Mesa Nove',
    tagline: 'Wood-fire kitchen, Recife',
    description:
      'A small neighbourhood kitchen cooking over wood fire. The menu changes with what the market has, so a few dishes come and go through the week.',
    whatsapp: '5581900000000',
    currency: 'BRL',
    locale: 'pt-BR',
    hours: [
      { day: 'Tuesday to Thursday', hours: '18:00 - 23:00' },
      { day: 'Friday and Saturday', hours: '18:00 - 00:30' },
      { day: 'Sunday', hours: '12:00 - 17:00' },
      { day: 'Monday', hours: 'Closed' },
    ],
    delivery: {
      enabled: true,
      feeNote: 'The delivery fee depends on your address and is confirmed over WhatsApp before the order is accepted.',
      minimumOrder: 4000,
    },
  },

  categories: [
    { id: 'starters', label: 'Starters', description: 'Small plates to open the table.' },
    { id: 'fire', label: 'From the fire', description: 'Cooked over wood embers.' },
    { id: 'pasta', label: 'Pasta', description: 'Rolled and cut the same day.' },
    { id: 'desserts', label: 'Desserts', description: 'Made in house.' },
    { id: 'drinks', label: 'Drinks', description: 'Non-alcoholic, made to order.' },
  ],

  products: [
    {
      id: 'bruschetta',
      name: 'Tomato bruschetta',
      description: 'Sourdough, confit tomato, basil and a sharp olive oil.',
      categoryId: 'starters',
      price: 2800,
      image: '/menu/bruschetta.jpg',
      imageAlt: 'Bruschetta with tomato and basil on a wooden board',
      available: true,
      optionGroups: [
        {
          id: 'bruschetta-size',
          label: 'Portion',
          min: 1,
          max: 1,
          choices: [
            { id: 'bruschetta-size-4', label: '4 pieces', priceDelta: 0 },
            { id: 'bruschetta-size-8', label: '8 pieces', priceDelta: 2200 },
          ],
        },
        {
          id: 'bruschetta-extras',
          label: 'Add to it',
          min: 0,
          max: 2,
          choices: [
            { id: 'bruschetta-extra-burrata', label: 'Burrata', priceDelta: 1800 },
            { id: 'bruschetta-extra-anchovy', label: 'Anchovy', priceDelta: 900 },
          ],
        },
      ],
    },
    {
      id: 'cod-croquettes',
      name: 'Salt cod croquettes',
      description: 'Six croquettes, lemon aioli on the side.',
      categoryId: 'starters',
      price: 3600,
      image: '/menu/cod-croquettes.jpg',
      imageAlt: 'Golden fried croquettes on a plate',
      available: true,
      optionGroups: [
        {
          id: 'croquettes-sauce',
          label: 'Sauce',
          min: 1,
          max: 1,
          choices: [
            { id: 'croquettes-sauce-aioli', label: 'Lemon aioli', priceDelta: 0 },
            { id: 'croquettes-sauce-pepper', label: 'Smoked pepper', priceDelta: 0 },
          ],
        },
      ],
    },
    {
      id: 'burrata',
      name: 'Burrata and roasted peach',
      description: 'Whole burrata, peach roasted in the embers, mint.',
      categoryId: 'starters',
      price: 4200,
      image: '/menu/burrata.jpg',
      imageAlt: 'Burrata cheese plated with roasted fruit',
      available: false,
      optionGroups: [],
    },
    {
      id: 'ribeye',
      name: 'Ribeye over embers',
      description: '400g, rested and sliced, with burnt onion and sea salt.',
      categoryId: 'fire',
      price: 12900,
      image: '/menu/ribeye.jpg',
      imageAlt: 'Sliced grilled ribeye steak on a board',
      available: true,
      optionGroups: [
        {
          id: 'ribeye-point',
          label: 'Cooked to',
          min: 1,
          max: 1,
          choices: [
            { id: 'ribeye-point-rare', label: 'Rare', priceDelta: 0 },
            { id: 'ribeye-point-medium', label: 'Medium', priceDelta: 0 },
            { id: 'ribeye-point-well', label: 'Well done', priceDelta: 0 },
          ],
        },
        {
          id: 'ribeye-side',
          label: 'Side',
          min: 1,
          max: 2,
          choices: [
            { id: 'ribeye-side-potato', label: 'Ember potatoes', priceDelta: 0 },
            { id: 'ribeye-side-greens', label: 'Grilled greens', priceDelta: 0 },
            { id: 'ribeye-side-farofa', label: 'Farofa', priceDelta: 1200 },
          ],
        },
      ],
    },
    {
      id: 'short-rib',
      name: 'Short rib, eight hours',
      description: 'Slow cooked over low embers, with its own reduced juices.',
      categoryId: 'fire',
      price: 11500,
      image: '/menu/short-rib.jpg',
      imageAlt: 'Braised short rib served on a dark plate',
      available: true,
      optionGroups: [
        {
          id: 'shortrib-side',
          label: 'Side',
          min: 1,
          max: 1,
          choices: [
            { id: 'shortrib-side-polenta', label: 'Soft polenta', priceDelta: 0 },
            { id: 'shortrib-side-potato', label: 'Ember potatoes', priceDelta: 0 },
          ],
        },
      ],
    },
    {
      id: 'roast-chicken',
      name: 'Half chicken, herb butter',
      description: 'Brined overnight, finished skin side down on the grill.',
      categoryId: 'fire',
      price: 8400,
      image: '/menu/roast-chicken.jpg',
      imageAlt: 'Roast chicken with herbs on a serving dish',
      available: true,
      optionGroups: [
        {
          id: 'chicken-heat',
          label: 'Heat',
          min: 1,
          max: 1,
          choices: [
            { id: 'chicken-heat-none', label: 'No chilli', priceDelta: 0 },
            { id: 'chicken-heat-mild', label: 'Mild', priceDelta: 0 },
            { id: 'chicken-heat-hot', label: 'Hot', priceDelta: 0 },
          ],
        },
      ],
    },
    {
      id: 'grilled-fish',
      name: 'Fish of the day',
      description: 'Whatever came in that morning, grilled whole, lemon and herbs.',
      categoryId: 'fire',
      price: 9800,
      image: '/menu/grilled-fish.jpg',
      imageAlt: 'Whole grilled fish with lemon',
      available: true,
      optionGroups: [],
    },
    {
      id: 'cacio-e-pepe',
      name: 'Cacio e pepe',
      description: 'Fresh tonnarelli, pecorino, a lot of black pepper.',
      categoryId: 'pasta',
      price: 6200,
      image: '/menu/cacio-e-pepe.jpg',
      imageAlt: 'Bowl of cacio e pepe pasta',
      available: true,
      optionGroups: [
        {
          id: 'cacio-extras',
          label: 'Add to it',
          min: 0,
          max: 2,
          choices: [
            { id: 'cacio-extra-pecorino', label: 'Extra pecorino', priceDelta: 900 },
            { id: 'cacio-extra-guanciale', label: 'Guanciale', priceDelta: 1600 },
          ],
        },
      ],
    },
    {
      id: 'mushroom-pasta',
      name: 'Mushroom pappardelle',
      description: 'Wide ribbons, mushrooms cooked hard in butter, thyme.',
      categoryId: 'pasta',
      price: 6800,
      image: '/menu/mushroom-pasta.jpg',
      imageAlt: 'Pappardelle pasta with mushrooms',
      available: true,
      optionGroups: [],
    },
    {
      id: 'seafood-linguine',
      name: 'Seafood linguine',
      description: 'Clams, prawns, white wine and a lot of parsley.',
      categoryId: 'pasta',
      price: 8900,
      image: '/menu/seafood-linguine.jpg',
      imageAlt: 'Linguine with seafood in a shallow bowl',
      available: true,
      optionGroups: [],
    },
    {
      id: 'chocolate-torte',
      name: 'Dark chocolate torte',
      description: 'Dense, barely sweet, sea salt on top.',
      categoryId: 'desserts',
      price: 3200,
      image: '/menu/chocolate-torte.jpg',
      imageAlt: 'Slice of dark chocolate torte',
      available: true,
      optionGroups: [
        {
          id: 'torte-extras',
          label: 'Add to it',
          min: 0,
          max: 1,
          choices: [{ id: 'torte-extra-cream', label: 'Whipped cream', priceDelta: 600 }],
        },
      ],
    },
    {
      id: 'citrus-tart',
      name: 'Citrus tart',
      description: 'Lime and orange curd, torched meringue.',
      categoryId: 'desserts',
      price: 2900,
      image: '/menu/citrus-tart.jpg',
      imageAlt: 'Citrus tart with torched meringue',
      available: true,
      optionGroups: [],
    },
    {
      id: 'house-lemonade',
      name: 'House lemonade',
      description: 'Pressed to order, ginger and a little honey.',
      categoryId: 'drinks',
      price: 1600,
      image: '/menu/house-lemonade.jpg',
      imageAlt: 'Glass of lemonade with ice',
      available: true,
      optionGroups: [
        {
          id: 'lemonade-size',
          label: 'Size',
          min: 1,
          max: 1,
          choices: [
            { id: 'lemonade-size-regular', label: 'Regular', priceDelta: 0 },
            { id: 'lemonade-size-large', label: 'Large', priceDelta: 700 },
          ],
        },
      ],
    },
    {
      id: 'spiced-tonic',
      name: 'Spiced tonic',
      description: 'Tonic, cardamom syrup, burnt orange.',
      categoryId: 'drinks',
      price: 1900,
      image: '/menu/spiced-tonic.jpg',
      imageAlt: 'Tall glass of tonic with orange',
      available: true,
      optionGroups: [],
    },
  ],
};
