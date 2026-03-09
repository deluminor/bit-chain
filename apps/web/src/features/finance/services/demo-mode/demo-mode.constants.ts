export const DEMO_TRADES_COUNT = 100;
export const DEMO_TRANSACTIONS_COUNT = 50;
export const DEMO_BUDGETS_COUNT = 2;

export const DEMO_ACCOUNT_NAMES = [
  'Main Bank Account',
  'Savings Account',
  'Cash Wallet',
  'Investment Account',
] as const;

export const DEMO_INCOME_CATEGORIES = [
  { name: 'Salary', type: 'INCOME' as const, color: '#10B981', icon: 'Briefcase' },
  { name: 'Freelance', type: 'INCOME' as const, color: '#3B82F6', icon: 'Code' },
  { name: 'Investment Returns', type: 'INCOME' as const, color: '#8B5CF6', icon: 'TrendingUp' },
  { name: 'Side Business', type: 'INCOME' as const, color: '#F59E0B', icon: 'Store' },
] as const;

export const DEMO_EXPENSE_CATEGORIES = [
  { name: 'Groceries', type: 'EXPENSE' as const, color: '#EF4444', icon: 'ShoppingCart' },
  { name: 'Transport', type: 'EXPENSE' as const, color: '#F59E0B', icon: 'Car' },
  { name: 'Entertainment', type: 'EXPENSE' as const, color: '#8B5CF6', icon: 'Music' },
  { name: 'Utilities', type: 'EXPENSE' as const, color: '#06B6D4', icon: 'Zap' },
  { name: 'Restaurants', type: 'EXPENSE' as const, color: '#EC4899', icon: 'UtensilsCrossed' },
  { name: 'Shopping', type: 'EXPENSE' as const, color: '#84CC16', icon: 'ShoppingBag' },
  { name: 'Healthcare', type: 'EXPENSE' as const, color: '#EF4444', icon: 'Heart' },
  { name: 'Education', type: 'EXPENSE' as const, color: '#3B82F6', icon: 'BookOpen' },
] as const;

export const DEMO_TRANSACTION_DESCRIPTIONS: Record<string, string[]> = {
  Salary: ['Monthly salary payment', 'Payroll deposit', 'Salary for this month'],
  Freelance: ['Website development project', 'Freelance design work', 'Consulting services'],
  'Investment Returns': ['Stock dividends', 'Bond interest payment', 'Investment profits'],
  'Side Business': ['Online store sales', 'Product sales', 'Service revenue'],
  Groceries: [
    'Weekly grocery shopping',
    'Supermarket visit',
    'Food and household items',
    'Fresh produce',
  ],
  Transport: ['Gas station fill-up', 'Public transport card', 'Taxi ride', 'Uber ride'],
  Entertainment: ['Movie tickets', 'Concert tickets', 'Streaming subscription', 'Gaming'],
  Utilities: ['Electricity bill', 'Internet bill', 'Water bill', 'Phone bill'],
  Restaurants: ['Dinner at restaurant', 'Lunch takeout', 'Coffee shop', 'Fast food'],
  Shopping: ['Clothing purchase', 'Electronics', 'Home goods', 'Online shopping'],
  Healthcare: ['Doctor visit', 'Pharmacy', 'Health insurance', 'Dental checkup'],
  Education: ['Course enrollment', 'Books purchase', 'Online learning', 'Training program'],
};
