# 🚀 BitChain App

**BitChain** is a comprehensive web platform for traders that combines cryptocurrency trading tracking with a complete personal finance management system. Built with modern technologies to provide the best user experience.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 📋 Table of Contents

- [🎯 Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📊 Functionality](#-functionality)
- [🎨 UI/UX](#-uiux)
- [🔒 Security](#-security)
- [📈 Analytics & Reporting](#-analytics--reporting)
- [💾 Backup System](#-backup-system)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Configuration](#️-configuration)
- [🏃‍♂️ Development](#️-development)
- [🚀 Deployment](#-deployment)
- [📱 Responsiveness](#-responsiveness)
- [🔧 Development Guidelines](#-development-guidelines)

## 🎯 Key Features

### 📊 **Trading Management**

- **Detailed trade journal** with Long/Short position support
- **Trade screenshots** for visual analysis
- **Trade categorization** (solo, radar, everest, cryptonite, and more)
- **P&L calculations** and performance statistics
- **Demo and live account support**

### 💰 **Personal Finance System**

- **Multi-account management** (cash, bank cards, savings, investments)
- **Income and expense categorization** with hierarchical structure
- **Budget planning** with templates and automatic creation
- **Financial goals** with progress tracking
- **Multi-currency support** with UAH and other currencies
- **Monobank integration** with opt-in account selection and transaction sync

### 📈 **Analytics & Visualization**

- **Interactive charts** using Recharts
- **Net Worth tracking** with growth dynamics
- **Categorized spending** with color coding
- **Account balance trends** across all accounts
- **Budget analytics** with plan vs actual

### 🔐 **Security & Data Management**

- **Personal backups** with full recovery
- **Role-based authorization** with JWT tokens
- **User data isolation**
- **Password encryption** with bcryptjs

## 🏗️ Architecture

### **Frontend Architecture**

```
src/
├── app/                          # Next.js 14 App Router
│   ├── (protected)/             # Protected routes with layout
│   ├── (public)/               # Public routes (login/register)
│   ├── api/                    # API Routes (Backend)
│   └── globals.css             # Global styles
├── components/                  # UI Components
│   ├── ui/                     # Shadcn UI components
│   ├── forms/                  # Forms with React Hook Form
│   ├── layout/                 # Layout components
│   └── backup/                 # Backup system
├── features/                   # Feature-based architecture
│   ├── auth/                   # Authentication
│   └── finance/                # Finance system
├── hooks/                      # Custom React hooks
├── lib/                        # Utilities and configurations
├── providers/                  # Context Providers
├── store/                      # State Management
├── styles/                     # Additional styles
└── types/                      # TypeScript types
```

### **Backend Architecture**

```
Backend (API Routes):
├── /api/auth/[...nextauth]     # NextAuth.js endpoints
├── /api/backup                 # Backup system
├── /api/finance/               # Finance APIs
│   ├── accounts/              # Account CRUD operations
│   ├── transactions/          # Transaction management
│   ├── categories/            # Transaction categories
│   ├── budget/               # Budget system
│   └── reports/              # Reports and analytics
└── /api/trades/              # Trading API
```

### **Database Schema**

```mermaid
erDiagram
    User ||--o{ Trade : owns
    User ||--o{ Category : creates
    User ||--o{ FinanceAccount : manages
    User ||--o{ Transaction : records
    User ||--o{ Budget : plans
    User ||--o{ FinancialGoal : sets

    Trade ||--o{ Screenshot : contains
    Trade }o--|| Category : belongs_to

    Transaction }o--|| FinanceAccount : from_account
    Transaction }o--|| TransactionCategory : categorized_as
    Transaction }o--|| FinanceAccount : to_account

    Budget ||--o{ BudgetCategory : includes
    BudgetCategory }o--|| TransactionCategory : tracks
```

## 🛠️ Tech Stack

### **Frontend**

| Technology          | Version | Purpose                                    |
| ------------------- | ------- | ------------------------------------------ |
| **Next.js**         | 14.x    | Full-stack React framework with App Router |
| **React**           | 18.x    | UI library with hooks and suspense         |
| **TypeScript**      | 5.x     | Type safety and better development         |
| **TailwindCSS**     | 3.x     | Utility-first CSS framework                |
| **Shadcn UI**       | Latest  | Customizable UI components                 |
| **React Hook Form** | 7.x     | Efficient form management                  |
| **React Query**     | 5.x     | Server state management                    |
| **Recharts**        | 2.x     | Chart and visualization library            |

### **Backend & Database**

| Technology      | Version | Purpose                          |
| --------------- | ------- | -------------------------------- |
| **Prisma**      | 5.x     | Type-safe ORM with migrations    |
| **PostgreSQL**  | 14+     | Relational database              |
| **NextAuth.js** | 4.x     | Authentication and authorization |
| **bcryptjs**    | 2.x     | Password hashing                 |
| **Zod**         | 3.x     | Schema validation                |

### **Deployment & DevOps**

| Technology            | Purpose                     |
| --------------------- | --------------------------- |
| **Vercel**            | Hosting and auto-deployment |
| **Neon**              | Serverless PostgreSQL       |
| **GitHub Actions**    | CI/CD pipeline              |
| **ESLint + Prettier** | Code quality and formatting |

## 📊 Functionality

### **🎯 Trading Module**

**Trade Management:**

- Add trades with complete details (symbol, entry/exit price, leverage, P&L)
- Support for Long/Short positions
- Automatic profit/loss calculations
- Strategy-based categorization
- Demo and real accounts

**Visual Analytics:**

- Performance chart over time
- Win/loss ratio statistics
- Category distribution
- Net Worth dynamics

**System Files:**

```typescript
// Trade model
model Trade {
  id           String        @id @default(cuid())
  userId       String
  symbol       String        // BTC/USDT
  side         TradeSide     // LONG/SHORT
  entryPrice   Float
  exitPrice    Float
  positionSize Float
  leverage     Float?
  pnl          Float         // Calculated P&L
  result       TradeResult   // WIN/LOSS/PENDING
  screenshots  Screenshot[]  // Attached screenshots
}
```

### **💰 Financial System**

**Multi-Account Management:**

- Cash wallets
- Bank cards and accounts
- Savings accounts
- Investment portfolios

**Smart Categorization:**

```typescript
// Hierarchical categories
model TransactionCategory {
  id       String @id @default(cuid())
  name     String // "Groceries", "Entertainment"
  type     TransactionType // INCOME/EXPENSE
  parentId String? // Sub-categories
  parent   TransactionCategory? @relation("CategoryHierarchy")
  children TransactionCategory[] @relation("CategoryHierarchy")
  color    String // Color coding
  icon     String // UI icon
}
```

**Budget System:**

- Monthly and yearly planning
- Budget templates for reuse
- Automatic expense tracking
- Alerts for limit violations

**Financial Goals:**

- Target savings with deadlines
- Progress tracker with visualization
- Multiple currencies

### **🔗 Integrations**

- **Monobank**: connect in Settings, choose accounts to import, sync balances and statements on demand
- Future integrations (crypto exchanges, additional banks) plug into the same Settings area

## 🎨 UI/UX

### **Design System**

The project uses **Shadcn UI** as the foundation for the design system with customization through TailwindCSS:

**Color Palette:**

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  --muted: 210 40% 96%;
  --accent: 210 40% 96%;
  --destructive: 0 84.2% 60.2%;
}
```

**Component Architecture:**

- **Atomic Design** principles
- **Compositional components** with Radix UI
- **Responsive-first** approach
- **Dark/Light mode** support

### **Charts & Visualization**

```typescript
// Chart configuration example
const chartConfig = {
  netWorth: {
    label: 'Net Worth',
    color: '#8b5cf6',
  },
} satisfies ChartConfig;

// Gradient configuration for smooth visualization
<linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.55} />
  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
</linearGradient>
```

## 🔒 Security

### **Authentication**

```typescript
// NextAuth configuration with JWT
export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        const isValid = await compare(credentials.password, user.password);
        return isValid ? { id: user.id, email: user.email } : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
};
```

### **API-Level Authorization**

Each API route validates user session:

```typescript
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Filter data by userId
  const data = await prisma.transaction.findMany({
    where: { userId: session.user.id },
  });
}
```

### **Data Isolation**

- All data tied to `userId`
- Automatic filtering at Prisma level
- Middleware for route protection

## 📈 Analytics & Reporting

### **Real-time Dashboard**

```typescript
// Hook for financial statistics
export function useFinanceStats() {
  return useQuery({
    queryKey: ['financeStats'],
    queryFn: async () => {
      const response = await fetch('/api/finance/stats');
      return response.json();
    },
    refetchInterval: 30000, // Update every 30 seconds
  });
}
```

### **Graphical Analytics**

- **Net Worth Chart**: Capital growth dynamics
- **Category Spending**: Expense distribution by categories
- **Account Balance Trends**: Account balances over time
- **Budget Performance**: Plan vs actual budget execution

### **Data Export**

- CSV export of transactions
- PDF reports with charts
- JSON backup files

## 💾 Backup System

### **Personalized Backups**

Each user has their own backup system with complete isolation:

```typescript
// BackupService architecture
export class BackupService {
  static async exportAllData(options: { userId?: string }) {
    // Export all user data types
    const [
      users, categories, trades, screenshots,
      financeAccounts, transactions, transactionCategories,
      budgets, budgetCategories, financialGoals
    ] = await Promise.all([
      // Parallel queries with userId filtering
    ]);

    return {
      users, categories, trades, screenshots,
      financeAccounts, transactions, transactionCategories,
      budgets, budgetCategories, financialGoals,
      metadata: {
        version: this.BACKUP_VERSION,
        timestamp: new Date().toISOString(),
        totalRecords: /* calculation */
      }
    };
  }
}
```

**Backup Features:**

- ✅ **Create personal backups** with all user data
- ✅ **JSON export** with download capability
- ✅ **File restoration** with merge/replace options
- ✅ **Automatic validation** of backup structure
- ✅ **Versioning** for backward compatibility

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18.17+ and npm/yarn/pnpm
- PostgreSQL database (local or cloud)
- Git for repository cloning

### **1. Clone and Install**

```bash
# Clone repository
git clone https://github.com/erikkopcha/bit-chain.git
cd bit-chain

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### **2. Environment Configuration**

Copy `.env.example` to `.env.local` and update the values:

```env
# Database (Neon example)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-jwt-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional API keys for crypto data
CRYPTOPANIC_API_KEY="your_cryptopanic_api_key"
COINGECKO_API_KEY="your_coingecko_api_key" # Pro plan
```

### **3. Database Initialization**

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate dev --name init

# Optional: seed with test data
npx prisma db seed
```

### **4. Development Run**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Configuration

### **Prisma Configuration**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### **Next.js Configuration**

```javascript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['assets.coingecko.com', 'crypto.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};
```

### **TailwindCSS Configuration**

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        // ... color system
      },
    },
  },
};
```

## 🏃‍♂️ Development

### **Available Commands**

```bash
# Development
npm run dev          # Run dev server
npm run build        # Production build
npm run start        # Run production server
npm run lint         # ESLint check
npm run type-check   # TypeScript check

# Database
npx prisma studio    # Prisma Studio (DB GUI)
npx prisma migrate dev    # Create migration
npx prisma db push   # Push schema without migration
npx prisma generate  # Generate client

# Utilities
npm run format       # Prettier formatting
npm run analyze      # Bundle analyzer

# sync
npm run monobank:sync-all -- --email "email@example.com" --from "2026-01-01" --force

```

### **Development Structure**

```
Development Workflow:
1. Feature branch creation
2. TypeScript strict mode
3. ESLint + Prettier auto formatting
4. Pre-commit hooks with lint-staged
5. Automatic testing on CI/CD
6. Review process before merge
```

## 🚀 Deployment

### **Vercel Deployment (Recommended)**

1. **Connect GitHub repository** to Vercel
2. **Configure environment variables:**
   ```
   DATABASE_URL=your_production_database_url
   NEXTAUTH_SECRET=your_production_secret
   NEXTAUTH_URL=https://yourdomain.com
   ```
3. **Automatic deployment** on push to main

### **Railway Deployment**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init
railway up
```

### **Self-hosted (Docker)**

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

## 📱 Responsiveness

### **Responsive Design**

```css
/* Breakpoints system */
sm: 640px   /* Mobile devices */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large screens */
2xl: 1536px /* Ultra-wide displays */
```

**Mobile Optimization:**

- Touch-friendly interfaces
- Swipe gestures for navigation
- Optimized forms for mobile keyboards
- Progressive Web App capabilities

## 🔧 Development Guidelines

### **Code Style**

```typescript
// ESLint configuration
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### **Commit Conventions**

```
feat: add new functionality
fix: bug fixes
docs: documentation updates
style: formatting, no logical changes
refactor: refactoring without functionality changes
test: adding or fixing tests
chore: technical changes, dependency updates
```

### **Folder Structure Best Practices**

- **Feature-based** organization in `features/`
- **Shared components** in `components/ui`
- **Custom hooks** in `hooks/`
- **Type definitions** in `types/`
- **API routes** grouped by domains

## 🚀 Performance

### **Optimization Features**

- **Server-side rendering** with Next.js App Router
- **Static generation** for public pages
- **Image optimization** with Next.js Image component
- **Code splitting** with dynamic imports
- **Database query optimization** with Prisma
- **Caching strategies** with React Query

### **Bundle Analysis**

```bash
npm run analyze  # Analyze bundle size
npm run build    # Check build performance
```

## 🧪 Testing

### **Testing Strategy**

- **Unit tests** with Jest and React Testing Library
- **Integration tests** for API routes
- **E2E tests** with Playwright
- **Type checking** with TypeScript

### **Testing Commands**

```bash
npm run test        # Run unit tests
npm run test:e2e    # Run E2E tests
npm run test:watch  # Watch mode
npm run coverage    # Coverage report
```

## 🌐 API Documentation

### **Authentication Endpoints**

```
POST /api/auth/register - User registration
POST /api/auth/signin   - User login
GET  /api/auth/session  - Get current session
```

### **Trading Endpoints**

```
GET    /api/trades         - Get user trades
POST   /api/trades         - Create new trade
PUT    /api/trades/:id     - Update trade
DELETE /api/trades/:id     - Delete trade
```

### **Finance Endpoints**

```
GET    /api/finance/accounts     - Get accounts
POST   /api/finance/accounts     - Create account
GET    /api/finance/transactions - Get transactions
POST   /api/finance/transactions - Create transaction
GET    /api/finance/reports      - Get financial reports
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## 📞 Support

If you have questions or issues:

- Create an [Issue](https://github.com/erikkopcha/bit-chain/issues)
- Check [Documentation](https://github.com/erikkopcha/bit-chain/wiki)
- Contact the developer

---

**Made with ❤️ using Next.js, TypeScript, and modern web technologies**
