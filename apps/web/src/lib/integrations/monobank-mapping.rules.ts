export type CategoryRule = {
  names: string[];
  mcc?: number[];
  mccRanges?: Array<[number, number]>;
  keywords?: string[];
};

export const INCOME_RULES: CategoryRule[] = [
  {
    names: ['Main Job', 'Salary'],
    keywords: ['salary', 'payroll', 'зарп', 'зароб', 'wage', 'paycheck'],
  },
  {
    names: ['Dividends', 'Investment', 'Other Income'],
    keywords: ['dividend', 'дивіденд', 'dividends'],
  },
  {
    names: ['Interest', 'Investment', 'Other Income'],
    keywords: ['interest', 'відсот', 'deposit', 'депозит', 'процент'],
  },
  {
    names: ['Refunds', 'Other Income'],
    keywords: [
      'refund',
      'cashback',
      'повернен',
      'reversal',
      'chargeback',
      'кешбек',
      'кешбэк',
      'скасув',
      'cancellation',
    ],
  },
  {
    names: ['Gifts', 'Other Income'],
    keywords: ['gift', 'подар', 'дарунок', 'donate', 'донат'],
  },
];

export const EXPENSE_RULES: CategoryRule[] = [
  {
    names: ['Groceries', 'Food & Drink', 'Food & Dining'],
    mcc: [5411, 5422, 5441, 5451, 5499],
    keywords: ['grocery', 'supermarket', 'grocer', 'продукт', 'супермаркет', 'market'],
  },
  {
    names: ['Restaurants', 'Food & Drink', 'Food & Dining'],
    mcc: [5812, 5813, 5814],
    keywords: ['restaurant', 'cafe', 'coffee', 'bar', 'pizza', 'burger', 'кафе', 'ресторан'],
  },
  {
    names: ['Fuel', 'Transportation', 'Transport'],
    mcc: [5541, 5542],
    keywords: ['fuel', 'gas', 'petrol', 'diesel', 'азс', 'паливо'],
  },
  {
    names: ['Transport', 'Public Transport', 'Transportation'],
    mcc: [4111, 4112, 4131, 4789],
    keywords: ['metro', 'bus', 'tram', 'train', 'transport', 'метро', 'маршрут'],
  },
  {
    names: ['Parking', 'Transportation', 'Transport'],
    mcc: [7523],
    keywords: ['parking', 'парков'],
  },
  {
    names: ['Car Maintenance', 'Transportation', 'Transport'],
    mcc: [7531, 7538, 7542, 7549],
    keywords: ['service', 'repair', 'автосервіс', 'сто', 'ремонт авто'],
  },
  {
    names: ['Subscriptions', 'House', 'Housing', 'Utilities'],
    mcc: [4900, 4814, 4812, 4816, 4899],
    keywords: ['utility', 'internet', 'phone', 'telecom', 'комун', 'інтернет', "зв'язок"],
  },
  {
    names: ['Rent/Mortgage', 'Housing', 'House'],
    mcc: [6513],
    keywords: ['rent', 'mortgage', 'оренда', 'квартира', 'lease'],
  },
  {
    names: ['Home Maintenance', 'Housing', 'House'],
    keywords: ['renovation', 'repair', 'будмат', 'ремонт'],
  },
  {
    names: ['Medications', 'Healthcare'],
    mcc: [5912],
    keywords: ['pharmacy', 'аптека', 'ліки', 'pharma'],
  },
  {
    names: ['Medical Services', 'Healthcare'],
    mcc: [8011, 8021, 8031, 8041, 8042, 8043, 8049, 8062, 8071, 8099],
    keywords: ['clinic', 'hospital', 'doctor', 'лікар', 'клінік'],
  },
  {
    names: ['Subscriptions', 'Entertainment', 'Shopping'],
    mcc: [7832, 7922, 7929, 7991, 7996, 7999],
    keywords: ['cinema', 'movie', 'concert', 'netflix', 'spotify', 'кіно', 'концерт'],
  },
  {
    names: ['Subscriptions'],
    mcc: [5817, 5818, 5968, 6012, 6300, 5734, 5045],
    keywords: [
      'subscription',
      'subscribe',
      'netflix',
      'spotify',
      'apple',
      'google',
      'cloud',
      'tradingview',
      'adobe',
    ],
  },
  {
    names: ['Shopping'],
    keywords: ['moyo', 'monomarket'],
  },
  {
    names: ['Shopping'],
    mcc: [5977],
    keywords: ['drogeria', 'cosmetic', 'muller'],
  },
  {
    names: ['Clothing', 'Shopping'],
    mcc: [5651, 5691, 5699],
    keywords: ['clothing', 'apparel', 'одяг'],
  },
  {
    names: ['Electronics', 'Shopping'],
    mcc: [5732],
    keywords: ['electronics', 'gadget', 'tech', 'електрон'],
  },
  {
    names: ['Home & Garden', 'Shopping'],
    mcc: [5200, 5211],
    keywords: ['home', 'garden', 'furniture', 'дім', 'мебл'],
  },
  {
    names: ['Personal Care', 'Shopping'],
    mcc: [7230, 7298],
    keywords: ['beauty', 'salon', 'spa', 'космет', 'перукар'],
  },
  {
    names: ['Education'],
    mcc: [8211, 8220, 8241, 8244, 8249, 8299],
    keywords: ['course', 'class', 'school', 'university', 'курс', 'школ', 'універс'],
  },
  {
    names: ['Travel', 'Transport'],
    mcc: [4722, 7011],
    mccRanges: [[3000, 3350]],
    keywords: ['hotel', 'flight', 'airline', 'travel', 'booking'],
  },
  {
    names: ['Taxes', 'Other Expenses'],
    mcc: [9311],
    keywords: ['tax', 'подат', 'мит'],
  },
  {
    names: ['Donations', 'Other Expenses'],
    mcc: [8398],
    keywords: ['donation', 'charity', 'благод'],
  },
];
