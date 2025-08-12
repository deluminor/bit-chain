// Import will be done in the main seed file
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export interface DefaultCategoryData {
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  isDefault: boolean;
  children?: Omit<DefaultCategoryData, 'children'>[];
}

export const DEFAULT_FINANCE_CATEGORIES: DefaultCategoryData[] = [
  // === INCOME CATEGORIES ===
  {
    name: 'Salary',
    type: TransactionType.INCOME,
    color: '#10B981', // green-500
    icon: 'Briefcase',
    isDefault: true,
    children: [
      {
        name: 'Main Job',
        type: TransactionType.INCOME,
        color: '#059669',
        icon: 'Building',
        isDefault: true,
      },
      {
        name: 'Part-time',
        type: TransactionType.INCOME,
        color: '#047857',
        icon: 'Clock',
        isDefault: true,
      },
      {
        name: 'Overtime',
        type: TransactionType.INCOME,
        color: '#065F46',
        icon: 'Plus',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Freelance',
    type: TransactionType.INCOME,
    color: '#8B5CF6', // purple-500
    icon: 'Laptop',
    isDefault: true,
    children: [
      {
        name: 'Web Development',
        type: TransactionType.INCOME,
        color: '#7C3AED',
        icon: 'Code',
        isDefault: true,
      },
      {
        name: 'Design',
        type: TransactionType.INCOME,
        color: '#6D28D9',
        icon: 'Palette',
        isDefault: true,
      },
      {
        name: 'Consulting',
        type: TransactionType.INCOME,
        color: '#5B21B6',
        icon: 'MessageCircle',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Investment',
    type: TransactionType.INCOME,
    color: '#F59E0B', // amber-500
    icon: 'TrendingUp',
    isDefault: true,
    children: [
      {
        name: 'Dividends',
        type: TransactionType.INCOME,
        color: '#D97706',
        icon: 'DollarSign',
        isDefault: true,
      },
      {
        name: 'Interest',
        type: TransactionType.INCOME,
        color: '#B45309',
        icon: 'Percent',
        isDefault: true,
      },
      {
        name: 'Capital Gains',
        type: TransactionType.INCOME,
        color: '#92400E',
        icon: 'ArrowUp',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Business',
    type: TransactionType.INCOME,
    color: '#3B82F6', // blue-500
    icon: 'Store',
    isDefault: true,
    children: [
      {
        name: 'Sales Revenue',
        type: TransactionType.INCOME,
        color: '#2563EB',
        icon: 'ShoppingCart',
        isDefault: true,
      },
      {
        name: 'Services',
        type: TransactionType.INCOME,
        color: '#1D4ED8',
        icon: 'Settings',
        isDefault: true,
      },
      {
        name: 'Royalties',
        type: TransactionType.INCOME,
        color: '#1E40AF',
        icon: 'Crown',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Other Income',
    type: TransactionType.INCOME,
    color: '#6B7280', // gray-500
    icon: 'Gift',
    isDefault: true,
    children: [
      {
        name: 'Gifts',
        type: TransactionType.INCOME,
        color: '#4B5563',
        icon: 'Heart',
        isDefault: true,
      },
      {
        name: 'Refunds',
        type: TransactionType.INCOME,
        color: '#374151',
        icon: 'RotateCcw',
        isDefault: true,
      },
      {
        name: 'Bonuses',
        type: TransactionType.INCOME,
        color: '#1F2937',
        icon: 'Award',
        isDefault: true,
      },
    ],
  },

  // === EXPENSE CATEGORIES ===
  {
    name: 'Food & Dining',
    type: TransactionType.EXPENSE,
    color: '#EF4444', // red-500
    icon: 'UtensilsCrossed',
    isDefault: true,
    children: [
      {
        name: 'Groceries',
        type: TransactionType.EXPENSE,
        color: '#DC2626',
        icon: 'ShoppingBasket',
        isDefault: true,
      },
      {
        name: 'Restaurants',
        type: TransactionType.EXPENSE,
        color: '#B91C1C',
        icon: 'UtensilsCrossed',
        isDefault: true,
      },
      {
        name: 'Fast Food',
        type: TransactionType.EXPENSE,
        color: '#991B1B',
        icon: 'Zap',
        isDefault: true,
      },
      {
        name: 'Coffee & Drinks',
        type: TransactionType.EXPENSE,
        color: '#7F1D1D',
        icon: 'Coffee',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Transportation',
    type: TransactionType.EXPENSE,
    color: '#06B6D4', // cyan-500
    icon: 'Car',
    isDefault: true,
    children: [
      {
        name: 'Fuel',
        type: TransactionType.EXPENSE,
        color: '#0891B2',
        icon: 'Fuel',
        isDefault: true,
      },
      {
        name: 'Public Transport',
        type: TransactionType.EXPENSE,
        color: '#0E7490',
        icon: 'Bus',
        isDefault: true,
      },
      {
        name: 'Taxi & Rideshare',
        type: TransactionType.EXPENSE,
        color: '#155E75',
        icon: 'Navigation',
        isDefault: true,
      },
      {
        name: 'Car Maintenance',
        type: TransactionType.EXPENSE,
        color: '#164E63',
        icon: 'Wrench',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Housing',
    type: TransactionType.EXPENSE,
    color: '#84CC16', // lime-500
    icon: 'Home',
    isDefault: true,
    children: [
      {
        name: 'Rent',
        type: TransactionType.EXPENSE,
        color: '#65A30D',
        icon: 'Key',
        isDefault: true,
      },
      {
        name: 'Mortgage',
        type: TransactionType.EXPENSE,
        color: '#4D7C0F',
        icon: 'Building',
        isDefault: true,
      },
      {
        name: 'Utilities',
        type: TransactionType.EXPENSE,
        color: '#365314',
        icon: 'Zap',
        isDefault: true,
      },
      {
        name: 'Internet & Phone',
        type: TransactionType.EXPENSE,
        color: '#1A2E05',
        icon: 'Wifi',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Healthcare',
    type: TransactionType.EXPENSE,
    color: '#EC4899', // pink-500
    icon: 'Heart',
    isDefault: true,
    children: [
      {
        name: 'Medical Bills',
        type: TransactionType.EXPENSE,
        color: '#DB2777',
        icon: 'Stethoscope',
        isDefault: true,
      },
      {
        name: 'Pharmacy',
        type: TransactionType.EXPENSE,
        color: '#BE185D',
        icon: 'Pill',
        isDefault: true,
      },
      {
        name: 'Dental',
        type: TransactionType.EXPENSE,
        color: '#9D174D',
        icon: 'Smile',
        isDefault: true,
      },
      {
        name: 'Insurance',
        type: TransactionType.EXPENSE,
        color: '#831843',
        icon: 'Shield',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Entertainment',
    type: TransactionType.EXPENSE,
    color: '#F97316', // orange-500
    icon: 'Music',
    isDefault: true,
    children: [
      {
        name: 'Movies & Cinema',
        type: TransactionType.EXPENSE,
        color: '#EA580C',
        icon: 'Film',
        isDefault: true,
      },
      {
        name: 'Streaming Services',
        type: TransactionType.EXPENSE,
        color: '#C2410C',
        icon: 'Tv',
        isDefault: true,
      },
      {
        name: 'Games',
        type: TransactionType.EXPENSE,
        color: '#9A3412',
        icon: 'Gamepad2',
        isDefault: true,
      },
      {
        name: 'Books',
        type: TransactionType.EXPENSE,
        color: '#7C2D12',
        icon: 'Book',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Shopping',
    type: TransactionType.EXPENSE,
    color: '#A855F7', // violet-500
    icon: 'ShoppingBag',
    isDefault: true,
    children: [
      {
        name: 'Clothing',
        type: TransactionType.EXPENSE,
        color: '#9333EA',
        icon: 'Shirt',
        isDefault: true,
      },
      {
        name: 'Electronics',
        type: TransactionType.EXPENSE,
        color: '#7C3AED',
        icon: 'Smartphone',
        isDefault: true,
      },
      {
        name: 'Home & Garden',
        type: TransactionType.EXPENSE,
        color: '#6D28D9',
        icon: 'Home',
        isDefault: true,
      },
      {
        name: 'Personal Care',
        type: TransactionType.EXPENSE,
        color: '#5B21B6',
        icon: 'Sparkles',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Education',
    type: TransactionType.EXPENSE,
    color: '#0EA5E9', // sky-500
    icon: 'GraduationCap',
    isDefault: true,
    children: [
      {
        name: 'Courses',
        type: TransactionType.EXPENSE,
        color: '#0284C7',
        icon: 'BookOpen',
        isDefault: true,
      },
      {
        name: 'Books & Materials',
        type: TransactionType.EXPENSE,
        color: '#0369A1',
        icon: 'Book',
        isDefault: true,
      },
      {
        name: 'Tuition',
        type: TransactionType.EXPENSE,
        color: '#075985',
        icon: 'School',
        isDefault: true,
      },
      {
        name: 'Certifications',
        type: TransactionType.EXPENSE,
        color: '#0C4A6E',
        icon: 'Award',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Travel',
    type: TransactionType.EXPENSE,
    color: '#14B8A6', // teal-500
    icon: 'Plane',
    isDefault: true,
    children: [
      {
        name: 'Flights',
        type: TransactionType.EXPENSE,
        color: '#0D9488',
        icon: 'Plane',
        isDefault: true,
      },
      {
        name: 'Hotels',
        type: TransactionType.EXPENSE,
        color: '#0F766E',
        icon: 'Bed',
        isDefault: true,
      },
      {
        name: 'Local Transport',
        type: TransactionType.EXPENSE,
        color: '#115E59',
        icon: 'Map',
        isDefault: true,
      },
      {
        name: 'Food & Activities',
        type: TransactionType.EXPENSE,
        color: '#134E4A',
        icon: 'Camera',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Financial',
    type: TransactionType.EXPENSE,
    color: '#64748B', // slate-500
    icon: 'CreditCard',
    isDefault: true,
    children: [
      {
        name: 'Bank Fees',
        type: TransactionType.EXPENSE,
        color: '#475569',
        icon: 'Building2',
        isDefault: true,
      },
      {
        name: 'Interest Payments',
        type: TransactionType.EXPENSE,
        color: '#334155',
        icon: 'Percent',
        isDefault: true,
      },
      {
        name: 'Loan Payments',
        type: TransactionType.EXPENSE,
        color: '#1E293B',
        icon: 'HandCoins',
        isDefault: true,
      },
      {
        name: 'Investments',
        type: TransactionType.EXPENSE,
        color: '#0F172A',
        icon: 'TrendingUp',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Other Expenses',
    type: TransactionType.EXPENSE,
    color: '#6B7280', // gray-500
    icon: 'MoreHorizontal',
    isDefault: true,
    children: [
      {
        name: 'Miscellaneous',
        type: TransactionType.EXPENSE,
        color: '#4B5563',
        icon: 'Package',
        isDefault: true,
      },
      {
        name: 'Taxes',
        type: TransactionType.EXPENSE,
        color: '#374151',
        icon: 'Receipt',
        isDefault: true,
      },
      {
        name: 'Donations',
        type: TransactionType.EXPENSE,
        color: '#1F2937',
        icon: 'Heart',
        isDefault: true,
      },
      {
        name: 'Emergency',
        type: TransactionType.EXPENSE,
        color: '#111827',
        icon: 'AlertTriangle',
        isDefault: true,
      },
    ],
  },
];
