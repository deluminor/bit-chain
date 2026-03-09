import { TransactionType, type DefaultCategoryData } from './finance-categories.types';

export const DEFAULT_FINANCE_EXPENSE_SECONDARY_CATEGORIES: DefaultCategoryData[] = [
  {
    name: 'Education',
    type: TransactionType.EXPENSE,
    color: '#0EA5E9',
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
    color: '#14B8A6',
    icon: 'Plane',
    isDefault: true,
  },
  {
    name: 'Other Expenses',
    type: TransactionType.EXPENSE,
    color: '#6B7280',
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
