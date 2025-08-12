/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model Category
 *
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>;
/**
 * Model Trade
 *
 */
export type Trade = $Result.DefaultSelection<Prisma.$TradePayload>;
/**
 * Model Screenshot
 *
 */
export type Screenshot = $Result.DefaultSelection<Prisma.$ScreenshotPayload>;
/**
 * Model FinanceAccount
 *
 */
export type FinanceAccount = $Result.DefaultSelection<Prisma.$FinanceAccountPayload>;
/**
 * Model Transaction
 *
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>;
/**
 * Model TransactionCategory
 *
 */
export type TransactionCategory = $Result.DefaultSelection<Prisma.$TransactionCategoryPayload>;
/**
 * Model Budget
 *
 */
export type Budget = $Result.DefaultSelection<Prisma.$BudgetPayload>;
/**
 * Model BudgetCategory
 *
 */
export type BudgetCategory = $Result.DefaultSelection<Prisma.$BudgetCategoryPayload>;
/**
 * Model FinancialGoal
 *
 */
export type FinancialGoal = $Result.DefaultSelection<Prisma.$FinancialGoalPayload>;

/**
 * Enums
 */
export namespace $Enums {
  export const TradeSide: {
    LONG: 'LONG';
    SHORT: 'SHORT';
  };

  export type TradeSide = (typeof TradeSide)[keyof typeof TradeSide];

  export const TradeResult: {
    WIN: 'WIN';
    LOSS: 'LOSS';
    PENDING: 'PENDING';
  };

  export type TradeResult = (typeof TradeResult)[keyof typeof TradeResult];

  export const TradeCategory: {
    solo: 'solo';
    radar: 'radar';
    everest: 'everest';
    cryptonite_radar: 'cryptonite_radar';
    cryptonite_everest: 'cryptonite_everest';
    humster: 'humster';
  };

  export type TradeCategory = (typeof TradeCategory)[keyof typeof TradeCategory];

  export const AccountType: {
    CASH: 'CASH';
    BANK_CARD: 'BANK_CARD';
    SAVINGS: 'SAVINGS';
    INVESTMENT: 'INVESTMENT';
  };

  export type AccountType = (typeof AccountType)[keyof typeof AccountType];

  export const TransactionType: {
    INCOME: 'INCOME';
    EXPENSE: 'EXPENSE';
    TRANSFER: 'TRANSFER';
  };

  export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

  export const BudgetPeriod: {
    MONTHLY: 'MONTHLY';
    YEARLY: 'YEARLY';
  };

  export type BudgetPeriod = (typeof BudgetPeriod)[keyof typeof BudgetPeriod];

  export const RecurringPattern: {
    DAILY: 'DAILY';
    WEEKLY: 'WEEKLY';
    MONTHLY: 'MONTHLY';
    QUARTERLY: 'QUARTERLY';
    YEARLY: 'YEARLY';
  };

  export type RecurringPattern = (typeof RecurringPattern)[keyof typeof RecurringPattern];
}

export type TradeSide = $Enums.TradeSide;

export const TradeSide: typeof $Enums.TradeSide;

export type TradeResult = $Enums.TradeResult;

export const TradeResult: typeof $Enums.TradeResult;

export type TradeCategory = $Enums.TradeCategory;

export const TradeCategory: typeof $Enums.TradeCategory;

export type AccountType = $Enums.AccountType;

export const AccountType: typeof $Enums.AccountType;

export type TransactionType = $Enums.TransactionType;

export const TransactionType: typeof $Enums.TransactionType;

export type BudgetPeriod = $Enums.BudgetPeriod;

export const BudgetPeriod: typeof $Enums.BudgetPeriod;

export type RecurringPattern = $Enums.RecurringPattern;

export const RecurringPattern: typeof $Enums.RecurringPattern;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(
    eventType: V,
    callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void,
  ): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Categories
   * const categories = await prisma.category.findMany()
   * ```
   */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trade`: Exposes CRUD operations for the **Trade** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Trades
   * const trades = await prisma.trade.findMany()
   * ```
   */
  get trade(): Prisma.TradeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.screenshot`: Exposes CRUD operations for the **Screenshot** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Screenshots
   * const screenshots = await prisma.screenshot.findMany()
   * ```
   */
  get screenshot(): Prisma.ScreenshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.financeAccount`: Exposes CRUD operations for the **FinanceAccount** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more FinanceAccounts
   * const financeAccounts = await prisma.financeAccount.findMany()
   * ```
   */
  get financeAccount(): Prisma.FinanceAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Transactions
   * const transactions = await prisma.transaction.findMany()
   * ```
   */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transactionCategory`: Exposes CRUD operations for the **TransactionCategory** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more TransactionCategories
   * const transactionCategories = await prisma.transactionCategory.findMany()
   * ```
   */
  get transactionCategory(): Prisma.TransactionCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.budget`: Exposes CRUD operations for the **Budget** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Budgets
   * const budgets = await prisma.budget.findMany()
   * ```
   */
  get budget(): Prisma.BudgetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.budgetCategory`: Exposes CRUD operations for the **BudgetCategory** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more BudgetCategories
   * const budgetCategories = await prisma.budgetCategory.findMany()
   * ```
   */
  get budgetCategory(): Prisma.BudgetCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.financialGoal`: Exposes CRUD operations for the **FinancialGoal** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more FinancialGoals
   * const financialGoals = await prisma.financialGoal.findMany()
   * ```
   */
  get financialGoal(): Prisma.FinancialGoalDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<
    ReturnType<T>
  >;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
    ? _Either<O, K, strict>
    : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (
    k: infer I,
  ) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> =
    IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<
    T,
    MaybeTupleToUnion<K>
  >;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    User: 'User';
    Category: 'Category';
    Trade: 'Trade';
    Screenshot: 'Screenshot';
    FinanceAccount: 'FinanceAccount';
    Transaction: 'Transaction';
    TransactionCategory: 'TransactionCategory';
    Budget: 'Budget';
    BudgetCategory: 'BudgetCategory';
    FinancialGoal: 'FinancialGoal';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  interface TypeMapCb<ClientOptions = {}>
    extends $Utils.Fn<{ extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps:
        | 'user'
        | 'category'
        | 'trade'
        | 'screenshot'
        | 'financeAccount'
        | 'transaction'
        | 'transactionCategory'
        | 'budget'
        | 'budgetCategory'
        | 'financialGoal';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>;
        fields: Prisma.UserFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUser>;
          };
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserCountArgs<ExtArgs>;
            result: $Utils.Optional<UserCountAggregateOutputType> | number;
          };
        };
      };
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>;
        fields: Prisma.CategoryFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[];
          };
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[];
          };
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.CategoryUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[];
          };
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateCategory>;
          };
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>;
            result: $Utils.Optional<CategoryGroupByOutputType>[];
          };
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>;
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number;
          };
        };
      };
      Trade: {
        payload: Prisma.$TradePayload<ExtArgs>;
        fields: Prisma.TradeFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.TradeFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TradePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.TradeFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TradePayload>;
          };
          findFirst: {
            args: Prisma.TradeFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TradePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.TradeFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TradePayload>;
          };
          findMany: {
            args: Prisma.TradeFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TradePayload>[];
          };
          create: {
            args: Prisma.TradeCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TradePayload>;
          };
          createMany: {
            args: Prisma.TradeCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.TradeCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TradePayload>[];
          };
          delete: {
            args: Prisma.TradeDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TradePayload>;
          };
          update: {
            args: Prisma.TradeUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TradePayload>;
          };
          deleteMany: {
            args: Prisma.TradeDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.TradeUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.TradeUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TradePayload>[];
          };
          upsert: {
            args: Prisma.TradeUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TradePayload>;
          };
          aggregate: {
            args: Prisma.TradeAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateTrade>;
          };
          groupBy: {
            args: Prisma.TradeGroupByArgs<ExtArgs>;
            result: $Utils.Optional<TradeGroupByOutputType>[];
          };
          count: {
            args: Prisma.TradeCountArgs<ExtArgs>;
            result: $Utils.Optional<TradeCountAggregateOutputType> | number;
          };
        };
      };
      Screenshot: {
        payload: Prisma.$ScreenshotPayload<ExtArgs>;
        fields: Prisma.ScreenshotFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ScreenshotFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ScreenshotFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>;
          };
          findFirst: {
            args: Prisma.ScreenshotFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ScreenshotFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>;
          };
          findMany: {
            args: Prisma.ScreenshotFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>[];
          };
          create: {
            args: Prisma.ScreenshotCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>;
          };
          createMany: {
            args: Prisma.ScreenshotCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ScreenshotCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>[];
          };
          delete: {
            args: Prisma.ScreenshotDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>;
          };
          update: {
            args: Prisma.ScreenshotUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>;
          };
          deleteMany: {
            args: Prisma.ScreenshotDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ScreenshotUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.ScreenshotUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>[];
          };
          upsert: {
            args: Prisma.ScreenshotUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>;
          };
          aggregate: {
            args: Prisma.ScreenshotAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateScreenshot>;
          };
          groupBy: {
            args: Prisma.ScreenshotGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ScreenshotGroupByOutputType>[];
          };
          count: {
            args: Prisma.ScreenshotCountArgs<ExtArgs>;
            result: $Utils.Optional<ScreenshotCountAggregateOutputType> | number;
          };
        };
      };
      FinanceAccount: {
        payload: Prisma.$FinanceAccountPayload<ExtArgs>;
        fields: Prisma.FinanceAccountFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.FinanceAccountFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinanceAccountPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.FinanceAccountFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinanceAccountPayload>;
          };
          findFirst: {
            args: Prisma.FinanceAccountFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinanceAccountPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.FinanceAccountFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinanceAccountPayload>;
          };
          findMany: {
            args: Prisma.FinanceAccountFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinanceAccountPayload>[];
          };
          create: {
            args: Prisma.FinanceAccountCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinanceAccountPayload>;
          };
          createMany: {
            args: Prisma.FinanceAccountCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.FinanceAccountCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinanceAccountPayload>[];
          };
          delete: {
            args: Prisma.FinanceAccountDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinanceAccountPayload>;
          };
          update: {
            args: Prisma.FinanceAccountUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinanceAccountPayload>;
          };
          deleteMany: {
            args: Prisma.FinanceAccountDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.FinanceAccountUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.FinanceAccountUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinanceAccountPayload>[];
          };
          upsert: {
            args: Prisma.FinanceAccountUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinanceAccountPayload>;
          };
          aggregate: {
            args: Prisma.FinanceAccountAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateFinanceAccount>;
          };
          groupBy: {
            args: Prisma.FinanceAccountGroupByArgs<ExtArgs>;
            result: $Utils.Optional<FinanceAccountGroupByOutputType>[];
          };
          count: {
            args: Prisma.FinanceAccountCountArgs<ExtArgs>;
            result: $Utils.Optional<FinanceAccountCountAggregateOutputType> | number;
          };
        };
      };
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>;
        fields: Prisma.TransactionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
          };
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
          };
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[];
          };
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
          };
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[];
          };
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
          };
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
          };
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[];
          };
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
          };
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateTransaction>;
          };
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<TransactionGroupByOutputType>[];
          };
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>;
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number;
          };
        };
      };
      TransactionCategory: {
        payload: Prisma.$TransactionCategoryPayload<ExtArgs>;
        fields: Prisma.TransactionCategoryFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.TransactionCategoryFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionCategoryPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.TransactionCategoryFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionCategoryPayload>;
          };
          findFirst: {
            args: Prisma.TransactionCategoryFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionCategoryPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.TransactionCategoryFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionCategoryPayload>;
          };
          findMany: {
            args: Prisma.TransactionCategoryFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionCategoryPayload>[];
          };
          create: {
            args: Prisma.TransactionCategoryCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionCategoryPayload>;
          };
          createMany: {
            args: Prisma.TransactionCategoryCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.TransactionCategoryCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionCategoryPayload>[];
          };
          delete: {
            args: Prisma.TransactionCategoryDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionCategoryPayload>;
          };
          update: {
            args: Prisma.TransactionCategoryUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionCategoryPayload>;
          };
          deleteMany: {
            args: Prisma.TransactionCategoryDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.TransactionCategoryUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.TransactionCategoryUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionCategoryPayload>[];
          };
          upsert: {
            args: Prisma.TransactionCategoryUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionCategoryPayload>;
          };
          aggregate: {
            args: Prisma.TransactionCategoryAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateTransactionCategory>;
          };
          groupBy: {
            args: Prisma.TransactionCategoryGroupByArgs<ExtArgs>;
            result: $Utils.Optional<TransactionCategoryGroupByOutputType>[];
          };
          count: {
            args: Prisma.TransactionCategoryCountArgs<ExtArgs>;
            result: $Utils.Optional<TransactionCategoryCountAggregateOutputType> | number;
          };
        };
      };
      Budget: {
        payload: Prisma.$BudgetPayload<ExtArgs>;
        fields: Prisma.BudgetFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.BudgetFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.BudgetFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>;
          };
          findFirst: {
            args: Prisma.BudgetFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.BudgetFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>;
          };
          findMany: {
            args: Prisma.BudgetFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>[];
          };
          create: {
            args: Prisma.BudgetCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>;
          };
          createMany: {
            args: Prisma.BudgetCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.BudgetCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>[];
          };
          delete: {
            args: Prisma.BudgetDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>;
          };
          update: {
            args: Prisma.BudgetUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>;
          };
          deleteMany: {
            args: Prisma.BudgetDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.BudgetUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.BudgetUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>[];
          };
          upsert: {
            args: Prisma.BudgetUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>;
          };
          aggregate: {
            args: Prisma.BudgetAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateBudget>;
          };
          groupBy: {
            args: Prisma.BudgetGroupByArgs<ExtArgs>;
            result: $Utils.Optional<BudgetGroupByOutputType>[];
          };
          count: {
            args: Prisma.BudgetCountArgs<ExtArgs>;
            result: $Utils.Optional<BudgetCountAggregateOutputType> | number;
          };
        };
      };
      BudgetCategory: {
        payload: Prisma.$BudgetCategoryPayload<ExtArgs>;
        fields: Prisma.BudgetCategoryFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.BudgetCategoryFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetCategoryPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.BudgetCategoryFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetCategoryPayload>;
          };
          findFirst: {
            args: Prisma.BudgetCategoryFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetCategoryPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.BudgetCategoryFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetCategoryPayload>;
          };
          findMany: {
            args: Prisma.BudgetCategoryFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetCategoryPayload>[];
          };
          create: {
            args: Prisma.BudgetCategoryCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetCategoryPayload>;
          };
          createMany: {
            args: Prisma.BudgetCategoryCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.BudgetCategoryCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetCategoryPayload>[];
          };
          delete: {
            args: Prisma.BudgetCategoryDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetCategoryPayload>;
          };
          update: {
            args: Prisma.BudgetCategoryUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetCategoryPayload>;
          };
          deleteMany: {
            args: Prisma.BudgetCategoryDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.BudgetCategoryUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.BudgetCategoryUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetCategoryPayload>[];
          };
          upsert: {
            args: Prisma.BudgetCategoryUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BudgetCategoryPayload>;
          };
          aggregate: {
            args: Prisma.BudgetCategoryAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateBudgetCategory>;
          };
          groupBy: {
            args: Prisma.BudgetCategoryGroupByArgs<ExtArgs>;
            result: $Utils.Optional<BudgetCategoryGroupByOutputType>[];
          };
          count: {
            args: Prisma.BudgetCategoryCountArgs<ExtArgs>;
            result: $Utils.Optional<BudgetCategoryCountAggregateOutputType> | number;
          };
        };
      };
      FinancialGoal: {
        payload: Prisma.$FinancialGoalPayload<ExtArgs>;
        fields: Prisma.FinancialGoalFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.FinancialGoalFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinancialGoalPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.FinancialGoalFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinancialGoalPayload>;
          };
          findFirst: {
            args: Prisma.FinancialGoalFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinancialGoalPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.FinancialGoalFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinancialGoalPayload>;
          };
          findMany: {
            args: Prisma.FinancialGoalFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinancialGoalPayload>[];
          };
          create: {
            args: Prisma.FinancialGoalCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinancialGoalPayload>;
          };
          createMany: {
            args: Prisma.FinancialGoalCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.FinancialGoalCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinancialGoalPayload>[];
          };
          delete: {
            args: Prisma.FinancialGoalDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinancialGoalPayload>;
          };
          update: {
            args: Prisma.FinancialGoalUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinancialGoalPayload>;
          };
          deleteMany: {
            args: Prisma.FinancialGoalDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.FinancialGoalUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.FinancialGoalUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinancialGoalPayload>[];
          };
          upsert: {
            args: Prisma.FinancialGoalUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FinancialGoalPayload>;
          };
          aggregate: {
            args: Prisma.FinancialGoalAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateFinancialGoal>;
          };
          groupBy: {
            args: Prisma.FinancialGoalGroupByArgs<ExtArgs>;
            result: $Utils.Optional<FinancialGoalGroupByOutputType>[];
          };
          count: {
            args: Prisma.FinancialGoalCountArgs<ExtArgs>;
            result: $Utils.Optional<FinancialGoalCountAggregateOutputType> | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig;
  }
  export type GlobalOmitConfig = {
    user?: UserOmit;
    category?: CategoryOmit;
    trade?: TradeOmit;
    screenshot?: ScreenshotOmit;
    financeAccount?: FinanceAccountOmit;
    transaction?: TransactionOmit;
    transactionCategory?: TransactionCategoryOmit;
    budget?: BudgetOmit;
    budgetCategory?: BudgetCategoryOmit;
    financialGoal?: FinancialGoalOmit;
  };

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;

  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName;
    action: PrismaAction;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
  };

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>;

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    trades: number;
    categories: number;
    financeAccounts: number;
    transactions: number;
    transactionCategories: number;
    budgets: number;
    financialGoals: number;
  };

  export type UserCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    trades?: boolean | UserCountOutputTypeCountTradesArgs;
    categories?: boolean | UserCountOutputTypeCountCategoriesArgs;
    financeAccounts?: boolean | UserCountOutputTypeCountFinanceAccountsArgs;
    transactions?: boolean | UserCountOutputTypeCountTransactionsArgs;
    transactionCategories?: boolean | UserCountOutputTypeCountTransactionCategoriesArgs;
    budgets?: boolean | UserCountOutputTypeCountBudgetsArgs;
    financialGoals?: boolean | UserCountOutputTypeCountFinancialGoalsArgs;
  };

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTradesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TradeWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCategoriesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CategoryWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFinanceAccountsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: FinanceAccountWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TransactionWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionCategoriesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TransactionCategoryWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBudgetsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BudgetWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFinancialGoalsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: FinancialGoalWhereInput;
  };

  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    trades: number;
  };

  export type CategoryCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    trades?: boolean | CategoryCountOutputTypeCountTradesArgs;
  };

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountTradesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TradeWhereInput;
  };

  /**
   * Count Type TradeCountOutputType
   */

  export type TradeCountOutputType = {
    screenshots: number;
  };

  export type TradeCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    screenshots?: boolean | TradeCountOutputTypeCountScreenshotsArgs;
  };

  // Custom InputTypes
  /**
   * TradeCountOutputType without action
   */
  export type TradeCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TradeCountOutputType
     */
    select?: TradeCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * TradeCountOutputType without action
   */
  export type TradeCountOutputTypeCountScreenshotsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ScreenshotWhereInput;
  };

  /**
   * Count Type FinanceAccountCountOutputType
   */

  export type FinanceAccountCountOutputType = {
    transactions: number;
    transfersTo: number;
  };

  export type FinanceAccountCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    transactions?: boolean | FinanceAccountCountOutputTypeCountTransactionsArgs;
    transfersTo?: boolean | FinanceAccountCountOutputTypeCountTransfersToArgs;
  };

  // Custom InputTypes
  /**
   * FinanceAccountCountOutputType without action
   */
  export type FinanceAccountCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccountCountOutputType
     */
    select?: FinanceAccountCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * FinanceAccountCountOutputType without action
   */
  export type FinanceAccountCountOutputTypeCountTransactionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TransactionWhereInput;
  };

  /**
   * FinanceAccountCountOutputType without action
   */
  export type FinanceAccountCountOutputTypeCountTransfersToArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TransactionWhereInput;
  };

  /**
   * Count Type TransactionCategoryCountOutputType
   */

  export type TransactionCategoryCountOutputType = {
    children: number;
    transactions: number;
    budgetCategories: number;
  };

  export type TransactionCategoryCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    children?: boolean | TransactionCategoryCountOutputTypeCountChildrenArgs;
    transactions?: boolean | TransactionCategoryCountOutputTypeCountTransactionsArgs;
    budgetCategories?: boolean | TransactionCategoryCountOutputTypeCountBudgetCategoriesArgs;
  };

  // Custom InputTypes
  /**
   * TransactionCategoryCountOutputType without action
   */
  export type TransactionCategoryCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategoryCountOutputType
     */
    select?: TransactionCategoryCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * TransactionCategoryCountOutputType without action
   */
  export type TransactionCategoryCountOutputTypeCountChildrenArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TransactionCategoryWhereInput;
  };

  /**
   * TransactionCategoryCountOutputType without action
   */
  export type TransactionCategoryCountOutputTypeCountTransactionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TransactionWhereInput;
  };

  /**
   * TransactionCategoryCountOutputType without action
   */
  export type TransactionCategoryCountOutputTypeCountBudgetCategoriesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BudgetCategoryWhereInput;
  };

  /**
   * Count Type BudgetCountOutputType
   */

  export type BudgetCountOutputType = {
    categories: number;
  };

  export type BudgetCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    categories?: boolean | BudgetCountOutputTypeCountCategoriesArgs;
  };

  // Custom InputTypes
  /**
   * BudgetCountOutputType without action
   */
  export type BudgetCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCountOutputType
     */
    select?: BudgetCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * BudgetCountOutputType without action
   */
  export type BudgetCountOutputTypeCountCategoriesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BudgetCategoryWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    password: string | null;
    createdAt: Date | null;
    defaultCategory: string | null;
  };

  export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    password: string | null;
    createdAt: Date | null;
    defaultCategory: string | null;
  };

  export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    password: number;
    createdAt: number;
    defaultCategory: number;
    _all: number;
  };

  export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    createdAt?: true;
    defaultCategory?: true;
  };

  export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    createdAt?: true;
    defaultCategory?: true;
  };

  export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    createdAt?: true;
    defaultCategory?: true;
    _all?: true;
  };

  export type UserAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
     **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserMaxAggregateInputType;
  };

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>;
  };

  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      where?: UserWhereInput;
      orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[];
      by: UserScalarFieldEnum[] | UserScalarFieldEnum;
      having?: UserScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: UserCountAggregateInputType | true;
      _min?: UserMinAggregateInputType;
      _max?: UserMaxAggregateInputType;
    };

  export type UserGroupByOutputType = {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    defaultCategory: string;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> & {
        [P in keyof T & keyof UserGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserGroupByOutputType[P]>
          : GetScalarType<T[P], UserGroupByOutputType[P]>;
      }
    >
  >;

  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        email?: boolean;
        password?: boolean;
        createdAt?: boolean;
        defaultCategory?: boolean;
        trades?: boolean | User$tradesArgs<ExtArgs>;
        categories?: boolean | User$categoriesArgs<ExtArgs>;
        financeAccounts?: boolean | User$financeAccountsArgs<ExtArgs>;
        transactions?: boolean | User$transactionsArgs<ExtArgs>;
        transactionCategories?: boolean | User$transactionCategoriesArgs<ExtArgs>;
        budgets?: boolean | User$budgetsArgs<ExtArgs>;
        financialGoals?: boolean | User$financialGoalsArgs<ExtArgs>;
        _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['user']
    >;

  export type UserSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      password?: boolean;
      createdAt?: boolean;
      defaultCategory?: boolean;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      password?: boolean;
      createdAt?: boolean;
      defaultCategory?: boolean;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    password?: boolean;
    createdAt?: boolean;
    defaultCategory?: boolean;
  };

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'email' | 'password' | 'createdAt' | 'defaultCategory',
      ExtArgs['result']['user']
    >;
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trades?: boolean | User$tradesArgs<ExtArgs>;
    categories?: boolean | User$categoriesArgs<ExtArgs>;
    financeAccounts?: boolean | User$financeAccountsArgs<ExtArgs>;
    transactions?: boolean | User$transactionsArgs<ExtArgs>;
    transactionCategories?: boolean | User$transactionCategoriesArgs<ExtArgs>;
    budgets?: boolean | User$budgetsArgs<ExtArgs>;
    financialGoals?: boolean | User$financialGoalsArgs<ExtArgs>;
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type UserIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type UserIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'User';
    objects: {
      trades: Prisma.$TradePayload<ExtArgs>[];
      categories: Prisma.$CategoryPayload<ExtArgs>[];
      financeAccounts: Prisma.$FinanceAccountPayload<ExtArgs>[];
      transactions: Prisma.$TransactionPayload<ExtArgs>[];
      transactionCategories: Prisma.$TransactionCategoryPayload<ExtArgs>[];
      budgets: Prisma.$BudgetPayload<ExtArgs>[];
      financialGoals: Prisma.$FinancialGoalPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        email: string;
        password: string;
        createdAt: Date;
        defaultCategory: string;
      },
      ExtArgs['result']['user']
    >;
    composites: {};
  };

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<
    Prisma.$UserPayload,
    S
  >;

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    UserFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: UserCountAggregateInputType | true;
  };

  export interface UserDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User']; meta: { name: 'User' } };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
      args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAggregateArgs>(
      args: Subset<T, UserAggregateArgs>,
    ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    trades<T extends User$tradesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$tradesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    categories<T extends User$categoriesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$categoriesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    financeAccounts<T extends User$financeAccountsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$financeAccountsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$FinanceAccountPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    transactions<T extends User$transactionsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$transactionsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    transactionCategories<T extends User$transactionCategoriesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$transactionCategoriesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$TransactionCategoryPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    budgets<T extends User$budgetsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$budgetsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    financialGoals<T extends User$financialGoalsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$financialGoalsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$FinancialGoalPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<'User', 'String'>;
    readonly email: FieldRef<'User', 'String'>;
    readonly password: FieldRef<'User', 'String'>;
    readonly createdAt: FieldRef<'User', 'DateTime'>;
    readonly defaultCategory: FieldRef<'User', 'String'>;
  }

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which Users to fetch.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Users.
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
    };

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>;
  };

  /**
   * User createMany
   */
  export type UserCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
  };

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
  };

  /**
   * User.trades
   */
  export type User$tradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Trade
       */
      select?: TradeSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Trade
       */
      omit?: TradeOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TradeInclude<ExtArgs> | null;
      where?: TradeWhereInput;
      orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[];
      cursor?: TradeWhereUniqueInput;
      take?: number;
      skip?: number;
      distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[];
    };

  /**
   * User.categories
   */
  export type User$categoriesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    where?: CategoryWhereInput;
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[];
    cursor?: CategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[];
  };

  /**
   * User.financeAccounts
   */
  export type User$financeAccountsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountInclude<ExtArgs> | null;
    where?: FinanceAccountWhereInput;
    orderBy?: FinanceAccountOrderByWithRelationInput | FinanceAccountOrderByWithRelationInput[];
    cursor?: FinanceAccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: FinanceAccountScalarFieldEnum | FinanceAccountScalarFieldEnum[];
  };

  /**
   * User.transactions
   */
  export type User$transactionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    where?: TransactionWhereInput;
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[];
    cursor?: TransactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
  };

  /**
   * User.transactionCategories
   */
  export type User$transactionCategoriesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
    where?: TransactionCategoryWhereInput;
    orderBy?:
      | TransactionCategoryOrderByWithRelationInput
      | TransactionCategoryOrderByWithRelationInput[];
    cursor?: TransactionCategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: TransactionCategoryScalarFieldEnum | TransactionCategoryScalarFieldEnum[];
  };

  /**
   * User.budgets
   */
  export type User$budgetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Budget
       */
      select?: BudgetSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Budget
       */
      omit?: BudgetOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: BudgetInclude<ExtArgs> | null;
      where?: BudgetWhereInput;
      orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[];
      cursor?: BudgetWhereUniqueInput;
      take?: number;
      skip?: number;
      distinct?: BudgetScalarFieldEnum | BudgetScalarFieldEnum[];
    };

  /**
   * User.financialGoals
   */
  export type User$financialGoalsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalInclude<ExtArgs> | null;
    where?: FinancialGoalWhereInput;
    orderBy?: FinancialGoalOrderByWithRelationInput | FinancialGoalOrderByWithRelationInput[];
    cursor?: FinancialGoalWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: FinancialGoalScalarFieldEnum | FinancialGoalScalarFieldEnum[];
  };

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
    };

  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null;
    _min: CategoryMinAggregateOutputType | null;
    _max: CategoryMaxAggregateOutputType | null;
  };

  export type CategoryMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    userId: string | null;
    createdAt: Date | null;
  };

  export type CategoryMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    userId: string | null;
    createdAt: Date | null;
  };

  export type CategoryCountAggregateOutputType = {
    id: number;
    name: number;
    userId: number;
    createdAt: number;
    _all: number;
  };

  export type CategoryMinAggregateInputType = {
    id?: true;
    name?: true;
    userId?: true;
    createdAt?: true;
  };

  export type CategoryMaxAggregateInputType = {
    id?: true;
    name?: true;
    userId?: true;
    createdAt?: true;
  };

  export type CategoryCountAggregateInputType = {
    id?: true;
    name?: true;
    userId?: true;
    createdAt?: true;
    _all?: true;
  };

  export type CategoryAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Categories
     **/
    _count?: true | CategoryCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CategoryMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CategoryMaxAggregateInputType;
  };

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
    [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>;
  };

  export type CategoryGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CategoryWhereInput;
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[];
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum;
    having?: CategoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CategoryCountAggregateInputType | true;
    _min?: CategoryMinAggregateInputType;
    _max?: CategoryMaxAggregateInputType;
  };

  export type CategoryGroupByOutputType = {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    _count: CategoryCountAggregateOutputType | null;
    _min: CategoryMinAggregateOutputType | null;
    _max: CategoryMaxAggregateOutputType | null;
  };

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> & {
        [P in keyof T & keyof CategoryGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
          : GetScalarType<T[P], CategoryGroupByOutputType[P]>;
      }
    >
  >;

  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        name?: boolean;
        userId?: boolean;
        createdAt?: boolean;
        user?: boolean | UserDefaultArgs<ExtArgs>;
        trades?: boolean | Category$tradesArgs<ExtArgs>;
        _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['category']
    >;

  export type CategorySelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      userId?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['category']
  >;

  export type CategorySelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      userId?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['category']
  >;

  export type CategorySelectScalar = {
    id?: boolean;
    name?: boolean;
    userId?: boolean;
    createdAt?: boolean;
  };

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<'id' | 'name' | 'userId' | 'createdAt', ExtArgs['result']['category']>;
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      user?: boolean | UserDefaultArgs<ExtArgs>;
      trades?: boolean | Category$tradesArgs<ExtArgs>;
      _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>;
    };
  export type CategoryIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type CategoryIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'Category';
      objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        trades: Prisma.$TradePayload<ExtArgs>[];
      };
      scalars: $Extensions.GetPayloadResult<
        {
          id: string;
          name: string;
          userId: string;
          createdAt: Date;
        },
        ExtArgs['result']['category']
      >;
      composites: {};
    };

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> =
    $Result.GetResult<Prisma.$CategoryPayload, S>;

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    CategoryFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: CategoryCountAggregateInputType | true;
  };

  export interface CategoryDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Category'];
      meta: { name: 'Category' };
    };
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(
      args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>,
    ): Prisma__CategoryClient<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(
      args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__CategoryClient<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(
      args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>,
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(
      args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     *
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     *
     */
    findMany<T extends CategoryFindManyArgs>(
      args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     *
     */
    create<T extends CategoryCreateArgs>(
      args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>,
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CategoryCreateManyArgs>(
      args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(
      args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     *
     */
    delete<T extends CategoryDeleteArgs>(
      args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>,
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CategoryUpdateArgs>(
      args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>,
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CategoryDeleteManyArgs>(
      args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CategoryUpdateManyArgs>(
      args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Categories and returns the data updated in the database.
     * @param {CategoryUpdateManyAndReturnArgs} args - Arguments to update many Categories.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends CategoryUpdateManyAndReturnArgs>(
      args: SelectSubset<T, CategoryUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(
      args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>,
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
     **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends CategoryAggregateArgs>(
      args: Subset<T, CategoryAggregateArgs>,
    ): Prisma.PrismaPromise<GetCategoryAggregateType<T>>;

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Category model
     */
    readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    trades<T extends Category$tradesArgs<ExtArgs> = {}>(
      args?: Subset<T, Category$tradesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<'Category', 'String'>;
    readonly name: FieldRef<'Category', 'String'>;
    readonly userId: FieldRef<'Category', 'String'>;
    readonly createdAt: FieldRef<'Category', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput;
  };

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput;
  };

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[];
  };

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[];
  };

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categories.
     */
    skip?: number;
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[];
  };

  /**
   * Category create
   */
  export type CategoryCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>;
  };

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Category update
   */
  export type CategoryUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>;
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput;
  };

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>;
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput;
    /**
     * Limit how many Categories to update.
     */
    limit?: number;
  };

  /**
   * Category updateManyAndReturn
   */
  export type CategoryUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>;
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput;
    /**
     * Limit how many Categories to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput;
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>;
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>;
  };

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput;
  };

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput;
    /**
     * Limit how many Categories to delete.
     */
    limit?: number;
  };

  /**
   * Category.trades
   */
  export type Category$tradesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null;
    where?: TradeWhereInput;
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[];
    cursor?: TradeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[];
  };

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
  };

  /**
   * Model Trade
   */

  export type AggregateTrade = {
    _count: TradeCountAggregateOutputType | null;
    _avg: TradeAvgAggregateOutputType | null;
    _sum: TradeSumAggregateOutputType | null;
    _min: TradeMinAggregateOutputType | null;
    _max: TradeMaxAggregateOutputType | null;
  };

  export type TradeAvgAggregateOutputType = {
    entryPrice: number | null;
    positionSize: number | null;
    stopLoss: number | null;
    exitPrice: number | null;
    commission: number | null;
    riskPercent: number | null;
    pnl: number | null;
    leverage: number | null;
    investment: number | null;
    deposit: number | null;
  };

  export type TradeSumAggregateOutputType = {
    entryPrice: number | null;
    positionSize: number | null;
    stopLoss: number | null;
    exitPrice: number | null;
    commission: number | null;
    riskPercent: number | null;
    pnl: number | null;
    leverage: number | null;
    investment: number | null;
    deposit: number | null;
  };

  export type TradeMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    categoryId: string | null;
    date: Date | null;
    symbol: string | null;
    side: $Enums.TradeSide | null;
    entryPrice: number | null;
    positionSize: number | null;
    stopLoss: number | null;
    exitPrice: number | null;
    commission: number | null;
    riskPercent: number | null;
    pnl: number | null;
    result: $Enums.TradeResult | null;
    leverage: number | null;
    investment: number | null;
    createdAt: Date | null;
    deposit: number | null;
    isDemo: boolean | null;
    comment: string | null;
  };

  export type TradeMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    categoryId: string | null;
    date: Date | null;
    symbol: string | null;
    side: $Enums.TradeSide | null;
    entryPrice: number | null;
    positionSize: number | null;
    stopLoss: number | null;
    exitPrice: number | null;
    commission: number | null;
    riskPercent: number | null;
    pnl: number | null;
    result: $Enums.TradeResult | null;
    leverage: number | null;
    investment: number | null;
    createdAt: Date | null;
    deposit: number | null;
    isDemo: boolean | null;
    comment: string | null;
  };

  export type TradeCountAggregateOutputType = {
    id: number;
    userId: number;
    categoryId: number;
    date: number;
    symbol: number;
    side: number;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: number;
    leverage: number;
    investment: number;
    createdAt: number;
    deposit: number;
    isDemo: number;
    comment: number;
    _all: number;
  };

  export type TradeAvgAggregateInputType = {
    entryPrice?: true;
    positionSize?: true;
    stopLoss?: true;
    exitPrice?: true;
    commission?: true;
    riskPercent?: true;
    pnl?: true;
    leverage?: true;
    investment?: true;
    deposit?: true;
  };

  export type TradeSumAggregateInputType = {
    entryPrice?: true;
    positionSize?: true;
    stopLoss?: true;
    exitPrice?: true;
    commission?: true;
    riskPercent?: true;
    pnl?: true;
    leverage?: true;
    investment?: true;
    deposit?: true;
  };

  export type TradeMinAggregateInputType = {
    id?: true;
    userId?: true;
    categoryId?: true;
    date?: true;
    symbol?: true;
    side?: true;
    entryPrice?: true;
    positionSize?: true;
    stopLoss?: true;
    exitPrice?: true;
    commission?: true;
    riskPercent?: true;
    pnl?: true;
    result?: true;
    leverage?: true;
    investment?: true;
    createdAt?: true;
    deposit?: true;
    isDemo?: true;
    comment?: true;
  };

  export type TradeMaxAggregateInputType = {
    id?: true;
    userId?: true;
    categoryId?: true;
    date?: true;
    symbol?: true;
    side?: true;
    entryPrice?: true;
    positionSize?: true;
    stopLoss?: true;
    exitPrice?: true;
    commission?: true;
    riskPercent?: true;
    pnl?: true;
    result?: true;
    leverage?: true;
    investment?: true;
    createdAt?: true;
    deposit?: true;
    isDemo?: true;
    comment?: true;
  };

  export type TradeCountAggregateInputType = {
    id?: true;
    userId?: true;
    categoryId?: true;
    date?: true;
    symbol?: true;
    side?: true;
    entryPrice?: true;
    positionSize?: true;
    stopLoss?: true;
    exitPrice?: true;
    commission?: true;
    riskPercent?: true;
    pnl?: true;
    result?: true;
    leverage?: true;
    investment?: true;
    createdAt?: true;
    deposit?: true;
    isDemo?: true;
    comment?: true;
    _all?: true;
  };

  export type TradeAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Trade to aggregate.
     */
    where?: TradeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: TradeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Trades.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Trades
     **/
    _count?: true | TradeCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: TradeAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: TradeSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TradeMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TradeMaxAggregateInputType;
  };

  export type GetTradeAggregateType<T extends TradeAggregateArgs> = {
    [P in keyof T & keyof AggregateTrade]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrade[P]>
      : GetScalarType<T[P], AggregateTrade[P]>;
  };

  export type TradeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      where?: TradeWhereInput;
      orderBy?: TradeOrderByWithAggregationInput | TradeOrderByWithAggregationInput[];
      by: TradeScalarFieldEnum[] | TradeScalarFieldEnum;
      having?: TradeScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: TradeCountAggregateInputType | true;
      _avg?: TradeAvgAggregateInputType;
      _sum?: TradeSumAggregateInputType;
      _min?: TradeMinAggregateInputType;
      _max?: TradeMaxAggregateInputType;
    };

  export type TradeGroupByOutputType = {
    id: string;
    userId: string;
    categoryId: string;
    date: Date;
    symbol: string;
    side: $Enums.TradeSide;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: $Enums.TradeResult;
    leverage: number | null;
    investment: number | null;
    createdAt: Date;
    deposit: number;
    isDemo: boolean;
    comment: string | null;
    _count: TradeCountAggregateOutputType | null;
    _avg: TradeAvgAggregateOutputType | null;
    _sum: TradeSumAggregateOutputType | null;
    _min: TradeMinAggregateOutputType | null;
    _max: TradeMaxAggregateOutputType | null;
  };

  type GetTradeGroupByPayload<T extends TradeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradeGroupByOutputType, T['by']> & {
        [P in keyof T & keyof TradeGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], TradeGroupByOutputType[P]>
          : GetScalarType<T[P], TradeGroupByOutputType[P]>;
      }
    >
  >;

  export type TradeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        userId?: boolean;
        categoryId?: boolean;
        date?: boolean;
        symbol?: boolean;
        side?: boolean;
        entryPrice?: boolean;
        positionSize?: boolean;
        stopLoss?: boolean;
        exitPrice?: boolean;
        commission?: boolean;
        riskPercent?: boolean;
        pnl?: boolean;
        result?: boolean;
        leverage?: boolean;
        investment?: boolean;
        createdAt?: boolean;
        deposit?: boolean;
        isDemo?: boolean;
        comment?: boolean;
        user?: boolean | UserDefaultArgs<ExtArgs>;
        category?: boolean | CategoryDefaultArgs<ExtArgs>;
        screenshots?: boolean | Trade$screenshotsArgs<ExtArgs>;
        _count?: boolean | TradeCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['trade']
    >;

  export type TradeSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      categoryId?: boolean;
      date?: boolean;
      symbol?: boolean;
      side?: boolean;
      entryPrice?: boolean;
      positionSize?: boolean;
      stopLoss?: boolean;
      exitPrice?: boolean;
      commission?: boolean;
      riskPercent?: boolean;
      pnl?: boolean;
      result?: boolean;
      leverage?: boolean;
      investment?: boolean;
      createdAt?: boolean;
      deposit?: boolean;
      isDemo?: boolean;
      comment?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      category?: boolean | CategoryDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['trade']
  >;

  export type TradeSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      categoryId?: boolean;
      date?: boolean;
      symbol?: boolean;
      side?: boolean;
      entryPrice?: boolean;
      positionSize?: boolean;
      stopLoss?: boolean;
      exitPrice?: boolean;
      commission?: boolean;
      riskPercent?: boolean;
      pnl?: boolean;
      result?: boolean;
      leverage?: boolean;
      investment?: boolean;
      createdAt?: boolean;
      deposit?: boolean;
      isDemo?: boolean;
      comment?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      category?: boolean | CategoryDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['trade']
  >;

  export type TradeSelectScalar = {
    id?: boolean;
    userId?: boolean;
    categoryId?: boolean;
    date?: boolean;
    symbol?: boolean;
    side?: boolean;
    entryPrice?: boolean;
    positionSize?: boolean;
    stopLoss?: boolean;
    exitPrice?: boolean;
    commission?: boolean;
    riskPercent?: boolean;
    pnl?: boolean;
    result?: boolean;
    leverage?: boolean;
    investment?: boolean;
    createdAt?: boolean;
    deposit?: boolean;
    isDemo?: boolean;
    comment?: boolean;
  };

  export type TradeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'userId'
      | 'categoryId'
      | 'date'
      | 'symbol'
      | 'side'
      | 'entryPrice'
      | 'positionSize'
      | 'stopLoss'
      | 'exitPrice'
      | 'commission'
      | 'riskPercent'
      | 'pnl'
      | 'result'
      | 'leverage'
      | 'investment'
      | 'createdAt'
      | 'deposit'
      | 'isDemo'
      | 'comment',
      ExtArgs['result']['trade']
    >;
  export type TradeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    category?: boolean | CategoryDefaultArgs<ExtArgs>;
    screenshots?: boolean | Trade$screenshotsArgs<ExtArgs>;
    _count?: boolean | TradeCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type TradeIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    category?: boolean | CategoryDefaultArgs<ExtArgs>;
  };
  export type TradeIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    category?: boolean | CategoryDefaultArgs<ExtArgs>;
  };

  export type $TradePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'Trade';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      category: Prisma.$CategoryPayload<ExtArgs>;
      screenshots: Prisma.$ScreenshotPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        categoryId: string;
        date: Date;
        symbol: string;
        side: $Enums.TradeSide;
        entryPrice: number;
        positionSize: number;
        stopLoss: number;
        exitPrice: number;
        commission: number;
        riskPercent: number;
        pnl: number;
        result: $Enums.TradeResult;
        leverage: number | null;
        investment: number | null;
        createdAt: Date;
        deposit: number;
        isDemo: boolean;
        comment: string | null;
      },
      ExtArgs['result']['trade']
    >;
    composites: {};
  };

  type TradeGetPayload<S extends boolean | null | undefined | TradeDefaultArgs> = $Result.GetResult<
    Prisma.$TradePayload,
    S
  >;

  type TradeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    TradeFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: TradeCountAggregateInputType | true;
  };

  export interface TradeDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Trade']; meta: { name: 'Trade' } };
    /**
     * Find zero or one Trade that matches the filter.
     * @param {TradeFindUniqueArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradeFindUniqueArgs>(
      args: SelectSubset<T, TradeFindUniqueArgs<ExtArgs>>,
    ): Prisma__TradeClient<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Trade that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradeFindUniqueOrThrowArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradeFindUniqueOrThrowArgs>(
      args: SelectSubset<T, TradeFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__TradeClient<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Trade that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeFindFirstArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradeFindFirstArgs>(
      args?: SelectSubset<T, TradeFindFirstArgs<ExtArgs>>,
    ): Prisma__TradeClient<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Trade that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeFindFirstOrThrowArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradeFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TradeFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__TradeClient<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Trades that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Trades
     * const trades = await prisma.trade.findMany()
     *
     * // Get first 10 Trades
     * const trades = await prisma.trade.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const tradeWithIdOnly = await prisma.trade.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TradeFindManyArgs>(
      args?: SelectSubset<T, TradeFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a Trade.
     * @param {TradeCreateArgs} args - Arguments to create a Trade.
     * @example
     * // Create one Trade
     * const Trade = await prisma.trade.create({
     *   data: {
     *     // ... data to create a Trade
     *   }
     * })
     *
     */
    create<T extends TradeCreateArgs>(
      args: SelectSubset<T, TradeCreateArgs<ExtArgs>>,
    ): Prisma__TradeClient<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Trades.
     * @param {TradeCreateManyArgs} args - Arguments to create many Trades.
     * @example
     * // Create many Trades
     * const trade = await prisma.trade.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TradeCreateManyArgs>(
      args?: SelectSubset<T, TradeCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Trades and returns the data saved in the database.
     * @param {TradeCreateManyAndReturnArgs} args - Arguments to create many Trades.
     * @example
     * // Create many Trades
     * const trade = await prisma.trade.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Trades and only return the `id`
     * const tradeWithIdOnly = await prisma.trade.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends TradeCreateManyAndReturnArgs>(
      args?: SelectSubset<T, TradeCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Delete a Trade.
     * @param {TradeDeleteArgs} args - Arguments to delete one Trade.
     * @example
     * // Delete one Trade
     * const Trade = await prisma.trade.delete({
     *   where: {
     *     // ... filter to delete one Trade
     *   }
     * })
     *
     */
    delete<T extends TradeDeleteArgs>(
      args: SelectSubset<T, TradeDeleteArgs<ExtArgs>>,
    ): Prisma__TradeClient<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Trade.
     * @param {TradeUpdateArgs} args - Arguments to update one Trade.
     * @example
     * // Update one Trade
     * const trade = await prisma.trade.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TradeUpdateArgs>(
      args: SelectSubset<T, TradeUpdateArgs<ExtArgs>>,
    ): Prisma__TradeClient<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Trades.
     * @param {TradeDeleteManyArgs} args - Arguments to filter Trades to delete.
     * @example
     * // Delete a few Trades
     * const { count } = await prisma.trade.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TradeDeleteManyArgs>(
      args?: SelectSubset<T, TradeDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Trades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Trades
     * const trade = await prisma.trade.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TradeUpdateManyArgs>(
      args: SelectSubset<T, TradeUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Trades and returns the data updated in the database.
     * @param {TradeUpdateManyAndReturnArgs} args - Arguments to update many Trades.
     * @example
     * // Update many Trades
     * const trade = await prisma.trade.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Trades and only return the `id`
     * const tradeWithIdOnly = await prisma.trade.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends TradeUpdateManyAndReturnArgs>(
      args: SelectSubset<T, TradeUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Create or update one Trade.
     * @param {TradeUpsertArgs} args - Arguments to update or create a Trade.
     * @example
     * // Update or create a Trade
     * const trade = await prisma.trade.upsert({
     *   create: {
     *     // ... data to create a Trade
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Trade we want to update
     *   }
     * })
     */
    upsert<T extends TradeUpsertArgs>(
      args: SelectSubset<T, TradeUpsertArgs<ExtArgs>>,
    ): Prisma__TradeClient<
      $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Trades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeCountArgs} args - Arguments to filter Trades to count.
     * @example
     * // Count the number of Trades
     * const count = await prisma.trade.count({
     *   where: {
     *     // ... the filter for the Trades we want to count
     *   }
     * })
     **/
    count<T extends TradeCountArgs>(
      args?: Subset<T, TradeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradeCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Trade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TradeAggregateArgs>(
      args: Subset<T, TradeAggregateArgs>,
    ): Prisma.PrismaPromise<GetTradeAggregateType<T>>;

    /**
     * Group by Trade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TradeGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradeGroupByArgs['orderBy'] }
        : { orderBy?: TradeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, TradeGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetTradeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Trade model
     */
    readonly fields: TradeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Trade.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradeClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    category<T extends CategoryDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, CategoryDefaultArgs<ExtArgs>>,
    ): Prisma__CategoryClient<
      | $Result.GetResult<
          Prisma.$CategoryPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    screenshots<T extends Trade$screenshotsArgs<ExtArgs> = {}>(
      args?: Subset<T, Trade$screenshotsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Trade model
   */
  interface TradeFieldRefs {
    readonly id: FieldRef<'Trade', 'String'>;
    readonly userId: FieldRef<'Trade', 'String'>;
    readonly categoryId: FieldRef<'Trade', 'String'>;
    readonly date: FieldRef<'Trade', 'DateTime'>;
    readonly symbol: FieldRef<'Trade', 'String'>;
    readonly side: FieldRef<'Trade', 'TradeSide'>;
    readonly entryPrice: FieldRef<'Trade', 'Float'>;
    readonly positionSize: FieldRef<'Trade', 'Float'>;
    readonly stopLoss: FieldRef<'Trade', 'Float'>;
    readonly exitPrice: FieldRef<'Trade', 'Float'>;
    readonly commission: FieldRef<'Trade', 'Float'>;
    readonly riskPercent: FieldRef<'Trade', 'Float'>;
    readonly pnl: FieldRef<'Trade', 'Float'>;
    readonly result: FieldRef<'Trade', 'TradeResult'>;
    readonly leverage: FieldRef<'Trade', 'Float'>;
    readonly investment: FieldRef<'Trade', 'Float'>;
    readonly createdAt: FieldRef<'Trade', 'DateTime'>;
    readonly deposit: FieldRef<'Trade', 'Float'>;
    readonly isDemo: FieldRef<'Trade', 'Boolean'>;
    readonly comment: FieldRef<'Trade', 'String'>;
  }

  // Custom InputTypes
  /**
   * Trade findUnique
   */
  export type TradeFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null;
    /**
     * Filter, which Trade to fetch.
     */
    where: TradeWhereUniqueInput;
  };

  /**
   * Trade findUniqueOrThrow
   */
  export type TradeFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null;
    /**
     * Filter, which Trade to fetch.
     */
    where: TradeWhereUniqueInput;
  };

  /**
   * Trade findFirst
   */
  export type TradeFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null;
    /**
     * Filter, which Trade to fetch.
     */
    where?: TradeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Trades.
     */
    cursor?: TradeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Trades.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Trades.
     */
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[];
  };

  /**
   * Trade findFirstOrThrow
   */
  export type TradeFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null;
    /**
     * Filter, which Trade to fetch.
     */
    where?: TradeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Trades.
     */
    cursor?: TradeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Trades.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Trades.
     */
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[];
  };

  /**
   * Trade findMany
   */
  export type TradeFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null;
    /**
     * Filter, which Trades to fetch.
     */
    where?: TradeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Trades.
     */
    cursor?: TradeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Trades.
     */
    skip?: number;
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[];
  };

  /**
   * Trade create
   */
  export type TradeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Trade
       */
      select?: TradeSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Trade
       */
      omit?: TradeOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TradeInclude<ExtArgs> | null;
      /**
       * The data needed to create a Trade.
       */
      data: XOR<TradeCreateInput, TradeUncheckedCreateInput>;
    };

  /**
   * Trade createMany
   */
  export type TradeCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Trades.
     */
    data: TradeCreateManyInput | TradeCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Trade createManyAndReturn
   */
  export type TradeCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null;
    /**
     * The data used to create many Trades.
     */
    data: TradeCreateManyInput | TradeCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Trade update
   */
  export type TradeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Trade
       */
      select?: TradeSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Trade
       */
      omit?: TradeOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TradeInclude<ExtArgs> | null;
      /**
       * The data needed to update a Trade.
       */
      data: XOR<TradeUpdateInput, TradeUncheckedUpdateInput>;
      /**
       * Choose, which Trade to update.
       */
      where: TradeWhereUniqueInput;
    };

  /**
   * Trade updateMany
   */
  export type TradeUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Trades.
     */
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyInput>;
    /**
     * Filter which Trades to update
     */
    where?: TradeWhereInput;
    /**
     * Limit how many Trades to update.
     */
    limit?: number;
  };

  /**
   * Trade updateManyAndReturn
   */
  export type TradeUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null;
    /**
     * The data used to update Trades.
     */
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyInput>;
    /**
     * Filter which Trades to update
     */
    where?: TradeWhereInput;
    /**
     * Limit how many Trades to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Trade upsert
   */
  export type TradeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Trade
       */
      select?: TradeSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Trade
       */
      omit?: TradeOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TradeInclude<ExtArgs> | null;
      /**
       * The filter to search for the Trade to update in case it exists.
       */
      where: TradeWhereUniqueInput;
      /**
       * In case the Trade found by the `where` argument doesn't exist, create a new Trade with this data.
       */
      create: XOR<TradeCreateInput, TradeUncheckedCreateInput>;
      /**
       * In case the Trade was found with the provided `where` argument, update it with this data.
       */
      update: XOR<TradeUpdateInput, TradeUncheckedUpdateInput>;
    };

  /**
   * Trade delete
   */
  export type TradeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Trade
       */
      select?: TradeSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Trade
       */
      omit?: TradeOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TradeInclude<ExtArgs> | null;
      /**
       * Filter which Trade to delete.
       */
      where: TradeWhereUniqueInput;
    };

  /**
   * Trade deleteMany
   */
  export type TradeDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Trades to delete
     */
    where?: TradeWhereInput;
    /**
     * Limit how many Trades to delete.
     */
    limit?: number;
  };

  /**
   * Trade.screenshots
   */
  export type Trade$screenshotsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null;
    where?: ScreenshotWhereInput;
    orderBy?: ScreenshotOrderByWithRelationInput | ScreenshotOrderByWithRelationInput[];
    cursor?: ScreenshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ScreenshotScalarFieldEnum | ScreenshotScalarFieldEnum[];
  };

  /**
   * Trade without action
   */
  export type TradeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Trade
       */
      select?: TradeSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Trade
       */
      omit?: TradeOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TradeInclude<ExtArgs> | null;
    };

  /**
   * Model Screenshot
   */

  export type AggregateScreenshot = {
    _count: ScreenshotCountAggregateOutputType | null;
    _avg: ScreenshotAvgAggregateOutputType | null;
    _sum: ScreenshotSumAggregateOutputType | null;
    _min: ScreenshotMinAggregateOutputType | null;
    _max: ScreenshotMaxAggregateOutputType | null;
  };

  export type ScreenshotAvgAggregateOutputType = {
    order: number | null;
  };

  export type ScreenshotSumAggregateOutputType = {
    order: number | null;
  };

  export type ScreenshotMinAggregateOutputType = {
    id: string | null;
    tradeId: string | null;
    imageData: string | null;
    createdAt: Date | null;
    order: number | null;
  };

  export type ScreenshotMaxAggregateOutputType = {
    id: string | null;
    tradeId: string | null;
    imageData: string | null;
    createdAt: Date | null;
    order: number | null;
  };

  export type ScreenshotCountAggregateOutputType = {
    id: number;
    tradeId: number;
    imageData: number;
    createdAt: number;
    order: number;
    _all: number;
  };

  export type ScreenshotAvgAggregateInputType = {
    order?: true;
  };

  export type ScreenshotSumAggregateInputType = {
    order?: true;
  };

  export type ScreenshotMinAggregateInputType = {
    id?: true;
    tradeId?: true;
    imageData?: true;
    createdAt?: true;
    order?: true;
  };

  export type ScreenshotMaxAggregateInputType = {
    id?: true;
    tradeId?: true;
    imageData?: true;
    createdAt?: true;
    order?: true;
  };

  export type ScreenshotCountAggregateInputType = {
    id?: true;
    tradeId?: true;
    imageData?: true;
    createdAt?: true;
    order?: true;
    _all?: true;
  };

  export type ScreenshotAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Screenshot to aggregate.
     */
    where?: ScreenshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Screenshots to fetch.
     */
    orderBy?: ScreenshotOrderByWithRelationInput | ScreenshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ScreenshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Screenshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Screenshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Screenshots
     **/
    _count?: true | ScreenshotCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ScreenshotAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ScreenshotSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ScreenshotMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ScreenshotMaxAggregateInputType;
  };

  export type GetScreenshotAggregateType<T extends ScreenshotAggregateArgs> = {
    [P in keyof T & keyof AggregateScreenshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScreenshot[P]>
      : GetScalarType<T[P], AggregateScreenshot[P]>;
  };

  export type ScreenshotGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ScreenshotWhereInput;
    orderBy?: ScreenshotOrderByWithAggregationInput | ScreenshotOrderByWithAggregationInput[];
    by: ScreenshotScalarFieldEnum[] | ScreenshotScalarFieldEnum;
    having?: ScreenshotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ScreenshotCountAggregateInputType | true;
    _avg?: ScreenshotAvgAggregateInputType;
    _sum?: ScreenshotSumAggregateInputType;
    _min?: ScreenshotMinAggregateInputType;
    _max?: ScreenshotMaxAggregateInputType;
  };

  export type ScreenshotGroupByOutputType = {
    id: string;
    tradeId: string;
    imageData: string;
    createdAt: Date;
    order: number;
    _count: ScreenshotCountAggregateOutputType | null;
    _avg: ScreenshotAvgAggregateOutputType | null;
    _sum: ScreenshotSumAggregateOutputType | null;
    _min: ScreenshotMinAggregateOutputType | null;
    _max: ScreenshotMaxAggregateOutputType | null;
  };

  type GetScreenshotGroupByPayload<T extends ScreenshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScreenshotGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ScreenshotGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ScreenshotGroupByOutputType[P]>
          : GetScalarType<T[P], ScreenshotGroupByOutputType[P]>;
      }
    >
  >;

  export type ScreenshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        tradeId?: boolean;
        imageData?: boolean;
        createdAt?: boolean;
        order?: boolean;
        trade?: boolean | TradeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['screenshot']
    >;

  export type ScreenshotSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      tradeId?: boolean;
      imageData?: boolean;
      createdAt?: boolean;
      order?: boolean;
      trade?: boolean | TradeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['screenshot']
  >;

  export type ScreenshotSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      tradeId?: boolean;
      imageData?: boolean;
      createdAt?: boolean;
      order?: boolean;
      trade?: boolean | TradeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['screenshot']
  >;

  export type ScreenshotSelectScalar = {
    id?: boolean;
    tradeId?: boolean;
    imageData?: boolean;
    createdAt?: boolean;
    order?: boolean;
  };

  export type ScreenshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'tradeId' | 'imageData' | 'createdAt' | 'order',
      ExtArgs['result']['screenshot']
    >;
  export type ScreenshotInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    trade?: boolean | TradeDefaultArgs<ExtArgs>;
  };
  export type ScreenshotIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    trade?: boolean | TradeDefaultArgs<ExtArgs>;
  };
  export type ScreenshotIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    trade?: boolean | TradeDefaultArgs<ExtArgs>;
  };

  export type $ScreenshotPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Screenshot';
    objects: {
      trade: Prisma.$TradePayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        tradeId: string;
        imageData: string;
        createdAt: Date;
        order: number;
      },
      ExtArgs['result']['screenshot']
    >;
    composites: {};
  };

  type ScreenshotGetPayload<S extends boolean | null | undefined | ScreenshotDefaultArgs> =
    $Result.GetResult<Prisma.$ScreenshotPayload, S>;

  type ScreenshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScreenshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScreenshotCountAggregateInputType | true;
    };

  export interface ScreenshotDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Screenshot'];
      meta: { name: 'Screenshot' };
    };
    /**
     * Find zero or one Screenshot that matches the filter.
     * @param {ScreenshotFindUniqueArgs} args - Arguments to find a Screenshot
     * @example
     * // Get one Screenshot
     * const screenshot = await prisma.screenshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScreenshotFindUniqueArgs>(
      args: SelectSubset<T, ScreenshotFindUniqueArgs<ExtArgs>>,
    ): Prisma__ScreenshotClient<
      $Result.GetResult<
        Prisma.$ScreenshotPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Screenshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScreenshotFindUniqueOrThrowArgs} args - Arguments to find a Screenshot
     * @example
     * // Get one Screenshot
     * const screenshot = await prisma.screenshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScreenshotFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ScreenshotFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__ScreenshotClient<
      $Result.GetResult<
        Prisma.$ScreenshotPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Screenshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotFindFirstArgs} args - Arguments to find a Screenshot
     * @example
     * // Get one Screenshot
     * const screenshot = await prisma.screenshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScreenshotFindFirstArgs>(
      args?: SelectSubset<T, ScreenshotFindFirstArgs<ExtArgs>>,
    ): Prisma__ScreenshotClient<
      $Result.GetResult<
        Prisma.$ScreenshotPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Screenshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotFindFirstOrThrowArgs} args - Arguments to find a Screenshot
     * @example
     * // Get one Screenshot
     * const screenshot = await prisma.screenshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScreenshotFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ScreenshotFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__ScreenshotClient<
      $Result.GetResult<
        Prisma.$ScreenshotPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Screenshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Screenshots
     * const screenshots = await prisma.screenshot.findMany()
     *
     * // Get first 10 Screenshots
     * const screenshots = await prisma.screenshot.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const screenshotWithIdOnly = await prisma.screenshot.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ScreenshotFindManyArgs>(
      args?: SelectSubset<T, ScreenshotFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a Screenshot.
     * @param {ScreenshotCreateArgs} args - Arguments to create a Screenshot.
     * @example
     * // Create one Screenshot
     * const Screenshot = await prisma.screenshot.create({
     *   data: {
     *     // ... data to create a Screenshot
     *   }
     * })
     *
     */
    create<T extends ScreenshotCreateArgs>(
      args: SelectSubset<T, ScreenshotCreateArgs<ExtArgs>>,
    ): Prisma__ScreenshotClient<
      $Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Screenshots.
     * @param {ScreenshotCreateManyArgs} args - Arguments to create many Screenshots.
     * @example
     * // Create many Screenshots
     * const screenshot = await prisma.screenshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ScreenshotCreateManyArgs>(
      args?: SelectSubset<T, ScreenshotCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Screenshots and returns the data saved in the database.
     * @param {ScreenshotCreateManyAndReturnArgs} args - Arguments to create many Screenshots.
     * @example
     * // Create many Screenshots
     * const screenshot = await prisma.screenshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Screenshots and only return the `id`
     * const screenshotWithIdOnly = await prisma.screenshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ScreenshotCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ScreenshotCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ScreenshotPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Screenshot.
     * @param {ScreenshotDeleteArgs} args - Arguments to delete one Screenshot.
     * @example
     * // Delete one Screenshot
     * const Screenshot = await prisma.screenshot.delete({
     *   where: {
     *     // ... filter to delete one Screenshot
     *   }
     * })
     *
     */
    delete<T extends ScreenshotDeleteArgs>(
      args: SelectSubset<T, ScreenshotDeleteArgs<ExtArgs>>,
    ): Prisma__ScreenshotClient<
      $Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Screenshot.
     * @param {ScreenshotUpdateArgs} args - Arguments to update one Screenshot.
     * @example
     * // Update one Screenshot
     * const screenshot = await prisma.screenshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ScreenshotUpdateArgs>(
      args: SelectSubset<T, ScreenshotUpdateArgs<ExtArgs>>,
    ): Prisma__ScreenshotClient<
      $Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Screenshots.
     * @param {ScreenshotDeleteManyArgs} args - Arguments to filter Screenshots to delete.
     * @example
     * // Delete a few Screenshots
     * const { count } = await prisma.screenshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ScreenshotDeleteManyArgs>(
      args?: SelectSubset<T, ScreenshotDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Screenshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Screenshots
     * const screenshot = await prisma.screenshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ScreenshotUpdateManyArgs>(
      args: SelectSubset<T, ScreenshotUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Screenshots and returns the data updated in the database.
     * @param {ScreenshotUpdateManyAndReturnArgs} args - Arguments to update many Screenshots.
     * @example
     * // Update many Screenshots
     * const screenshot = await prisma.screenshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Screenshots and only return the `id`
     * const screenshotWithIdOnly = await prisma.screenshot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ScreenshotUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ScreenshotUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ScreenshotPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Screenshot.
     * @param {ScreenshotUpsertArgs} args - Arguments to update or create a Screenshot.
     * @example
     * // Update or create a Screenshot
     * const screenshot = await prisma.screenshot.upsert({
     *   create: {
     *     // ... data to create a Screenshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Screenshot we want to update
     *   }
     * })
     */
    upsert<T extends ScreenshotUpsertArgs>(
      args: SelectSubset<T, ScreenshotUpsertArgs<ExtArgs>>,
    ): Prisma__ScreenshotClient<
      $Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Screenshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotCountArgs} args - Arguments to filter Screenshots to count.
     * @example
     * // Count the number of Screenshots
     * const count = await prisma.screenshot.count({
     *   where: {
     *     // ... the filter for the Screenshots we want to count
     *   }
     * })
     **/
    count<T extends ScreenshotCountArgs>(
      args?: Subset<T, ScreenshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScreenshotCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Screenshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ScreenshotAggregateArgs>(
      args: Subset<T, ScreenshotAggregateArgs>,
    ): Prisma.PrismaPromise<GetScreenshotAggregateType<T>>;

    /**
     * Group by Screenshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ScreenshotGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScreenshotGroupByArgs['orderBy'] }
        : { orderBy?: ScreenshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ScreenshotGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetScreenshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Screenshot model
     */
    readonly fields: ScreenshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Screenshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScreenshotClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    trade<T extends TradeDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, TradeDefaultArgs<ExtArgs>>,
    ): Prisma__TradeClient<
      | $Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Screenshot model
   */
  interface ScreenshotFieldRefs {
    readonly id: FieldRef<'Screenshot', 'String'>;
    readonly tradeId: FieldRef<'Screenshot', 'String'>;
    readonly imageData: FieldRef<'Screenshot', 'String'>;
    readonly createdAt: FieldRef<'Screenshot', 'DateTime'>;
    readonly order: FieldRef<'Screenshot', 'Int'>;
  }

  // Custom InputTypes
  /**
   * Screenshot findUnique
   */
  export type ScreenshotFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null;
    /**
     * Filter, which Screenshot to fetch.
     */
    where: ScreenshotWhereUniqueInput;
  };

  /**
   * Screenshot findUniqueOrThrow
   */
  export type ScreenshotFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null;
    /**
     * Filter, which Screenshot to fetch.
     */
    where: ScreenshotWhereUniqueInput;
  };

  /**
   * Screenshot findFirst
   */
  export type ScreenshotFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null;
    /**
     * Filter, which Screenshot to fetch.
     */
    where?: ScreenshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Screenshots to fetch.
     */
    orderBy?: ScreenshotOrderByWithRelationInput | ScreenshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Screenshots.
     */
    cursor?: ScreenshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Screenshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Screenshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Screenshots.
     */
    distinct?: ScreenshotScalarFieldEnum | ScreenshotScalarFieldEnum[];
  };

  /**
   * Screenshot findFirstOrThrow
   */
  export type ScreenshotFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null;
    /**
     * Filter, which Screenshot to fetch.
     */
    where?: ScreenshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Screenshots to fetch.
     */
    orderBy?: ScreenshotOrderByWithRelationInput | ScreenshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Screenshots.
     */
    cursor?: ScreenshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Screenshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Screenshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Screenshots.
     */
    distinct?: ScreenshotScalarFieldEnum | ScreenshotScalarFieldEnum[];
  };

  /**
   * Screenshot findMany
   */
  export type ScreenshotFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null;
    /**
     * Filter, which Screenshots to fetch.
     */
    where?: ScreenshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Screenshots to fetch.
     */
    orderBy?: ScreenshotOrderByWithRelationInput | ScreenshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Screenshots.
     */
    cursor?: ScreenshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Screenshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Screenshots.
     */
    skip?: number;
    distinct?: ScreenshotScalarFieldEnum | ScreenshotScalarFieldEnum[];
  };

  /**
   * Screenshot create
   */
  export type ScreenshotCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null;
    /**
     * The data needed to create a Screenshot.
     */
    data: XOR<ScreenshotCreateInput, ScreenshotUncheckedCreateInput>;
  };

  /**
   * Screenshot createMany
   */
  export type ScreenshotCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Screenshots.
     */
    data: ScreenshotCreateManyInput | ScreenshotCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Screenshot createManyAndReturn
   */
  export type ScreenshotCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * The data used to create many Screenshots.
     */
    data: ScreenshotCreateManyInput | ScreenshotCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Screenshot update
   */
  export type ScreenshotUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null;
    /**
     * The data needed to update a Screenshot.
     */
    data: XOR<ScreenshotUpdateInput, ScreenshotUncheckedUpdateInput>;
    /**
     * Choose, which Screenshot to update.
     */
    where: ScreenshotWhereUniqueInput;
  };

  /**
   * Screenshot updateMany
   */
  export type ScreenshotUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Screenshots.
     */
    data: XOR<ScreenshotUpdateManyMutationInput, ScreenshotUncheckedUpdateManyInput>;
    /**
     * Filter which Screenshots to update
     */
    where?: ScreenshotWhereInput;
    /**
     * Limit how many Screenshots to update.
     */
    limit?: number;
  };

  /**
   * Screenshot updateManyAndReturn
   */
  export type ScreenshotUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * The data used to update Screenshots.
     */
    data: XOR<ScreenshotUpdateManyMutationInput, ScreenshotUncheckedUpdateManyInput>;
    /**
     * Filter which Screenshots to update
     */
    where?: ScreenshotWhereInput;
    /**
     * Limit how many Screenshots to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Screenshot upsert
   */
  export type ScreenshotUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null;
    /**
     * The filter to search for the Screenshot to update in case it exists.
     */
    where: ScreenshotWhereUniqueInput;
    /**
     * In case the Screenshot found by the `where` argument doesn't exist, create a new Screenshot with this data.
     */
    create: XOR<ScreenshotCreateInput, ScreenshotUncheckedCreateInput>;
    /**
     * In case the Screenshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScreenshotUpdateInput, ScreenshotUncheckedUpdateInput>;
  };

  /**
   * Screenshot delete
   */
  export type ScreenshotDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null;
    /**
     * Filter which Screenshot to delete.
     */
    where: ScreenshotWhereUniqueInput;
  };

  /**
   * Screenshot deleteMany
   */
  export type ScreenshotDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Screenshots to delete
     */
    where?: ScreenshotWhereInput;
    /**
     * Limit how many Screenshots to delete.
     */
    limit?: number;
  };

  /**
   * Screenshot without action
   */
  export type ScreenshotDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null;
  };

  /**
   * Model FinanceAccount
   */

  export type AggregateFinanceAccount = {
    _count: FinanceAccountCountAggregateOutputType | null;
    _avg: FinanceAccountAvgAggregateOutputType | null;
    _sum: FinanceAccountSumAggregateOutputType | null;
    _min: FinanceAccountMinAggregateOutputType | null;
    _max: FinanceAccountMaxAggregateOutputType | null;
  };

  export type FinanceAccountAvgAggregateOutputType = {
    balance: number | null;
  };

  export type FinanceAccountSumAggregateOutputType = {
    balance: number | null;
  };

  export type FinanceAccountMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    name: string | null;
    type: $Enums.AccountType | null;
    currency: string | null;
    balance: number | null;
    isActive: boolean | null;
    isDemo: boolean | null;
    color: string | null;
    icon: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type FinanceAccountMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    name: string | null;
    type: $Enums.AccountType | null;
    currency: string | null;
    balance: number | null;
    isActive: boolean | null;
    isDemo: boolean | null;
    color: string | null;
    icon: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type FinanceAccountCountAggregateOutputType = {
    id: number;
    userId: number;
    name: number;
    type: number;
    currency: number;
    balance: number;
    isActive: number;
    isDemo: number;
    color: number;
    icon: number;
    description: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type FinanceAccountAvgAggregateInputType = {
    balance?: true;
  };

  export type FinanceAccountSumAggregateInputType = {
    balance?: true;
  };

  export type FinanceAccountMinAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    type?: true;
    currency?: true;
    balance?: true;
    isActive?: true;
    isDemo?: true;
    color?: true;
    icon?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type FinanceAccountMaxAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    type?: true;
    currency?: true;
    balance?: true;
    isActive?: true;
    isDemo?: true;
    color?: true;
    icon?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type FinanceAccountCountAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    type?: true;
    currency?: true;
    balance?: true;
    isActive?: true;
    isDemo?: true;
    color?: true;
    icon?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type FinanceAccountAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which FinanceAccount to aggregate.
     */
    where?: FinanceAccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FinanceAccounts to fetch.
     */
    orderBy?: FinanceAccountOrderByWithRelationInput | FinanceAccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: FinanceAccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FinanceAccounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FinanceAccounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned FinanceAccounts
     **/
    _count?: true | FinanceAccountCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: FinanceAccountAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: FinanceAccountSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: FinanceAccountMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: FinanceAccountMaxAggregateInputType;
  };

  export type GetFinanceAccountAggregateType<T extends FinanceAccountAggregateArgs> = {
    [P in keyof T & keyof AggregateFinanceAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFinanceAccount[P]>
      : GetScalarType<T[P], AggregateFinanceAccount[P]>;
  };

  export type FinanceAccountGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: FinanceAccountWhereInput;
    orderBy?:
      | FinanceAccountOrderByWithAggregationInput
      | FinanceAccountOrderByWithAggregationInput[];
    by: FinanceAccountScalarFieldEnum[] | FinanceAccountScalarFieldEnum;
    having?: FinanceAccountScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FinanceAccountCountAggregateInputType | true;
    _avg?: FinanceAccountAvgAggregateInputType;
    _sum?: FinanceAccountSumAggregateInputType;
    _min?: FinanceAccountMinAggregateInputType;
    _max?: FinanceAccountMaxAggregateInputType;
  };

  export type FinanceAccountGroupByOutputType = {
    id: string;
    userId: string;
    name: string;
    type: $Enums.AccountType;
    currency: string;
    balance: number;
    isActive: boolean;
    isDemo: boolean;
    color: string | null;
    icon: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: FinanceAccountCountAggregateOutputType | null;
    _avg: FinanceAccountAvgAggregateOutputType | null;
    _sum: FinanceAccountSumAggregateOutputType | null;
    _min: FinanceAccountMinAggregateOutputType | null;
    _max: FinanceAccountMaxAggregateOutputType | null;
  };

  type GetFinanceAccountGroupByPayload<T extends FinanceAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FinanceAccountGroupByOutputType, T['by']> & {
        [P in keyof T & keyof FinanceAccountGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], FinanceAccountGroupByOutputType[P]>
          : GetScalarType<T[P], FinanceAccountGroupByOutputType[P]>;
      }
    >
  >;

  export type FinanceAccountSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      name?: boolean;
      type?: boolean;
      currency?: boolean;
      balance?: boolean;
      isActive?: boolean;
      isDemo?: boolean;
      color?: boolean;
      icon?: boolean;
      description?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      transactions?: boolean | FinanceAccount$transactionsArgs<ExtArgs>;
      transfersTo?: boolean | FinanceAccount$transfersToArgs<ExtArgs>;
      _count?: boolean | FinanceAccountCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['financeAccount']
  >;

  export type FinanceAccountSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      name?: boolean;
      type?: boolean;
      currency?: boolean;
      balance?: boolean;
      isActive?: boolean;
      isDemo?: boolean;
      color?: boolean;
      icon?: boolean;
      description?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['financeAccount']
  >;

  export type FinanceAccountSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      name?: boolean;
      type?: boolean;
      currency?: boolean;
      balance?: boolean;
      isActive?: boolean;
      isDemo?: boolean;
      color?: boolean;
      icon?: boolean;
      description?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['financeAccount']
  >;

  export type FinanceAccountSelectScalar = {
    id?: boolean;
    userId?: boolean;
    name?: boolean;
    type?: boolean;
    currency?: boolean;
    balance?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    color?: boolean;
    icon?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type FinanceAccountOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'name'
    | 'type'
    | 'currency'
    | 'balance'
    | 'isActive'
    | 'isDemo'
    | 'color'
    | 'icon'
    | 'description'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['financeAccount']
  >;
  export type FinanceAccountInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    transactions?: boolean | FinanceAccount$transactionsArgs<ExtArgs>;
    transfersTo?: boolean | FinanceAccount$transfersToArgs<ExtArgs>;
    _count?: boolean | FinanceAccountCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type FinanceAccountIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type FinanceAccountIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $FinanceAccountPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'FinanceAccount';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      transactions: Prisma.$TransactionPayload<ExtArgs>[];
      transfersTo: Prisma.$TransactionPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        name: string;
        type: $Enums.AccountType;
        currency: string;
        balance: number;
        isActive: boolean;
        isDemo: boolean;
        color: string | null;
        icon: string | null;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['financeAccount']
    >;
    composites: {};
  };

  type FinanceAccountGetPayload<S extends boolean | null | undefined | FinanceAccountDefaultArgs> =
    $Result.GetResult<Prisma.$FinanceAccountPayload, S>;

  type FinanceAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FinanceAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FinanceAccountCountAggregateInputType | true;
    };

  export interface FinanceAccountDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['FinanceAccount'];
      meta: { name: 'FinanceAccount' };
    };
    /**
     * Find zero or one FinanceAccount that matches the filter.
     * @param {FinanceAccountFindUniqueArgs} args - Arguments to find a FinanceAccount
     * @example
     * // Get one FinanceAccount
     * const financeAccount = await prisma.financeAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FinanceAccountFindUniqueArgs>(
      args: SelectSubset<T, FinanceAccountFindUniqueArgs<ExtArgs>>,
    ): Prisma__FinanceAccountClient<
      $Result.GetResult<
        Prisma.$FinanceAccountPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one FinanceAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FinanceAccountFindUniqueOrThrowArgs} args - Arguments to find a FinanceAccount
     * @example
     * // Get one FinanceAccount
     * const financeAccount = await prisma.financeAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FinanceAccountFindUniqueOrThrowArgs>(
      args: SelectSubset<T, FinanceAccountFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__FinanceAccountClient<
      $Result.GetResult<
        Prisma.$FinanceAccountPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first FinanceAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceAccountFindFirstArgs} args - Arguments to find a FinanceAccount
     * @example
     * // Get one FinanceAccount
     * const financeAccount = await prisma.financeAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FinanceAccountFindFirstArgs>(
      args?: SelectSubset<T, FinanceAccountFindFirstArgs<ExtArgs>>,
    ): Prisma__FinanceAccountClient<
      $Result.GetResult<
        Prisma.$FinanceAccountPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first FinanceAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceAccountFindFirstOrThrowArgs} args - Arguments to find a FinanceAccount
     * @example
     * // Get one FinanceAccount
     * const financeAccount = await prisma.financeAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FinanceAccountFindFirstOrThrowArgs>(
      args?: SelectSubset<T, FinanceAccountFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__FinanceAccountClient<
      $Result.GetResult<
        Prisma.$FinanceAccountPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more FinanceAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FinanceAccounts
     * const financeAccounts = await prisma.financeAccount.findMany()
     *
     * // Get first 10 FinanceAccounts
     * const financeAccounts = await prisma.financeAccount.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const financeAccountWithIdOnly = await prisma.financeAccount.findMany({ select: { id: true } })
     *
     */
    findMany<T extends FinanceAccountFindManyArgs>(
      args?: SelectSubset<T, FinanceAccountFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$FinanceAccountPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a FinanceAccount.
     * @param {FinanceAccountCreateArgs} args - Arguments to create a FinanceAccount.
     * @example
     * // Create one FinanceAccount
     * const FinanceAccount = await prisma.financeAccount.create({
     *   data: {
     *     // ... data to create a FinanceAccount
     *   }
     * })
     *
     */
    create<T extends FinanceAccountCreateArgs>(
      args: SelectSubset<T, FinanceAccountCreateArgs<ExtArgs>>,
    ): Prisma__FinanceAccountClient<
      $Result.GetResult<Prisma.$FinanceAccountPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many FinanceAccounts.
     * @param {FinanceAccountCreateManyArgs} args - Arguments to create many FinanceAccounts.
     * @example
     * // Create many FinanceAccounts
     * const financeAccount = await prisma.financeAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends FinanceAccountCreateManyArgs>(
      args?: SelectSubset<T, FinanceAccountCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many FinanceAccounts and returns the data saved in the database.
     * @param {FinanceAccountCreateManyAndReturnArgs} args - Arguments to create many FinanceAccounts.
     * @example
     * // Create many FinanceAccounts
     * const financeAccount = await prisma.financeAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many FinanceAccounts and only return the `id`
     * const financeAccountWithIdOnly = await prisma.financeAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends FinanceAccountCreateManyAndReturnArgs>(
      args?: SelectSubset<T, FinanceAccountCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$FinanceAccountPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a FinanceAccount.
     * @param {FinanceAccountDeleteArgs} args - Arguments to delete one FinanceAccount.
     * @example
     * // Delete one FinanceAccount
     * const FinanceAccount = await prisma.financeAccount.delete({
     *   where: {
     *     // ... filter to delete one FinanceAccount
     *   }
     * })
     *
     */
    delete<T extends FinanceAccountDeleteArgs>(
      args: SelectSubset<T, FinanceAccountDeleteArgs<ExtArgs>>,
    ): Prisma__FinanceAccountClient<
      $Result.GetResult<Prisma.$FinanceAccountPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one FinanceAccount.
     * @param {FinanceAccountUpdateArgs} args - Arguments to update one FinanceAccount.
     * @example
     * // Update one FinanceAccount
     * const financeAccount = await prisma.financeAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends FinanceAccountUpdateArgs>(
      args: SelectSubset<T, FinanceAccountUpdateArgs<ExtArgs>>,
    ): Prisma__FinanceAccountClient<
      $Result.GetResult<Prisma.$FinanceAccountPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more FinanceAccounts.
     * @param {FinanceAccountDeleteManyArgs} args - Arguments to filter FinanceAccounts to delete.
     * @example
     * // Delete a few FinanceAccounts
     * const { count } = await prisma.financeAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends FinanceAccountDeleteManyArgs>(
      args?: SelectSubset<T, FinanceAccountDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more FinanceAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FinanceAccounts
     * const financeAccount = await prisma.financeAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends FinanceAccountUpdateManyArgs>(
      args: SelectSubset<T, FinanceAccountUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more FinanceAccounts and returns the data updated in the database.
     * @param {FinanceAccountUpdateManyAndReturnArgs} args - Arguments to update many FinanceAccounts.
     * @example
     * // Update many FinanceAccounts
     * const financeAccount = await prisma.financeAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more FinanceAccounts and only return the `id`
     * const financeAccountWithIdOnly = await prisma.financeAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends FinanceAccountUpdateManyAndReturnArgs>(
      args: SelectSubset<T, FinanceAccountUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$FinanceAccountPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one FinanceAccount.
     * @param {FinanceAccountUpsertArgs} args - Arguments to update or create a FinanceAccount.
     * @example
     * // Update or create a FinanceAccount
     * const financeAccount = await prisma.financeAccount.upsert({
     *   create: {
     *     // ... data to create a FinanceAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FinanceAccount we want to update
     *   }
     * })
     */
    upsert<T extends FinanceAccountUpsertArgs>(
      args: SelectSubset<T, FinanceAccountUpsertArgs<ExtArgs>>,
    ): Prisma__FinanceAccountClient<
      $Result.GetResult<Prisma.$FinanceAccountPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of FinanceAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceAccountCountArgs} args - Arguments to filter FinanceAccounts to count.
     * @example
     * // Count the number of FinanceAccounts
     * const count = await prisma.financeAccount.count({
     *   where: {
     *     // ... the filter for the FinanceAccounts we want to count
     *   }
     * })
     **/
    count<T extends FinanceAccountCountArgs>(
      args?: Subset<T, FinanceAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FinanceAccountCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a FinanceAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends FinanceAccountAggregateArgs>(
      args: Subset<T, FinanceAccountAggregateArgs>,
    ): Prisma.PrismaPromise<GetFinanceAccountAggregateType<T>>;

    /**
     * Group by FinanceAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends FinanceAccountGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FinanceAccountGroupByArgs['orderBy'] }
        : { orderBy?: FinanceAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, FinanceAccountGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetFinanceAccountGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the FinanceAccount model
     */
    readonly fields: FinanceAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FinanceAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FinanceAccountClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    transactions<T extends FinanceAccount$transactionsArgs<ExtArgs> = {}>(
      args?: Subset<T, FinanceAccount$transactionsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    transfersTo<T extends FinanceAccount$transfersToArgs<ExtArgs> = {}>(
      args?: Subset<T, FinanceAccount$transfersToArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the FinanceAccount model
   */
  interface FinanceAccountFieldRefs {
    readonly id: FieldRef<'FinanceAccount', 'String'>;
    readonly userId: FieldRef<'FinanceAccount', 'String'>;
    readonly name: FieldRef<'FinanceAccount', 'String'>;
    readonly type: FieldRef<'FinanceAccount', 'AccountType'>;
    readonly currency: FieldRef<'FinanceAccount', 'String'>;
    readonly balance: FieldRef<'FinanceAccount', 'Float'>;
    readonly isActive: FieldRef<'FinanceAccount', 'Boolean'>;
    readonly isDemo: FieldRef<'FinanceAccount', 'Boolean'>;
    readonly color: FieldRef<'FinanceAccount', 'String'>;
    readonly icon: FieldRef<'FinanceAccount', 'String'>;
    readonly description: FieldRef<'FinanceAccount', 'String'>;
    readonly createdAt: FieldRef<'FinanceAccount', 'DateTime'>;
    readonly updatedAt: FieldRef<'FinanceAccount', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * FinanceAccount findUnique
   */
  export type FinanceAccountFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountInclude<ExtArgs> | null;
    /**
     * Filter, which FinanceAccount to fetch.
     */
    where: FinanceAccountWhereUniqueInput;
  };

  /**
   * FinanceAccount findUniqueOrThrow
   */
  export type FinanceAccountFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountInclude<ExtArgs> | null;
    /**
     * Filter, which FinanceAccount to fetch.
     */
    where: FinanceAccountWhereUniqueInput;
  };

  /**
   * FinanceAccount findFirst
   */
  export type FinanceAccountFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountInclude<ExtArgs> | null;
    /**
     * Filter, which FinanceAccount to fetch.
     */
    where?: FinanceAccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FinanceAccounts to fetch.
     */
    orderBy?: FinanceAccountOrderByWithRelationInput | FinanceAccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FinanceAccounts.
     */
    cursor?: FinanceAccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FinanceAccounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FinanceAccounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FinanceAccounts.
     */
    distinct?: FinanceAccountScalarFieldEnum | FinanceAccountScalarFieldEnum[];
  };

  /**
   * FinanceAccount findFirstOrThrow
   */
  export type FinanceAccountFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountInclude<ExtArgs> | null;
    /**
     * Filter, which FinanceAccount to fetch.
     */
    where?: FinanceAccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FinanceAccounts to fetch.
     */
    orderBy?: FinanceAccountOrderByWithRelationInput | FinanceAccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FinanceAccounts.
     */
    cursor?: FinanceAccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FinanceAccounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FinanceAccounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FinanceAccounts.
     */
    distinct?: FinanceAccountScalarFieldEnum | FinanceAccountScalarFieldEnum[];
  };

  /**
   * FinanceAccount findMany
   */
  export type FinanceAccountFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountInclude<ExtArgs> | null;
    /**
     * Filter, which FinanceAccounts to fetch.
     */
    where?: FinanceAccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FinanceAccounts to fetch.
     */
    orderBy?: FinanceAccountOrderByWithRelationInput | FinanceAccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing FinanceAccounts.
     */
    cursor?: FinanceAccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FinanceAccounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FinanceAccounts.
     */
    skip?: number;
    distinct?: FinanceAccountScalarFieldEnum | FinanceAccountScalarFieldEnum[];
  };

  /**
   * FinanceAccount create
   */
  export type FinanceAccountCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountInclude<ExtArgs> | null;
    /**
     * The data needed to create a FinanceAccount.
     */
    data: XOR<FinanceAccountCreateInput, FinanceAccountUncheckedCreateInput>;
  };

  /**
   * FinanceAccount createMany
   */
  export type FinanceAccountCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many FinanceAccounts.
     */
    data: FinanceAccountCreateManyInput | FinanceAccountCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * FinanceAccount createManyAndReturn
   */
  export type FinanceAccountCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * The data used to create many FinanceAccounts.
     */
    data: FinanceAccountCreateManyInput | FinanceAccountCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * FinanceAccount update
   */
  export type FinanceAccountUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountInclude<ExtArgs> | null;
    /**
     * The data needed to update a FinanceAccount.
     */
    data: XOR<FinanceAccountUpdateInput, FinanceAccountUncheckedUpdateInput>;
    /**
     * Choose, which FinanceAccount to update.
     */
    where: FinanceAccountWhereUniqueInput;
  };

  /**
   * FinanceAccount updateMany
   */
  export type FinanceAccountUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update FinanceAccounts.
     */
    data: XOR<FinanceAccountUpdateManyMutationInput, FinanceAccountUncheckedUpdateManyInput>;
    /**
     * Filter which FinanceAccounts to update
     */
    where?: FinanceAccountWhereInput;
    /**
     * Limit how many FinanceAccounts to update.
     */
    limit?: number;
  };

  /**
   * FinanceAccount updateManyAndReturn
   */
  export type FinanceAccountUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * The data used to update FinanceAccounts.
     */
    data: XOR<FinanceAccountUpdateManyMutationInput, FinanceAccountUncheckedUpdateManyInput>;
    /**
     * Filter which FinanceAccounts to update
     */
    where?: FinanceAccountWhereInput;
    /**
     * Limit how many FinanceAccounts to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * FinanceAccount upsert
   */
  export type FinanceAccountUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountInclude<ExtArgs> | null;
    /**
     * The filter to search for the FinanceAccount to update in case it exists.
     */
    where: FinanceAccountWhereUniqueInput;
    /**
     * In case the FinanceAccount found by the `where` argument doesn't exist, create a new FinanceAccount with this data.
     */
    create: XOR<FinanceAccountCreateInput, FinanceAccountUncheckedCreateInput>;
    /**
     * In case the FinanceAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FinanceAccountUpdateInput, FinanceAccountUncheckedUpdateInput>;
  };

  /**
   * FinanceAccount delete
   */
  export type FinanceAccountDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountInclude<ExtArgs> | null;
    /**
     * Filter which FinanceAccount to delete.
     */
    where: FinanceAccountWhereUniqueInput;
  };

  /**
   * FinanceAccount deleteMany
   */
  export type FinanceAccountDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which FinanceAccounts to delete
     */
    where?: FinanceAccountWhereInput;
    /**
     * Limit how many FinanceAccounts to delete.
     */
    limit?: number;
  };

  /**
   * FinanceAccount.transactions
   */
  export type FinanceAccount$transactionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    where?: TransactionWhereInput;
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[];
    cursor?: TransactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
  };

  /**
   * FinanceAccount.transfersTo
   */
  export type FinanceAccount$transfersToArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    where?: TransactionWhereInput;
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[];
    cursor?: TransactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
  };

  /**
   * FinanceAccount without action
   */
  export type FinanceAccountDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountInclude<ExtArgs> | null;
  };

  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null;
    _avg: TransactionAvgAggregateOutputType | null;
    _sum: TransactionSumAggregateOutputType | null;
    _min: TransactionMinAggregateOutputType | null;
    _max: TransactionMaxAggregateOutputType | null;
  };

  export type TransactionAvgAggregateOutputType = {
    amount: number | null;
  };

  export type TransactionSumAggregateOutputType = {
    amount: number | null;
  };

  export type TransactionMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    accountId: string | null;
    categoryId: string | null;
    type: $Enums.TransactionType | null;
    amount: number | null;
    currency: string | null;
    description: string | null;
    date: Date | null;
    isDemo: boolean | null;
    transferToId: string | null;
    isRecurring: boolean | null;
    recurringPattern: $Enums.RecurringPattern | null;
    parentTransactionId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type TransactionMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    accountId: string | null;
    categoryId: string | null;
    type: $Enums.TransactionType | null;
    amount: number | null;
    currency: string | null;
    description: string | null;
    date: Date | null;
    isDemo: boolean | null;
    transferToId: string | null;
    isRecurring: boolean | null;
    recurringPattern: $Enums.RecurringPattern | null;
    parentTransactionId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type TransactionCountAggregateOutputType = {
    id: number;
    userId: number;
    accountId: number;
    categoryId: number;
    type: number;
    amount: number;
    currency: number;
    description: number;
    date: number;
    tags: number;
    isDemo: number;
    transferToId: number;
    isRecurring: number;
    recurringPattern: number;
    parentTransactionId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type TransactionAvgAggregateInputType = {
    amount?: true;
  };

  export type TransactionSumAggregateInputType = {
    amount?: true;
  };

  export type TransactionMinAggregateInputType = {
    id?: true;
    userId?: true;
    accountId?: true;
    categoryId?: true;
    type?: true;
    amount?: true;
    currency?: true;
    description?: true;
    date?: true;
    isDemo?: true;
    transferToId?: true;
    isRecurring?: true;
    recurringPattern?: true;
    parentTransactionId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type TransactionMaxAggregateInputType = {
    id?: true;
    userId?: true;
    accountId?: true;
    categoryId?: true;
    type?: true;
    amount?: true;
    currency?: true;
    description?: true;
    date?: true;
    isDemo?: true;
    transferToId?: true;
    isRecurring?: true;
    recurringPattern?: true;
    parentTransactionId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type TransactionCountAggregateInputType = {
    id?: true;
    userId?: true;
    accountId?: true;
    categoryId?: true;
    type?: true;
    amount?: true;
    currency?: true;
    description?: true;
    date?: true;
    tags?: true;
    isDemo?: true;
    transferToId?: true;
    isRecurring?: true;
    recurringPattern?: true;
    parentTransactionId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type TransactionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Transactions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Transactions
     **/
    _count?: true | TransactionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: TransactionAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: TransactionSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TransactionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TransactionMaxAggregateInputType;
  };

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
    [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>;
  };

  export type TransactionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TransactionWhereInput;
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[];
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum;
    having?: TransactionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TransactionCountAggregateInputType | true;
    _avg?: TransactionAvgAggregateInputType;
    _sum?: TransactionSumAggregateInputType;
    _min?: TransactionMinAggregateInputType;
    _max?: TransactionMaxAggregateInputType;
  };

  export type TransactionGroupByOutputType = {
    id: string;
    userId: string;
    accountId: string;
    categoryId: string;
    type: $Enums.TransactionType;
    amount: number;
    currency: string;
    description: string | null;
    date: Date;
    tags: string[];
    isDemo: boolean;
    transferToId: string | null;
    isRecurring: boolean;
    recurringPattern: $Enums.RecurringPattern | null;
    parentTransactionId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: TransactionCountAggregateOutputType | null;
    _avg: TransactionAvgAggregateOutputType | null;
    _sum: TransactionSumAggregateOutputType | null;
    _min: TransactionMinAggregateOutputType | null;
    _max: TransactionMaxAggregateOutputType | null;
  };

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> & {
        [P in keyof T & keyof TransactionGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
          : GetScalarType<T[P], TransactionGroupByOutputType[P]>;
      }
    >
  >;

  export type TransactionSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      accountId?: boolean;
      categoryId?: boolean;
      type?: boolean;
      amount?: boolean;
      currency?: boolean;
      description?: boolean;
      date?: boolean;
      tags?: boolean;
      isDemo?: boolean;
      transferToId?: boolean;
      isRecurring?: boolean;
      recurringPattern?: boolean;
      parentTransactionId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      account?: boolean | FinanceAccountDefaultArgs<ExtArgs>;
      category?: boolean | TransactionCategoryDefaultArgs<ExtArgs>;
      transferTo?: boolean | Transaction$transferToArgs<ExtArgs>;
    },
    ExtArgs['result']['transaction']
  >;

  export type TransactionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      accountId?: boolean;
      categoryId?: boolean;
      type?: boolean;
      amount?: boolean;
      currency?: boolean;
      description?: boolean;
      date?: boolean;
      tags?: boolean;
      isDemo?: boolean;
      transferToId?: boolean;
      isRecurring?: boolean;
      recurringPattern?: boolean;
      parentTransactionId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      account?: boolean | FinanceAccountDefaultArgs<ExtArgs>;
      category?: boolean | TransactionCategoryDefaultArgs<ExtArgs>;
      transferTo?: boolean | Transaction$transferToArgs<ExtArgs>;
    },
    ExtArgs['result']['transaction']
  >;

  export type TransactionSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      accountId?: boolean;
      categoryId?: boolean;
      type?: boolean;
      amount?: boolean;
      currency?: boolean;
      description?: boolean;
      date?: boolean;
      tags?: boolean;
      isDemo?: boolean;
      transferToId?: boolean;
      isRecurring?: boolean;
      recurringPattern?: boolean;
      parentTransactionId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      account?: boolean | FinanceAccountDefaultArgs<ExtArgs>;
      category?: boolean | TransactionCategoryDefaultArgs<ExtArgs>;
      transferTo?: boolean | Transaction$transferToArgs<ExtArgs>;
    },
    ExtArgs['result']['transaction']
  >;

  export type TransactionSelectScalar = {
    id?: boolean;
    userId?: boolean;
    accountId?: boolean;
    categoryId?: boolean;
    type?: boolean;
    amount?: boolean;
    currency?: boolean;
    description?: boolean;
    date?: boolean;
    tags?: boolean;
    isDemo?: boolean;
    transferToId?: boolean;
    isRecurring?: boolean;
    recurringPattern?: boolean;
    parentTransactionId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'userId'
      | 'accountId'
      | 'categoryId'
      | 'type'
      | 'amount'
      | 'currency'
      | 'description'
      | 'date'
      | 'tags'
      | 'isDemo'
      | 'transferToId'
      | 'isRecurring'
      | 'recurringPattern'
      | 'parentTransactionId'
      | 'createdAt'
      | 'updatedAt',
      ExtArgs['result']['transaction']
    >;
  export type TransactionInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    account?: boolean | FinanceAccountDefaultArgs<ExtArgs>;
    category?: boolean | TransactionCategoryDefaultArgs<ExtArgs>;
    transferTo?: boolean | Transaction$transferToArgs<ExtArgs>;
  };
  export type TransactionIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    account?: boolean | FinanceAccountDefaultArgs<ExtArgs>;
    category?: boolean | TransactionCategoryDefaultArgs<ExtArgs>;
    transferTo?: boolean | Transaction$transferToArgs<ExtArgs>;
  };
  export type TransactionIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    account?: boolean | FinanceAccountDefaultArgs<ExtArgs>;
    category?: boolean | TransactionCategoryDefaultArgs<ExtArgs>;
    transferTo?: boolean | Transaction$transferToArgs<ExtArgs>;
  };

  export type $TransactionPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Transaction';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      account: Prisma.$FinanceAccountPayload<ExtArgs>;
      category: Prisma.$TransactionCategoryPayload<ExtArgs>;
      transferTo: Prisma.$FinanceAccountPayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        accountId: string;
        categoryId: string;
        type: $Enums.TransactionType;
        amount: number;
        currency: string;
        description: string | null;
        date: Date;
        tags: string[];
        isDemo: boolean;
        transferToId: string | null;
        isRecurring: boolean;
        recurringPattern: $Enums.RecurringPattern | null;
        parentTransactionId: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['transaction']
    >;
    composites: {};
  };

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> =
    $Result.GetResult<Prisma.$TransactionPayload, S>;

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true;
    };

  export interface TransactionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Transaction'];
      meta: { name: 'Transaction' };
    };
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(
      args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>,
    ): Prisma__TransactionClient<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__TransactionClient<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(
      args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>,
    ): Prisma__TransactionClient<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__TransactionClient<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     *
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TransactionFindManyArgs>(
      args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     *
     */
    create<T extends TransactionCreateArgs>(
      args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>,
    ): Prisma__TransactionClient<
      $Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TransactionCreateManyArgs>(
      args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     *
     */
    delete<T extends TransactionDeleteArgs>(
      args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>,
    ): Prisma__TransactionClient<
      $Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TransactionUpdateArgs>(
      args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>,
    ): Prisma__TransactionClient<
      $Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TransactionDeleteManyArgs>(
      args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TransactionUpdateManyArgs>(
      args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(
      args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>,
    ): Prisma__TransactionClient<
      $Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
     **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TransactionAggregateArgs>(
      args: Subset<T, TransactionAggregateArgs>,
    ): Prisma.PrismaPromise<GetTransactionAggregateType<T>>;

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Transaction model
     */
    readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    account<T extends FinanceAccountDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, FinanceAccountDefaultArgs<ExtArgs>>,
    ): Prisma__FinanceAccountClient<
      | $Result.GetResult<
          Prisma.$FinanceAccountPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    category<T extends TransactionCategoryDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, TransactionCategoryDefaultArgs<ExtArgs>>,
    ): Prisma__TransactionCategoryClient<
      | $Result.GetResult<
          Prisma.$TransactionCategoryPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    transferTo<T extends Transaction$transferToArgs<ExtArgs> = {}>(
      args?: Subset<T, Transaction$transferToArgs<ExtArgs>>,
    ): Prisma__FinanceAccountClient<
      $Result.GetResult<
        Prisma.$FinanceAccountPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<'Transaction', 'String'>;
    readonly userId: FieldRef<'Transaction', 'String'>;
    readonly accountId: FieldRef<'Transaction', 'String'>;
    readonly categoryId: FieldRef<'Transaction', 'String'>;
    readonly type: FieldRef<'Transaction', 'TransactionType'>;
    readonly amount: FieldRef<'Transaction', 'Float'>;
    readonly currency: FieldRef<'Transaction', 'String'>;
    readonly description: FieldRef<'Transaction', 'String'>;
    readonly date: FieldRef<'Transaction', 'DateTime'>;
    readonly tags: FieldRef<'Transaction', 'String[]'>;
    readonly isDemo: FieldRef<'Transaction', 'Boolean'>;
    readonly transferToId: FieldRef<'Transaction', 'String'>;
    readonly isRecurring: FieldRef<'Transaction', 'Boolean'>;
    readonly recurringPattern: FieldRef<'Transaction', 'RecurringPattern'>;
    readonly parentTransactionId: FieldRef<'Transaction', 'String'>;
    readonly createdAt: FieldRef<'Transaction', 'DateTime'>;
    readonly updatedAt: FieldRef<'Transaction', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput;
  };

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput;
  };

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Transactions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
  };

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Transactions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
  };

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Transactions.
     */
    skip?: number;
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
  };

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>;
  };

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>;
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput;
  };

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>;
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput;
    /**
     * Limit how many Transactions to update.
     */
    limit?: number;
  };

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>;
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput;
    /**
     * Limit how many Transactions to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput;
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>;
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>;
  };

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput;
  };

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput;
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number;
  };

  /**
   * Transaction.transferTo
   */
  export type Transaction$transferToArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinanceAccount
     */
    select?: FinanceAccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinanceAccount
     */
    omit?: FinanceAccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceAccountInclude<ExtArgs> | null;
    where?: FinanceAccountWhereInput;
  };

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
  };

  /**
   * Model TransactionCategory
   */

  export type AggregateTransactionCategory = {
    _count: TransactionCategoryCountAggregateOutputType | null;
    _min: TransactionCategoryMinAggregateOutputType | null;
    _max: TransactionCategoryMaxAggregateOutputType | null;
  };

  export type TransactionCategoryMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    name: string | null;
    type: $Enums.TransactionType | null;
    parentId: string | null;
    color: string | null;
    icon: string | null;
    isDefault: boolean | null;
    isActive: boolean | null;
    isDemo: boolean | null;
    createdAt: Date | null;
  };

  export type TransactionCategoryMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    name: string | null;
    type: $Enums.TransactionType | null;
    parentId: string | null;
    color: string | null;
    icon: string | null;
    isDefault: boolean | null;
    isActive: boolean | null;
    isDemo: boolean | null;
    createdAt: Date | null;
  };

  export type TransactionCategoryCountAggregateOutputType = {
    id: number;
    userId: number;
    name: number;
    type: number;
    parentId: number;
    color: number;
    icon: number;
    isDefault: number;
    isActive: number;
    isDemo: number;
    createdAt: number;
    _all: number;
  };

  export type TransactionCategoryMinAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    type?: true;
    parentId?: true;
    color?: true;
    icon?: true;
    isDefault?: true;
    isActive?: true;
    isDemo?: true;
    createdAt?: true;
  };

  export type TransactionCategoryMaxAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    type?: true;
    parentId?: true;
    color?: true;
    icon?: true;
    isDefault?: true;
    isActive?: true;
    isDemo?: true;
    createdAt?: true;
  };

  export type TransactionCategoryCountAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    type?: true;
    parentId?: true;
    color?: true;
    icon?: true;
    isDefault?: true;
    isActive?: true;
    isDemo?: true;
    createdAt?: true;
    _all?: true;
  };

  export type TransactionCategoryAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which TransactionCategory to aggregate.
     */
    where?: TransactionCategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TransactionCategories to fetch.
     */
    orderBy?:
      | TransactionCategoryOrderByWithRelationInput
      | TransactionCategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: TransactionCategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TransactionCategories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TransactionCategories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned TransactionCategories
     **/
    _count?: true | TransactionCategoryCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TransactionCategoryMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TransactionCategoryMaxAggregateInputType;
  };

  export type GetTransactionCategoryAggregateType<T extends TransactionCategoryAggregateArgs> = {
    [P in keyof T & keyof AggregateTransactionCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransactionCategory[P]>
      : GetScalarType<T[P], AggregateTransactionCategory[P]>;
  };

  export type TransactionCategoryGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TransactionCategoryWhereInput;
    orderBy?:
      | TransactionCategoryOrderByWithAggregationInput
      | TransactionCategoryOrderByWithAggregationInput[];
    by: TransactionCategoryScalarFieldEnum[] | TransactionCategoryScalarFieldEnum;
    having?: TransactionCategoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TransactionCategoryCountAggregateInputType | true;
    _min?: TransactionCategoryMinAggregateInputType;
    _max?: TransactionCategoryMaxAggregateInputType;
  };

  export type TransactionCategoryGroupByOutputType = {
    id: string;
    userId: string;
    name: string;
    type: $Enums.TransactionType;
    parentId: string | null;
    color: string;
    icon: string;
    isDefault: boolean;
    isActive: boolean;
    isDemo: boolean;
    createdAt: Date;
    _count: TransactionCategoryCountAggregateOutputType | null;
    _min: TransactionCategoryMinAggregateOutputType | null;
    _max: TransactionCategoryMaxAggregateOutputType | null;
  };

  type GetTransactionCategoryGroupByPayload<T extends TransactionCategoryGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<TransactionCategoryGroupByOutputType, T['by']> & {
          [P in keyof T & keyof TransactionCategoryGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionCategoryGroupByOutputType[P]>;
        }
      >
    >;

  export type TransactionCategorySelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      name?: boolean;
      type?: boolean;
      parentId?: boolean;
      color?: boolean;
      icon?: boolean;
      isDefault?: boolean;
      isActive?: boolean;
      isDemo?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      parent?: boolean | TransactionCategory$parentArgs<ExtArgs>;
      children?: boolean | TransactionCategory$childrenArgs<ExtArgs>;
      transactions?: boolean | TransactionCategory$transactionsArgs<ExtArgs>;
      budgetCategories?: boolean | TransactionCategory$budgetCategoriesArgs<ExtArgs>;
      _count?: boolean | TransactionCategoryCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['transactionCategory']
  >;

  export type TransactionCategorySelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      name?: boolean;
      type?: boolean;
      parentId?: boolean;
      color?: boolean;
      icon?: boolean;
      isDefault?: boolean;
      isActive?: boolean;
      isDemo?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      parent?: boolean | TransactionCategory$parentArgs<ExtArgs>;
    },
    ExtArgs['result']['transactionCategory']
  >;

  export type TransactionCategorySelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      name?: boolean;
      type?: boolean;
      parentId?: boolean;
      color?: boolean;
      icon?: boolean;
      isDefault?: boolean;
      isActive?: boolean;
      isDemo?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      parent?: boolean | TransactionCategory$parentArgs<ExtArgs>;
    },
    ExtArgs['result']['transactionCategory']
  >;

  export type TransactionCategorySelectScalar = {
    id?: boolean;
    userId?: boolean;
    name?: boolean;
    type?: boolean;
    parentId?: boolean;
    color?: boolean;
    icon?: boolean;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: boolean;
  };

  export type TransactionCategoryOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'name'
    | 'type'
    | 'parentId'
    | 'color'
    | 'icon'
    | 'isDefault'
    | 'isActive'
    | 'isDemo'
    | 'createdAt',
    ExtArgs['result']['transactionCategory']
  >;
  export type TransactionCategoryInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    parent?: boolean | TransactionCategory$parentArgs<ExtArgs>;
    children?: boolean | TransactionCategory$childrenArgs<ExtArgs>;
    transactions?: boolean | TransactionCategory$transactionsArgs<ExtArgs>;
    budgetCategories?: boolean | TransactionCategory$budgetCategoriesArgs<ExtArgs>;
    _count?: boolean | TransactionCategoryCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type TransactionCategoryIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    parent?: boolean | TransactionCategory$parentArgs<ExtArgs>;
  };
  export type TransactionCategoryIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    parent?: boolean | TransactionCategory$parentArgs<ExtArgs>;
  };

  export type $TransactionCategoryPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'TransactionCategory';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      parent: Prisma.$TransactionCategoryPayload<ExtArgs> | null;
      children: Prisma.$TransactionCategoryPayload<ExtArgs>[];
      transactions: Prisma.$TransactionPayload<ExtArgs>[];
      budgetCategories: Prisma.$BudgetCategoryPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        name: string;
        type: $Enums.TransactionType;
        parentId: string | null;
        color: string;
        icon: string;
        isDefault: boolean;
        isActive: boolean;
        isDemo: boolean;
        createdAt: Date;
      },
      ExtArgs['result']['transactionCategory']
    >;
    composites: {};
  };

  type TransactionCategoryGetPayload<
    S extends boolean | null | undefined | TransactionCategoryDefaultArgs,
  > = $Result.GetResult<Prisma.$TransactionCategoryPayload, S>;

  type TransactionCategoryCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<TransactionCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TransactionCategoryCountAggregateInputType | true;
  };

  export interface TransactionCategoryDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['TransactionCategory'];
      meta: { name: 'TransactionCategory' };
    };
    /**
     * Find zero or one TransactionCategory that matches the filter.
     * @param {TransactionCategoryFindUniqueArgs} args - Arguments to find a TransactionCategory
     * @example
     * // Get one TransactionCategory
     * const transactionCategory = await prisma.transactionCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionCategoryFindUniqueArgs>(
      args: SelectSubset<T, TransactionCategoryFindUniqueArgs<ExtArgs>>,
    ): Prisma__TransactionCategoryClient<
      $Result.GetResult<
        Prisma.$TransactionCategoryPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one TransactionCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionCategoryFindUniqueOrThrowArgs} args - Arguments to find a TransactionCategory
     * @example
     * // Get one TransactionCategory
     * const transactionCategory = await prisma.transactionCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionCategoryFindUniqueOrThrowArgs>(
      args: SelectSubset<T, TransactionCategoryFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__TransactionCategoryClient<
      $Result.GetResult<
        Prisma.$TransactionCategoryPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first TransactionCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCategoryFindFirstArgs} args - Arguments to find a TransactionCategory
     * @example
     * // Get one TransactionCategory
     * const transactionCategory = await prisma.transactionCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionCategoryFindFirstArgs>(
      args?: SelectSubset<T, TransactionCategoryFindFirstArgs<ExtArgs>>,
    ): Prisma__TransactionCategoryClient<
      $Result.GetResult<
        Prisma.$TransactionCategoryPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first TransactionCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCategoryFindFirstOrThrowArgs} args - Arguments to find a TransactionCategory
     * @example
     * // Get one TransactionCategory
     * const transactionCategory = await prisma.transactionCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionCategoryFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TransactionCategoryFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__TransactionCategoryClient<
      $Result.GetResult<
        Prisma.$TransactionCategoryPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more TransactionCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TransactionCategories
     * const transactionCategories = await prisma.transactionCategory.findMany()
     *
     * // Get first 10 TransactionCategories
     * const transactionCategories = await prisma.transactionCategory.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const transactionCategoryWithIdOnly = await prisma.transactionCategory.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TransactionCategoryFindManyArgs>(
      args?: SelectSubset<T, TransactionCategoryFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TransactionCategoryPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a TransactionCategory.
     * @param {TransactionCategoryCreateArgs} args - Arguments to create a TransactionCategory.
     * @example
     * // Create one TransactionCategory
     * const TransactionCategory = await prisma.transactionCategory.create({
     *   data: {
     *     // ... data to create a TransactionCategory
     *   }
     * })
     *
     */
    create<T extends TransactionCategoryCreateArgs>(
      args: SelectSubset<T, TransactionCategoryCreateArgs<ExtArgs>>,
    ): Prisma__TransactionCategoryClient<
      $Result.GetResult<
        Prisma.$TransactionCategoryPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many TransactionCategories.
     * @param {TransactionCategoryCreateManyArgs} args - Arguments to create many TransactionCategories.
     * @example
     * // Create many TransactionCategories
     * const transactionCategory = await prisma.transactionCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TransactionCategoryCreateManyArgs>(
      args?: SelectSubset<T, TransactionCategoryCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many TransactionCategories and returns the data saved in the database.
     * @param {TransactionCategoryCreateManyAndReturnArgs} args - Arguments to create many TransactionCategories.
     * @example
     * // Create many TransactionCategories
     * const transactionCategory = await prisma.transactionCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many TransactionCategories and only return the `id`
     * const transactionCategoryWithIdOnly = await prisma.transactionCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends TransactionCategoryCreateManyAndReturnArgs>(
      args?: SelectSubset<T, TransactionCategoryCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TransactionCategoryPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a TransactionCategory.
     * @param {TransactionCategoryDeleteArgs} args - Arguments to delete one TransactionCategory.
     * @example
     * // Delete one TransactionCategory
     * const TransactionCategory = await prisma.transactionCategory.delete({
     *   where: {
     *     // ... filter to delete one TransactionCategory
     *   }
     * })
     *
     */
    delete<T extends TransactionCategoryDeleteArgs>(
      args: SelectSubset<T, TransactionCategoryDeleteArgs<ExtArgs>>,
    ): Prisma__TransactionCategoryClient<
      $Result.GetResult<
        Prisma.$TransactionCategoryPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one TransactionCategory.
     * @param {TransactionCategoryUpdateArgs} args - Arguments to update one TransactionCategory.
     * @example
     * // Update one TransactionCategory
     * const transactionCategory = await prisma.transactionCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TransactionCategoryUpdateArgs>(
      args: SelectSubset<T, TransactionCategoryUpdateArgs<ExtArgs>>,
    ): Prisma__TransactionCategoryClient<
      $Result.GetResult<
        Prisma.$TransactionCategoryPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more TransactionCategories.
     * @param {TransactionCategoryDeleteManyArgs} args - Arguments to filter TransactionCategories to delete.
     * @example
     * // Delete a few TransactionCategories
     * const { count } = await prisma.transactionCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TransactionCategoryDeleteManyArgs>(
      args?: SelectSubset<T, TransactionCategoryDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more TransactionCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TransactionCategories
     * const transactionCategory = await prisma.transactionCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TransactionCategoryUpdateManyArgs>(
      args: SelectSubset<T, TransactionCategoryUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more TransactionCategories and returns the data updated in the database.
     * @param {TransactionCategoryUpdateManyAndReturnArgs} args - Arguments to update many TransactionCategories.
     * @example
     * // Update many TransactionCategories
     * const transactionCategory = await prisma.transactionCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more TransactionCategories and only return the `id`
     * const transactionCategoryWithIdOnly = await prisma.transactionCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends TransactionCategoryUpdateManyAndReturnArgs>(
      args: SelectSubset<T, TransactionCategoryUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TransactionCategoryPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one TransactionCategory.
     * @param {TransactionCategoryUpsertArgs} args - Arguments to update or create a TransactionCategory.
     * @example
     * // Update or create a TransactionCategory
     * const transactionCategory = await prisma.transactionCategory.upsert({
     *   create: {
     *     // ... data to create a TransactionCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TransactionCategory we want to update
     *   }
     * })
     */
    upsert<T extends TransactionCategoryUpsertArgs>(
      args: SelectSubset<T, TransactionCategoryUpsertArgs<ExtArgs>>,
    ): Prisma__TransactionCategoryClient<
      $Result.GetResult<
        Prisma.$TransactionCategoryPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of TransactionCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCategoryCountArgs} args - Arguments to filter TransactionCategories to count.
     * @example
     * // Count the number of TransactionCategories
     * const count = await prisma.transactionCategory.count({
     *   where: {
     *     // ... the filter for the TransactionCategories we want to count
     *   }
     * })
     **/
    count<T extends TransactionCategoryCountArgs>(
      args?: Subset<T, TransactionCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCategoryCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a TransactionCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TransactionCategoryAggregateArgs>(
      args: Subset<T, TransactionCategoryAggregateArgs>,
    ): Prisma.PrismaPromise<GetTransactionCategoryAggregateType<T>>;

    /**
     * Group by TransactionCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TransactionCategoryGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionCategoryGroupByArgs['orderBy'] }
        : { orderBy?: TransactionCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, TransactionCategoryGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetTransactionCategoryGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the TransactionCategory model
     */
    readonly fields: TransactionCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TransactionCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionCategoryClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    parent<T extends TransactionCategory$parentArgs<ExtArgs> = {}>(
      args?: Subset<T, TransactionCategory$parentArgs<ExtArgs>>,
    ): Prisma__TransactionCategoryClient<
      $Result.GetResult<
        Prisma.$TransactionCategoryPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    children<T extends TransactionCategory$childrenArgs<ExtArgs> = {}>(
      args?: Subset<T, TransactionCategory$childrenArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$TransactionCategoryPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    transactions<T extends TransactionCategory$transactionsArgs<ExtArgs> = {}>(
      args?: Subset<T, TransactionCategory$transactionsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    budgetCategories<T extends TransactionCategory$budgetCategoriesArgs<ExtArgs> = {}>(
      args?: Subset<T, TransactionCategory$budgetCategoriesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$BudgetCategoryPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the TransactionCategory model
   */
  interface TransactionCategoryFieldRefs {
    readonly id: FieldRef<'TransactionCategory', 'String'>;
    readonly userId: FieldRef<'TransactionCategory', 'String'>;
    readonly name: FieldRef<'TransactionCategory', 'String'>;
    readonly type: FieldRef<'TransactionCategory', 'TransactionType'>;
    readonly parentId: FieldRef<'TransactionCategory', 'String'>;
    readonly color: FieldRef<'TransactionCategory', 'String'>;
    readonly icon: FieldRef<'TransactionCategory', 'String'>;
    readonly isDefault: FieldRef<'TransactionCategory', 'Boolean'>;
    readonly isActive: FieldRef<'TransactionCategory', 'Boolean'>;
    readonly isDemo: FieldRef<'TransactionCategory', 'Boolean'>;
    readonly createdAt: FieldRef<'TransactionCategory', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * TransactionCategory findUnique
   */
  export type TransactionCategoryFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
    /**
     * Filter, which TransactionCategory to fetch.
     */
    where: TransactionCategoryWhereUniqueInput;
  };

  /**
   * TransactionCategory findUniqueOrThrow
   */
  export type TransactionCategoryFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
    /**
     * Filter, which TransactionCategory to fetch.
     */
    where: TransactionCategoryWhereUniqueInput;
  };

  /**
   * TransactionCategory findFirst
   */
  export type TransactionCategoryFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
    /**
     * Filter, which TransactionCategory to fetch.
     */
    where?: TransactionCategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TransactionCategories to fetch.
     */
    orderBy?:
      | TransactionCategoryOrderByWithRelationInput
      | TransactionCategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TransactionCategories.
     */
    cursor?: TransactionCategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TransactionCategories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TransactionCategories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TransactionCategories.
     */
    distinct?: TransactionCategoryScalarFieldEnum | TransactionCategoryScalarFieldEnum[];
  };

  /**
   * TransactionCategory findFirstOrThrow
   */
  export type TransactionCategoryFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
    /**
     * Filter, which TransactionCategory to fetch.
     */
    where?: TransactionCategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TransactionCategories to fetch.
     */
    orderBy?:
      | TransactionCategoryOrderByWithRelationInput
      | TransactionCategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TransactionCategories.
     */
    cursor?: TransactionCategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TransactionCategories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TransactionCategories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TransactionCategories.
     */
    distinct?: TransactionCategoryScalarFieldEnum | TransactionCategoryScalarFieldEnum[];
  };

  /**
   * TransactionCategory findMany
   */
  export type TransactionCategoryFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
    /**
     * Filter, which TransactionCategories to fetch.
     */
    where?: TransactionCategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TransactionCategories to fetch.
     */
    orderBy?:
      | TransactionCategoryOrderByWithRelationInput
      | TransactionCategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing TransactionCategories.
     */
    cursor?: TransactionCategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TransactionCategories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TransactionCategories.
     */
    skip?: number;
    distinct?: TransactionCategoryScalarFieldEnum | TransactionCategoryScalarFieldEnum[];
  };

  /**
   * TransactionCategory create
   */
  export type TransactionCategoryCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
    /**
     * The data needed to create a TransactionCategory.
     */
    data: XOR<TransactionCategoryCreateInput, TransactionCategoryUncheckedCreateInput>;
  };

  /**
   * TransactionCategory createMany
   */
  export type TransactionCategoryCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many TransactionCategories.
     */
    data: TransactionCategoryCreateManyInput | TransactionCategoryCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * TransactionCategory createManyAndReturn
   */
  export type TransactionCategoryCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * The data used to create many TransactionCategories.
     */
    data: TransactionCategoryCreateManyInput | TransactionCategoryCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * TransactionCategory update
   */
  export type TransactionCategoryUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
    /**
     * The data needed to update a TransactionCategory.
     */
    data: XOR<TransactionCategoryUpdateInput, TransactionCategoryUncheckedUpdateInput>;
    /**
     * Choose, which TransactionCategory to update.
     */
    where: TransactionCategoryWhereUniqueInput;
  };

  /**
   * TransactionCategory updateMany
   */
  export type TransactionCategoryUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update TransactionCategories.
     */
    data: XOR<
      TransactionCategoryUpdateManyMutationInput,
      TransactionCategoryUncheckedUpdateManyInput
    >;
    /**
     * Filter which TransactionCategories to update
     */
    where?: TransactionCategoryWhereInput;
    /**
     * Limit how many TransactionCategories to update.
     */
    limit?: number;
  };

  /**
   * TransactionCategory updateManyAndReturn
   */
  export type TransactionCategoryUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * The data used to update TransactionCategories.
     */
    data: XOR<
      TransactionCategoryUpdateManyMutationInput,
      TransactionCategoryUncheckedUpdateManyInput
    >;
    /**
     * Filter which TransactionCategories to update
     */
    where?: TransactionCategoryWhereInput;
    /**
     * Limit how many TransactionCategories to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * TransactionCategory upsert
   */
  export type TransactionCategoryUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
    /**
     * The filter to search for the TransactionCategory to update in case it exists.
     */
    where: TransactionCategoryWhereUniqueInput;
    /**
     * In case the TransactionCategory found by the `where` argument doesn't exist, create a new TransactionCategory with this data.
     */
    create: XOR<TransactionCategoryCreateInput, TransactionCategoryUncheckedCreateInput>;
    /**
     * In case the TransactionCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionCategoryUpdateInput, TransactionCategoryUncheckedUpdateInput>;
  };

  /**
   * TransactionCategory delete
   */
  export type TransactionCategoryDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
    /**
     * Filter which TransactionCategory to delete.
     */
    where: TransactionCategoryWhereUniqueInput;
  };

  /**
   * TransactionCategory deleteMany
   */
  export type TransactionCategoryDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which TransactionCategories to delete
     */
    where?: TransactionCategoryWhereInput;
    /**
     * Limit how many TransactionCategories to delete.
     */
    limit?: number;
  };

  /**
   * TransactionCategory.parent
   */
  export type TransactionCategory$parentArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
    where?: TransactionCategoryWhereInput;
  };

  /**
   * TransactionCategory.children
   */
  export type TransactionCategory$childrenArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
    where?: TransactionCategoryWhereInput;
    orderBy?:
      | TransactionCategoryOrderByWithRelationInput
      | TransactionCategoryOrderByWithRelationInput[];
    cursor?: TransactionCategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: TransactionCategoryScalarFieldEnum | TransactionCategoryScalarFieldEnum[];
  };

  /**
   * TransactionCategory.transactions
   */
  export type TransactionCategory$transactionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    where?: TransactionWhereInput;
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[];
    cursor?: TransactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
  };

  /**
   * TransactionCategory.budgetCategories
   */
  export type TransactionCategory$budgetCategoriesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryInclude<ExtArgs> | null;
    where?: BudgetCategoryWhereInput;
    orderBy?: BudgetCategoryOrderByWithRelationInput | BudgetCategoryOrderByWithRelationInput[];
    cursor?: BudgetCategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: BudgetCategoryScalarFieldEnum | BudgetCategoryScalarFieldEnum[];
  };

  /**
   * TransactionCategory without action
   */
  export type TransactionCategoryDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TransactionCategory
     */
    select?: TransactionCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionCategory
     */
    omit?: TransactionCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionCategoryInclude<ExtArgs> | null;
  };

  /**
   * Model Budget
   */

  export type AggregateBudget = {
    _count: BudgetCountAggregateOutputType | null;
    _avg: BudgetAvgAggregateOutputType | null;
    _sum: BudgetSumAggregateOutputType | null;
    _min: BudgetMinAggregateOutputType | null;
    _max: BudgetMaxAggregateOutputType | null;
  };

  export type BudgetAvgAggregateOutputType = {
    totalPlanned: number | null;
    totalActual: number | null;
  };

  export type BudgetSumAggregateOutputType = {
    totalPlanned: number | null;
    totalActual: number | null;
  };

  export type BudgetMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    name: string | null;
    period: $Enums.BudgetPeriod | null;
    startDate: Date | null;
    endDate: Date | null;
    currency: string | null;
    totalPlanned: number | null;
    totalActual: number | null;
    isActive: boolean | null;
    isDemo: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type BudgetMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    name: string | null;
    period: $Enums.BudgetPeriod | null;
    startDate: Date | null;
    endDate: Date | null;
    currency: string | null;
    totalPlanned: number | null;
    totalActual: number | null;
    isActive: boolean | null;
    isDemo: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type BudgetCountAggregateOutputType = {
    id: number;
    userId: number;
    name: number;
    period: number;
    startDate: number;
    endDate: number;
    currency: number;
    totalPlanned: number;
    totalActual: number;
    isActive: number;
    isDemo: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type BudgetAvgAggregateInputType = {
    totalPlanned?: true;
    totalActual?: true;
  };

  export type BudgetSumAggregateInputType = {
    totalPlanned?: true;
    totalActual?: true;
  };

  export type BudgetMinAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    period?: true;
    startDate?: true;
    endDate?: true;
    currency?: true;
    totalPlanned?: true;
    totalActual?: true;
    isActive?: true;
    isDemo?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type BudgetMaxAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    period?: true;
    startDate?: true;
    endDate?: true;
    currency?: true;
    totalPlanned?: true;
    totalActual?: true;
    isActive?: true;
    isDemo?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type BudgetCountAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    period?: true;
    startDate?: true;
    endDate?: true;
    currency?: true;
    totalPlanned?: true;
    totalActual?: true;
    isActive?: true;
    isDemo?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type BudgetAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Budget to aggregate.
     */
    where?: BudgetWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Budgets to fetch.
     */
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: BudgetWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Budgets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Budgets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Budgets
     **/
    _count?: true | BudgetCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: BudgetAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: BudgetSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: BudgetMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: BudgetMaxAggregateInputType;
  };

  export type GetBudgetAggregateType<T extends BudgetAggregateArgs> = {
    [P in keyof T & keyof AggregateBudget]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBudget[P]>
      : GetScalarType<T[P], AggregateBudget[P]>;
  };

  export type BudgetGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BudgetWhereInput;
    orderBy?: BudgetOrderByWithAggregationInput | BudgetOrderByWithAggregationInput[];
    by: BudgetScalarFieldEnum[] | BudgetScalarFieldEnum;
    having?: BudgetScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BudgetCountAggregateInputType | true;
    _avg?: BudgetAvgAggregateInputType;
    _sum?: BudgetSumAggregateInputType;
    _min?: BudgetMinAggregateInputType;
    _max?: BudgetMaxAggregateInputType;
  };

  export type BudgetGroupByOutputType = {
    id: string;
    userId: string;
    name: string;
    period: $Enums.BudgetPeriod;
    startDate: Date;
    endDate: Date;
    currency: string;
    totalPlanned: number;
    totalActual: number;
    isActive: boolean;
    isDemo: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: BudgetCountAggregateOutputType | null;
    _avg: BudgetAvgAggregateOutputType | null;
    _sum: BudgetSumAggregateOutputType | null;
    _min: BudgetMinAggregateOutputType | null;
    _max: BudgetMaxAggregateOutputType | null;
  };

  type GetBudgetGroupByPayload<T extends BudgetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BudgetGroupByOutputType, T['by']> & {
        [P in keyof T & keyof BudgetGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], BudgetGroupByOutputType[P]>
          : GetScalarType<T[P], BudgetGroupByOutputType[P]>;
      }
    >
  >;

  export type BudgetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        userId?: boolean;
        name?: boolean;
        period?: boolean;
        startDate?: boolean;
        endDate?: boolean;
        currency?: boolean;
        totalPlanned?: boolean;
        totalActual?: boolean;
        isActive?: boolean;
        isDemo?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        user?: boolean | UserDefaultArgs<ExtArgs>;
        categories?: boolean | Budget$categoriesArgs<ExtArgs>;
        _count?: boolean | BudgetCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['budget']
    >;

  export type BudgetSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      name?: boolean;
      period?: boolean;
      startDate?: boolean;
      endDate?: boolean;
      currency?: boolean;
      totalPlanned?: boolean;
      totalActual?: boolean;
      isActive?: boolean;
      isDemo?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['budget']
  >;

  export type BudgetSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      name?: boolean;
      period?: boolean;
      startDate?: boolean;
      endDate?: boolean;
      currency?: boolean;
      totalPlanned?: boolean;
      totalActual?: boolean;
      isActive?: boolean;
      isDemo?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['budget']
  >;

  export type BudgetSelectScalar = {
    id?: boolean;
    userId?: boolean;
    name?: boolean;
    period?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    currency?: boolean;
    totalPlanned?: boolean;
    totalActual?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type BudgetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'userId'
      | 'name'
      | 'period'
      | 'startDate'
      | 'endDate'
      | 'currency'
      | 'totalPlanned'
      | 'totalActual'
      | 'isActive'
      | 'isDemo'
      | 'createdAt'
      | 'updatedAt',
      ExtArgs['result']['budget']
    >;
  export type BudgetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    categories?: boolean | Budget$categoriesArgs<ExtArgs>;
    _count?: boolean | BudgetCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type BudgetIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type BudgetIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $BudgetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'Budget';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      categories: Prisma.$BudgetCategoryPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        name: string;
        period: $Enums.BudgetPeriod;
        startDate: Date;
        endDate: Date;
        currency: string;
        totalPlanned: number;
        totalActual: number;
        isActive: boolean;
        isDemo: boolean;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['budget']
    >;
    composites: {};
  };

  type BudgetGetPayload<S extends boolean | null | undefined | BudgetDefaultArgs> =
    $Result.GetResult<Prisma.$BudgetPayload, S>;

  type BudgetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    BudgetFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: BudgetCountAggregateInputType | true;
  };

  export interface BudgetDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Budget']; meta: { name: 'Budget' } };
    /**
     * Find zero or one Budget that matches the filter.
     * @param {BudgetFindUniqueArgs} args - Arguments to find a Budget
     * @example
     * // Get one Budget
     * const budget = await prisma.budget.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BudgetFindUniqueArgs>(
      args: SelectSubset<T, BudgetFindUniqueArgs<ExtArgs>>,
    ): Prisma__BudgetClient<
      $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Budget that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BudgetFindUniqueOrThrowArgs} args - Arguments to find a Budget
     * @example
     * // Get one Budget
     * const budget = await prisma.budget.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BudgetFindUniqueOrThrowArgs>(
      args: SelectSubset<T, BudgetFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__BudgetClient<
      $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Budget that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetFindFirstArgs} args - Arguments to find a Budget
     * @example
     * // Get one Budget
     * const budget = await prisma.budget.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BudgetFindFirstArgs>(
      args?: SelectSubset<T, BudgetFindFirstArgs<ExtArgs>>,
    ): Prisma__BudgetClient<
      $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Budget that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetFindFirstOrThrowArgs} args - Arguments to find a Budget
     * @example
     * // Get one Budget
     * const budget = await prisma.budget.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BudgetFindFirstOrThrowArgs>(
      args?: SelectSubset<T, BudgetFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__BudgetClient<
      $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Budgets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Budgets
     * const budgets = await prisma.budget.findMany()
     *
     * // Get first 10 Budgets
     * const budgets = await prisma.budget.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const budgetWithIdOnly = await prisma.budget.findMany({ select: { id: true } })
     *
     */
    findMany<T extends BudgetFindManyArgs>(
      args?: SelectSubset<T, BudgetFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a Budget.
     * @param {BudgetCreateArgs} args - Arguments to create a Budget.
     * @example
     * // Create one Budget
     * const Budget = await prisma.budget.create({
     *   data: {
     *     // ... data to create a Budget
     *   }
     * })
     *
     */
    create<T extends BudgetCreateArgs>(
      args: SelectSubset<T, BudgetCreateArgs<ExtArgs>>,
    ): Prisma__BudgetClient<
      $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Budgets.
     * @param {BudgetCreateManyArgs} args - Arguments to create many Budgets.
     * @example
     * // Create many Budgets
     * const budget = await prisma.budget.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BudgetCreateManyArgs>(
      args?: SelectSubset<T, BudgetCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Budgets and returns the data saved in the database.
     * @param {BudgetCreateManyAndReturnArgs} args - Arguments to create many Budgets.
     * @example
     * // Create many Budgets
     * const budget = await prisma.budget.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Budgets and only return the `id`
     * const budgetWithIdOnly = await prisma.budget.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends BudgetCreateManyAndReturnArgs>(
      args?: SelectSubset<T, BudgetCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Delete a Budget.
     * @param {BudgetDeleteArgs} args - Arguments to delete one Budget.
     * @example
     * // Delete one Budget
     * const Budget = await prisma.budget.delete({
     *   where: {
     *     // ... filter to delete one Budget
     *   }
     * })
     *
     */
    delete<T extends BudgetDeleteArgs>(
      args: SelectSubset<T, BudgetDeleteArgs<ExtArgs>>,
    ): Prisma__BudgetClient<
      $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Budget.
     * @param {BudgetUpdateArgs} args - Arguments to update one Budget.
     * @example
     * // Update one Budget
     * const budget = await prisma.budget.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BudgetUpdateArgs>(
      args: SelectSubset<T, BudgetUpdateArgs<ExtArgs>>,
    ): Prisma__BudgetClient<
      $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Budgets.
     * @param {BudgetDeleteManyArgs} args - Arguments to filter Budgets to delete.
     * @example
     * // Delete a few Budgets
     * const { count } = await prisma.budget.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BudgetDeleteManyArgs>(
      args?: SelectSubset<T, BudgetDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Budgets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Budgets
     * const budget = await prisma.budget.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BudgetUpdateManyArgs>(
      args: SelectSubset<T, BudgetUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Budgets and returns the data updated in the database.
     * @param {BudgetUpdateManyAndReturnArgs} args - Arguments to update many Budgets.
     * @example
     * // Update many Budgets
     * const budget = await prisma.budget.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Budgets and only return the `id`
     * const budgetWithIdOnly = await prisma.budget.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends BudgetUpdateManyAndReturnArgs>(
      args: SelectSubset<T, BudgetUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Create or update one Budget.
     * @param {BudgetUpsertArgs} args - Arguments to update or create a Budget.
     * @example
     * // Update or create a Budget
     * const budget = await prisma.budget.upsert({
     *   create: {
     *     // ... data to create a Budget
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Budget we want to update
     *   }
     * })
     */
    upsert<T extends BudgetUpsertArgs>(
      args: SelectSubset<T, BudgetUpsertArgs<ExtArgs>>,
    ): Prisma__BudgetClient<
      $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Budgets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetCountArgs} args - Arguments to filter Budgets to count.
     * @example
     * // Count the number of Budgets
     * const count = await prisma.budget.count({
     *   where: {
     *     // ... the filter for the Budgets we want to count
     *   }
     * })
     **/
    count<T extends BudgetCountArgs>(
      args?: Subset<T, BudgetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BudgetCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Budget.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends BudgetAggregateArgs>(
      args: Subset<T, BudgetAggregateArgs>,
    ): Prisma.PrismaPromise<GetBudgetAggregateType<T>>;

    /**
     * Group by Budget.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends BudgetGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BudgetGroupByArgs['orderBy'] }
        : { orderBy?: BudgetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, BudgetGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetBudgetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Budget model
     */
    readonly fields: BudgetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Budget.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BudgetClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    categories<T extends Budget$categoriesArgs<ExtArgs> = {}>(
      args?: Subset<T, Budget$categoriesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$BudgetCategoryPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Budget model
   */
  interface BudgetFieldRefs {
    readonly id: FieldRef<'Budget', 'String'>;
    readonly userId: FieldRef<'Budget', 'String'>;
    readonly name: FieldRef<'Budget', 'String'>;
    readonly period: FieldRef<'Budget', 'BudgetPeriod'>;
    readonly startDate: FieldRef<'Budget', 'DateTime'>;
    readonly endDate: FieldRef<'Budget', 'DateTime'>;
    readonly currency: FieldRef<'Budget', 'String'>;
    readonly totalPlanned: FieldRef<'Budget', 'Float'>;
    readonly totalActual: FieldRef<'Budget', 'Float'>;
    readonly isActive: FieldRef<'Budget', 'Boolean'>;
    readonly isDemo: FieldRef<'Budget', 'Boolean'>;
    readonly createdAt: FieldRef<'Budget', 'DateTime'>;
    readonly updatedAt: FieldRef<'Budget', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Budget findUnique
   */
  export type BudgetFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null;
    /**
     * Filter, which Budget to fetch.
     */
    where: BudgetWhereUniqueInput;
  };

  /**
   * Budget findUniqueOrThrow
   */
  export type BudgetFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null;
    /**
     * Filter, which Budget to fetch.
     */
    where: BudgetWhereUniqueInput;
  };

  /**
   * Budget findFirst
   */
  export type BudgetFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null;
    /**
     * Filter, which Budget to fetch.
     */
    where?: BudgetWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Budgets to fetch.
     */
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Budgets.
     */
    cursor?: BudgetWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Budgets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Budgets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Budgets.
     */
    distinct?: BudgetScalarFieldEnum | BudgetScalarFieldEnum[];
  };

  /**
   * Budget findFirstOrThrow
   */
  export type BudgetFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null;
    /**
     * Filter, which Budget to fetch.
     */
    where?: BudgetWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Budgets to fetch.
     */
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Budgets.
     */
    cursor?: BudgetWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Budgets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Budgets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Budgets.
     */
    distinct?: BudgetScalarFieldEnum | BudgetScalarFieldEnum[];
  };

  /**
   * Budget findMany
   */
  export type BudgetFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null;
    /**
     * Filter, which Budgets to fetch.
     */
    where?: BudgetWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Budgets to fetch.
     */
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Budgets.
     */
    cursor?: BudgetWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Budgets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Budgets.
     */
    skip?: number;
    distinct?: BudgetScalarFieldEnum | BudgetScalarFieldEnum[];
  };

  /**
   * Budget create
   */
  export type BudgetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Budget
       */
      select?: BudgetSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Budget
       */
      omit?: BudgetOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: BudgetInclude<ExtArgs> | null;
      /**
       * The data needed to create a Budget.
       */
      data: XOR<BudgetCreateInput, BudgetUncheckedCreateInput>;
    };

  /**
   * Budget createMany
   */
  export type BudgetCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Budgets.
     */
    data: BudgetCreateManyInput | BudgetCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Budget createManyAndReturn
   */
  export type BudgetCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null;
    /**
     * The data used to create many Budgets.
     */
    data: BudgetCreateManyInput | BudgetCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Budget update
   */
  export type BudgetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Budget
       */
      select?: BudgetSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Budget
       */
      omit?: BudgetOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: BudgetInclude<ExtArgs> | null;
      /**
       * The data needed to update a Budget.
       */
      data: XOR<BudgetUpdateInput, BudgetUncheckedUpdateInput>;
      /**
       * Choose, which Budget to update.
       */
      where: BudgetWhereUniqueInput;
    };

  /**
   * Budget updateMany
   */
  export type BudgetUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Budgets.
     */
    data: XOR<BudgetUpdateManyMutationInput, BudgetUncheckedUpdateManyInput>;
    /**
     * Filter which Budgets to update
     */
    where?: BudgetWhereInput;
    /**
     * Limit how many Budgets to update.
     */
    limit?: number;
  };

  /**
   * Budget updateManyAndReturn
   */
  export type BudgetUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null;
    /**
     * The data used to update Budgets.
     */
    data: XOR<BudgetUpdateManyMutationInput, BudgetUncheckedUpdateManyInput>;
    /**
     * Filter which Budgets to update
     */
    where?: BudgetWhereInput;
    /**
     * Limit how many Budgets to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Budget upsert
   */
  export type BudgetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Budget
       */
      select?: BudgetSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Budget
       */
      omit?: BudgetOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: BudgetInclude<ExtArgs> | null;
      /**
       * The filter to search for the Budget to update in case it exists.
       */
      where: BudgetWhereUniqueInput;
      /**
       * In case the Budget found by the `where` argument doesn't exist, create a new Budget with this data.
       */
      create: XOR<BudgetCreateInput, BudgetUncheckedCreateInput>;
      /**
       * In case the Budget was found with the provided `where` argument, update it with this data.
       */
      update: XOR<BudgetUpdateInput, BudgetUncheckedUpdateInput>;
    };

  /**
   * Budget delete
   */
  export type BudgetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Budget
       */
      select?: BudgetSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Budget
       */
      omit?: BudgetOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: BudgetInclude<ExtArgs> | null;
      /**
       * Filter which Budget to delete.
       */
      where: BudgetWhereUniqueInput;
    };

  /**
   * Budget deleteMany
   */
  export type BudgetDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Budgets to delete
     */
    where?: BudgetWhereInput;
    /**
     * Limit how many Budgets to delete.
     */
    limit?: number;
  };

  /**
   * Budget.categories
   */
  export type Budget$categoriesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryInclude<ExtArgs> | null;
    where?: BudgetCategoryWhereInput;
    orderBy?: BudgetCategoryOrderByWithRelationInput | BudgetCategoryOrderByWithRelationInput[];
    cursor?: BudgetCategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: BudgetCategoryScalarFieldEnum | BudgetCategoryScalarFieldEnum[];
  };

  /**
   * Budget without action
   */
  export type BudgetDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null;
  };

  /**
   * Model BudgetCategory
   */

  export type AggregateBudgetCategory = {
    _count: BudgetCategoryCountAggregateOutputType | null;
    _avg: BudgetCategoryAvgAggregateOutputType | null;
    _sum: BudgetCategorySumAggregateOutputType | null;
    _min: BudgetCategoryMinAggregateOutputType | null;
    _max: BudgetCategoryMaxAggregateOutputType | null;
  };

  export type BudgetCategoryAvgAggregateOutputType = {
    planned: number | null;
    actual: number | null;
  };

  export type BudgetCategorySumAggregateOutputType = {
    planned: number | null;
    actual: number | null;
  };

  export type BudgetCategoryMinAggregateOutputType = {
    id: string | null;
    budgetId: string | null;
    categoryId: string | null;
    planned: number | null;
    actual: number | null;
  };

  export type BudgetCategoryMaxAggregateOutputType = {
    id: string | null;
    budgetId: string | null;
    categoryId: string | null;
    planned: number | null;
    actual: number | null;
  };

  export type BudgetCategoryCountAggregateOutputType = {
    id: number;
    budgetId: number;
    categoryId: number;
    planned: number;
    actual: number;
    _all: number;
  };

  export type BudgetCategoryAvgAggregateInputType = {
    planned?: true;
    actual?: true;
  };

  export type BudgetCategorySumAggregateInputType = {
    planned?: true;
    actual?: true;
  };

  export type BudgetCategoryMinAggregateInputType = {
    id?: true;
    budgetId?: true;
    categoryId?: true;
    planned?: true;
    actual?: true;
  };

  export type BudgetCategoryMaxAggregateInputType = {
    id?: true;
    budgetId?: true;
    categoryId?: true;
    planned?: true;
    actual?: true;
  };

  export type BudgetCategoryCountAggregateInputType = {
    id?: true;
    budgetId?: true;
    categoryId?: true;
    planned?: true;
    actual?: true;
    _all?: true;
  };

  export type BudgetCategoryAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which BudgetCategory to aggregate.
     */
    where?: BudgetCategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BudgetCategories to fetch.
     */
    orderBy?: BudgetCategoryOrderByWithRelationInput | BudgetCategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: BudgetCategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BudgetCategories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BudgetCategories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned BudgetCategories
     **/
    _count?: true | BudgetCategoryCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: BudgetCategoryAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: BudgetCategorySumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: BudgetCategoryMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: BudgetCategoryMaxAggregateInputType;
  };

  export type GetBudgetCategoryAggregateType<T extends BudgetCategoryAggregateArgs> = {
    [P in keyof T & keyof AggregateBudgetCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBudgetCategory[P]>
      : GetScalarType<T[P], AggregateBudgetCategory[P]>;
  };

  export type BudgetCategoryGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BudgetCategoryWhereInput;
    orderBy?:
      | BudgetCategoryOrderByWithAggregationInput
      | BudgetCategoryOrderByWithAggregationInput[];
    by: BudgetCategoryScalarFieldEnum[] | BudgetCategoryScalarFieldEnum;
    having?: BudgetCategoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BudgetCategoryCountAggregateInputType | true;
    _avg?: BudgetCategoryAvgAggregateInputType;
    _sum?: BudgetCategorySumAggregateInputType;
    _min?: BudgetCategoryMinAggregateInputType;
    _max?: BudgetCategoryMaxAggregateInputType;
  };

  export type BudgetCategoryGroupByOutputType = {
    id: string;
    budgetId: string;
    categoryId: string;
    planned: number;
    actual: number;
    _count: BudgetCategoryCountAggregateOutputType | null;
    _avg: BudgetCategoryAvgAggregateOutputType | null;
    _sum: BudgetCategorySumAggregateOutputType | null;
    _min: BudgetCategoryMinAggregateOutputType | null;
    _max: BudgetCategoryMaxAggregateOutputType | null;
  };

  type GetBudgetCategoryGroupByPayload<T extends BudgetCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BudgetCategoryGroupByOutputType, T['by']> & {
        [P in keyof T & keyof BudgetCategoryGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], BudgetCategoryGroupByOutputType[P]>
          : GetScalarType<T[P], BudgetCategoryGroupByOutputType[P]>;
      }
    >
  >;

  export type BudgetCategorySelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      budgetId?: boolean;
      categoryId?: boolean;
      planned?: boolean;
      actual?: boolean;
      budget?: boolean | BudgetDefaultArgs<ExtArgs>;
      category?: boolean | TransactionCategoryDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['budgetCategory']
  >;

  export type BudgetCategorySelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      budgetId?: boolean;
      categoryId?: boolean;
      planned?: boolean;
      actual?: boolean;
      budget?: boolean | BudgetDefaultArgs<ExtArgs>;
      category?: boolean | TransactionCategoryDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['budgetCategory']
  >;

  export type BudgetCategorySelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      budgetId?: boolean;
      categoryId?: boolean;
      planned?: boolean;
      actual?: boolean;
      budget?: boolean | BudgetDefaultArgs<ExtArgs>;
      category?: boolean | TransactionCategoryDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['budgetCategory']
  >;

  export type BudgetCategorySelectScalar = {
    id?: boolean;
    budgetId?: boolean;
    categoryId?: boolean;
    planned?: boolean;
    actual?: boolean;
  };

  export type BudgetCategoryOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'budgetId' | 'categoryId' | 'planned' | 'actual',
    ExtArgs['result']['budgetCategory']
  >;
  export type BudgetCategoryInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    budget?: boolean | BudgetDefaultArgs<ExtArgs>;
    category?: boolean | TransactionCategoryDefaultArgs<ExtArgs>;
  };
  export type BudgetCategoryIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    budget?: boolean | BudgetDefaultArgs<ExtArgs>;
    category?: boolean | TransactionCategoryDefaultArgs<ExtArgs>;
  };
  export type BudgetCategoryIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    budget?: boolean | BudgetDefaultArgs<ExtArgs>;
    category?: boolean | TransactionCategoryDefaultArgs<ExtArgs>;
  };

  export type $BudgetCategoryPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'BudgetCategory';
    objects: {
      budget: Prisma.$BudgetPayload<ExtArgs>;
      category: Prisma.$TransactionCategoryPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        budgetId: string;
        categoryId: string;
        planned: number;
        actual: number;
      },
      ExtArgs['result']['budgetCategory']
    >;
    composites: {};
  };

  type BudgetCategoryGetPayload<S extends boolean | null | undefined | BudgetCategoryDefaultArgs> =
    $Result.GetResult<Prisma.$BudgetCategoryPayload, S>;

  type BudgetCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BudgetCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BudgetCategoryCountAggregateInputType | true;
    };

  export interface BudgetCategoryDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['BudgetCategory'];
      meta: { name: 'BudgetCategory' };
    };
    /**
     * Find zero or one BudgetCategory that matches the filter.
     * @param {BudgetCategoryFindUniqueArgs} args - Arguments to find a BudgetCategory
     * @example
     * // Get one BudgetCategory
     * const budgetCategory = await prisma.budgetCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BudgetCategoryFindUniqueArgs>(
      args: SelectSubset<T, BudgetCategoryFindUniqueArgs<ExtArgs>>,
    ): Prisma__BudgetCategoryClient<
      $Result.GetResult<
        Prisma.$BudgetCategoryPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one BudgetCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BudgetCategoryFindUniqueOrThrowArgs} args - Arguments to find a BudgetCategory
     * @example
     * // Get one BudgetCategory
     * const budgetCategory = await prisma.budgetCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BudgetCategoryFindUniqueOrThrowArgs>(
      args: SelectSubset<T, BudgetCategoryFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__BudgetCategoryClient<
      $Result.GetResult<
        Prisma.$BudgetCategoryPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first BudgetCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetCategoryFindFirstArgs} args - Arguments to find a BudgetCategory
     * @example
     * // Get one BudgetCategory
     * const budgetCategory = await prisma.budgetCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BudgetCategoryFindFirstArgs>(
      args?: SelectSubset<T, BudgetCategoryFindFirstArgs<ExtArgs>>,
    ): Prisma__BudgetCategoryClient<
      $Result.GetResult<
        Prisma.$BudgetCategoryPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first BudgetCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetCategoryFindFirstOrThrowArgs} args - Arguments to find a BudgetCategory
     * @example
     * // Get one BudgetCategory
     * const budgetCategory = await prisma.budgetCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BudgetCategoryFindFirstOrThrowArgs>(
      args?: SelectSubset<T, BudgetCategoryFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__BudgetCategoryClient<
      $Result.GetResult<
        Prisma.$BudgetCategoryPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more BudgetCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BudgetCategories
     * const budgetCategories = await prisma.budgetCategory.findMany()
     *
     * // Get first 10 BudgetCategories
     * const budgetCategories = await prisma.budgetCategory.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const budgetCategoryWithIdOnly = await prisma.budgetCategory.findMany({ select: { id: true } })
     *
     */
    findMany<T extends BudgetCategoryFindManyArgs>(
      args?: SelectSubset<T, BudgetCategoryFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$BudgetCategoryPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a BudgetCategory.
     * @param {BudgetCategoryCreateArgs} args - Arguments to create a BudgetCategory.
     * @example
     * // Create one BudgetCategory
     * const BudgetCategory = await prisma.budgetCategory.create({
     *   data: {
     *     // ... data to create a BudgetCategory
     *   }
     * })
     *
     */
    create<T extends BudgetCategoryCreateArgs>(
      args: SelectSubset<T, BudgetCategoryCreateArgs<ExtArgs>>,
    ): Prisma__BudgetCategoryClient<
      $Result.GetResult<Prisma.$BudgetCategoryPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many BudgetCategories.
     * @param {BudgetCategoryCreateManyArgs} args - Arguments to create many BudgetCategories.
     * @example
     * // Create many BudgetCategories
     * const budgetCategory = await prisma.budgetCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BudgetCategoryCreateManyArgs>(
      args?: SelectSubset<T, BudgetCategoryCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many BudgetCategories and returns the data saved in the database.
     * @param {BudgetCategoryCreateManyAndReturnArgs} args - Arguments to create many BudgetCategories.
     * @example
     * // Create many BudgetCategories
     * const budgetCategory = await prisma.budgetCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many BudgetCategories and only return the `id`
     * const budgetCategoryWithIdOnly = await prisma.budgetCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends BudgetCategoryCreateManyAndReturnArgs>(
      args?: SelectSubset<T, BudgetCategoryCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$BudgetCategoryPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a BudgetCategory.
     * @param {BudgetCategoryDeleteArgs} args - Arguments to delete one BudgetCategory.
     * @example
     * // Delete one BudgetCategory
     * const BudgetCategory = await prisma.budgetCategory.delete({
     *   where: {
     *     // ... filter to delete one BudgetCategory
     *   }
     * })
     *
     */
    delete<T extends BudgetCategoryDeleteArgs>(
      args: SelectSubset<T, BudgetCategoryDeleteArgs<ExtArgs>>,
    ): Prisma__BudgetCategoryClient<
      $Result.GetResult<Prisma.$BudgetCategoryPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one BudgetCategory.
     * @param {BudgetCategoryUpdateArgs} args - Arguments to update one BudgetCategory.
     * @example
     * // Update one BudgetCategory
     * const budgetCategory = await prisma.budgetCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BudgetCategoryUpdateArgs>(
      args: SelectSubset<T, BudgetCategoryUpdateArgs<ExtArgs>>,
    ): Prisma__BudgetCategoryClient<
      $Result.GetResult<Prisma.$BudgetCategoryPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more BudgetCategories.
     * @param {BudgetCategoryDeleteManyArgs} args - Arguments to filter BudgetCategories to delete.
     * @example
     * // Delete a few BudgetCategories
     * const { count } = await prisma.budgetCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BudgetCategoryDeleteManyArgs>(
      args?: SelectSubset<T, BudgetCategoryDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more BudgetCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BudgetCategories
     * const budgetCategory = await prisma.budgetCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BudgetCategoryUpdateManyArgs>(
      args: SelectSubset<T, BudgetCategoryUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more BudgetCategories and returns the data updated in the database.
     * @param {BudgetCategoryUpdateManyAndReturnArgs} args - Arguments to update many BudgetCategories.
     * @example
     * // Update many BudgetCategories
     * const budgetCategory = await prisma.budgetCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more BudgetCategories and only return the `id`
     * const budgetCategoryWithIdOnly = await prisma.budgetCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends BudgetCategoryUpdateManyAndReturnArgs>(
      args: SelectSubset<T, BudgetCategoryUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$BudgetCategoryPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one BudgetCategory.
     * @param {BudgetCategoryUpsertArgs} args - Arguments to update or create a BudgetCategory.
     * @example
     * // Update or create a BudgetCategory
     * const budgetCategory = await prisma.budgetCategory.upsert({
     *   create: {
     *     // ... data to create a BudgetCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BudgetCategory we want to update
     *   }
     * })
     */
    upsert<T extends BudgetCategoryUpsertArgs>(
      args: SelectSubset<T, BudgetCategoryUpsertArgs<ExtArgs>>,
    ): Prisma__BudgetCategoryClient<
      $Result.GetResult<Prisma.$BudgetCategoryPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of BudgetCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetCategoryCountArgs} args - Arguments to filter BudgetCategories to count.
     * @example
     * // Count the number of BudgetCategories
     * const count = await prisma.budgetCategory.count({
     *   where: {
     *     // ... the filter for the BudgetCategories we want to count
     *   }
     * })
     **/
    count<T extends BudgetCategoryCountArgs>(
      args?: Subset<T, BudgetCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BudgetCategoryCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a BudgetCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends BudgetCategoryAggregateArgs>(
      args: Subset<T, BudgetCategoryAggregateArgs>,
    ): Prisma.PrismaPromise<GetBudgetCategoryAggregateType<T>>;

    /**
     * Group by BudgetCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends BudgetCategoryGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BudgetCategoryGroupByArgs['orderBy'] }
        : { orderBy?: BudgetCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, BudgetCategoryGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetBudgetCategoryGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the BudgetCategory model
     */
    readonly fields: BudgetCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BudgetCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BudgetCategoryClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    budget<T extends BudgetDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, BudgetDefaultArgs<ExtArgs>>,
    ): Prisma__BudgetClient<
      | $Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    category<T extends TransactionCategoryDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, TransactionCategoryDefaultArgs<ExtArgs>>,
    ): Prisma__TransactionCategoryClient<
      | $Result.GetResult<
          Prisma.$TransactionCategoryPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the BudgetCategory model
   */
  interface BudgetCategoryFieldRefs {
    readonly id: FieldRef<'BudgetCategory', 'String'>;
    readonly budgetId: FieldRef<'BudgetCategory', 'String'>;
    readonly categoryId: FieldRef<'BudgetCategory', 'String'>;
    readonly planned: FieldRef<'BudgetCategory', 'Float'>;
    readonly actual: FieldRef<'BudgetCategory', 'Float'>;
  }

  // Custom InputTypes
  /**
   * BudgetCategory findUnique
   */
  export type BudgetCategoryFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryInclude<ExtArgs> | null;
    /**
     * Filter, which BudgetCategory to fetch.
     */
    where: BudgetCategoryWhereUniqueInput;
  };

  /**
   * BudgetCategory findUniqueOrThrow
   */
  export type BudgetCategoryFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryInclude<ExtArgs> | null;
    /**
     * Filter, which BudgetCategory to fetch.
     */
    where: BudgetCategoryWhereUniqueInput;
  };

  /**
   * BudgetCategory findFirst
   */
  export type BudgetCategoryFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryInclude<ExtArgs> | null;
    /**
     * Filter, which BudgetCategory to fetch.
     */
    where?: BudgetCategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BudgetCategories to fetch.
     */
    orderBy?: BudgetCategoryOrderByWithRelationInput | BudgetCategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BudgetCategories.
     */
    cursor?: BudgetCategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BudgetCategories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BudgetCategories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BudgetCategories.
     */
    distinct?: BudgetCategoryScalarFieldEnum | BudgetCategoryScalarFieldEnum[];
  };

  /**
   * BudgetCategory findFirstOrThrow
   */
  export type BudgetCategoryFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryInclude<ExtArgs> | null;
    /**
     * Filter, which BudgetCategory to fetch.
     */
    where?: BudgetCategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BudgetCategories to fetch.
     */
    orderBy?: BudgetCategoryOrderByWithRelationInput | BudgetCategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BudgetCategories.
     */
    cursor?: BudgetCategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BudgetCategories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BudgetCategories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BudgetCategories.
     */
    distinct?: BudgetCategoryScalarFieldEnum | BudgetCategoryScalarFieldEnum[];
  };

  /**
   * BudgetCategory findMany
   */
  export type BudgetCategoryFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryInclude<ExtArgs> | null;
    /**
     * Filter, which BudgetCategories to fetch.
     */
    where?: BudgetCategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BudgetCategories to fetch.
     */
    orderBy?: BudgetCategoryOrderByWithRelationInput | BudgetCategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing BudgetCategories.
     */
    cursor?: BudgetCategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BudgetCategories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BudgetCategories.
     */
    skip?: number;
    distinct?: BudgetCategoryScalarFieldEnum | BudgetCategoryScalarFieldEnum[];
  };

  /**
   * BudgetCategory create
   */
  export type BudgetCategoryCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryInclude<ExtArgs> | null;
    /**
     * The data needed to create a BudgetCategory.
     */
    data: XOR<BudgetCategoryCreateInput, BudgetCategoryUncheckedCreateInput>;
  };

  /**
   * BudgetCategory createMany
   */
  export type BudgetCategoryCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many BudgetCategories.
     */
    data: BudgetCategoryCreateManyInput | BudgetCategoryCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * BudgetCategory createManyAndReturn
   */
  export type BudgetCategoryCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * The data used to create many BudgetCategories.
     */
    data: BudgetCategoryCreateManyInput | BudgetCategoryCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * BudgetCategory update
   */
  export type BudgetCategoryUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryInclude<ExtArgs> | null;
    /**
     * The data needed to update a BudgetCategory.
     */
    data: XOR<BudgetCategoryUpdateInput, BudgetCategoryUncheckedUpdateInput>;
    /**
     * Choose, which BudgetCategory to update.
     */
    where: BudgetCategoryWhereUniqueInput;
  };

  /**
   * BudgetCategory updateMany
   */
  export type BudgetCategoryUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update BudgetCategories.
     */
    data: XOR<BudgetCategoryUpdateManyMutationInput, BudgetCategoryUncheckedUpdateManyInput>;
    /**
     * Filter which BudgetCategories to update
     */
    where?: BudgetCategoryWhereInput;
    /**
     * Limit how many BudgetCategories to update.
     */
    limit?: number;
  };

  /**
   * BudgetCategory updateManyAndReturn
   */
  export type BudgetCategoryUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * The data used to update BudgetCategories.
     */
    data: XOR<BudgetCategoryUpdateManyMutationInput, BudgetCategoryUncheckedUpdateManyInput>;
    /**
     * Filter which BudgetCategories to update
     */
    where?: BudgetCategoryWhereInput;
    /**
     * Limit how many BudgetCategories to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * BudgetCategory upsert
   */
  export type BudgetCategoryUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryInclude<ExtArgs> | null;
    /**
     * The filter to search for the BudgetCategory to update in case it exists.
     */
    where: BudgetCategoryWhereUniqueInput;
    /**
     * In case the BudgetCategory found by the `where` argument doesn't exist, create a new BudgetCategory with this data.
     */
    create: XOR<BudgetCategoryCreateInput, BudgetCategoryUncheckedCreateInput>;
    /**
     * In case the BudgetCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BudgetCategoryUpdateInput, BudgetCategoryUncheckedUpdateInput>;
  };

  /**
   * BudgetCategory delete
   */
  export type BudgetCategoryDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryInclude<ExtArgs> | null;
    /**
     * Filter which BudgetCategory to delete.
     */
    where: BudgetCategoryWhereUniqueInput;
  };

  /**
   * BudgetCategory deleteMany
   */
  export type BudgetCategoryDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which BudgetCategories to delete
     */
    where?: BudgetCategoryWhereInput;
    /**
     * Limit how many BudgetCategories to delete.
     */
    limit?: number;
  };

  /**
   * BudgetCategory without action
   */
  export type BudgetCategoryDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BudgetCategory
     */
    select?: BudgetCategorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BudgetCategory
     */
    omit?: BudgetCategoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetCategoryInclude<ExtArgs> | null;
  };

  /**
   * Model FinancialGoal
   */

  export type AggregateFinancialGoal = {
    _count: FinancialGoalCountAggregateOutputType | null;
    _avg: FinancialGoalAvgAggregateOutputType | null;
    _sum: FinancialGoalSumAggregateOutputType | null;
    _min: FinancialGoalMinAggregateOutputType | null;
    _max: FinancialGoalMaxAggregateOutputType | null;
  };

  export type FinancialGoalAvgAggregateOutputType = {
    targetAmount: number | null;
    currentAmount: number | null;
  };

  export type FinancialGoalSumAggregateOutputType = {
    targetAmount: number | null;
    currentAmount: number | null;
  };

  export type FinancialGoalMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    name: string | null;
    description: string | null;
    targetAmount: number | null;
    currentAmount: number | null;
    currency: string | null;
    deadline: Date | null;
    color: string | null;
    icon: string | null;
    isActive: boolean | null;
    isCompleted: boolean | null;
    isDemo: boolean | null;
    completedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type FinancialGoalMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    name: string | null;
    description: string | null;
    targetAmount: number | null;
    currentAmount: number | null;
    currency: string | null;
    deadline: Date | null;
    color: string | null;
    icon: string | null;
    isActive: boolean | null;
    isCompleted: boolean | null;
    isDemo: boolean | null;
    completedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type FinancialGoalCountAggregateOutputType = {
    id: number;
    userId: number;
    name: number;
    description: number;
    targetAmount: number;
    currentAmount: number;
    currency: number;
    deadline: number;
    color: number;
    icon: number;
    isActive: number;
    isCompleted: number;
    isDemo: number;
    completedAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type FinancialGoalAvgAggregateInputType = {
    targetAmount?: true;
    currentAmount?: true;
  };

  export type FinancialGoalSumAggregateInputType = {
    targetAmount?: true;
    currentAmount?: true;
  };

  export type FinancialGoalMinAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    description?: true;
    targetAmount?: true;
    currentAmount?: true;
    currency?: true;
    deadline?: true;
    color?: true;
    icon?: true;
    isActive?: true;
    isCompleted?: true;
    isDemo?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type FinancialGoalMaxAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    description?: true;
    targetAmount?: true;
    currentAmount?: true;
    currency?: true;
    deadline?: true;
    color?: true;
    icon?: true;
    isActive?: true;
    isCompleted?: true;
    isDemo?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type FinancialGoalCountAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    description?: true;
    targetAmount?: true;
    currentAmount?: true;
    currency?: true;
    deadline?: true;
    color?: true;
    icon?: true;
    isActive?: true;
    isCompleted?: true;
    isDemo?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type FinancialGoalAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which FinancialGoal to aggregate.
     */
    where?: FinancialGoalWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FinancialGoals to fetch.
     */
    orderBy?: FinancialGoalOrderByWithRelationInput | FinancialGoalOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: FinancialGoalWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FinancialGoals from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FinancialGoals.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned FinancialGoals
     **/
    _count?: true | FinancialGoalCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: FinancialGoalAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: FinancialGoalSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: FinancialGoalMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: FinancialGoalMaxAggregateInputType;
  };

  export type GetFinancialGoalAggregateType<T extends FinancialGoalAggregateArgs> = {
    [P in keyof T & keyof AggregateFinancialGoal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFinancialGoal[P]>
      : GetScalarType<T[P], AggregateFinancialGoal[P]>;
  };

  export type FinancialGoalGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: FinancialGoalWhereInput;
    orderBy?: FinancialGoalOrderByWithAggregationInput | FinancialGoalOrderByWithAggregationInput[];
    by: FinancialGoalScalarFieldEnum[] | FinancialGoalScalarFieldEnum;
    having?: FinancialGoalScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FinancialGoalCountAggregateInputType | true;
    _avg?: FinancialGoalAvgAggregateInputType;
    _sum?: FinancialGoalSumAggregateInputType;
    _min?: FinancialGoalMinAggregateInputType;
    _max?: FinancialGoalMaxAggregateInputType;
  };

  export type FinancialGoalGroupByOutputType = {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    targetAmount: number;
    currentAmount: number;
    currency: string;
    deadline: Date | null;
    color: string;
    icon: string;
    isActive: boolean;
    isCompleted: boolean;
    isDemo: boolean;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: FinancialGoalCountAggregateOutputType | null;
    _avg: FinancialGoalAvgAggregateOutputType | null;
    _sum: FinancialGoalSumAggregateOutputType | null;
    _min: FinancialGoalMinAggregateOutputType | null;
    _max: FinancialGoalMaxAggregateOutputType | null;
  };

  type GetFinancialGoalGroupByPayload<T extends FinancialGoalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FinancialGoalGroupByOutputType, T['by']> & {
        [P in keyof T & keyof FinancialGoalGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], FinancialGoalGroupByOutputType[P]>
          : GetScalarType<T[P], FinancialGoalGroupByOutputType[P]>;
      }
    >
  >;

  export type FinancialGoalSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      name?: boolean;
      description?: boolean;
      targetAmount?: boolean;
      currentAmount?: boolean;
      currency?: boolean;
      deadline?: boolean;
      color?: boolean;
      icon?: boolean;
      isActive?: boolean;
      isCompleted?: boolean;
      isDemo?: boolean;
      completedAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['financialGoal']
  >;

  export type FinancialGoalSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      name?: boolean;
      description?: boolean;
      targetAmount?: boolean;
      currentAmount?: boolean;
      currency?: boolean;
      deadline?: boolean;
      color?: boolean;
      icon?: boolean;
      isActive?: boolean;
      isCompleted?: boolean;
      isDemo?: boolean;
      completedAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['financialGoal']
  >;

  export type FinancialGoalSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      name?: boolean;
      description?: boolean;
      targetAmount?: boolean;
      currentAmount?: boolean;
      currency?: boolean;
      deadline?: boolean;
      color?: boolean;
      icon?: boolean;
      isActive?: boolean;
      isCompleted?: boolean;
      isDemo?: boolean;
      completedAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['financialGoal']
  >;

  export type FinancialGoalSelectScalar = {
    id?: boolean;
    userId?: boolean;
    name?: boolean;
    description?: boolean;
    targetAmount?: boolean;
    currentAmount?: boolean;
    currency?: boolean;
    deadline?: boolean;
    color?: boolean;
    icon?: boolean;
    isActive?: boolean;
    isCompleted?: boolean;
    isDemo?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type FinancialGoalOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'name'
    | 'description'
    | 'targetAmount'
    | 'currentAmount'
    | 'currency'
    | 'deadline'
    | 'color'
    | 'icon'
    | 'isActive'
    | 'isCompleted'
    | 'isDemo'
    | 'completedAt'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['financialGoal']
  >;
  export type FinancialGoalInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type FinancialGoalIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type FinancialGoalIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $FinancialGoalPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'FinancialGoal';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        name: string;
        description: string | null;
        targetAmount: number;
        currentAmount: number;
        currency: string;
        deadline: Date | null;
        color: string;
        icon: string;
        isActive: boolean;
        isCompleted: boolean;
        isDemo: boolean;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['financialGoal']
    >;
    composites: {};
  };

  type FinancialGoalGetPayload<S extends boolean | null | undefined | FinancialGoalDefaultArgs> =
    $Result.GetResult<Prisma.$FinancialGoalPayload, S>;

  type FinancialGoalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FinancialGoalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FinancialGoalCountAggregateInputType | true;
    };

  export interface FinancialGoalDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['FinancialGoal'];
      meta: { name: 'FinancialGoal' };
    };
    /**
     * Find zero or one FinancialGoal that matches the filter.
     * @param {FinancialGoalFindUniqueArgs} args - Arguments to find a FinancialGoal
     * @example
     * // Get one FinancialGoal
     * const financialGoal = await prisma.financialGoal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FinancialGoalFindUniqueArgs>(
      args: SelectSubset<T, FinancialGoalFindUniqueArgs<ExtArgs>>,
    ): Prisma__FinancialGoalClient<
      $Result.GetResult<
        Prisma.$FinancialGoalPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one FinancialGoal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FinancialGoalFindUniqueOrThrowArgs} args - Arguments to find a FinancialGoal
     * @example
     * // Get one FinancialGoal
     * const financialGoal = await prisma.financialGoal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FinancialGoalFindUniqueOrThrowArgs>(
      args: SelectSubset<T, FinancialGoalFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__FinancialGoalClient<
      $Result.GetResult<
        Prisma.$FinancialGoalPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first FinancialGoal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancialGoalFindFirstArgs} args - Arguments to find a FinancialGoal
     * @example
     * // Get one FinancialGoal
     * const financialGoal = await prisma.financialGoal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FinancialGoalFindFirstArgs>(
      args?: SelectSubset<T, FinancialGoalFindFirstArgs<ExtArgs>>,
    ): Prisma__FinancialGoalClient<
      $Result.GetResult<
        Prisma.$FinancialGoalPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first FinancialGoal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancialGoalFindFirstOrThrowArgs} args - Arguments to find a FinancialGoal
     * @example
     * // Get one FinancialGoal
     * const financialGoal = await prisma.financialGoal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FinancialGoalFindFirstOrThrowArgs>(
      args?: SelectSubset<T, FinancialGoalFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__FinancialGoalClient<
      $Result.GetResult<
        Prisma.$FinancialGoalPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more FinancialGoals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancialGoalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FinancialGoals
     * const financialGoals = await prisma.financialGoal.findMany()
     *
     * // Get first 10 FinancialGoals
     * const financialGoals = await prisma.financialGoal.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const financialGoalWithIdOnly = await prisma.financialGoal.findMany({ select: { id: true } })
     *
     */
    findMany<T extends FinancialGoalFindManyArgs>(
      args?: SelectSubset<T, FinancialGoalFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$FinancialGoalPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a FinancialGoal.
     * @param {FinancialGoalCreateArgs} args - Arguments to create a FinancialGoal.
     * @example
     * // Create one FinancialGoal
     * const FinancialGoal = await prisma.financialGoal.create({
     *   data: {
     *     // ... data to create a FinancialGoal
     *   }
     * })
     *
     */
    create<T extends FinancialGoalCreateArgs>(
      args: SelectSubset<T, FinancialGoalCreateArgs<ExtArgs>>,
    ): Prisma__FinancialGoalClient<
      $Result.GetResult<Prisma.$FinancialGoalPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many FinancialGoals.
     * @param {FinancialGoalCreateManyArgs} args - Arguments to create many FinancialGoals.
     * @example
     * // Create many FinancialGoals
     * const financialGoal = await prisma.financialGoal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends FinancialGoalCreateManyArgs>(
      args?: SelectSubset<T, FinancialGoalCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many FinancialGoals and returns the data saved in the database.
     * @param {FinancialGoalCreateManyAndReturnArgs} args - Arguments to create many FinancialGoals.
     * @example
     * // Create many FinancialGoals
     * const financialGoal = await prisma.financialGoal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many FinancialGoals and only return the `id`
     * const financialGoalWithIdOnly = await prisma.financialGoal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends FinancialGoalCreateManyAndReturnArgs>(
      args?: SelectSubset<T, FinancialGoalCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$FinancialGoalPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a FinancialGoal.
     * @param {FinancialGoalDeleteArgs} args - Arguments to delete one FinancialGoal.
     * @example
     * // Delete one FinancialGoal
     * const FinancialGoal = await prisma.financialGoal.delete({
     *   where: {
     *     // ... filter to delete one FinancialGoal
     *   }
     * })
     *
     */
    delete<T extends FinancialGoalDeleteArgs>(
      args: SelectSubset<T, FinancialGoalDeleteArgs<ExtArgs>>,
    ): Prisma__FinancialGoalClient<
      $Result.GetResult<Prisma.$FinancialGoalPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one FinancialGoal.
     * @param {FinancialGoalUpdateArgs} args - Arguments to update one FinancialGoal.
     * @example
     * // Update one FinancialGoal
     * const financialGoal = await prisma.financialGoal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends FinancialGoalUpdateArgs>(
      args: SelectSubset<T, FinancialGoalUpdateArgs<ExtArgs>>,
    ): Prisma__FinancialGoalClient<
      $Result.GetResult<Prisma.$FinancialGoalPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more FinancialGoals.
     * @param {FinancialGoalDeleteManyArgs} args - Arguments to filter FinancialGoals to delete.
     * @example
     * // Delete a few FinancialGoals
     * const { count } = await prisma.financialGoal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends FinancialGoalDeleteManyArgs>(
      args?: SelectSubset<T, FinancialGoalDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more FinancialGoals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancialGoalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FinancialGoals
     * const financialGoal = await prisma.financialGoal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends FinancialGoalUpdateManyArgs>(
      args: SelectSubset<T, FinancialGoalUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more FinancialGoals and returns the data updated in the database.
     * @param {FinancialGoalUpdateManyAndReturnArgs} args - Arguments to update many FinancialGoals.
     * @example
     * // Update many FinancialGoals
     * const financialGoal = await prisma.financialGoal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more FinancialGoals and only return the `id`
     * const financialGoalWithIdOnly = await prisma.financialGoal.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends FinancialGoalUpdateManyAndReturnArgs>(
      args: SelectSubset<T, FinancialGoalUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$FinancialGoalPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one FinancialGoal.
     * @param {FinancialGoalUpsertArgs} args - Arguments to update or create a FinancialGoal.
     * @example
     * // Update or create a FinancialGoal
     * const financialGoal = await prisma.financialGoal.upsert({
     *   create: {
     *     // ... data to create a FinancialGoal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FinancialGoal we want to update
     *   }
     * })
     */
    upsert<T extends FinancialGoalUpsertArgs>(
      args: SelectSubset<T, FinancialGoalUpsertArgs<ExtArgs>>,
    ): Prisma__FinancialGoalClient<
      $Result.GetResult<Prisma.$FinancialGoalPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of FinancialGoals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancialGoalCountArgs} args - Arguments to filter FinancialGoals to count.
     * @example
     * // Count the number of FinancialGoals
     * const count = await prisma.financialGoal.count({
     *   where: {
     *     // ... the filter for the FinancialGoals we want to count
     *   }
     * })
     **/
    count<T extends FinancialGoalCountArgs>(
      args?: Subset<T, FinancialGoalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FinancialGoalCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a FinancialGoal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancialGoalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends FinancialGoalAggregateArgs>(
      args: Subset<T, FinancialGoalAggregateArgs>,
    ): Prisma.PrismaPromise<GetFinancialGoalAggregateType<T>>;

    /**
     * Group by FinancialGoal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancialGoalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends FinancialGoalGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FinancialGoalGroupByArgs['orderBy'] }
        : { orderBy?: FinancialGoalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, FinancialGoalGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetFinancialGoalGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the FinancialGoal model
     */
    readonly fields: FinancialGoalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FinancialGoal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FinancialGoalClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the FinancialGoal model
   */
  interface FinancialGoalFieldRefs {
    readonly id: FieldRef<'FinancialGoal', 'String'>;
    readonly userId: FieldRef<'FinancialGoal', 'String'>;
    readonly name: FieldRef<'FinancialGoal', 'String'>;
    readonly description: FieldRef<'FinancialGoal', 'String'>;
    readonly targetAmount: FieldRef<'FinancialGoal', 'Float'>;
    readonly currentAmount: FieldRef<'FinancialGoal', 'Float'>;
    readonly currency: FieldRef<'FinancialGoal', 'String'>;
    readonly deadline: FieldRef<'FinancialGoal', 'DateTime'>;
    readonly color: FieldRef<'FinancialGoal', 'String'>;
    readonly icon: FieldRef<'FinancialGoal', 'String'>;
    readonly isActive: FieldRef<'FinancialGoal', 'Boolean'>;
    readonly isCompleted: FieldRef<'FinancialGoal', 'Boolean'>;
    readonly isDemo: FieldRef<'FinancialGoal', 'Boolean'>;
    readonly completedAt: FieldRef<'FinancialGoal', 'DateTime'>;
    readonly createdAt: FieldRef<'FinancialGoal', 'DateTime'>;
    readonly updatedAt: FieldRef<'FinancialGoal', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * FinancialGoal findUnique
   */
  export type FinancialGoalFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalInclude<ExtArgs> | null;
    /**
     * Filter, which FinancialGoal to fetch.
     */
    where: FinancialGoalWhereUniqueInput;
  };

  /**
   * FinancialGoal findUniqueOrThrow
   */
  export type FinancialGoalFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalInclude<ExtArgs> | null;
    /**
     * Filter, which FinancialGoal to fetch.
     */
    where: FinancialGoalWhereUniqueInput;
  };

  /**
   * FinancialGoal findFirst
   */
  export type FinancialGoalFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalInclude<ExtArgs> | null;
    /**
     * Filter, which FinancialGoal to fetch.
     */
    where?: FinancialGoalWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FinancialGoals to fetch.
     */
    orderBy?: FinancialGoalOrderByWithRelationInput | FinancialGoalOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FinancialGoals.
     */
    cursor?: FinancialGoalWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FinancialGoals from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FinancialGoals.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FinancialGoals.
     */
    distinct?: FinancialGoalScalarFieldEnum | FinancialGoalScalarFieldEnum[];
  };

  /**
   * FinancialGoal findFirstOrThrow
   */
  export type FinancialGoalFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalInclude<ExtArgs> | null;
    /**
     * Filter, which FinancialGoal to fetch.
     */
    where?: FinancialGoalWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FinancialGoals to fetch.
     */
    orderBy?: FinancialGoalOrderByWithRelationInput | FinancialGoalOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FinancialGoals.
     */
    cursor?: FinancialGoalWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FinancialGoals from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FinancialGoals.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FinancialGoals.
     */
    distinct?: FinancialGoalScalarFieldEnum | FinancialGoalScalarFieldEnum[];
  };

  /**
   * FinancialGoal findMany
   */
  export type FinancialGoalFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalInclude<ExtArgs> | null;
    /**
     * Filter, which FinancialGoals to fetch.
     */
    where?: FinancialGoalWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FinancialGoals to fetch.
     */
    orderBy?: FinancialGoalOrderByWithRelationInput | FinancialGoalOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing FinancialGoals.
     */
    cursor?: FinancialGoalWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FinancialGoals from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FinancialGoals.
     */
    skip?: number;
    distinct?: FinancialGoalScalarFieldEnum | FinancialGoalScalarFieldEnum[];
  };

  /**
   * FinancialGoal create
   */
  export type FinancialGoalCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalInclude<ExtArgs> | null;
    /**
     * The data needed to create a FinancialGoal.
     */
    data: XOR<FinancialGoalCreateInput, FinancialGoalUncheckedCreateInput>;
  };

  /**
   * FinancialGoal createMany
   */
  export type FinancialGoalCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many FinancialGoals.
     */
    data: FinancialGoalCreateManyInput | FinancialGoalCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * FinancialGoal createManyAndReturn
   */
  export type FinancialGoalCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * The data used to create many FinancialGoals.
     */
    data: FinancialGoalCreateManyInput | FinancialGoalCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * FinancialGoal update
   */
  export type FinancialGoalUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalInclude<ExtArgs> | null;
    /**
     * The data needed to update a FinancialGoal.
     */
    data: XOR<FinancialGoalUpdateInput, FinancialGoalUncheckedUpdateInput>;
    /**
     * Choose, which FinancialGoal to update.
     */
    where: FinancialGoalWhereUniqueInput;
  };

  /**
   * FinancialGoal updateMany
   */
  export type FinancialGoalUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update FinancialGoals.
     */
    data: XOR<FinancialGoalUpdateManyMutationInput, FinancialGoalUncheckedUpdateManyInput>;
    /**
     * Filter which FinancialGoals to update
     */
    where?: FinancialGoalWhereInput;
    /**
     * Limit how many FinancialGoals to update.
     */
    limit?: number;
  };

  /**
   * FinancialGoal updateManyAndReturn
   */
  export type FinancialGoalUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * The data used to update FinancialGoals.
     */
    data: XOR<FinancialGoalUpdateManyMutationInput, FinancialGoalUncheckedUpdateManyInput>;
    /**
     * Filter which FinancialGoals to update
     */
    where?: FinancialGoalWhereInput;
    /**
     * Limit how many FinancialGoals to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * FinancialGoal upsert
   */
  export type FinancialGoalUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalInclude<ExtArgs> | null;
    /**
     * The filter to search for the FinancialGoal to update in case it exists.
     */
    where: FinancialGoalWhereUniqueInput;
    /**
     * In case the FinancialGoal found by the `where` argument doesn't exist, create a new FinancialGoal with this data.
     */
    create: XOR<FinancialGoalCreateInput, FinancialGoalUncheckedCreateInput>;
    /**
     * In case the FinancialGoal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FinancialGoalUpdateInput, FinancialGoalUncheckedUpdateInput>;
  };

  /**
   * FinancialGoal delete
   */
  export type FinancialGoalDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalInclude<ExtArgs> | null;
    /**
     * Filter which FinancialGoal to delete.
     */
    where: FinancialGoalWhereUniqueInput;
  };

  /**
   * FinancialGoal deleteMany
   */
  export type FinancialGoalDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which FinancialGoals to delete
     */
    where?: FinancialGoalWhereInput;
    /**
     * Limit how many FinancialGoals to delete.
     */
    limit?: number;
  };

  /**
   * FinancialGoal without action
   */
  export type FinancialGoalDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the FinancialGoal
     */
    select?: FinancialGoalSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FinancialGoal
     */
    omit?: FinancialGoalOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancialGoalInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const UserScalarFieldEnum: {
    id: 'id';
    email: 'email';
    password: 'password';
    createdAt: 'createdAt';
    defaultCategory: 'defaultCategory';
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

  export const CategoryScalarFieldEnum: {
    id: 'id';
    name: 'name';
    userId: 'userId';
    createdAt: 'createdAt';
  };

  export type CategoryScalarFieldEnum =
    (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];

  export const TradeScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    categoryId: 'categoryId';
    date: 'date';
    symbol: 'symbol';
    side: 'side';
    entryPrice: 'entryPrice';
    positionSize: 'positionSize';
    stopLoss: 'stopLoss';
    exitPrice: 'exitPrice';
    commission: 'commission';
    riskPercent: 'riskPercent';
    pnl: 'pnl';
    result: 'result';
    leverage: 'leverage';
    investment: 'investment';
    createdAt: 'createdAt';
    deposit: 'deposit';
    isDemo: 'isDemo';
    comment: 'comment';
  };

  export type TradeScalarFieldEnum =
    (typeof TradeScalarFieldEnum)[keyof typeof TradeScalarFieldEnum];

  export const ScreenshotScalarFieldEnum: {
    id: 'id';
    tradeId: 'tradeId';
    imageData: 'imageData';
    createdAt: 'createdAt';
    order: 'order';
  };

  export type ScreenshotScalarFieldEnum =
    (typeof ScreenshotScalarFieldEnum)[keyof typeof ScreenshotScalarFieldEnum];

  export const FinanceAccountScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    name: 'name';
    type: 'type';
    currency: 'currency';
    balance: 'balance';
    isActive: 'isActive';
    isDemo: 'isDemo';
    color: 'color';
    icon: 'icon';
    description: 'description';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type FinanceAccountScalarFieldEnum =
    (typeof FinanceAccountScalarFieldEnum)[keyof typeof FinanceAccountScalarFieldEnum];

  export const TransactionScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    accountId: 'accountId';
    categoryId: 'categoryId';
    type: 'type';
    amount: 'amount';
    currency: 'currency';
    description: 'description';
    date: 'date';
    tags: 'tags';
    isDemo: 'isDemo';
    transferToId: 'transferToId';
    isRecurring: 'isRecurring';
    recurringPattern: 'recurringPattern';
    parentTransactionId: 'parentTransactionId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type TransactionScalarFieldEnum =
    (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum];

  export const TransactionCategoryScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    name: 'name';
    type: 'type';
    parentId: 'parentId';
    color: 'color';
    icon: 'icon';
    isDefault: 'isDefault';
    isActive: 'isActive';
    isDemo: 'isDemo';
    createdAt: 'createdAt';
  };

  export type TransactionCategoryScalarFieldEnum =
    (typeof TransactionCategoryScalarFieldEnum)[keyof typeof TransactionCategoryScalarFieldEnum];

  export const BudgetScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    name: 'name';
    period: 'period';
    startDate: 'startDate';
    endDate: 'endDate';
    currency: 'currency';
    totalPlanned: 'totalPlanned';
    totalActual: 'totalActual';
    isActive: 'isActive';
    isDemo: 'isDemo';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type BudgetScalarFieldEnum =
    (typeof BudgetScalarFieldEnum)[keyof typeof BudgetScalarFieldEnum];

  export const BudgetCategoryScalarFieldEnum: {
    id: 'id';
    budgetId: 'budgetId';
    categoryId: 'categoryId';
    planned: 'planned';
    actual: 'actual';
  };

  export type BudgetCategoryScalarFieldEnum =
    (typeof BudgetCategoryScalarFieldEnum)[keyof typeof BudgetCategoryScalarFieldEnum];

  export const FinancialGoalScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    name: 'name';
    description: 'description';
    targetAmount: 'targetAmount';
    currentAmount: 'currentAmount';
    currency: 'currency';
    deadline: 'deadline';
    color: 'color';
    icon: 'icon';
    isActive: 'isActive';
    isCompleted: 'isCompleted';
    isDemo: 'isDemo';
    completedAt: 'completedAt';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type FinancialGoalScalarFieldEnum =
    (typeof FinancialGoalScalarFieldEnum)[keyof typeof FinancialGoalScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;

  /**
   * Reference to a field of type 'TradeSide'
   */
  export type EnumTradeSideFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'TradeSide'
  >;

  /**
   * Reference to a field of type 'TradeSide[]'
   */
  export type ListEnumTradeSideFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'TradeSide[]'
  >;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;

  /**
   * Reference to a field of type 'TradeResult'
   */
  export type EnumTradeResultFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'TradeResult'
  >;

  /**
   * Reference to a field of type 'TradeResult[]'
   */
  export type ListEnumTradeResultFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'TradeResult[]'
  >;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;

  /**
   * Reference to a field of type 'AccountType'
   */
  export type EnumAccountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'AccountType'
  >;

  /**
   * Reference to a field of type 'AccountType[]'
   */
  export type ListEnumAccountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'AccountType[]'
  >;

  /**
   * Reference to a field of type 'TransactionType'
   */
  export type EnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'TransactionType'
  >;

  /**
   * Reference to a field of type 'TransactionType[]'
   */
  export type ListEnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'TransactionType[]'
  >;

  /**
   * Reference to a field of type 'RecurringPattern'
   */
  export type EnumRecurringPatternFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'RecurringPattern'
  >;

  /**
   * Reference to a field of type 'RecurringPattern[]'
   */
  export type ListEnumRecurringPatternFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'RecurringPattern[]'
  >;

  /**
   * Reference to a field of type 'BudgetPeriod'
   */
  export type EnumBudgetPeriodFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'BudgetPeriod'
  >;

  /**
   * Reference to a field of type 'BudgetPeriod[]'
   */
  export type ListEnumBudgetPeriodFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'BudgetPeriod[]'
  >;

  /**
   * Deep Input Types
   */

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[];
    OR?: UserWhereInput[];
    NOT?: UserWhereInput | UserWhereInput[];
    id?: StringFilter<'User'> | string;
    email?: StringFilter<'User'> | string;
    password?: StringFilter<'User'> | string;
    createdAt?: DateTimeFilter<'User'> | Date | string;
    defaultCategory?: StringFilter<'User'> | string;
    trades?: TradeListRelationFilter;
    categories?: CategoryListRelationFilter;
    financeAccounts?: FinanceAccountListRelationFilter;
    transactions?: TransactionListRelationFilter;
    transactionCategories?: TransactionCategoryListRelationFilter;
    budgets?: BudgetListRelationFilter;
    financialGoals?: FinancialGoalListRelationFilter;
  };

  export type UserOrderByWithRelationInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    createdAt?: SortOrder;
    defaultCategory?: SortOrder;
    trades?: TradeOrderByRelationAggregateInput;
    categories?: CategoryOrderByRelationAggregateInput;
    financeAccounts?: FinanceAccountOrderByRelationAggregateInput;
    transactions?: TransactionOrderByRelationAggregateInput;
    transactionCategories?: TransactionCategoryOrderByRelationAggregateInput;
    budgets?: BudgetOrderByRelationAggregateInput;
    financialGoals?: FinancialGoalOrderByRelationAggregateInput;
  };

  export type UserWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email?: string;
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      password?: StringFilter<'User'> | string;
      createdAt?: DateTimeFilter<'User'> | Date | string;
      defaultCategory?: StringFilter<'User'> | string;
      trades?: TradeListRelationFilter;
      categories?: CategoryListRelationFilter;
      financeAccounts?: FinanceAccountListRelationFilter;
      transactions?: TransactionListRelationFilter;
      transactionCategories?: TransactionCategoryListRelationFilter;
      budgets?: BudgetListRelationFilter;
      financialGoals?: FinancialGoalListRelationFilter;
    },
    'id' | 'email'
  >;

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    createdAt?: SortOrder;
    defaultCategory?: SortOrder;
    _count?: UserCountOrderByAggregateInput;
    _max?: UserMaxOrderByAggregateInput;
    _min?: UserMinOrderByAggregateInput;
  };

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
    OR?: UserScalarWhereWithAggregatesInput[];
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'User'> | string;
    email?: StringWithAggregatesFilter<'User'> | string;
    password?: StringWithAggregatesFilter<'User'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
    defaultCategory?: StringWithAggregatesFilter<'User'> | string;
  };

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[];
    OR?: CategoryWhereInput[];
    NOT?: CategoryWhereInput | CategoryWhereInput[];
    id?: StringFilter<'Category'> | string;
    name?: StringFilter<'Category'> | string;
    userId?: StringFilter<'Category'> | string;
    createdAt?: DateTimeFilter<'Category'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    trades?: TradeListRelationFilter;
  };

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    trades?: TradeOrderByRelationAggregateInput;
  };

  export type CategoryWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_name?: CategoryUserIdNameCompoundUniqueInput;
      AND?: CategoryWhereInput | CategoryWhereInput[];
      OR?: CategoryWhereInput[];
      NOT?: CategoryWhereInput | CategoryWhereInput[];
      name?: StringFilter<'Category'> | string;
      userId?: StringFilter<'Category'> | string;
      createdAt?: DateTimeFilter<'Category'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      trades?: TradeListRelationFilter;
    },
    'id' | 'userId_name'
  >;

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    _count?: CategoryCountOrderByAggregateInput;
    _max?: CategoryMaxOrderByAggregateInput;
    _min?: CategoryMinOrderByAggregateInput;
  };

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[];
    OR?: CategoryScalarWhereWithAggregatesInput[];
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Category'> | string;
    name?: StringWithAggregatesFilter<'Category'> | string;
    userId?: StringWithAggregatesFilter<'Category'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Category'> | Date | string;
  };

  export type TradeWhereInput = {
    AND?: TradeWhereInput | TradeWhereInput[];
    OR?: TradeWhereInput[];
    NOT?: TradeWhereInput | TradeWhereInput[];
    id?: StringFilter<'Trade'> | string;
    userId?: StringFilter<'Trade'> | string;
    categoryId?: StringFilter<'Trade'> | string;
    date?: DateTimeFilter<'Trade'> | Date | string;
    symbol?: StringFilter<'Trade'> | string;
    side?: EnumTradeSideFilter<'Trade'> | $Enums.TradeSide;
    entryPrice?: FloatFilter<'Trade'> | number;
    positionSize?: FloatFilter<'Trade'> | number;
    stopLoss?: FloatFilter<'Trade'> | number;
    exitPrice?: FloatFilter<'Trade'> | number;
    commission?: FloatFilter<'Trade'> | number;
    riskPercent?: FloatFilter<'Trade'> | number;
    pnl?: FloatFilter<'Trade'> | number;
    result?: EnumTradeResultFilter<'Trade'> | $Enums.TradeResult;
    leverage?: FloatNullableFilter<'Trade'> | number | null;
    investment?: FloatNullableFilter<'Trade'> | number | null;
    createdAt?: DateTimeFilter<'Trade'> | Date | string;
    deposit?: FloatFilter<'Trade'> | number;
    isDemo?: BoolFilter<'Trade'> | boolean;
    comment?: StringNullableFilter<'Trade'> | string | null;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>;
    screenshots?: ScreenshotListRelationFilter;
  };

  export type TradeOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    categoryId?: SortOrder;
    date?: SortOrder;
    symbol?: SortOrder;
    side?: SortOrder;
    entryPrice?: SortOrder;
    positionSize?: SortOrder;
    stopLoss?: SortOrder;
    exitPrice?: SortOrder;
    commission?: SortOrder;
    riskPercent?: SortOrder;
    pnl?: SortOrder;
    result?: SortOrder;
    leverage?: SortOrderInput | SortOrder;
    investment?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    deposit?: SortOrder;
    isDemo?: SortOrder;
    comment?: SortOrderInput | SortOrder;
    user?: UserOrderByWithRelationInput;
    category?: CategoryOrderByWithRelationInput;
    screenshots?: ScreenshotOrderByRelationAggregateInput;
  };

  export type TradeWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: TradeWhereInput | TradeWhereInput[];
      OR?: TradeWhereInput[];
      NOT?: TradeWhereInput | TradeWhereInput[];
      userId?: StringFilter<'Trade'> | string;
      categoryId?: StringFilter<'Trade'> | string;
      date?: DateTimeFilter<'Trade'> | Date | string;
      symbol?: StringFilter<'Trade'> | string;
      side?: EnumTradeSideFilter<'Trade'> | $Enums.TradeSide;
      entryPrice?: FloatFilter<'Trade'> | number;
      positionSize?: FloatFilter<'Trade'> | number;
      stopLoss?: FloatFilter<'Trade'> | number;
      exitPrice?: FloatFilter<'Trade'> | number;
      commission?: FloatFilter<'Trade'> | number;
      riskPercent?: FloatFilter<'Trade'> | number;
      pnl?: FloatFilter<'Trade'> | number;
      result?: EnumTradeResultFilter<'Trade'> | $Enums.TradeResult;
      leverage?: FloatNullableFilter<'Trade'> | number | null;
      investment?: FloatNullableFilter<'Trade'> | number | null;
      createdAt?: DateTimeFilter<'Trade'> | Date | string;
      deposit?: FloatFilter<'Trade'> | number;
      isDemo?: BoolFilter<'Trade'> | boolean;
      comment?: StringNullableFilter<'Trade'> | string | null;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>;
      screenshots?: ScreenshotListRelationFilter;
    },
    'id'
  >;

  export type TradeOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    categoryId?: SortOrder;
    date?: SortOrder;
    symbol?: SortOrder;
    side?: SortOrder;
    entryPrice?: SortOrder;
    positionSize?: SortOrder;
    stopLoss?: SortOrder;
    exitPrice?: SortOrder;
    commission?: SortOrder;
    riskPercent?: SortOrder;
    pnl?: SortOrder;
    result?: SortOrder;
    leverage?: SortOrderInput | SortOrder;
    investment?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    deposit?: SortOrder;
    isDemo?: SortOrder;
    comment?: SortOrderInput | SortOrder;
    _count?: TradeCountOrderByAggregateInput;
    _avg?: TradeAvgOrderByAggregateInput;
    _max?: TradeMaxOrderByAggregateInput;
    _min?: TradeMinOrderByAggregateInput;
    _sum?: TradeSumOrderByAggregateInput;
  };

  export type TradeScalarWhereWithAggregatesInput = {
    AND?: TradeScalarWhereWithAggregatesInput | TradeScalarWhereWithAggregatesInput[];
    OR?: TradeScalarWhereWithAggregatesInput[];
    NOT?: TradeScalarWhereWithAggregatesInput | TradeScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Trade'> | string;
    userId?: StringWithAggregatesFilter<'Trade'> | string;
    categoryId?: StringWithAggregatesFilter<'Trade'> | string;
    date?: DateTimeWithAggregatesFilter<'Trade'> | Date | string;
    symbol?: StringWithAggregatesFilter<'Trade'> | string;
    side?: EnumTradeSideWithAggregatesFilter<'Trade'> | $Enums.TradeSide;
    entryPrice?: FloatWithAggregatesFilter<'Trade'> | number;
    positionSize?: FloatWithAggregatesFilter<'Trade'> | number;
    stopLoss?: FloatWithAggregatesFilter<'Trade'> | number;
    exitPrice?: FloatWithAggregatesFilter<'Trade'> | number;
    commission?: FloatWithAggregatesFilter<'Trade'> | number;
    riskPercent?: FloatWithAggregatesFilter<'Trade'> | number;
    pnl?: FloatWithAggregatesFilter<'Trade'> | number;
    result?: EnumTradeResultWithAggregatesFilter<'Trade'> | $Enums.TradeResult;
    leverage?: FloatNullableWithAggregatesFilter<'Trade'> | number | null;
    investment?: FloatNullableWithAggregatesFilter<'Trade'> | number | null;
    createdAt?: DateTimeWithAggregatesFilter<'Trade'> | Date | string;
    deposit?: FloatWithAggregatesFilter<'Trade'> | number;
    isDemo?: BoolWithAggregatesFilter<'Trade'> | boolean;
    comment?: StringNullableWithAggregatesFilter<'Trade'> | string | null;
  };

  export type ScreenshotWhereInput = {
    AND?: ScreenshotWhereInput | ScreenshotWhereInput[];
    OR?: ScreenshotWhereInput[];
    NOT?: ScreenshotWhereInput | ScreenshotWhereInput[];
    id?: StringFilter<'Screenshot'> | string;
    tradeId?: StringFilter<'Screenshot'> | string;
    imageData?: StringFilter<'Screenshot'> | string;
    createdAt?: DateTimeFilter<'Screenshot'> | Date | string;
    order?: IntFilter<'Screenshot'> | number;
    trade?: XOR<TradeScalarRelationFilter, TradeWhereInput>;
  };

  export type ScreenshotOrderByWithRelationInput = {
    id?: SortOrder;
    tradeId?: SortOrder;
    imageData?: SortOrder;
    createdAt?: SortOrder;
    order?: SortOrder;
    trade?: TradeOrderByWithRelationInput;
  };

  export type ScreenshotWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: ScreenshotWhereInput | ScreenshotWhereInput[];
      OR?: ScreenshotWhereInput[];
      NOT?: ScreenshotWhereInput | ScreenshotWhereInput[];
      tradeId?: StringFilter<'Screenshot'> | string;
      imageData?: StringFilter<'Screenshot'> | string;
      createdAt?: DateTimeFilter<'Screenshot'> | Date | string;
      order?: IntFilter<'Screenshot'> | number;
      trade?: XOR<TradeScalarRelationFilter, TradeWhereInput>;
    },
    'id'
  >;

  export type ScreenshotOrderByWithAggregationInput = {
    id?: SortOrder;
    tradeId?: SortOrder;
    imageData?: SortOrder;
    createdAt?: SortOrder;
    order?: SortOrder;
    _count?: ScreenshotCountOrderByAggregateInput;
    _avg?: ScreenshotAvgOrderByAggregateInput;
    _max?: ScreenshotMaxOrderByAggregateInput;
    _min?: ScreenshotMinOrderByAggregateInput;
    _sum?: ScreenshotSumOrderByAggregateInput;
  };

  export type ScreenshotScalarWhereWithAggregatesInput = {
    AND?: ScreenshotScalarWhereWithAggregatesInput | ScreenshotScalarWhereWithAggregatesInput[];
    OR?: ScreenshotScalarWhereWithAggregatesInput[];
    NOT?: ScreenshotScalarWhereWithAggregatesInput | ScreenshotScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Screenshot'> | string;
    tradeId?: StringWithAggregatesFilter<'Screenshot'> | string;
    imageData?: StringWithAggregatesFilter<'Screenshot'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Screenshot'> | Date | string;
    order?: IntWithAggregatesFilter<'Screenshot'> | number;
  };

  export type FinanceAccountWhereInput = {
    AND?: FinanceAccountWhereInput | FinanceAccountWhereInput[];
    OR?: FinanceAccountWhereInput[];
    NOT?: FinanceAccountWhereInput | FinanceAccountWhereInput[];
    id?: StringFilter<'FinanceAccount'> | string;
    userId?: StringFilter<'FinanceAccount'> | string;
    name?: StringFilter<'FinanceAccount'> | string;
    type?: EnumAccountTypeFilter<'FinanceAccount'> | $Enums.AccountType;
    currency?: StringFilter<'FinanceAccount'> | string;
    balance?: FloatFilter<'FinanceAccount'> | number;
    isActive?: BoolFilter<'FinanceAccount'> | boolean;
    isDemo?: BoolFilter<'FinanceAccount'> | boolean;
    color?: StringNullableFilter<'FinanceAccount'> | string | null;
    icon?: StringNullableFilter<'FinanceAccount'> | string | null;
    description?: StringNullableFilter<'FinanceAccount'> | string | null;
    createdAt?: DateTimeFilter<'FinanceAccount'> | Date | string;
    updatedAt?: DateTimeFilter<'FinanceAccount'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    transactions?: TransactionListRelationFilter;
    transfersTo?: TransactionListRelationFilter;
  };

  export type FinanceAccountOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    currency?: SortOrder;
    balance?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    color?: SortOrderInput | SortOrder;
    icon?: SortOrderInput | SortOrder;
    description?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    transactions?: TransactionOrderByRelationAggregateInput;
    transfersTo?: TransactionOrderByRelationAggregateInput;
  };

  export type FinanceAccountWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_name?: FinanceAccountUserIdNameCompoundUniqueInput;
      AND?: FinanceAccountWhereInput | FinanceAccountWhereInput[];
      OR?: FinanceAccountWhereInput[];
      NOT?: FinanceAccountWhereInput | FinanceAccountWhereInput[];
      userId?: StringFilter<'FinanceAccount'> | string;
      name?: StringFilter<'FinanceAccount'> | string;
      type?: EnumAccountTypeFilter<'FinanceAccount'> | $Enums.AccountType;
      currency?: StringFilter<'FinanceAccount'> | string;
      balance?: FloatFilter<'FinanceAccount'> | number;
      isActive?: BoolFilter<'FinanceAccount'> | boolean;
      isDemo?: BoolFilter<'FinanceAccount'> | boolean;
      color?: StringNullableFilter<'FinanceAccount'> | string | null;
      icon?: StringNullableFilter<'FinanceAccount'> | string | null;
      description?: StringNullableFilter<'FinanceAccount'> | string | null;
      createdAt?: DateTimeFilter<'FinanceAccount'> | Date | string;
      updatedAt?: DateTimeFilter<'FinanceAccount'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      transactions?: TransactionListRelationFilter;
      transfersTo?: TransactionListRelationFilter;
    },
    'id' | 'userId_name'
  >;

  export type FinanceAccountOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    currency?: SortOrder;
    balance?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    color?: SortOrderInput | SortOrder;
    icon?: SortOrderInput | SortOrder;
    description?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: FinanceAccountCountOrderByAggregateInput;
    _avg?: FinanceAccountAvgOrderByAggregateInput;
    _max?: FinanceAccountMaxOrderByAggregateInput;
    _min?: FinanceAccountMinOrderByAggregateInput;
    _sum?: FinanceAccountSumOrderByAggregateInput;
  };

  export type FinanceAccountScalarWhereWithAggregatesInput = {
    AND?:
      | FinanceAccountScalarWhereWithAggregatesInput
      | FinanceAccountScalarWhereWithAggregatesInput[];
    OR?: FinanceAccountScalarWhereWithAggregatesInput[];
    NOT?:
      | FinanceAccountScalarWhereWithAggregatesInput
      | FinanceAccountScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'FinanceAccount'> | string;
    userId?: StringWithAggregatesFilter<'FinanceAccount'> | string;
    name?: StringWithAggregatesFilter<'FinanceAccount'> | string;
    type?: EnumAccountTypeWithAggregatesFilter<'FinanceAccount'> | $Enums.AccountType;
    currency?: StringWithAggregatesFilter<'FinanceAccount'> | string;
    balance?: FloatWithAggregatesFilter<'FinanceAccount'> | number;
    isActive?: BoolWithAggregatesFilter<'FinanceAccount'> | boolean;
    isDemo?: BoolWithAggregatesFilter<'FinanceAccount'> | boolean;
    color?: StringNullableWithAggregatesFilter<'FinanceAccount'> | string | null;
    icon?: StringNullableWithAggregatesFilter<'FinanceAccount'> | string | null;
    description?: StringNullableWithAggregatesFilter<'FinanceAccount'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'FinanceAccount'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'FinanceAccount'> | Date | string;
  };

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[];
    OR?: TransactionWhereInput[];
    NOT?: TransactionWhereInput | TransactionWhereInput[];
    id?: StringFilter<'Transaction'> | string;
    userId?: StringFilter<'Transaction'> | string;
    accountId?: StringFilter<'Transaction'> | string;
    categoryId?: StringFilter<'Transaction'> | string;
    type?: EnumTransactionTypeFilter<'Transaction'> | $Enums.TransactionType;
    amount?: FloatFilter<'Transaction'> | number;
    currency?: StringFilter<'Transaction'> | string;
    description?: StringNullableFilter<'Transaction'> | string | null;
    date?: DateTimeFilter<'Transaction'> | Date | string;
    tags?: StringNullableListFilter<'Transaction'>;
    isDemo?: BoolFilter<'Transaction'> | boolean;
    transferToId?: StringNullableFilter<'Transaction'> | string | null;
    isRecurring?: BoolFilter<'Transaction'> | boolean;
    recurringPattern?:
      | EnumRecurringPatternNullableFilter<'Transaction'>
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: StringNullableFilter<'Transaction'> | string | null;
    createdAt?: DateTimeFilter<'Transaction'> | Date | string;
    updatedAt?: DateTimeFilter<'Transaction'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    account?: XOR<FinanceAccountScalarRelationFilter, FinanceAccountWhereInput>;
    category?: XOR<TransactionCategoryScalarRelationFilter, TransactionCategoryWhereInput>;
    transferTo?: XOR<FinanceAccountNullableScalarRelationFilter, FinanceAccountWhereInput> | null;
  };

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    accountId?: SortOrder;
    categoryId?: SortOrder;
    type?: SortOrder;
    amount?: SortOrder;
    currency?: SortOrder;
    description?: SortOrderInput | SortOrder;
    date?: SortOrder;
    tags?: SortOrder;
    isDemo?: SortOrder;
    transferToId?: SortOrderInput | SortOrder;
    isRecurring?: SortOrder;
    recurringPattern?: SortOrderInput | SortOrder;
    parentTransactionId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    account?: FinanceAccountOrderByWithRelationInput;
    category?: TransactionCategoryOrderByWithRelationInput;
    transferTo?: FinanceAccountOrderByWithRelationInput;
  };

  export type TransactionWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: TransactionWhereInput | TransactionWhereInput[];
      OR?: TransactionWhereInput[];
      NOT?: TransactionWhereInput | TransactionWhereInput[];
      userId?: StringFilter<'Transaction'> | string;
      accountId?: StringFilter<'Transaction'> | string;
      categoryId?: StringFilter<'Transaction'> | string;
      type?: EnumTransactionTypeFilter<'Transaction'> | $Enums.TransactionType;
      amount?: FloatFilter<'Transaction'> | number;
      currency?: StringFilter<'Transaction'> | string;
      description?: StringNullableFilter<'Transaction'> | string | null;
      date?: DateTimeFilter<'Transaction'> | Date | string;
      tags?: StringNullableListFilter<'Transaction'>;
      isDemo?: BoolFilter<'Transaction'> | boolean;
      transferToId?: StringNullableFilter<'Transaction'> | string | null;
      isRecurring?: BoolFilter<'Transaction'> | boolean;
      recurringPattern?:
        | EnumRecurringPatternNullableFilter<'Transaction'>
        | $Enums.RecurringPattern
        | null;
      parentTransactionId?: StringNullableFilter<'Transaction'> | string | null;
      createdAt?: DateTimeFilter<'Transaction'> | Date | string;
      updatedAt?: DateTimeFilter<'Transaction'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      account?: XOR<FinanceAccountScalarRelationFilter, FinanceAccountWhereInput>;
      category?: XOR<TransactionCategoryScalarRelationFilter, TransactionCategoryWhereInput>;
      transferTo?: XOR<FinanceAccountNullableScalarRelationFilter, FinanceAccountWhereInput> | null;
    },
    'id'
  >;

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    accountId?: SortOrder;
    categoryId?: SortOrder;
    type?: SortOrder;
    amount?: SortOrder;
    currency?: SortOrder;
    description?: SortOrderInput | SortOrder;
    date?: SortOrder;
    tags?: SortOrder;
    isDemo?: SortOrder;
    transferToId?: SortOrderInput | SortOrder;
    isRecurring?: SortOrder;
    recurringPattern?: SortOrderInput | SortOrder;
    parentTransactionId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: TransactionCountOrderByAggregateInput;
    _avg?: TransactionAvgOrderByAggregateInput;
    _max?: TransactionMaxOrderByAggregateInput;
    _min?: TransactionMinOrderByAggregateInput;
    _sum?: TransactionSumOrderByAggregateInput;
  };

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[];
    OR?: TransactionScalarWhereWithAggregatesInput[];
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Transaction'> | string;
    userId?: StringWithAggregatesFilter<'Transaction'> | string;
    accountId?: StringWithAggregatesFilter<'Transaction'> | string;
    categoryId?: StringWithAggregatesFilter<'Transaction'> | string;
    type?: EnumTransactionTypeWithAggregatesFilter<'Transaction'> | $Enums.TransactionType;
    amount?: FloatWithAggregatesFilter<'Transaction'> | number;
    currency?: StringWithAggregatesFilter<'Transaction'> | string;
    description?: StringNullableWithAggregatesFilter<'Transaction'> | string | null;
    date?: DateTimeWithAggregatesFilter<'Transaction'> | Date | string;
    tags?: StringNullableListFilter<'Transaction'>;
    isDemo?: BoolWithAggregatesFilter<'Transaction'> | boolean;
    transferToId?: StringNullableWithAggregatesFilter<'Transaction'> | string | null;
    isRecurring?: BoolWithAggregatesFilter<'Transaction'> | boolean;
    recurringPattern?:
      | EnumRecurringPatternNullableWithAggregatesFilter<'Transaction'>
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: StringNullableWithAggregatesFilter<'Transaction'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Transaction'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Transaction'> | Date | string;
  };

  export type TransactionCategoryWhereInput = {
    AND?: TransactionCategoryWhereInput | TransactionCategoryWhereInput[];
    OR?: TransactionCategoryWhereInput[];
    NOT?: TransactionCategoryWhereInput | TransactionCategoryWhereInput[];
    id?: StringFilter<'TransactionCategory'> | string;
    userId?: StringFilter<'TransactionCategory'> | string;
    name?: StringFilter<'TransactionCategory'> | string;
    type?: EnumTransactionTypeFilter<'TransactionCategory'> | $Enums.TransactionType;
    parentId?: StringNullableFilter<'TransactionCategory'> | string | null;
    color?: StringFilter<'TransactionCategory'> | string;
    icon?: StringFilter<'TransactionCategory'> | string;
    isDefault?: BoolFilter<'TransactionCategory'> | boolean;
    isActive?: BoolFilter<'TransactionCategory'> | boolean;
    isDemo?: BoolFilter<'TransactionCategory'> | boolean;
    createdAt?: DateTimeFilter<'TransactionCategory'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    parent?: XOR<
      TransactionCategoryNullableScalarRelationFilter,
      TransactionCategoryWhereInput
    > | null;
    children?: TransactionCategoryListRelationFilter;
    transactions?: TransactionListRelationFilter;
    budgetCategories?: BudgetCategoryListRelationFilter;
  };

  export type TransactionCategoryOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    parentId?: SortOrderInput | SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isDefault?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    parent?: TransactionCategoryOrderByWithRelationInput;
    children?: TransactionCategoryOrderByRelationAggregateInput;
    transactions?: TransactionOrderByRelationAggregateInput;
    budgetCategories?: BudgetCategoryOrderByRelationAggregateInput;
  };

  export type TransactionCategoryWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_name_type?: TransactionCategoryUserIdNameTypeCompoundUniqueInput;
      AND?: TransactionCategoryWhereInput | TransactionCategoryWhereInput[];
      OR?: TransactionCategoryWhereInput[];
      NOT?: TransactionCategoryWhereInput | TransactionCategoryWhereInput[];
      userId?: StringFilter<'TransactionCategory'> | string;
      name?: StringFilter<'TransactionCategory'> | string;
      type?: EnumTransactionTypeFilter<'TransactionCategory'> | $Enums.TransactionType;
      parentId?: StringNullableFilter<'TransactionCategory'> | string | null;
      color?: StringFilter<'TransactionCategory'> | string;
      icon?: StringFilter<'TransactionCategory'> | string;
      isDefault?: BoolFilter<'TransactionCategory'> | boolean;
      isActive?: BoolFilter<'TransactionCategory'> | boolean;
      isDemo?: BoolFilter<'TransactionCategory'> | boolean;
      createdAt?: DateTimeFilter<'TransactionCategory'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      parent?: XOR<
        TransactionCategoryNullableScalarRelationFilter,
        TransactionCategoryWhereInput
      > | null;
      children?: TransactionCategoryListRelationFilter;
      transactions?: TransactionListRelationFilter;
      budgetCategories?: BudgetCategoryListRelationFilter;
    },
    'id' | 'userId_name_type'
  >;

  export type TransactionCategoryOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    parentId?: SortOrderInput | SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isDefault?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    createdAt?: SortOrder;
    _count?: TransactionCategoryCountOrderByAggregateInput;
    _max?: TransactionCategoryMaxOrderByAggregateInput;
    _min?: TransactionCategoryMinOrderByAggregateInput;
  };

  export type TransactionCategoryScalarWhereWithAggregatesInput = {
    AND?:
      | TransactionCategoryScalarWhereWithAggregatesInput
      | TransactionCategoryScalarWhereWithAggregatesInput[];
    OR?: TransactionCategoryScalarWhereWithAggregatesInput[];
    NOT?:
      | TransactionCategoryScalarWhereWithAggregatesInput
      | TransactionCategoryScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'TransactionCategory'> | string;
    userId?: StringWithAggregatesFilter<'TransactionCategory'> | string;
    name?: StringWithAggregatesFilter<'TransactionCategory'> | string;
    type?: EnumTransactionTypeWithAggregatesFilter<'TransactionCategory'> | $Enums.TransactionType;
    parentId?: StringNullableWithAggregatesFilter<'TransactionCategory'> | string | null;
    color?: StringWithAggregatesFilter<'TransactionCategory'> | string;
    icon?: StringWithAggregatesFilter<'TransactionCategory'> | string;
    isDefault?: BoolWithAggregatesFilter<'TransactionCategory'> | boolean;
    isActive?: BoolWithAggregatesFilter<'TransactionCategory'> | boolean;
    isDemo?: BoolWithAggregatesFilter<'TransactionCategory'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'TransactionCategory'> | Date | string;
  };

  export type BudgetWhereInput = {
    AND?: BudgetWhereInput | BudgetWhereInput[];
    OR?: BudgetWhereInput[];
    NOT?: BudgetWhereInput | BudgetWhereInput[];
    id?: StringFilter<'Budget'> | string;
    userId?: StringFilter<'Budget'> | string;
    name?: StringFilter<'Budget'> | string;
    period?: EnumBudgetPeriodFilter<'Budget'> | $Enums.BudgetPeriod;
    startDate?: DateTimeFilter<'Budget'> | Date | string;
    endDate?: DateTimeFilter<'Budget'> | Date | string;
    currency?: StringFilter<'Budget'> | string;
    totalPlanned?: FloatFilter<'Budget'> | number;
    totalActual?: FloatFilter<'Budget'> | number;
    isActive?: BoolFilter<'Budget'> | boolean;
    isDemo?: BoolFilter<'Budget'> | boolean;
    createdAt?: DateTimeFilter<'Budget'> | Date | string;
    updatedAt?: DateTimeFilter<'Budget'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    categories?: BudgetCategoryListRelationFilter;
  };

  export type BudgetOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    period?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    currency?: SortOrder;
    totalPlanned?: SortOrder;
    totalActual?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    categories?: BudgetCategoryOrderByRelationAggregateInput;
  };

  export type BudgetWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_name?: BudgetUserIdNameCompoundUniqueInput;
      AND?: BudgetWhereInput | BudgetWhereInput[];
      OR?: BudgetWhereInput[];
      NOT?: BudgetWhereInput | BudgetWhereInput[];
      userId?: StringFilter<'Budget'> | string;
      name?: StringFilter<'Budget'> | string;
      period?: EnumBudgetPeriodFilter<'Budget'> | $Enums.BudgetPeriod;
      startDate?: DateTimeFilter<'Budget'> | Date | string;
      endDate?: DateTimeFilter<'Budget'> | Date | string;
      currency?: StringFilter<'Budget'> | string;
      totalPlanned?: FloatFilter<'Budget'> | number;
      totalActual?: FloatFilter<'Budget'> | number;
      isActive?: BoolFilter<'Budget'> | boolean;
      isDemo?: BoolFilter<'Budget'> | boolean;
      createdAt?: DateTimeFilter<'Budget'> | Date | string;
      updatedAt?: DateTimeFilter<'Budget'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      categories?: BudgetCategoryListRelationFilter;
    },
    'id' | 'userId_name'
  >;

  export type BudgetOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    period?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    currency?: SortOrder;
    totalPlanned?: SortOrder;
    totalActual?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: BudgetCountOrderByAggregateInput;
    _avg?: BudgetAvgOrderByAggregateInput;
    _max?: BudgetMaxOrderByAggregateInput;
    _min?: BudgetMinOrderByAggregateInput;
    _sum?: BudgetSumOrderByAggregateInput;
  };

  export type BudgetScalarWhereWithAggregatesInput = {
    AND?: BudgetScalarWhereWithAggregatesInput | BudgetScalarWhereWithAggregatesInput[];
    OR?: BudgetScalarWhereWithAggregatesInput[];
    NOT?: BudgetScalarWhereWithAggregatesInput | BudgetScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Budget'> | string;
    userId?: StringWithAggregatesFilter<'Budget'> | string;
    name?: StringWithAggregatesFilter<'Budget'> | string;
    period?: EnumBudgetPeriodWithAggregatesFilter<'Budget'> | $Enums.BudgetPeriod;
    startDate?: DateTimeWithAggregatesFilter<'Budget'> | Date | string;
    endDate?: DateTimeWithAggregatesFilter<'Budget'> | Date | string;
    currency?: StringWithAggregatesFilter<'Budget'> | string;
    totalPlanned?: FloatWithAggregatesFilter<'Budget'> | number;
    totalActual?: FloatWithAggregatesFilter<'Budget'> | number;
    isActive?: BoolWithAggregatesFilter<'Budget'> | boolean;
    isDemo?: BoolWithAggregatesFilter<'Budget'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'Budget'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Budget'> | Date | string;
  };

  export type BudgetCategoryWhereInput = {
    AND?: BudgetCategoryWhereInput | BudgetCategoryWhereInput[];
    OR?: BudgetCategoryWhereInput[];
    NOT?: BudgetCategoryWhereInput | BudgetCategoryWhereInput[];
    id?: StringFilter<'BudgetCategory'> | string;
    budgetId?: StringFilter<'BudgetCategory'> | string;
    categoryId?: StringFilter<'BudgetCategory'> | string;
    planned?: FloatFilter<'BudgetCategory'> | number;
    actual?: FloatFilter<'BudgetCategory'> | number;
    budget?: XOR<BudgetScalarRelationFilter, BudgetWhereInput>;
    category?: XOR<TransactionCategoryScalarRelationFilter, TransactionCategoryWhereInput>;
  };

  export type BudgetCategoryOrderByWithRelationInput = {
    id?: SortOrder;
    budgetId?: SortOrder;
    categoryId?: SortOrder;
    planned?: SortOrder;
    actual?: SortOrder;
    budget?: BudgetOrderByWithRelationInput;
    category?: TransactionCategoryOrderByWithRelationInput;
  };

  export type BudgetCategoryWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      budgetId_categoryId?: BudgetCategoryBudgetIdCategoryIdCompoundUniqueInput;
      AND?: BudgetCategoryWhereInput | BudgetCategoryWhereInput[];
      OR?: BudgetCategoryWhereInput[];
      NOT?: BudgetCategoryWhereInput | BudgetCategoryWhereInput[];
      budgetId?: StringFilter<'BudgetCategory'> | string;
      categoryId?: StringFilter<'BudgetCategory'> | string;
      planned?: FloatFilter<'BudgetCategory'> | number;
      actual?: FloatFilter<'BudgetCategory'> | number;
      budget?: XOR<BudgetScalarRelationFilter, BudgetWhereInput>;
      category?: XOR<TransactionCategoryScalarRelationFilter, TransactionCategoryWhereInput>;
    },
    'id' | 'budgetId_categoryId'
  >;

  export type BudgetCategoryOrderByWithAggregationInput = {
    id?: SortOrder;
    budgetId?: SortOrder;
    categoryId?: SortOrder;
    planned?: SortOrder;
    actual?: SortOrder;
    _count?: BudgetCategoryCountOrderByAggregateInput;
    _avg?: BudgetCategoryAvgOrderByAggregateInput;
    _max?: BudgetCategoryMaxOrderByAggregateInput;
    _min?: BudgetCategoryMinOrderByAggregateInput;
    _sum?: BudgetCategorySumOrderByAggregateInput;
  };

  export type BudgetCategoryScalarWhereWithAggregatesInput = {
    AND?:
      | BudgetCategoryScalarWhereWithAggregatesInput
      | BudgetCategoryScalarWhereWithAggregatesInput[];
    OR?: BudgetCategoryScalarWhereWithAggregatesInput[];
    NOT?:
      | BudgetCategoryScalarWhereWithAggregatesInput
      | BudgetCategoryScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'BudgetCategory'> | string;
    budgetId?: StringWithAggregatesFilter<'BudgetCategory'> | string;
    categoryId?: StringWithAggregatesFilter<'BudgetCategory'> | string;
    planned?: FloatWithAggregatesFilter<'BudgetCategory'> | number;
    actual?: FloatWithAggregatesFilter<'BudgetCategory'> | number;
  };

  export type FinancialGoalWhereInput = {
    AND?: FinancialGoalWhereInput | FinancialGoalWhereInput[];
    OR?: FinancialGoalWhereInput[];
    NOT?: FinancialGoalWhereInput | FinancialGoalWhereInput[];
    id?: StringFilter<'FinancialGoal'> | string;
    userId?: StringFilter<'FinancialGoal'> | string;
    name?: StringFilter<'FinancialGoal'> | string;
    description?: StringNullableFilter<'FinancialGoal'> | string | null;
    targetAmount?: FloatFilter<'FinancialGoal'> | number;
    currentAmount?: FloatFilter<'FinancialGoal'> | number;
    currency?: StringFilter<'FinancialGoal'> | string;
    deadline?: DateTimeNullableFilter<'FinancialGoal'> | Date | string | null;
    color?: StringFilter<'FinancialGoal'> | string;
    icon?: StringFilter<'FinancialGoal'> | string;
    isActive?: BoolFilter<'FinancialGoal'> | boolean;
    isCompleted?: BoolFilter<'FinancialGoal'> | boolean;
    isDemo?: BoolFilter<'FinancialGoal'> | boolean;
    completedAt?: DateTimeNullableFilter<'FinancialGoal'> | Date | string | null;
    createdAt?: DateTimeFilter<'FinancialGoal'> | Date | string;
    updatedAt?: DateTimeFilter<'FinancialGoal'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type FinancialGoalOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    description?: SortOrderInput | SortOrder;
    targetAmount?: SortOrder;
    currentAmount?: SortOrder;
    currency?: SortOrder;
    deadline?: SortOrderInput | SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isActive?: SortOrder;
    isCompleted?: SortOrder;
    isDemo?: SortOrder;
    completedAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };

  export type FinancialGoalWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_name?: FinancialGoalUserIdNameCompoundUniqueInput;
      AND?: FinancialGoalWhereInput | FinancialGoalWhereInput[];
      OR?: FinancialGoalWhereInput[];
      NOT?: FinancialGoalWhereInput | FinancialGoalWhereInput[];
      userId?: StringFilter<'FinancialGoal'> | string;
      name?: StringFilter<'FinancialGoal'> | string;
      description?: StringNullableFilter<'FinancialGoal'> | string | null;
      targetAmount?: FloatFilter<'FinancialGoal'> | number;
      currentAmount?: FloatFilter<'FinancialGoal'> | number;
      currency?: StringFilter<'FinancialGoal'> | string;
      deadline?: DateTimeNullableFilter<'FinancialGoal'> | Date | string | null;
      color?: StringFilter<'FinancialGoal'> | string;
      icon?: StringFilter<'FinancialGoal'> | string;
      isActive?: BoolFilter<'FinancialGoal'> | boolean;
      isCompleted?: BoolFilter<'FinancialGoal'> | boolean;
      isDemo?: BoolFilter<'FinancialGoal'> | boolean;
      completedAt?: DateTimeNullableFilter<'FinancialGoal'> | Date | string | null;
      createdAt?: DateTimeFilter<'FinancialGoal'> | Date | string;
      updatedAt?: DateTimeFilter<'FinancialGoal'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id' | 'userId_name'
  >;

  export type FinancialGoalOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    description?: SortOrderInput | SortOrder;
    targetAmount?: SortOrder;
    currentAmount?: SortOrder;
    currency?: SortOrder;
    deadline?: SortOrderInput | SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isActive?: SortOrder;
    isCompleted?: SortOrder;
    isDemo?: SortOrder;
    completedAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: FinancialGoalCountOrderByAggregateInput;
    _avg?: FinancialGoalAvgOrderByAggregateInput;
    _max?: FinancialGoalMaxOrderByAggregateInput;
    _min?: FinancialGoalMinOrderByAggregateInput;
    _sum?: FinancialGoalSumOrderByAggregateInput;
  };

  export type FinancialGoalScalarWhereWithAggregatesInput = {
    AND?:
      | FinancialGoalScalarWhereWithAggregatesInput
      | FinancialGoalScalarWhereWithAggregatesInput[];
    OR?: FinancialGoalScalarWhereWithAggregatesInput[];
    NOT?:
      | FinancialGoalScalarWhereWithAggregatesInput
      | FinancialGoalScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'FinancialGoal'> | string;
    userId?: StringWithAggregatesFilter<'FinancialGoal'> | string;
    name?: StringWithAggregatesFilter<'FinancialGoal'> | string;
    description?: StringNullableWithAggregatesFilter<'FinancialGoal'> | string | null;
    targetAmount?: FloatWithAggregatesFilter<'FinancialGoal'> | number;
    currentAmount?: FloatWithAggregatesFilter<'FinancialGoal'> | number;
    currency?: StringWithAggregatesFilter<'FinancialGoal'> | string;
    deadline?: DateTimeNullableWithAggregatesFilter<'FinancialGoal'> | Date | string | null;
    color?: StringWithAggregatesFilter<'FinancialGoal'> | string;
    icon?: StringWithAggregatesFilter<'FinancialGoal'> | string;
    isActive?: BoolWithAggregatesFilter<'FinancialGoal'> | boolean;
    isCompleted?: BoolWithAggregatesFilter<'FinancialGoal'> | boolean;
    isDemo?: BoolWithAggregatesFilter<'FinancialGoal'> | boolean;
    completedAt?: DateTimeNullableWithAggregatesFilter<'FinancialGoal'> | Date | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'FinancialGoal'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'FinancialGoal'> | Date | string;
  };

  export type UserCreateInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeCreateNestedManyWithoutUserInput;
    categories?: CategoryCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountCreateNestedManyWithoutUserInput;
    transactions?: TransactionCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryCreateNestedManyWithoutUserInput;
    budgets?: BudgetCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput;
    categories?: CategoryUncheckedCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountUncheckedCreateNestedManyWithoutUserInput;
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryUncheckedCreateNestedManyWithoutUserInput;
    budgets?: BudgetUncheckedCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUpdateManyWithoutUserNestedInput;
    categories?: CategoryUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput;
    categories?: CategoryUncheckedUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUncheckedUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUncheckedUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type UserCreateManyInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
  };

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
  };

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
  };

  export type CategoryCreateInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutCategoriesInput;
    trades?: TradeCreateNestedManyWithoutCategoryInput;
  };

  export type CategoryUncheckedCreateInput = {
    id?: string;
    name: string;
    userId: string;
    createdAt?: Date | string;
    trades?: TradeUncheckedCreateNestedManyWithoutCategoryInput;
  };

  export type CategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutCategoriesNestedInput;
    trades?: TradeUpdateManyWithoutCategoryNestedInput;
  };

  export type CategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    trades?: TradeUncheckedUpdateManyWithoutCategoryNestedInput;
  };

  export type CategoryCreateManyInput = {
    id?: string;
    name: string;
    userId: string;
    createdAt?: Date | string;
  };

  export type CategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TradeCreateInput = {
    id?: string;
    date?: Date | string;
    symbol: string;
    side: $Enums.TradeSide;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: $Enums.TradeResult;
    leverage?: number | null;
    investment?: number | null;
    createdAt?: Date | string;
    deposit: number;
    isDemo?: boolean;
    comment?: string | null;
    user: UserCreateNestedOneWithoutTradesInput;
    category: CategoryCreateNestedOneWithoutTradesInput;
    screenshots?: ScreenshotCreateNestedManyWithoutTradeInput;
  };

  export type TradeUncheckedCreateInput = {
    id?: string;
    userId: string;
    categoryId: string;
    date?: Date | string;
    symbol: string;
    side: $Enums.TradeSide;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: $Enums.TradeResult;
    leverage?: number | null;
    investment?: number | null;
    createdAt?: Date | string;
    deposit: number;
    isDemo?: boolean;
    comment?: string | null;
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutTradeInput;
  };

  export type TradeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    symbol?: StringFieldUpdateOperationsInput | string;
    side?: EnumTradeSideFieldUpdateOperationsInput | $Enums.TradeSide;
    entryPrice?: FloatFieldUpdateOperationsInput | number;
    positionSize?: FloatFieldUpdateOperationsInput | number;
    stopLoss?: FloatFieldUpdateOperationsInput | number;
    exitPrice?: FloatFieldUpdateOperationsInput | number;
    commission?: FloatFieldUpdateOperationsInput | number;
    riskPercent?: FloatFieldUpdateOperationsInput | number;
    pnl?: FloatFieldUpdateOperationsInput | number;
    result?: EnumTradeResultFieldUpdateOperationsInput | $Enums.TradeResult;
    leverage?: NullableFloatFieldUpdateOperationsInput | number | null;
    investment?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deposit?: FloatFieldUpdateOperationsInput | number;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    comment?: NullableStringFieldUpdateOperationsInput | string | null;
    user?: UserUpdateOneRequiredWithoutTradesNestedInput;
    category?: CategoryUpdateOneRequiredWithoutTradesNestedInput;
    screenshots?: ScreenshotUpdateManyWithoutTradeNestedInput;
  };

  export type TradeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    symbol?: StringFieldUpdateOperationsInput | string;
    side?: EnumTradeSideFieldUpdateOperationsInput | $Enums.TradeSide;
    entryPrice?: FloatFieldUpdateOperationsInput | number;
    positionSize?: FloatFieldUpdateOperationsInput | number;
    stopLoss?: FloatFieldUpdateOperationsInput | number;
    exitPrice?: FloatFieldUpdateOperationsInput | number;
    commission?: FloatFieldUpdateOperationsInput | number;
    riskPercent?: FloatFieldUpdateOperationsInput | number;
    pnl?: FloatFieldUpdateOperationsInput | number;
    result?: EnumTradeResultFieldUpdateOperationsInput | $Enums.TradeResult;
    leverage?: NullableFloatFieldUpdateOperationsInput | number | null;
    investment?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deposit?: FloatFieldUpdateOperationsInput | number;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    comment?: NullableStringFieldUpdateOperationsInput | string | null;
    screenshots?: ScreenshotUncheckedUpdateManyWithoutTradeNestedInput;
  };

  export type TradeCreateManyInput = {
    id?: string;
    userId: string;
    categoryId: string;
    date?: Date | string;
    symbol: string;
    side: $Enums.TradeSide;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: $Enums.TradeResult;
    leverage?: number | null;
    investment?: number | null;
    createdAt?: Date | string;
    deposit: number;
    isDemo?: boolean;
    comment?: string | null;
  };

  export type TradeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    symbol?: StringFieldUpdateOperationsInput | string;
    side?: EnumTradeSideFieldUpdateOperationsInput | $Enums.TradeSide;
    entryPrice?: FloatFieldUpdateOperationsInput | number;
    positionSize?: FloatFieldUpdateOperationsInput | number;
    stopLoss?: FloatFieldUpdateOperationsInput | number;
    exitPrice?: FloatFieldUpdateOperationsInput | number;
    commission?: FloatFieldUpdateOperationsInput | number;
    riskPercent?: FloatFieldUpdateOperationsInput | number;
    pnl?: FloatFieldUpdateOperationsInput | number;
    result?: EnumTradeResultFieldUpdateOperationsInput | $Enums.TradeResult;
    leverage?: NullableFloatFieldUpdateOperationsInput | number | null;
    investment?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deposit?: FloatFieldUpdateOperationsInput | number;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    comment?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type TradeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    symbol?: StringFieldUpdateOperationsInput | string;
    side?: EnumTradeSideFieldUpdateOperationsInput | $Enums.TradeSide;
    entryPrice?: FloatFieldUpdateOperationsInput | number;
    positionSize?: FloatFieldUpdateOperationsInput | number;
    stopLoss?: FloatFieldUpdateOperationsInput | number;
    exitPrice?: FloatFieldUpdateOperationsInput | number;
    commission?: FloatFieldUpdateOperationsInput | number;
    riskPercent?: FloatFieldUpdateOperationsInput | number;
    pnl?: FloatFieldUpdateOperationsInput | number;
    result?: EnumTradeResultFieldUpdateOperationsInput | $Enums.TradeResult;
    leverage?: NullableFloatFieldUpdateOperationsInput | number | null;
    investment?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deposit?: FloatFieldUpdateOperationsInput | number;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    comment?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type ScreenshotCreateInput = {
    id?: string;
    imageData: string;
    createdAt?: Date | string;
    order?: number;
    trade: TradeCreateNestedOneWithoutScreenshotsInput;
  };

  export type ScreenshotUncheckedCreateInput = {
    id?: string;
    tradeId: string;
    imageData: string;
    createdAt?: Date | string;
    order?: number;
  };

  export type ScreenshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    imageData?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    order?: IntFieldUpdateOperationsInput | number;
    trade?: TradeUpdateOneRequiredWithoutScreenshotsNestedInput;
  };

  export type ScreenshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tradeId?: StringFieldUpdateOperationsInput | string;
    imageData?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    order?: IntFieldUpdateOperationsInput | number;
  };

  export type ScreenshotCreateManyInput = {
    id?: string;
    tradeId: string;
    imageData: string;
    createdAt?: Date | string;
    order?: number;
  };

  export type ScreenshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    imageData?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    order?: IntFieldUpdateOperationsInput | number;
  };

  export type ScreenshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tradeId?: StringFieldUpdateOperationsInput | string;
    imageData?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    order?: IntFieldUpdateOperationsInput | number;
  };

  export type FinanceAccountCreateInput = {
    id?: string;
    name: string;
    type: $Enums.AccountType;
    currency?: string;
    balance?: number;
    isActive?: boolean;
    isDemo?: boolean;
    color?: string | null;
    icon?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutFinanceAccountsInput;
    transactions?: TransactionCreateNestedManyWithoutAccountInput;
    transfersTo?: TransactionCreateNestedManyWithoutTransferToInput;
  };

  export type FinanceAccountUncheckedCreateInput = {
    id?: string;
    userId: string;
    name: string;
    type: $Enums.AccountType;
    currency?: string;
    balance?: number;
    isActive?: boolean;
    isDemo?: boolean;
    color?: string | null;
    icon?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: TransactionUncheckedCreateNestedManyWithoutAccountInput;
    transfersTo?: TransactionUncheckedCreateNestedManyWithoutTransferToInput;
  };

  export type FinanceAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType;
    currency?: StringFieldUpdateOperationsInput | string;
    balance?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutFinanceAccountsNestedInput;
    transactions?: TransactionUpdateManyWithoutAccountNestedInput;
    transfersTo?: TransactionUpdateManyWithoutTransferToNestedInput;
  };

  export type FinanceAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType;
    currency?: StringFieldUpdateOperationsInput | string;
    balance?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: TransactionUncheckedUpdateManyWithoutAccountNestedInput;
    transfersTo?: TransactionUncheckedUpdateManyWithoutTransferToNestedInput;
  };

  export type FinanceAccountCreateManyInput = {
    id?: string;
    userId: string;
    name: string;
    type: $Enums.AccountType;
    currency?: string;
    balance?: number;
    isActive?: boolean;
    isDemo?: boolean;
    color?: string | null;
    icon?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type FinanceAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType;
    currency?: StringFieldUpdateOperationsInput | string;
    balance?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FinanceAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType;
    currency?: StringFieldUpdateOperationsInput | string;
    balance?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionCreateInput = {
    id?: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutTransactionsInput;
    account: FinanceAccountCreateNestedOneWithoutTransactionsInput;
    category: TransactionCategoryCreateNestedOneWithoutTransactionsInput;
    transferTo?: FinanceAccountCreateNestedOneWithoutTransfersToInput;
  };

  export type TransactionUncheckedCreateInput = {
    id?: string;
    userId: string;
    accountId: string;
    categoryId: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    transferToId?: string | null;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput;
    account?: FinanceAccountUpdateOneRequiredWithoutTransactionsNestedInput;
    category?: TransactionCategoryUpdateOneRequiredWithoutTransactionsNestedInput;
    transferTo?: FinanceAccountUpdateOneWithoutTransfersToNestedInput;
  };

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    transferToId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionCreateManyInput = {
    id?: string;
    userId: string;
    accountId: string;
    categoryId: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    transferToId?: string | null;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    transferToId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionCategoryCreateInput = {
    id?: string;
    name: string;
    type: $Enums.TransactionType;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutTransactionCategoriesInput;
    parent?: TransactionCategoryCreateNestedOneWithoutChildrenInput;
    children?: TransactionCategoryCreateNestedManyWithoutParentInput;
    transactions?: TransactionCreateNestedManyWithoutCategoryInput;
    budgetCategories?: BudgetCategoryCreateNestedManyWithoutCategoryInput;
  };

  export type TransactionCategoryUncheckedCreateInput = {
    id?: string;
    userId: string;
    name: string;
    type: $Enums.TransactionType;
    parentId?: string | null;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    children?: TransactionCategoryUncheckedCreateNestedManyWithoutParentInput;
    transactions?: TransactionUncheckedCreateNestedManyWithoutCategoryInput;
    budgetCategories?: BudgetCategoryUncheckedCreateNestedManyWithoutCategoryInput;
  };

  export type TransactionCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutTransactionCategoriesNestedInput;
    parent?: TransactionCategoryUpdateOneWithoutChildrenNestedInput;
    children?: TransactionCategoryUpdateManyWithoutParentNestedInput;
    transactions?: TransactionUpdateManyWithoutCategoryNestedInput;
    budgetCategories?: BudgetCategoryUpdateManyWithoutCategoryNestedInput;
  };

  export type TransactionCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: TransactionCategoryUncheckedUpdateManyWithoutParentNestedInput;
    transactions?: TransactionUncheckedUpdateManyWithoutCategoryNestedInput;
    budgetCategories?: BudgetCategoryUncheckedUpdateManyWithoutCategoryNestedInput;
  };

  export type TransactionCategoryCreateManyInput = {
    id?: string;
    userId: string;
    name: string;
    type: $Enums.TransactionType;
    parentId?: string | null;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
  };

  export type TransactionCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BudgetCreateInput = {
    id?: string;
    name: string;
    period: $Enums.BudgetPeriod;
    startDate: Date | string;
    endDate: Date | string;
    currency?: string;
    totalPlanned: number;
    totalActual?: number;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutBudgetsInput;
    categories?: BudgetCategoryCreateNestedManyWithoutBudgetInput;
  };

  export type BudgetUncheckedCreateInput = {
    id?: string;
    userId: string;
    name: string;
    period: $Enums.BudgetPeriod;
    startDate: Date | string;
    endDate: Date | string;
    currency?: string;
    totalPlanned: number;
    totalActual?: number;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    categories?: BudgetCategoryUncheckedCreateNestedManyWithoutBudgetInput;
  };

  export type BudgetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    period?: EnumBudgetPeriodFieldUpdateOperationsInput | $Enums.BudgetPeriod;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    currency?: StringFieldUpdateOperationsInput | string;
    totalPlanned?: FloatFieldUpdateOperationsInput | number;
    totalActual?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutBudgetsNestedInput;
    categories?: BudgetCategoryUpdateManyWithoutBudgetNestedInput;
  };

  export type BudgetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    period?: EnumBudgetPeriodFieldUpdateOperationsInput | $Enums.BudgetPeriod;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    currency?: StringFieldUpdateOperationsInput | string;
    totalPlanned?: FloatFieldUpdateOperationsInput | number;
    totalActual?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    categories?: BudgetCategoryUncheckedUpdateManyWithoutBudgetNestedInput;
  };

  export type BudgetCreateManyInput = {
    id?: string;
    userId: string;
    name: string;
    period: $Enums.BudgetPeriod;
    startDate: Date | string;
    endDate: Date | string;
    currency?: string;
    totalPlanned: number;
    totalActual?: number;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BudgetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    period?: EnumBudgetPeriodFieldUpdateOperationsInput | $Enums.BudgetPeriod;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    currency?: StringFieldUpdateOperationsInput | string;
    totalPlanned?: FloatFieldUpdateOperationsInput | number;
    totalActual?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BudgetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    period?: EnumBudgetPeriodFieldUpdateOperationsInput | $Enums.BudgetPeriod;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    currency?: StringFieldUpdateOperationsInput | string;
    totalPlanned?: FloatFieldUpdateOperationsInput | number;
    totalActual?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BudgetCategoryCreateInput = {
    id?: string;
    planned: number;
    actual?: number;
    budget: BudgetCreateNestedOneWithoutCategoriesInput;
    category: TransactionCategoryCreateNestedOneWithoutBudgetCategoriesInput;
  };

  export type BudgetCategoryUncheckedCreateInput = {
    id?: string;
    budgetId: string;
    categoryId: string;
    planned: number;
    actual?: number;
  };

  export type BudgetCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    planned?: FloatFieldUpdateOperationsInput | number;
    actual?: FloatFieldUpdateOperationsInput | number;
    budget?: BudgetUpdateOneRequiredWithoutCategoriesNestedInput;
    category?: TransactionCategoryUpdateOneRequiredWithoutBudgetCategoriesNestedInput;
  };

  export type BudgetCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    budgetId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    planned?: FloatFieldUpdateOperationsInput | number;
    actual?: FloatFieldUpdateOperationsInput | number;
  };

  export type BudgetCategoryCreateManyInput = {
    id?: string;
    budgetId: string;
    categoryId: string;
    planned: number;
    actual?: number;
  };

  export type BudgetCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    planned?: FloatFieldUpdateOperationsInput | number;
    actual?: FloatFieldUpdateOperationsInput | number;
  };

  export type BudgetCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    budgetId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    planned?: FloatFieldUpdateOperationsInput | number;
    actual?: FloatFieldUpdateOperationsInput | number;
  };

  export type FinancialGoalCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    targetAmount: number;
    currentAmount?: number;
    currency?: string;
    deadline?: Date | string | null;
    color: string;
    icon: string;
    isActive?: boolean;
    isCompleted?: boolean;
    isDemo?: boolean;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutFinancialGoalsInput;
  };

  export type FinancialGoalUncheckedCreateInput = {
    id?: string;
    userId: string;
    name: string;
    description?: string | null;
    targetAmount: number;
    currentAmount?: number;
    currency?: string;
    deadline?: Date | string | null;
    color: string;
    icon: string;
    isActive?: boolean;
    isCompleted?: boolean;
    isDemo?: boolean;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type FinancialGoalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    targetAmount?: FloatFieldUpdateOperationsInput | number;
    currentAmount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isCompleted?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutFinancialGoalsNestedInput;
  };

  export type FinancialGoalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    targetAmount?: FloatFieldUpdateOperationsInput | number;
    currentAmount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isCompleted?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FinancialGoalCreateManyInput = {
    id?: string;
    userId: string;
    name: string;
    description?: string | null;
    targetAmount: number;
    currentAmount?: number;
    currency?: string;
    deadline?: Date | string | null;
    color: string;
    icon: string;
    isActive?: boolean;
    isCompleted?: boolean;
    isDemo?: boolean;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type FinancialGoalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    targetAmount?: FloatFieldUpdateOperationsInput | number;
    currentAmount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isCompleted?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FinancialGoalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    targetAmount?: FloatFieldUpdateOperationsInput | number;
    currentAmount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isCompleted?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type TradeListRelationFilter = {
    every?: TradeWhereInput;
    some?: TradeWhereInput;
    none?: TradeWhereInput;
  };

  export type CategoryListRelationFilter = {
    every?: CategoryWhereInput;
    some?: CategoryWhereInput;
    none?: CategoryWhereInput;
  };

  export type FinanceAccountListRelationFilter = {
    every?: FinanceAccountWhereInput;
    some?: FinanceAccountWhereInput;
    none?: FinanceAccountWhereInput;
  };

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput;
    some?: TransactionWhereInput;
    none?: TransactionWhereInput;
  };

  export type TransactionCategoryListRelationFilter = {
    every?: TransactionCategoryWhereInput;
    some?: TransactionCategoryWhereInput;
    none?: TransactionCategoryWhereInput;
  };

  export type BudgetListRelationFilter = {
    every?: BudgetWhereInput;
    some?: BudgetWhereInput;
    none?: BudgetWhereInput;
  };

  export type FinancialGoalListRelationFilter = {
    every?: FinancialGoalWhereInput;
    some?: FinancialGoalWhereInput;
    none?: FinancialGoalWhereInput;
  };

  export type TradeOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type CategoryOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type FinanceAccountOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type TransactionCategoryOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type BudgetOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type FinancialGoalOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    createdAt?: SortOrder;
    defaultCategory?: SortOrder;
  };

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    createdAt?: SortOrder;
    defaultCategory?: SortOrder;
  };

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    createdAt?: SortOrder;
    defaultCategory?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type UserScalarRelationFilter = {
    is?: UserWhereInput;
    isNot?: UserWhereInput;
  };

  export type CategoryUserIdNameCompoundUniqueInput = {
    userId: string;
    name: string;
  };

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EnumTradeSideFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeSide | EnumTradeSideFieldRefInput<$PrismaModel>;
    in?: $Enums.TradeSide[] | ListEnumTradeSideFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TradeSide[] | ListEnumTradeSideFieldRefInput<$PrismaModel>;
    not?: NestedEnumTradeSideFilter<$PrismaModel> | $Enums.TradeSide;
  };

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type EnumTradeResultFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeResult | EnumTradeResultFieldRefInput<$PrismaModel>;
    in?: $Enums.TradeResult[] | ListEnumTradeResultFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TradeResult[] | ListEnumTradeResultFieldRefInput<$PrismaModel>;
    not?: NestedEnumTradeResultFilter<$PrismaModel> | $Enums.TradeResult;
  };

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type CategoryScalarRelationFilter = {
    is?: CategoryWhereInput;
    isNot?: CategoryWhereInput;
  };

  export type ScreenshotListRelationFilter = {
    every?: ScreenshotWhereInput;
    some?: ScreenshotWhereInput;
    none?: ScreenshotWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type ScreenshotOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type TradeCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    categoryId?: SortOrder;
    date?: SortOrder;
    symbol?: SortOrder;
    side?: SortOrder;
    entryPrice?: SortOrder;
    positionSize?: SortOrder;
    stopLoss?: SortOrder;
    exitPrice?: SortOrder;
    commission?: SortOrder;
    riskPercent?: SortOrder;
    pnl?: SortOrder;
    result?: SortOrder;
    leverage?: SortOrder;
    investment?: SortOrder;
    createdAt?: SortOrder;
    deposit?: SortOrder;
    isDemo?: SortOrder;
    comment?: SortOrder;
  };

  export type TradeAvgOrderByAggregateInput = {
    entryPrice?: SortOrder;
    positionSize?: SortOrder;
    stopLoss?: SortOrder;
    exitPrice?: SortOrder;
    commission?: SortOrder;
    riskPercent?: SortOrder;
    pnl?: SortOrder;
    leverage?: SortOrder;
    investment?: SortOrder;
    deposit?: SortOrder;
  };

  export type TradeMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    categoryId?: SortOrder;
    date?: SortOrder;
    symbol?: SortOrder;
    side?: SortOrder;
    entryPrice?: SortOrder;
    positionSize?: SortOrder;
    stopLoss?: SortOrder;
    exitPrice?: SortOrder;
    commission?: SortOrder;
    riskPercent?: SortOrder;
    pnl?: SortOrder;
    result?: SortOrder;
    leverage?: SortOrder;
    investment?: SortOrder;
    createdAt?: SortOrder;
    deposit?: SortOrder;
    isDemo?: SortOrder;
    comment?: SortOrder;
  };

  export type TradeMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    categoryId?: SortOrder;
    date?: SortOrder;
    symbol?: SortOrder;
    side?: SortOrder;
    entryPrice?: SortOrder;
    positionSize?: SortOrder;
    stopLoss?: SortOrder;
    exitPrice?: SortOrder;
    commission?: SortOrder;
    riskPercent?: SortOrder;
    pnl?: SortOrder;
    result?: SortOrder;
    leverage?: SortOrder;
    investment?: SortOrder;
    createdAt?: SortOrder;
    deposit?: SortOrder;
    isDemo?: SortOrder;
    comment?: SortOrder;
  };

  export type TradeSumOrderByAggregateInput = {
    entryPrice?: SortOrder;
    positionSize?: SortOrder;
    stopLoss?: SortOrder;
    exitPrice?: SortOrder;
    commission?: SortOrder;
    riskPercent?: SortOrder;
    pnl?: SortOrder;
    leverage?: SortOrder;
    investment?: SortOrder;
    deposit?: SortOrder;
  };

  export type EnumTradeSideWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeSide | EnumTradeSideFieldRefInput<$PrismaModel>;
    in?: $Enums.TradeSide[] | ListEnumTradeSideFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TradeSide[] | ListEnumTradeSideFieldRefInput<$PrismaModel>;
    not?: NestedEnumTradeSideWithAggregatesFilter<$PrismaModel> | $Enums.TradeSide;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumTradeSideFilter<$PrismaModel>;
    _max?: NestedEnumTradeSideFilter<$PrismaModel>;
  };

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };

  export type EnumTradeResultWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeResult | EnumTradeResultFieldRefInput<$PrismaModel>;
    in?: $Enums.TradeResult[] | ListEnumTradeResultFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TradeResult[] | ListEnumTradeResultFieldRefInput<$PrismaModel>;
    not?: NestedEnumTradeResultWithAggregatesFilter<$PrismaModel> | $Enums.TradeResult;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumTradeResultFilter<$PrismaModel>;
    _max?: NestedEnumTradeResultFilter<$PrismaModel>;
  };

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedFloatNullableFilter<$PrismaModel>;
    _min?: NestedFloatNullableFilter<$PrismaModel>;
    _max?: NestedFloatNullableFilter<$PrismaModel>;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type TradeScalarRelationFilter = {
    is?: TradeWhereInput;
    isNot?: TradeWhereInput;
  };

  export type ScreenshotCountOrderByAggregateInput = {
    id?: SortOrder;
    tradeId?: SortOrder;
    imageData?: SortOrder;
    createdAt?: SortOrder;
    order?: SortOrder;
  };

  export type ScreenshotAvgOrderByAggregateInput = {
    order?: SortOrder;
  };

  export type ScreenshotMaxOrderByAggregateInput = {
    id?: SortOrder;
    tradeId?: SortOrder;
    imageData?: SortOrder;
    createdAt?: SortOrder;
    order?: SortOrder;
  };

  export type ScreenshotMinOrderByAggregateInput = {
    id?: SortOrder;
    tradeId?: SortOrder;
    imageData?: SortOrder;
    createdAt?: SortOrder;
    order?: SortOrder;
  };

  export type ScreenshotSumOrderByAggregateInput = {
    order?: SortOrder;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type EnumAccountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | EnumAccountTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumAccountTypeFilter<$PrismaModel> | $Enums.AccountType;
  };

  export type FinanceAccountUserIdNameCompoundUniqueInput = {
    userId: string;
    name: string;
  };

  export type FinanceAccountCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    currency?: SortOrder;
    balance?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    description?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type FinanceAccountAvgOrderByAggregateInput = {
    balance?: SortOrder;
  };

  export type FinanceAccountMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    currency?: SortOrder;
    balance?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    description?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type FinanceAccountMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    currency?: SortOrder;
    balance?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    description?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type FinanceAccountSumOrderByAggregateInput = {
    balance?: SortOrder;
  };

  export type EnumAccountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | EnumAccountTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumAccountTypeWithAggregatesFilter<$PrismaModel> | $Enums.AccountType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumAccountTypeFilter<$PrismaModel>;
    _max?: NestedEnumAccountTypeFilter<$PrismaModel>;
  };

  export type EnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType;
  };

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
  };

  export type EnumRecurringPatternNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.RecurringPattern | EnumRecurringPatternFieldRefInput<$PrismaModel> | null;
    in?: $Enums.RecurringPattern[] | ListEnumRecurringPatternFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.RecurringPattern[] | ListEnumRecurringPatternFieldRefInput<$PrismaModel> | null;
    not?: NestedEnumRecurringPatternNullableFilter<$PrismaModel> | $Enums.RecurringPattern | null;
  };

  export type FinanceAccountScalarRelationFilter = {
    is?: FinanceAccountWhereInput;
    isNot?: FinanceAccountWhereInput;
  };

  export type TransactionCategoryScalarRelationFilter = {
    is?: TransactionCategoryWhereInput;
    isNot?: TransactionCategoryWhereInput;
  };

  export type FinanceAccountNullableScalarRelationFilter = {
    is?: FinanceAccountWhereInput | null;
    isNot?: FinanceAccountWhereInput | null;
  };

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    accountId?: SortOrder;
    categoryId?: SortOrder;
    type?: SortOrder;
    amount?: SortOrder;
    currency?: SortOrder;
    description?: SortOrder;
    date?: SortOrder;
    tags?: SortOrder;
    isDemo?: SortOrder;
    transferToId?: SortOrder;
    isRecurring?: SortOrder;
    recurringPattern?: SortOrder;
    parentTransactionId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TransactionAvgOrderByAggregateInput = {
    amount?: SortOrder;
  };

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    accountId?: SortOrder;
    categoryId?: SortOrder;
    type?: SortOrder;
    amount?: SortOrder;
    currency?: SortOrder;
    description?: SortOrder;
    date?: SortOrder;
    isDemo?: SortOrder;
    transferToId?: SortOrder;
    isRecurring?: SortOrder;
    recurringPattern?: SortOrder;
    parentTransactionId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    accountId?: SortOrder;
    categoryId?: SortOrder;
    type?: SortOrder;
    amount?: SortOrder;
    currency?: SortOrder;
    description?: SortOrder;
    date?: SortOrder;
    isDemo?: SortOrder;
    transferToId?: SortOrder;
    isRecurring?: SortOrder;
    recurringPattern?: SortOrder;
    parentTransactionId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TransactionSumOrderByAggregateInput = {
    amount?: SortOrder;
  };

  export type EnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>;
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>;
  };

  export type EnumRecurringPatternNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RecurringPattern | EnumRecurringPatternFieldRefInput<$PrismaModel> | null;
    in?: $Enums.RecurringPattern[] | ListEnumRecurringPatternFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.RecurringPattern[] | ListEnumRecurringPatternFieldRefInput<$PrismaModel> | null;
    not?:
      | NestedEnumRecurringPatternNullableWithAggregatesFilter<$PrismaModel>
      | $Enums.RecurringPattern
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedEnumRecurringPatternNullableFilter<$PrismaModel>;
    _max?: NestedEnumRecurringPatternNullableFilter<$PrismaModel>;
  };

  export type TransactionCategoryNullableScalarRelationFilter = {
    is?: TransactionCategoryWhereInput | null;
    isNot?: TransactionCategoryWhereInput | null;
  };

  export type BudgetCategoryListRelationFilter = {
    every?: BudgetCategoryWhereInput;
    some?: BudgetCategoryWhereInput;
    none?: BudgetCategoryWhereInput;
  };

  export type BudgetCategoryOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type TransactionCategoryUserIdNameTypeCompoundUniqueInput = {
    userId: string;
    name: string;
    type: $Enums.TransactionType;
  };

  export type TransactionCategoryCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    parentId?: SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isDefault?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    createdAt?: SortOrder;
  };

  export type TransactionCategoryMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    parentId?: SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isDefault?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    createdAt?: SortOrder;
  };

  export type TransactionCategoryMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    parentId?: SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isDefault?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EnumBudgetPeriodFilter<$PrismaModel = never> = {
    equals?: $Enums.BudgetPeriod | EnumBudgetPeriodFieldRefInput<$PrismaModel>;
    in?: $Enums.BudgetPeriod[] | ListEnumBudgetPeriodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BudgetPeriod[] | ListEnumBudgetPeriodFieldRefInput<$PrismaModel>;
    not?: NestedEnumBudgetPeriodFilter<$PrismaModel> | $Enums.BudgetPeriod;
  };

  export type BudgetUserIdNameCompoundUniqueInput = {
    userId: string;
    name: string;
  };

  export type BudgetCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    period?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    currency?: SortOrder;
    totalPlanned?: SortOrder;
    totalActual?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type BudgetAvgOrderByAggregateInput = {
    totalPlanned?: SortOrder;
    totalActual?: SortOrder;
  };

  export type BudgetMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    period?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    currency?: SortOrder;
    totalPlanned?: SortOrder;
    totalActual?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type BudgetMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    period?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    currency?: SortOrder;
    totalPlanned?: SortOrder;
    totalActual?: SortOrder;
    isActive?: SortOrder;
    isDemo?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type BudgetSumOrderByAggregateInput = {
    totalPlanned?: SortOrder;
    totalActual?: SortOrder;
  };

  export type EnumBudgetPeriodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BudgetPeriod | EnumBudgetPeriodFieldRefInput<$PrismaModel>;
    in?: $Enums.BudgetPeriod[] | ListEnumBudgetPeriodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BudgetPeriod[] | ListEnumBudgetPeriodFieldRefInput<$PrismaModel>;
    not?: NestedEnumBudgetPeriodWithAggregatesFilter<$PrismaModel> | $Enums.BudgetPeriod;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumBudgetPeriodFilter<$PrismaModel>;
    _max?: NestedEnumBudgetPeriodFilter<$PrismaModel>;
  };

  export type BudgetScalarRelationFilter = {
    is?: BudgetWhereInput;
    isNot?: BudgetWhereInput;
  };

  export type BudgetCategoryBudgetIdCategoryIdCompoundUniqueInput = {
    budgetId: string;
    categoryId: string;
  };

  export type BudgetCategoryCountOrderByAggregateInput = {
    id?: SortOrder;
    budgetId?: SortOrder;
    categoryId?: SortOrder;
    planned?: SortOrder;
    actual?: SortOrder;
  };

  export type BudgetCategoryAvgOrderByAggregateInput = {
    planned?: SortOrder;
    actual?: SortOrder;
  };

  export type BudgetCategoryMaxOrderByAggregateInput = {
    id?: SortOrder;
    budgetId?: SortOrder;
    categoryId?: SortOrder;
    planned?: SortOrder;
    actual?: SortOrder;
  };

  export type BudgetCategoryMinOrderByAggregateInput = {
    id?: SortOrder;
    budgetId?: SortOrder;
    categoryId?: SortOrder;
    planned?: SortOrder;
    actual?: SortOrder;
  };

  export type BudgetCategorySumOrderByAggregateInput = {
    planned?: SortOrder;
    actual?: SortOrder;
  };

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type FinancialGoalUserIdNameCompoundUniqueInput = {
    userId: string;
    name: string;
  };

  export type FinancialGoalCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    targetAmount?: SortOrder;
    currentAmount?: SortOrder;
    currency?: SortOrder;
    deadline?: SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isActive?: SortOrder;
    isCompleted?: SortOrder;
    isDemo?: SortOrder;
    completedAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type FinancialGoalAvgOrderByAggregateInput = {
    targetAmount?: SortOrder;
    currentAmount?: SortOrder;
  };

  export type FinancialGoalMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    targetAmount?: SortOrder;
    currentAmount?: SortOrder;
    currency?: SortOrder;
    deadline?: SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isActive?: SortOrder;
    isCompleted?: SortOrder;
    isDemo?: SortOrder;
    completedAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type FinancialGoalMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    targetAmount?: SortOrder;
    currentAmount?: SortOrder;
    currency?: SortOrder;
    deadline?: SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isActive?: SortOrder;
    isCompleted?: SortOrder;
    isDemo?: SortOrder;
    completedAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type FinancialGoalSumOrderByAggregateInput = {
    targetAmount?: SortOrder;
    currentAmount?: SortOrder;
  };

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type TradeCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput>
      | TradeCreateWithoutUserInput[]
      | TradeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: TradeCreateOrConnectWithoutUserInput | TradeCreateOrConnectWithoutUserInput[];
    createMany?: TradeCreateManyUserInputEnvelope;
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
  };

  export type CategoryCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<CategoryCreateWithoutUserInput, CategoryUncheckedCreateWithoutUserInput>
      | CategoryCreateWithoutUserInput[]
      | CategoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | CategoryCreateOrConnectWithoutUserInput
      | CategoryCreateOrConnectWithoutUserInput[];
    createMany?: CategoryCreateManyUserInputEnvelope;
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
  };

  export type FinanceAccountCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<FinanceAccountCreateWithoutUserInput, FinanceAccountUncheckedCreateWithoutUserInput>
      | FinanceAccountCreateWithoutUserInput[]
      | FinanceAccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | FinanceAccountCreateOrConnectWithoutUserInput
      | FinanceAccountCreateOrConnectWithoutUserInput[];
    createMany?: FinanceAccountCreateManyUserInputEnvelope;
    connect?: FinanceAccountWhereUniqueInput | FinanceAccountWhereUniqueInput[];
  };

  export type TransactionCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
      | TransactionCreateWithoutUserInput[]
      | TransactionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutUserInput
      | TransactionCreateOrConnectWithoutUserInput[];
    createMany?: TransactionCreateManyUserInputEnvelope;
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
  };

  export type TransactionCategoryCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          TransactionCategoryCreateWithoutUserInput,
          TransactionCategoryUncheckedCreateWithoutUserInput
        >
      | TransactionCategoryCreateWithoutUserInput[]
      | TransactionCategoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | TransactionCategoryCreateOrConnectWithoutUserInput
      | TransactionCategoryCreateOrConnectWithoutUserInput[];
    createMany?: TransactionCategoryCreateManyUserInputEnvelope;
    connect?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
  };

  export type BudgetCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<BudgetCreateWithoutUserInput, BudgetUncheckedCreateWithoutUserInput>
      | BudgetCreateWithoutUserInput[]
      | BudgetUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | BudgetCreateOrConnectWithoutUserInput
      | BudgetCreateOrConnectWithoutUserInput[];
    createMany?: BudgetCreateManyUserInputEnvelope;
    connect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[];
  };

  export type FinancialGoalCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<FinancialGoalCreateWithoutUserInput, FinancialGoalUncheckedCreateWithoutUserInput>
      | FinancialGoalCreateWithoutUserInput[]
      | FinancialGoalUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | FinancialGoalCreateOrConnectWithoutUserInput
      | FinancialGoalCreateOrConnectWithoutUserInput[];
    createMany?: FinancialGoalCreateManyUserInputEnvelope;
    connect?: FinancialGoalWhereUniqueInput | FinancialGoalWhereUniqueInput[];
  };

  export type TradeUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput>
      | TradeCreateWithoutUserInput[]
      | TradeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: TradeCreateOrConnectWithoutUserInput | TradeCreateOrConnectWithoutUserInput[];
    createMany?: TradeCreateManyUserInputEnvelope;
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
  };

  export type CategoryUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<CategoryCreateWithoutUserInput, CategoryUncheckedCreateWithoutUserInput>
      | CategoryCreateWithoutUserInput[]
      | CategoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | CategoryCreateOrConnectWithoutUserInput
      | CategoryCreateOrConnectWithoutUserInput[];
    createMany?: CategoryCreateManyUserInputEnvelope;
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
  };

  export type FinanceAccountUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<FinanceAccountCreateWithoutUserInput, FinanceAccountUncheckedCreateWithoutUserInput>
      | FinanceAccountCreateWithoutUserInput[]
      | FinanceAccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | FinanceAccountCreateOrConnectWithoutUserInput
      | FinanceAccountCreateOrConnectWithoutUserInput[];
    createMany?: FinanceAccountCreateManyUserInputEnvelope;
    connect?: FinanceAccountWhereUniqueInput | FinanceAccountWhereUniqueInput[];
  };

  export type TransactionUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
      | TransactionCreateWithoutUserInput[]
      | TransactionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutUserInput
      | TransactionCreateOrConnectWithoutUserInput[];
    createMany?: TransactionCreateManyUserInputEnvelope;
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
  };

  export type TransactionCategoryUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          TransactionCategoryCreateWithoutUserInput,
          TransactionCategoryUncheckedCreateWithoutUserInput
        >
      | TransactionCategoryCreateWithoutUserInput[]
      | TransactionCategoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | TransactionCategoryCreateOrConnectWithoutUserInput
      | TransactionCategoryCreateOrConnectWithoutUserInput[];
    createMany?: TransactionCategoryCreateManyUserInputEnvelope;
    connect?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
  };

  export type BudgetUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<BudgetCreateWithoutUserInput, BudgetUncheckedCreateWithoutUserInput>
      | BudgetCreateWithoutUserInput[]
      | BudgetUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | BudgetCreateOrConnectWithoutUserInput
      | BudgetCreateOrConnectWithoutUserInput[];
    createMany?: BudgetCreateManyUserInputEnvelope;
    connect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[];
  };

  export type FinancialGoalUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<FinancialGoalCreateWithoutUserInput, FinancialGoalUncheckedCreateWithoutUserInput>
      | FinancialGoalCreateWithoutUserInput[]
      | FinancialGoalUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | FinancialGoalCreateOrConnectWithoutUserInput
      | FinancialGoalCreateOrConnectWithoutUserInput[];
    createMany?: FinancialGoalCreateManyUserInputEnvelope;
    connect?: FinancialGoalWhereUniqueInput | FinancialGoalWhereUniqueInput[];
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type TradeUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput>
      | TradeCreateWithoutUserInput[]
      | TradeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: TradeCreateOrConnectWithoutUserInput | TradeCreateOrConnectWithoutUserInput[];
    upsert?:
      | TradeUpsertWithWhereUniqueWithoutUserInput
      | TradeUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: TradeCreateManyUserInputEnvelope;
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    update?:
      | TradeUpdateWithWhereUniqueWithoutUserInput
      | TradeUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | TradeUpdateManyWithWhereWithoutUserInput
      | TradeUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[];
  };

  export type CategoryUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<CategoryCreateWithoutUserInput, CategoryUncheckedCreateWithoutUserInput>
      | CategoryCreateWithoutUserInput[]
      | CategoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | CategoryCreateOrConnectWithoutUserInput
      | CategoryCreateOrConnectWithoutUserInput[];
    upsert?:
      | CategoryUpsertWithWhereUniqueWithoutUserInput
      | CategoryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: CategoryCreateManyUserInputEnvelope;
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    update?:
      | CategoryUpdateWithWhereUniqueWithoutUserInput
      | CategoryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | CategoryUpdateManyWithWhereWithoutUserInput
      | CategoryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[];
  };

  export type FinanceAccountUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<FinanceAccountCreateWithoutUserInput, FinanceAccountUncheckedCreateWithoutUserInput>
      | FinanceAccountCreateWithoutUserInput[]
      | FinanceAccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | FinanceAccountCreateOrConnectWithoutUserInput
      | FinanceAccountCreateOrConnectWithoutUserInput[];
    upsert?:
      | FinanceAccountUpsertWithWhereUniqueWithoutUserInput
      | FinanceAccountUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: FinanceAccountCreateManyUserInputEnvelope;
    set?: FinanceAccountWhereUniqueInput | FinanceAccountWhereUniqueInput[];
    disconnect?: FinanceAccountWhereUniqueInput | FinanceAccountWhereUniqueInput[];
    delete?: FinanceAccountWhereUniqueInput | FinanceAccountWhereUniqueInput[];
    connect?: FinanceAccountWhereUniqueInput | FinanceAccountWhereUniqueInput[];
    update?:
      | FinanceAccountUpdateWithWhereUniqueWithoutUserInput
      | FinanceAccountUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | FinanceAccountUpdateManyWithWhereWithoutUserInput
      | FinanceAccountUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: FinanceAccountScalarWhereInput | FinanceAccountScalarWhereInput[];
  };

  export type TransactionUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
      | TransactionCreateWithoutUserInput[]
      | TransactionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutUserInput
      | TransactionCreateOrConnectWithoutUserInput[];
    upsert?:
      | TransactionUpsertWithWhereUniqueWithoutUserInput
      | TransactionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: TransactionCreateManyUserInputEnvelope;
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    update?:
      | TransactionUpdateWithWhereUniqueWithoutUserInput
      | TransactionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | TransactionUpdateManyWithWhereWithoutUserInput
      | TransactionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
  };

  export type TransactionCategoryUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          TransactionCategoryCreateWithoutUserInput,
          TransactionCategoryUncheckedCreateWithoutUserInput
        >
      | TransactionCategoryCreateWithoutUserInput[]
      | TransactionCategoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | TransactionCategoryCreateOrConnectWithoutUserInput
      | TransactionCategoryCreateOrConnectWithoutUserInput[];
    upsert?:
      | TransactionCategoryUpsertWithWhereUniqueWithoutUserInput
      | TransactionCategoryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: TransactionCategoryCreateManyUserInputEnvelope;
    set?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    disconnect?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    delete?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    connect?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    update?:
      | TransactionCategoryUpdateWithWhereUniqueWithoutUserInput
      | TransactionCategoryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | TransactionCategoryUpdateManyWithWhereWithoutUserInput
      | TransactionCategoryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: TransactionCategoryScalarWhereInput | TransactionCategoryScalarWhereInput[];
  };

  export type BudgetUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<BudgetCreateWithoutUserInput, BudgetUncheckedCreateWithoutUserInput>
      | BudgetCreateWithoutUserInput[]
      | BudgetUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | BudgetCreateOrConnectWithoutUserInput
      | BudgetCreateOrConnectWithoutUserInput[];
    upsert?:
      | BudgetUpsertWithWhereUniqueWithoutUserInput
      | BudgetUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: BudgetCreateManyUserInputEnvelope;
    set?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[];
    disconnect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[];
    delete?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[];
    connect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[];
    update?:
      | BudgetUpdateWithWhereUniqueWithoutUserInput
      | BudgetUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | BudgetUpdateManyWithWhereWithoutUserInput
      | BudgetUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: BudgetScalarWhereInput | BudgetScalarWhereInput[];
  };

  export type FinancialGoalUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<FinancialGoalCreateWithoutUserInput, FinancialGoalUncheckedCreateWithoutUserInput>
      | FinancialGoalCreateWithoutUserInput[]
      | FinancialGoalUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | FinancialGoalCreateOrConnectWithoutUserInput
      | FinancialGoalCreateOrConnectWithoutUserInput[];
    upsert?:
      | FinancialGoalUpsertWithWhereUniqueWithoutUserInput
      | FinancialGoalUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: FinancialGoalCreateManyUserInputEnvelope;
    set?: FinancialGoalWhereUniqueInput | FinancialGoalWhereUniqueInput[];
    disconnect?: FinancialGoalWhereUniqueInput | FinancialGoalWhereUniqueInput[];
    delete?: FinancialGoalWhereUniqueInput | FinancialGoalWhereUniqueInput[];
    connect?: FinancialGoalWhereUniqueInput | FinancialGoalWhereUniqueInput[];
    update?:
      | FinancialGoalUpdateWithWhereUniqueWithoutUserInput
      | FinancialGoalUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | FinancialGoalUpdateManyWithWhereWithoutUserInput
      | FinancialGoalUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: FinancialGoalScalarWhereInput | FinancialGoalScalarWhereInput[];
  };

  export type TradeUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput>
      | TradeCreateWithoutUserInput[]
      | TradeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: TradeCreateOrConnectWithoutUserInput | TradeCreateOrConnectWithoutUserInput[];
    upsert?:
      | TradeUpsertWithWhereUniqueWithoutUserInput
      | TradeUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: TradeCreateManyUserInputEnvelope;
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    update?:
      | TradeUpdateWithWhereUniqueWithoutUserInput
      | TradeUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | TradeUpdateManyWithWhereWithoutUserInput
      | TradeUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[];
  };

  export type CategoryUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<CategoryCreateWithoutUserInput, CategoryUncheckedCreateWithoutUserInput>
      | CategoryCreateWithoutUserInput[]
      | CategoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | CategoryCreateOrConnectWithoutUserInput
      | CategoryCreateOrConnectWithoutUserInput[];
    upsert?:
      | CategoryUpsertWithWhereUniqueWithoutUserInput
      | CategoryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: CategoryCreateManyUserInputEnvelope;
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    update?:
      | CategoryUpdateWithWhereUniqueWithoutUserInput
      | CategoryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | CategoryUpdateManyWithWhereWithoutUserInput
      | CategoryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[];
  };

  export type FinanceAccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<FinanceAccountCreateWithoutUserInput, FinanceAccountUncheckedCreateWithoutUserInput>
      | FinanceAccountCreateWithoutUserInput[]
      | FinanceAccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | FinanceAccountCreateOrConnectWithoutUserInput
      | FinanceAccountCreateOrConnectWithoutUserInput[];
    upsert?:
      | FinanceAccountUpsertWithWhereUniqueWithoutUserInput
      | FinanceAccountUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: FinanceAccountCreateManyUserInputEnvelope;
    set?: FinanceAccountWhereUniqueInput | FinanceAccountWhereUniqueInput[];
    disconnect?: FinanceAccountWhereUniqueInput | FinanceAccountWhereUniqueInput[];
    delete?: FinanceAccountWhereUniqueInput | FinanceAccountWhereUniqueInput[];
    connect?: FinanceAccountWhereUniqueInput | FinanceAccountWhereUniqueInput[];
    update?:
      | FinanceAccountUpdateWithWhereUniqueWithoutUserInput
      | FinanceAccountUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | FinanceAccountUpdateManyWithWhereWithoutUserInput
      | FinanceAccountUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: FinanceAccountScalarWhereInput | FinanceAccountScalarWhereInput[];
  };

  export type TransactionUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
      | TransactionCreateWithoutUserInput[]
      | TransactionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutUserInput
      | TransactionCreateOrConnectWithoutUserInput[];
    upsert?:
      | TransactionUpsertWithWhereUniqueWithoutUserInput
      | TransactionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: TransactionCreateManyUserInputEnvelope;
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    update?:
      | TransactionUpdateWithWhereUniqueWithoutUserInput
      | TransactionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | TransactionUpdateManyWithWhereWithoutUserInput
      | TransactionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
  };

  export type TransactionCategoryUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          TransactionCategoryCreateWithoutUserInput,
          TransactionCategoryUncheckedCreateWithoutUserInput
        >
      | TransactionCategoryCreateWithoutUserInput[]
      | TransactionCategoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | TransactionCategoryCreateOrConnectWithoutUserInput
      | TransactionCategoryCreateOrConnectWithoutUserInput[];
    upsert?:
      | TransactionCategoryUpsertWithWhereUniqueWithoutUserInput
      | TransactionCategoryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: TransactionCategoryCreateManyUserInputEnvelope;
    set?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    disconnect?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    delete?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    connect?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    update?:
      | TransactionCategoryUpdateWithWhereUniqueWithoutUserInput
      | TransactionCategoryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | TransactionCategoryUpdateManyWithWhereWithoutUserInput
      | TransactionCategoryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: TransactionCategoryScalarWhereInput | TransactionCategoryScalarWhereInput[];
  };

  export type BudgetUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<BudgetCreateWithoutUserInput, BudgetUncheckedCreateWithoutUserInput>
      | BudgetCreateWithoutUserInput[]
      | BudgetUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | BudgetCreateOrConnectWithoutUserInput
      | BudgetCreateOrConnectWithoutUserInput[];
    upsert?:
      | BudgetUpsertWithWhereUniqueWithoutUserInput
      | BudgetUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: BudgetCreateManyUserInputEnvelope;
    set?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[];
    disconnect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[];
    delete?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[];
    connect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[];
    update?:
      | BudgetUpdateWithWhereUniqueWithoutUserInput
      | BudgetUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | BudgetUpdateManyWithWhereWithoutUserInput
      | BudgetUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: BudgetScalarWhereInput | BudgetScalarWhereInput[];
  };

  export type FinancialGoalUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<FinancialGoalCreateWithoutUserInput, FinancialGoalUncheckedCreateWithoutUserInput>
      | FinancialGoalCreateWithoutUserInput[]
      | FinancialGoalUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | FinancialGoalCreateOrConnectWithoutUserInput
      | FinancialGoalCreateOrConnectWithoutUserInput[];
    upsert?:
      | FinancialGoalUpsertWithWhereUniqueWithoutUserInput
      | FinancialGoalUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: FinancialGoalCreateManyUserInputEnvelope;
    set?: FinancialGoalWhereUniqueInput | FinancialGoalWhereUniqueInput[];
    disconnect?: FinancialGoalWhereUniqueInput | FinancialGoalWhereUniqueInput[];
    delete?: FinancialGoalWhereUniqueInput | FinancialGoalWhereUniqueInput[];
    connect?: FinancialGoalWhereUniqueInput | FinancialGoalWhereUniqueInput[];
    update?:
      | FinancialGoalUpdateWithWhereUniqueWithoutUserInput
      | FinancialGoalUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | FinancialGoalUpdateManyWithWhereWithoutUserInput
      | FinancialGoalUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: FinancialGoalScalarWhereInput | FinancialGoalScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutCategoriesInput = {
    create?: XOR<UserCreateWithoutCategoriesInput, UserUncheckedCreateWithoutCategoriesInput>;
    connectOrCreate?: UserCreateOrConnectWithoutCategoriesInput;
    connect?: UserWhereUniqueInput;
  };

  export type TradeCreateNestedManyWithoutCategoryInput = {
    create?:
      | XOR<TradeCreateWithoutCategoryInput, TradeUncheckedCreateWithoutCategoryInput>
      | TradeCreateWithoutCategoryInput[]
      | TradeUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | TradeCreateOrConnectWithoutCategoryInput
      | TradeCreateOrConnectWithoutCategoryInput[];
    createMany?: TradeCreateManyCategoryInputEnvelope;
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
  };

  export type TradeUncheckedCreateNestedManyWithoutCategoryInput = {
    create?:
      | XOR<TradeCreateWithoutCategoryInput, TradeUncheckedCreateWithoutCategoryInput>
      | TradeCreateWithoutCategoryInput[]
      | TradeUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | TradeCreateOrConnectWithoutCategoryInput
      | TradeCreateOrConnectWithoutCategoryInput[];
    createMany?: TradeCreateManyCategoryInputEnvelope;
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
  };

  export type UserUpdateOneRequiredWithoutCategoriesNestedInput = {
    create?: XOR<UserCreateWithoutCategoriesInput, UserUncheckedCreateWithoutCategoriesInput>;
    connectOrCreate?: UserCreateOrConnectWithoutCategoriesInput;
    upsert?: UserUpsertWithoutCategoriesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutCategoriesInput, UserUpdateWithoutCategoriesInput>,
      UserUncheckedUpdateWithoutCategoriesInput
    >;
  };

  export type TradeUpdateManyWithoutCategoryNestedInput = {
    create?:
      | XOR<TradeCreateWithoutCategoryInput, TradeUncheckedCreateWithoutCategoryInput>
      | TradeCreateWithoutCategoryInput[]
      | TradeUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | TradeCreateOrConnectWithoutCategoryInput
      | TradeCreateOrConnectWithoutCategoryInput[];
    upsert?:
      | TradeUpsertWithWhereUniqueWithoutCategoryInput
      | TradeUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: TradeCreateManyCategoryInputEnvelope;
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    update?:
      | TradeUpdateWithWhereUniqueWithoutCategoryInput
      | TradeUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?:
      | TradeUpdateManyWithWhereWithoutCategoryInput
      | TradeUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[];
  };

  export type TradeUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?:
      | XOR<TradeCreateWithoutCategoryInput, TradeUncheckedCreateWithoutCategoryInput>
      | TradeCreateWithoutCategoryInput[]
      | TradeUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | TradeCreateOrConnectWithoutCategoryInput
      | TradeCreateOrConnectWithoutCategoryInput[];
    upsert?:
      | TradeUpsertWithWhereUniqueWithoutCategoryInput
      | TradeUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: TradeCreateManyCategoryInputEnvelope;
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[];
    update?:
      | TradeUpdateWithWhereUniqueWithoutCategoryInput
      | TradeUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?:
      | TradeUpdateManyWithWhereWithoutCategoryInput
      | TradeUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutTradesInput = {
    create?: XOR<UserCreateWithoutTradesInput, UserUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: UserCreateOrConnectWithoutTradesInput;
    connect?: UserWhereUniqueInput;
  };

  export type CategoryCreateNestedOneWithoutTradesInput = {
    create?: XOR<CategoryCreateWithoutTradesInput, CategoryUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: CategoryCreateOrConnectWithoutTradesInput;
    connect?: CategoryWhereUniqueInput;
  };

  export type ScreenshotCreateNestedManyWithoutTradeInput = {
    create?:
      | XOR<ScreenshotCreateWithoutTradeInput, ScreenshotUncheckedCreateWithoutTradeInput>
      | ScreenshotCreateWithoutTradeInput[]
      | ScreenshotUncheckedCreateWithoutTradeInput[];
    connectOrCreate?:
      | ScreenshotCreateOrConnectWithoutTradeInput
      | ScreenshotCreateOrConnectWithoutTradeInput[];
    createMany?: ScreenshotCreateManyTradeInputEnvelope;
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[];
  };

  export type ScreenshotUncheckedCreateNestedManyWithoutTradeInput = {
    create?:
      | XOR<ScreenshotCreateWithoutTradeInput, ScreenshotUncheckedCreateWithoutTradeInput>
      | ScreenshotCreateWithoutTradeInput[]
      | ScreenshotUncheckedCreateWithoutTradeInput[];
    connectOrCreate?:
      | ScreenshotCreateOrConnectWithoutTradeInput
      | ScreenshotCreateOrConnectWithoutTradeInput[];
    createMany?: ScreenshotCreateManyTradeInputEnvelope;
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[];
  };

  export type EnumTradeSideFieldUpdateOperationsInput = {
    set?: $Enums.TradeSide;
  };

  export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type EnumTradeResultFieldUpdateOperationsInput = {
    set?: $Enums.TradeResult;
  };

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type UserUpdateOneRequiredWithoutTradesNestedInput = {
    create?: XOR<UserCreateWithoutTradesInput, UserUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: UserCreateOrConnectWithoutTradesInput;
    upsert?: UserUpsertWithoutTradesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutTradesInput, UserUpdateWithoutTradesInput>,
      UserUncheckedUpdateWithoutTradesInput
    >;
  };

  export type CategoryUpdateOneRequiredWithoutTradesNestedInput = {
    create?: XOR<CategoryCreateWithoutTradesInput, CategoryUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: CategoryCreateOrConnectWithoutTradesInput;
    upsert?: CategoryUpsertWithoutTradesInput;
    connect?: CategoryWhereUniqueInput;
    update?: XOR<
      XOR<CategoryUpdateToOneWithWhereWithoutTradesInput, CategoryUpdateWithoutTradesInput>,
      CategoryUncheckedUpdateWithoutTradesInput
    >;
  };

  export type ScreenshotUpdateManyWithoutTradeNestedInput = {
    create?:
      | XOR<ScreenshotCreateWithoutTradeInput, ScreenshotUncheckedCreateWithoutTradeInput>
      | ScreenshotCreateWithoutTradeInput[]
      | ScreenshotUncheckedCreateWithoutTradeInput[];
    connectOrCreate?:
      | ScreenshotCreateOrConnectWithoutTradeInput
      | ScreenshotCreateOrConnectWithoutTradeInput[];
    upsert?:
      | ScreenshotUpsertWithWhereUniqueWithoutTradeInput
      | ScreenshotUpsertWithWhereUniqueWithoutTradeInput[];
    createMany?: ScreenshotCreateManyTradeInputEnvelope;
    set?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[];
    disconnect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[];
    delete?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[];
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[];
    update?:
      | ScreenshotUpdateWithWhereUniqueWithoutTradeInput
      | ScreenshotUpdateWithWhereUniqueWithoutTradeInput[];
    updateMany?:
      | ScreenshotUpdateManyWithWhereWithoutTradeInput
      | ScreenshotUpdateManyWithWhereWithoutTradeInput[];
    deleteMany?: ScreenshotScalarWhereInput | ScreenshotScalarWhereInput[];
  };

  export type ScreenshotUncheckedUpdateManyWithoutTradeNestedInput = {
    create?:
      | XOR<ScreenshotCreateWithoutTradeInput, ScreenshotUncheckedCreateWithoutTradeInput>
      | ScreenshotCreateWithoutTradeInput[]
      | ScreenshotUncheckedCreateWithoutTradeInput[];
    connectOrCreate?:
      | ScreenshotCreateOrConnectWithoutTradeInput
      | ScreenshotCreateOrConnectWithoutTradeInput[];
    upsert?:
      | ScreenshotUpsertWithWhereUniqueWithoutTradeInput
      | ScreenshotUpsertWithWhereUniqueWithoutTradeInput[];
    createMany?: ScreenshotCreateManyTradeInputEnvelope;
    set?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[];
    disconnect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[];
    delete?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[];
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[];
    update?:
      | ScreenshotUpdateWithWhereUniqueWithoutTradeInput
      | ScreenshotUpdateWithWhereUniqueWithoutTradeInput[];
    updateMany?:
      | ScreenshotUpdateManyWithWhereWithoutTradeInput
      | ScreenshotUpdateManyWithWhereWithoutTradeInput[];
    deleteMany?: ScreenshotScalarWhereInput | ScreenshotScalarWhereInput[];
  };

  export type TradeCreateNestedOneWithoutScreenshotsInput = {
    create?: XOR<TradeCreateWithoutScreenshotsInput, TradeUncheckedCreateWithoutScreenshotsInput>;
    connectOrCreate?: TradeCreateOrConnectWithoutScreenshotsInput;
    connect?: TradeWhereUniqueInput;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type TradeUpdateOneRequiredWithoutScreenshotsNestedInput = {
    create?: XOR<TradeCreateWithoutScreenshotsInput, TradeUncheckedCreateWithoutScreenshotsInput>;
    connectOrCreate?: TradeCreateOrConnectWithoutScreenshotsInput;
    upsert?: TradeUpsertWithoutScreenshotsInput;
    connect?: TradeWhereUniqueInput;
    update?: XOR<
      XOR<TradeUpdateToOneWithWhereWithoutScreenshotsInput, TradeUpdateWithoutScreenshotsInput>,
      TradeUncheckedUpdateWithoutScreenshotsInput
    >;
  };

  export type UserCreateNestedOneWithoutFinanceAccountsInput = {
    create?: XOR<
      UserCreateWithoutFinanceAccountsInput,
      UserUncheckedCreateWithoutFinanceAccountsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutFinanceAccountsInput;
    connect?: UserWhereUniqueInput;
  };

  export type TransactionCreateNestedManyWithoutAccountInput = {
    create?:
      | XOR<TransactionCreateWithoutAccountInput, TransactionUncheckedCreateWithoutAccountInput>
      | TransactionCreateWithoutAccountInput[]
      | TransactionUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutAccountInput
      | TransactionCreateOrConnectWithoutAccountInput[];
    createMany?: TransactionCreateManyAccountInputEnvelope;
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
  };

  export type TransactionCreateNestedManyWithoutTransferToInput = {
    create?:
      | XOR<
          TransactionCreateWithoutTransferToInput,
          TransactionUncheckedCreateWithoutTransferToInput
        >
      | TransactionCreateWithoutTransferToInput[]
      | TransactionUncheckedCreateWithoutTransferToInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutTransferToInput
      | TransactionCreateOrConnectWithoutTransferToInput[];
    createMany?: TransactionCreateManyTransferToInputEnvelope;
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
  };

  export type TransactionUncheckedCreateNestedManyWithoutAccountInput = {
    create?:
      | XOR<TransactionCreateWithoutAccountInput, TransactionUncheckedCreateWithoutAccountInput>
      | TransactionCreateWithoutAccountInput[]
      | TransactionUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutAccountInput
      | TransactionCreateOrConnectWithoutAccountInput[];
    createMany?: TransactionCreateManyAccountInputEnvelope;
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
  };

  export type TransactionUncheckedCreateNestedManyWithoutTransferToInput = {
    create?:
      | XOR<
          TransactionCreateWithoutTransferToInput,
          TransactionUncheckedCreateWithoutTransferToInput
        >
      | TransactionCreateWithoutTransferToInput[]
      | TransactionUncheckedCreateWithoutTransferToInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutTransferToInput
      | TransactionCreateOrConnectWithoutTransferToInput[];
    createMany?: TransactionCreateManyTransferToInputEnvelope;
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
  };

  export type EnumAccountTypeFieldUpdateOperationsInput = {
    set?: $Enums.AccountType;
  };

  export type UserUpdateOneRequiredWithoutFinanceAccountsNestedInput = {
    create?: XOR<
      UserCreateWithoutFinanceAccountsInput,
      UserUncheckedCreateWithoutFinanceAccountsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutFinanceAccountsInput;
    upsert?: UserUpsertWithoutFinanceAccountsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutFinanceAccountsInput,
        UserUpdateWithoutFinanceAccountsInput
      >,
      UserUncheckedUpdateWithoutFinanceAccountsInput
    >;
  };

  export type TransactionUpdateManyWithoutAccountNestedInput = {
    create?:
      | XOR<TransactionCreateWithoutAccountInput, TransactionUncheckedCreateWithoutAccountInput>
      | TransactionCreateWithoutAccountInput[]
      | TransactionUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutAccountInput
      | TransactionCreateOrConnectWithoutAccountInput[];
    upsert?:
      | TransactionUpsertWithWhereUniqueWithoutAccountInput
      | TransactionUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: TransactionCreateManyAccountInputEnvelope;
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    update?:
      | TransactionUpdateWithWhereUniqueWithoutAccountInput
      | TransactionUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?:
      | TransactionUpdateManyWithWhereWithoutAccountInput
      | TransactionUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
  };

  export type TransactionUpdateManyWithoutTransferToNestedInput = {
    create?:
      | XOR<
          TransactionCreateWithoutTransferToInput,
          TransactionUncheckedCreateWithoutTransferToInput
        >
      | TransactionCreateWithoutTransferToInput[]
      | TransactionUncheckedCreateWithoutTransferToInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutTransferToInput
      | TransactionCreateOrConnectWithoutTransferToInput[];
    upsert?:
      | TransactionUpsertWithWhereUniqueWithoutTransferToInput
      | TransactionUpsertWithWhereUniqueWithoutTransferToInput[];
    createMany?: TransactionCreateManyTransferToInputEnvelope;
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    update?:
      | TransactionUpdateWithWhereUniqueWithoutTransferToInput
      | TransactionUpdateWithWhereUniqueWithoutTransferToInput[];
    updateMany?:
      | TransactionUpdateManyWithWhereWithoutTransferToInput
      | TransactionUpdateManyWithWhereWithoutTransferToInput[];
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
  };

  export type TransactionUncheckedUpdateManyWithoutAccountNestedInput = {
    create?:
      | XOR<TransactionCreateWithoutAccountInput, TransactionUncheckedCreateWithoutAccountInput>
      | TransactionCreateWithoutAccountInput[]
      | TransactionUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutAccountInput
      | TransactionCreateOrConnectWithoutAccountInput[];
    upsert?:
      | TransactionUpsertWithWhereUniqueWithoutAccountInput
      | TransactionUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: TransactionCreateManyAccountInputEnvelope;
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    update?:
      | TransactionUpdateWithWhereUniqueWithoutAccountInput
      | TransactionUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?:
      | TransactionUpdateManyWithWhereWithoutAccountInput
      | TransactionUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
  };

  export type TransactionUncheckedUpdateManyWithoutTransferToNestedInput = {
    create?:
      | XOR<
          TransactionCreateWithoutTransferToInput,
          TransactionUncheckedCreateWithoutTransferToInput
        >
      | TransactionCreateWithoutTransferToInput[]
      | TransactionUncheckedCreateWithoutTransferToInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutTransferToInput
      | TransactionCreateOrConnectWithoutTransferToInput[];
    upsert?:
      | TransactionUpsertWithWhereUniqueWithoutTransferToInput
      | TransactionUpsertWithWhereUniqueWithoutTransferToInput[];
    createMany?: TransactionCreateManyTransferToInputEnvelope;
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    update?:
      | TransactionUpdateWithWhereUniqueWithoutTransferToInput
      | TransactionUpdateWithWhereUniqueWithoutTransferToInput[];
    updateMany?:
      | TransactionUpdateManyWithWhereWithoutTransferToInput
      | TransactionUpdateManyWithWhereWithoutTransferToInput[];
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
  };

  export type TransactionCreatetagsInput = {
    set: string[];
  };

  export type UserCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput;
    connect?: UserWhereUniqueInput;
  };

  export type FinanceAccountCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<
      FinanceAccountCreateWithoutTransactionsInput,
      FinanceAccountUncheckedCreateWithoutTransactionsInput
    >;
    connectOrCreate?: FinanceAccountCreateOrConnectWithoutTransactionsInput;
    connect?: FinanceAccountWhereUniqueInput;
  };

  export type TransactionCategoryCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<
      TransactionCategoryCreateWithoutTransactionsInput,
      TransactionCategoryUncheckedCreateWithoutTransactionsInput
    >;
    connectOrCreate?: TransactionCategoryCreateOrConnectWithoutTransactionsInput;
    connect?: TransactionCategoryWhereUniqueInput;
  };

  export type FinanceAccountCreateNestedOneWithoutTransfersToInput = {
    create?: XOR<
      FinanceAccountCreateWithoutTransfersToInput,
      FinanceAccountUncheckedCreateWithoutTransfersToInput
    >;
    connectOrCreate?: FinanceAccountCreateOrConnectWithoutTransfersToInput;
    connect?: FinanceAccountWhereUniqueInput;
  };

  export type EnumTransactionTypeFieldUpdateOperationsInput = {
    set?: $Enums.TransactionType;
  };

  export type TransactionUpdatetagsInput = {
    set?: string[];
    push?: string | string[];
  };

  export type NullableEnumRecurringPatternFieldUpdateOperationsInput = {
    set?: $Enums.RecurringPattern | null;
  };

  export type UserUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput;
    upsert?: UserUpsertWithoutTransactionsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutTransactionsInput, UserUpdateWithoutTransactionsInput>,
      UserUncheckedUpdateWithoutTransactionsInput
    >;
  };

  export type FinanceAccountUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<
      FinanceAccountCreateWithoutTransactionsInput,
      FinanceAccountUncheckedCreateWithoutTransactionsInput
    >;
    connectOrCreate?: FinanceAccountCreateOrConnectWithoutTransactionsInput;
    upsert?: FinanceAccountUpsertWithoutTransactionsInput;
    connect?: FinanceAccountWhereUniqueInput;
    update?: XOR<
      XOR<
        FinanceAccountUpdateToOneWithWhereWithoutTransactionsInput,
        FinanceAccountUpdateWithoutTransactionsInput
      >,
      FinanceAccountUncheckedUpdateWithoutTransactionsInput
    >;
  };

  export type TransactionCategoryUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<
      TransactionCategoryCreateWithoutTransactionsInput,
      TransactionCategoryUncheckedCreateWithoutTransactionsInput
    >;
    connectOrCreate?: TransactionCategoryCreateOrConnectWithoutTransactionsInput;
    upsert?: TransactionCategoryUpsertWithoutTransactionsInput;
    connect?: TransactionCategoryWhereUniqueInput;
    update?: XOR<
      XOR<
        TransactionCategoryUpdateToOneWithWhereWithoutTransactionsInput,
        TransactionCategoryUpdateWithoutTransactionsInput
      >,
      TransactionCategoryUncheckedUpdateWithoutTransactionsInput
    >;
  };

  export type FinanceAccountUpdateOneWithoutTransfersToNestedInput = {
    create?: XOR<
      FinanceAccountCreateWithoutTransfersToInput,
      FinanceAccountUncheckedCreateWithoutTransfersToInput
    >;
    connectOrCreate?: FinanceAccountCreateOrConnectWithoutTransfersToInput;
    upsert?: FinanceAccountUpsertWithoutTransfersToInput;
    disconnect?: FinanceAccountWhereInput | boolean;
    delete?: FinanceAccountWhereInput | boolean;
    connect?: FinanceAccountWhereUniqueInput;
    update?: XOR<
      XOR<
        FinanceAccountUpdateToOneWithWhereWithoutTransfersToInput,
        FinanceAccountUpdateWithoutTransfersToInput
      >,
      FinanceAccountUncheckedUpdateWithoutTransfersToInput
    >;
  };

  export type UserCreateNestedOneWithoutTransactionCategoriesInput = {
    create?: XOR<
      UserCreateWithoutTransactionCategoriesInput,
      UserUncheckedCreateWithoutTransactionCategoriesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutTransactionCategoriesInput;
    connect?: UserWhereUniqueInput;
  };

  export type TransactionCategoryCreateNestedOneWithoutChildrenInput = {
    create?: XOR<
      TransactionCategoryCreateWithoutChildrenInput,
      TransactionCategoryUncheckedCreateWithoutChildrenInput
    >;
    connectOrCreate?: TransactionCategoryCreateOrConnectWithoutChildrenInput;
    connect?: TransactionCategoryWhereUniqueInput;
  };

  export type TransactionCategoryCreateNestedManyWithoutParentInput = {
    create?:
      | XOR<
          TransactionCategoryCreateWithoutParentInput,
          TransactionCategoryUncheckedCreateWithoutParentInput
        >
      | TransactionCategoryCreateWithoutParentInput[]
      | TransactionCategoryUncheckedCreateWithoutParentInput[];
    connectOrCreate?:
      | TransactionCategoryCreateOrConnectWithoutParentInput
      | TransactionCategoryCreateOrConnectWithoutParentInput[];
    createMany?: TransactionCategoryCreateManyParentInputEnvelope;
    connect?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
  };

  export type TransactionCreateNestedManyWithoutCategoryInput = {
    create?:
      | XOR<TransactionCreateWithoutCategoryInput, TransactionUncheckedCreateWithoutCategoryInput>
      | TransactionCreateWithoutCategoryInput[]
      | TransactionUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutCategoryInput
      | TransactionCreateOrConnectWithoutCategoryInput[];
    createMany?: TransactionCreateManyCategoryInputEnvelope;
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
  };

  export type BudgetCategoryCreateNestedManyWithoutCategoryInput = {
    create?:
      | XOR<
          BudgetCategoryCreateWithoutCategoryInput,
          BudgetCategoryUncheckedCreateWithoutCategoryInput
        >
      | BudgetCategoryCreateWithoutCategoryInput[]
      | BudgetCategoryUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | BudgetCategoryCreateOrConnectWithoutCategoryInput
      | BudgetCategoryCreateOrConnectWithoutCategoryInput[];
    createMany?: BudgetCategoryCreateManyCategoryInputEnvelope;
    connect?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
  };

  export type TransactionCategoryUncheckedCreateNestedManyWithoutParentInput = {
    create?:
      | XOR<
          TransactionCategoryCreateWithoutParentInput,
          TransactionCategoryUncheckedCreateWithoutParentInput
        >
      | TransactionCategoryCreateWithoutParentInput[]
      | TransactionCategoryUncheckedCreateWithoutParentInput[];
    connectOrCreate?:
      | TransactionCategoryCreateOrConnectWithoutParentInput
      | TransactionCategoryCreateOrConnectWithoutParentInput[];
    createMany?: TransactionCategoryCreateManyParentInputEnvelope;
    connect?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
  };

  export type TransactionUncheckedCreateNestedManyWithoutCategoryInput = {
    create?:
      | XOR<TransactionCreateWithoutCategoryInput, TransactionUncheckedCreateWithoutCategoryInput>
      | TransactionCreateWithoutCategoryInput[]
      | TransactionUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutCategoryInput
      | TransactionCreateOrConnectWithoutCategoryInput[];
    createMany?: TransactionCreateManyCategoryInputEnvelope;
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
  };

  export type BudgetCategoryUncheckedCreateNestedManyWithoutCategoryInput = {
    create?:
      | XOR<
          BudgetCategoryCreateWithoutCategoryInput,
          BudgetCategoryUncheckedCreateWithoutCategoryInput
        >
      | BudgetCategoryCreateWithoutCategoryInput[]
      | BudgetCategoryUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | BudgetCategoryCreateOrConnectWithoutCategoryInput
      | BudgetCategoryCreateOrConnectWithoutCategoryInput[];
    createMany?: BudgetCategoryCreateManyCategoryInputEnvelope;
    connect?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
  };

  export type UserUpdateOneRequiredWithoutTransactionCategoriesNestedInput = {
    create?: XOR<
      UserCreateWithoutTransactionCategoriesInput,
      UserUncheckedCreateWithoutTransactionCategoriesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutTransactionCategoriesInput;
    upsert?: UserUpsertWithoutTransactionCategoriesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutTransactionCategoriesInput,
        UserUpdateWithoutTransactionCategoriesInput
      >,
      UserUncheckedUpdateWithoutTransactionCategoriesInput
    >;
  };

  export type TransactionCategoryUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<
      TransactionCategoryCreateWithoutChildrenInput,
      TransactionCategoryUncheckedCreateWithoutChildrenInput
    >;
    connectOrCreate?: TransactionCategoryCreateOrConnectWithoutChildrenInput;
    upsert?: TransactionCategoryUpsertWithoutChildrenInput;
    disconnect?: TransactionCategoryWhereInput | boolean;
    delete?: TransactionCategoryWhereInput | boolean;
    connect?: TransactionCategoryWhereUniqueInput;
    update?: XOR<
      XOR<
        TransactionCategoryUpdateToOneWithWhereWithoutChildrenInput,
        TransactionCategoryUpdateWithoutChildrenInput
      >,
      TransactionCategoryUncheckedUpdateWithoutChildrenInput
    >;
  };

  export type TransactionCategoryUpdateManyWithoutParentNestedInput = {
    create?:
      | XOR<
          TransactionCategoryCreateWithoutParentInput,
          TransactionCategoryUncheckedCreateWithoutParentInput
        >
      | TransactionCategoryCreateWithoutParentInput[]
      | TransactionCategoryUncheckedCreateWithoutParentInput[];
    connectOrCreate?:
      | TransactionCategoryCreateOrConnectWithoutParentInput
      | TransactionCategoryCreateOrConnectWithoutParentInput[];
    upsert?:
      | TransactionCategoryUpsertWithWhereUniqueWithoutParentInput
      | TransactionCategoryUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: TransactionCategoryCreateManyParentInputEnvelope;
    set?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    disconnect?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    delete?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    connect?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    update?:
      | TransactionCategoryUpdateWithWhereUniqueWithoutParentInput
      | TransactionCategoryUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?:
      | TransactionCategoryUpdateManyWithWhereWithoutParentInput
      | TransactionCategoryUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: TransactionCategoryScalarWhereInput | TransactionCategoryScalarWhereInput[];
  };

  export type TransactionUpdateManyWithoutCategoryNestedInput = {
    create?:
      | XOR<TransactionCreateWithoutCategoryInput, TransactionUncheckedCreateWithoutCategoryInput>
      | TransactionCreateWithoutCategoryInput[]
      | TransactionUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutCategoryInput
      | TransactionCreateOrConnectWithoutCategoryInput[];
    upsert?:
      | TransactionUpsertWithWhereUniqueWithoutCategoryInput
      | TransactionUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: TransactionCreateManyCategoryInputEnvelope;
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    update?:
      | TransactionUpdateWithWhereUniqueWithoutCategoryInput
      | TransactionUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?:
      | TransactionUpdateManyWithWhereWithoutCategoryInput
      | TransactionUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
  };

  export type BudgetCategoryUpdateManyWithoutCategoryNestedInput = {
    create?:
      | XOR<
          BudgetCategoryCreateWithoutCategoryInput,
          BudgetCategoryUncheckedCreateWithoutCategoryInput
        >
      | BudgetCategoryCreateWithoutCategoryInput[]
      | BudgetCategoryUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | BudgetCategoryCreateOrConnectWithoutCategoryInput
      | BudgetCategoryCreateOrConnectWithoutCategoryInput[];
    upsert?:
      | BudgetCategoryUpsertWithWhereUniqueWithoutCategoryInput
      | BudgetCategoryUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: BudgetCategoryCreateManyCategoryInputEnvelope;
    set?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    disconnect?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    delete?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    connect?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    update?:
      | BudgetCategoryUpdateWithWhereUniqueWithoutCategoryInput
      | BudgetCategoryUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?:
      | BudgetCategoryUpdateManyWithWhereWithoutCategoryInput
      | BudgetCategoryUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: BudgetCategoryScalarWhereInput | BudgetCategoryScalarWhereInput[];
  };

  export type TransactionCategoryUncheckedUpdateManyWithoutParentNestedInput = {
    create?:
      | XOR<
          TransactionCategoryCreateWithoutParentInput,
          TransactionCategoryUncheckedCreateWithoutParentInput
        >
      | TransactionCategoryCreateWithoutParentInput[]
      | TransactionCategoryUncheckedCreateWithoutParentInput[];
    connectOrCreate?:
      | TransactionCategoryCreateOrConnectWithoutParentInput
      | TransactionCategoryCreateOrConnectWithoutParentInput[];
    upsert?:
      | TransactionCategoryUpsertWithWhereUniqueWithoutParentInput
      | TransactionCategoryUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: TransactionCategoryCreateManyParentInputEnvelope;
    set?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    disconnect?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    delete?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    connect?: TransactionCategoryWhereUniqueInput | TransactionCategoryWhereUniqueInput[];
    update?:
      | TransactionCategoryUpdateWithWhereUniqueWithoutParentInput
      | TransactionCategoryUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?:
      | TransactionCategoryUpdateManyWithWhereWithoutParentInput
      | TransactionCategoryUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: TransactionCategoryScalarWhereInput | TransactionCategoryScalarWhereInput[];
  };

  export type TransactionUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?:
      | XOR<TransactionCreateWithoutCategoryInput, TransactionUncheckedCreateWithoutCategoryInput>
      | TransactionCreateWithoutCategoryInput[]
      | TransactionUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutCategoryInput
      | TransactionCreateOrConnectWithoutCategoryInput[];
    upsert?:
      | TransactionUpsertWithWhereUniqueWithoutCategoryInput
      | TransactionUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: TransactionCreateManyCategoryInputEnvelope;
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    update?:
      | TransactionUpdateWithWhereUniqueWithoutCategoryInput
      | TransactionUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?:
      | TransactionUpdateManyWithWhereWithoutCategoryInput
      | TransactionUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
  };

  export type BudgetCategoryUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?:
      | XOR<
          BudgetCategoryCreateWithoutCategoryInput,
          BudgetCategoryUncheckedCreateWithoutCategoryInput
        >
      | BudgetCategoryCreateWithoutCategoryInput[]
      | BudgetCategoryUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | BudgetCategoryCreateOrConnectWithoutCategoryInput
      | BudgetCategoryCreateOrConnectWithoutCategoryInput[];
    upsert?:
      | BudgetCategoryUpsertWithWhereUniqueWithoutCategoryInput
      | BudgetCategoryUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: BudgetCategoryCreateManyCategoryInputEnvelope;
    set?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    disconnect?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    delete?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    connect?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    update?:
      | BudgetCategoryUpdateWithWhereUniqueWithoutCategoryInput
      | BudgetCategoryUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?:
      | BudgetCategoryUpdateManyWithWhereWithoutCategoryInput
      | BudgetCategoryUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: BudgetCategoryScalarWhereInput | BudgetCategoryScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutBudgetsInput = {
    create?: XOR<UserCreateWithoutBudgetsInput, UserUncheckedCreateWithoutBudgetsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutBudgetsInput;
    connect?: UserWhereUniqueInput;
  };

  export type BudgetCategoryCreateNestedManyWithoutBudgetInput = {
    create?:
      | XOR<BudgetCategoryCreateWithoutBudgetInput, BudgetCategoryUncheckedCreateWithoutBudgetInput>
      | BudgetCategoryCreateWithoutBudgetInput[]
      | BudgetCategoryUncheckedCreateWithoutBudgetInput[];
    connectOrCreate?:
      | BudgetCategoryCreateOrConnectWithoutBudgetInput
      | BudgetCategoryCreateOrConnectWithoutBudgetInput[];
    createMany?: BudgetCategoryCreateManyBudgetInputEnvelope;
    connect?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
  };

  export type BudgetCategoryUncheckedCreateNestedManyWithoutBudgetInput = {
    create?:
      | XOR<BudgetCategoryCreateWithoutBudgetInput, BudgetCategoryUncheckedCreateWithoutBudgetInput>
      | BudgetCategoryCreateWithoutBudgetInput[]
      | BudgetCategoryUncheckedCreateWithoutBudgetInput[];
    connectOrCreate?:
      | BudgetCategoryCreateOrConnectWithoutBudgetInput
      | BudgetCategoryCreateOrConnectWithoutBudgetInput[];
    createMany?: BudgetCategoryCreateManyBudgetInputEnvelope;
    connect?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
  };

  export type EnumBudgetPeriodFieldUpdateOperationsInput = {
    set?: $Enums.BudgetPeriod;
  };

  export type UserUpdateOneRequiredWithoutBudgetsNestedInput = {
    create?: XOR<UserCreateWithoutBudgetsInput, UserUncheckedCreateWithoutBudgetsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutBudgetsInput;
    upsert?: UserUpsertWithoutBudgetsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutBudgetsInput, UserUpdateWithoutBudgetsInput>,
      UserUncheckedUpdateWithoutBudgetsInput
    >;
  };

  export type BudgetCategoryUpdateManyWithoutBudgetNestedInput = {
    create?:
      | XOR<BudgetCategoryCreateWithoutBudgetInput, BudgetCategoryUncheckedCreateWithoutBudgetInput>
      | BudgetCategoryCreateWithoutBudgetInput[]
      | BudgetCategoryUncheckedCreateWithoutBudgetInput[];
    connectOrCreate?:
      | BudgetCategoryCreateOrConnectWithoutBudgetInput
      | BudgetCategoryCreateOrConnectWithoutBudgetInput[];
    upsert?:
      | BudgetCategoryUpsertWithWhereUniqueWithoutBudgetInput
      | BudgetCategoryUpsertWithWhereUniqueWithoutBudgetInput[];
    createMany?: BudgetCategoryCreateManyBudgetInputEnvelope;
    set?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    disconnect?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    delete?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    connect?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    update?:
      | BudgetCategoryUpdateWithWhereUniqueWithoutBudgetInput
      | BudgetCategoryUpdateWithWhereUniqueWithoutBudgetInput[];
    updateMany?:
      | BudgetCategoryUpdateManyWithWhereWithoutBudgetInput
      | BudgetCategoryUpdateManyWithWhereWithoutBudgetInput[];
    deleteMany?: BudgetCategoryScalarWhereInput | BudgetCategoryScalarWhereInput[];
  };

  export type BudgetCategoryUncheckedUpdateManyWithoutBudgetNestedInput = {
    create?:
      | XOR<BudgetCategoryCreateWithoutBudgetInput, BudgetCategoryUncheckedCreateWithoutBudgetInput>
      | BudgetCategoryCreateWithoutBudgetInput[]
      | BudgetCategoryUncheckedCreateWithoutBudgetInput[];
    connectOrCreate?:
      | BudgetCategoryCreateOrConnectWithoutBudgetInput
      | BudgetCategoryCreateOrConnectWithoutBudgetInput[];
    upsert?:
      | BudgetCategoryUpsertWithWhereUniqueWithoutBudgetInput
      | BudgetCategoryUpsertWithWhereUniqueWithoutBudgetInput[];
    createMany?: BudgetCategoryCreateManyBudgetInputEnvelope;
    set?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    disconnect?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    delete?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    connect?: BudgetCategoryWhereUniqueInput | BudgetCategoryWhereUniqueInput[];
    update?:
      | BudgetCategoryUpdateWithWhereUniqueWithoutBudgetInput
      | BudgetCategoryUpdateWithWhereUniqueWithoutBudgetInput[];
    updateMany?:
      | BudgetCategoryUpdateManyWithWhereWithoutBudgetInput
      | BudgetCategoryUpdateManyWithWhereWithoutBudgetInput[];
    deleteMany?: BudgetCategoryScalarWhereInput | BudgetCategoryScalarWhereInput[];
  };

  export type BudgetCreateNestedOneWithoutCategoriesInput = {
    create?: XOR<BudgetCreateWithoutCategoriesInput, BudgetUncheckedCreateWithoutCategoriesInput>;
    connectOrCreate?: BudgetCreateOrConnectWithoutCategoriesInput;
    connect?: BudgetWhereUniqueInput;
  };

  export type TransactionCategoryCreateNestedOneWithoutBudgetCategoriesInput = {
    create?: XOR<
      TransactionCategoryCreateWithoutBudgetCategoriesInput,
      TransactionCategoryUncheckedCreateWithoutBudgetCategoriesInput
    >;
    connectOrCreate?: TransactionCategoryCreateOrConnectWithoutBudgetCategoriesInput;
    connect?: TransactionCategoryWhereUniqueInput;
  };

  export type BudgetUpdateOneRequiredWithoutCategoriesNestedInput = {
    create?: XOR<BudgetCreateWithoutCategoriesInput, BudgetUncheckedCreateWithoutCategoriesInput>;
    connectOrCreate?: BudgetCreateOrConnectWithoutCategoriesInput;
    upsert?: BudgetUpsertWithoutCategoriesInput;
    connect?: BudgetWhereUniqueInput;
    update?: XOR<
      XOR<BudgetUpdateToOneWithWhereWithoutCategoriesInput, BudgetUpdateWithoutCategoriesInput>,
      BudgetUncheckedUpdateWithoutCategoriesInput
    >;
  };

  export type TransactionCategoryUpdateOneRequiredWithoutBudgetCategoriesNestedInput = {
    create?: XOR<
      TransactionCategoryCreateWithoutBudgetCategoriesInput,
      TransactionCategoryUncheckedCreateWithoutBudgetCategoriesInput
    >;
    connectOrCreate?: TransactionCategoryCreateOrConnectWithoutBudgetCategoriesInput;
    upsert?: TransactionCategoryUpsertWithoutBudgetCategoriesInput;
    connect?: TransactionCategoryWhereUniqueInput;
    update?: XOR<
      XOR<
        TransactionCategoryUpdateToOneWithWhereWithoutBudgetCategoriesInput,
        TransactionCategoryUpdateWithoutBudgetCategoriesInput
      >,
      TransactionCategoryUncheckedUpdateWithoutBudgetCategoriesInput
    >;
  };

  export type UserCreateNestedOneWithoutFinancialGoalsInput = {
    create?: XOR<
      UserCreateWithoutFinancialGoalsInput,
      UserUncheckedCreateWithoutFinancialGoalsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutFinancialGoalsInput;
    connect?: UserWhereUniqueInput;
  };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type UserUpdateOneRequiredWithoutFinancialGoalsNestedInput = {
    create?: XOR<
      UserCreateWithoutFinancialGoalsInput,
      UserUncheckedCreateWithoutFinancialGoalsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutFinancialGoalsInput;
    upsert?: UserUpsertWithoutFinancialGoalsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutFinancialGoalsInput, UserUpdateWithoutFinancialGoalsInput>,
      UserUncheckedUpdateWithoutFinancialGoalsInput
    >;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedEnumTradeSideFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeSide | EnumTradeSideFieldRefInput<$PrismaModel>;
    in?: $Enums.TradeSide[] | ListEnumTradeSideFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TradeSide[] | ListEnumTradeSideFieldRefInput<$PrismaModel>;
    not?: NestedEnumTradeSideFilter<$PrismaModel> | $Enums.TradeSide;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type NestedEnumTradeResultFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeResult | EnumTradeResultFieldRefInput<$PrismaModel>;
    in?: $Enums.TradeResult[] | ListEnumTradeResultFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TradeResult[] | ListEnumTradeResultFieldRefInput<$PrismaModel>;
    not?: NestedEnumTradeResultFilter<$PrismaModel> | $Enums.TradeResult;
  };

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedEnumTradeSideWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeSide | EnumTradeSideFieldRefInput<$PrismaModel>;
    in?: $Enums.TradeSide[] | ListEnumTradeSideFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TradeSide[] | ListEnumTradeSideFieldRefInput<$PrismaModel>;
    not?: NestedEnumTradeSideWithAggregatesFilter<$PrismaModel> | $Enums.TradeSide;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumTradeSideFilter<$PrismaModel>;
    _max?: NestedEnumTradeSideFilter<$PrismaModel>;
  };

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };

  export type NestedEnumTradeResultWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeResult | EnumTradeResultFieldRefInput<$PrismaModel>;
    in?: $Enums.TradeResult[] | ListEnumTradeResultFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TradeResult[] | ListEnumTradeResultFieldRefInput<$PrismaModel>;
    not?: NestedEnumTradeResultWithAggregatesFilter<$PrismaModel> | $Enums.TradeResult;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumTradeResultFilter<$PrismaModel>;
    _max?: NestedEnumTradeResultFilter<$PrismaModel>;
  };

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedFloatNullableFilter<$PrismaModel>;
    _min?: NestedFloatNullableFilter<$PrismaModel>;
    _max?: NestedFloatNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedEnumAccountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | EnumAccountTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumAccountTypeFilter<$PrismaModel> | $Enums.AccountType;
  };

  export type NestedEnumAccountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | EnumAccountTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumAccountTypeWithAggregatesFilter<$PrismaModel> | $Enums.AccountType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumAccountTypeFilter<$PrismaModel>;
    _max?: NestedEnumAccountTypeFilter<$PrismaModel>;
  };

  export type NestedEnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType;
  };

  export type NestedEnumRecurringPatternNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.RecurringPattern | EnumRecurringPatternFieldRefInput<$PrismaModel> | null;
    in?: $Enums.RecurringPattern[] | ListEnumRecurringPatternFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.RecurringPattern[] | ListEnumRecurringPatternFieldRefInput<$PrismaModel> | null;
    not?: NestedEnumRecurringPatternNullableFilter<$PrismaModel> | $Enums.RecurringPattern | null;
  };

  export type NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>;
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>;
  };

  export type NestedEnumRecurringPatternNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RecurringPattern | EnumRecurringPatternFieldRefInput<$PrismaModel> | null;
    in?: $Enums.RecurringPattern[] | ListEnumRecurringPatternFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.RecurringPattern[] | ListEnumRecurringPatternFieldRefInput<$PrismaModel> | null;
    not?:
      | NestedEnumRecurringPatternNullableWithAggregatesFilter<$PrismaModel>
      | $Enums.RecurringPattern
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedEnumRecurringPatternNullableFilter<$PrismaModel>;
    _max?: NestedEnumRecurringPatternNullableFilter<$PrismaModel>;
  };

  export type NestedEnumBudgetPeriodFilter<$PrismaModel = never> = {
    equals?: $Enums.BudgetPeriod | EnumBudgetPeriodFieldRefInput<$PrismaModel>;
    in?: $Enums.BudgetPeriod[] | ListEnumBudgetPeriodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BudgetPeriod[] | ListEnumBudgetPeriodFieldRefInput<$PrismaModel>;
    not?: NestedEnumBudgetPeriodFilter<$PrismaModel> | $Enums.BudgetPeriod;
  };

  export type NestedEnumBudgetPeriodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BudgetPeriod | EnumBudgetPeriodFieldRefInput<$PrismaModel>;
    in?: $Enums.BudgetPeriod[] | ListEnumBudgetPeriodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BudgetPeriod[] | ListEnumBudgetPeriodFieldRefInput<$PrismaModel>;
    not?: NestedEnumBudgetPeriodWithAggregatesFilter<$PrismaModel> | $Enums.BudgetPeriod;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumBudgetPeriodFilter<$PrismaModel>;
    _max?: NestedEnumBudgetPeriodFilter<$PrismaModel>;
  };

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type TradeCreateWithoutUserInput = {
    id?: string;
    date?: Date | string;
    symbol: string;
    side: $Enums.TradeSide;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: $Enums.TradeResult;
    leverage?: number | null;
    investment?: number | null;
    createdAt?: Date | string;
    deposit: number;
    isDemo?: boolean;
    comment?: string | null;
    category: CategoryCreateNestedOneWithoutTradesInput;
    screenshots?: ScreenshotCreateNestedManyWithoutTradeInput;
  };

  export type TradeUncheckedCreateWithoutUserInput = {
    id?: string;
    categoryId: string;
    date?: Date | string;
    symbol: string;
    side: $Enums.TradeSide;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: $Enums.TradeResult;
    leverage?: number | null;
    investment?: number | null;
    createdAt?: Date | string;
    deposit: number;
    isDemo?: boolean;
    comment?: string | null;
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutTradeInput;
  };

  export type TradeCreateOrConnectWithoutUserInput = {
    where: TradeWhereUniqueInput;
    create: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput>;
  };

  export type TradeCreateManyUserInputEnvelope = {
    data: TradeCreateManyUserInput | TradeCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type CategoryCreateWithoutUserInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    trades?: TradeCreateNestedManyWithoutCategoryInput;
  };

  export type CategoryUncheckedCreateWithoutUserInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    trades?: TradeUncheckedCreateNestedManyWithoutCategoryInput;
  };

  export type CategoryCreateOrConnectWithoutUserInput = {
    where: CategoryWhereUniqueInput;
    create: XOR<CategoryCreateWithoutUserInput, CategoryUncheckedCreateWithoutUserInput>;
  };

  export type CategoryCreateManyUserInputEnvelope = {
    data: CategoryCreateManyUserInput | CategoryCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type FinanceAccountCreateWithoutUserInput = {
    id?: string;
    name: string;
    type: $Enums.AccountType;
    currency?: string;
    balance?: number;
    isActive?: boolean;
    isDemo?: boolean;
    color?: string | null;
    icon?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: TransactionCreateNestedManyWithoutAccountInput;
    transfersTo?: TransactionCreateNestedManyWithoutTransferToInput;
  };

  export type FinanceAccountUncheckedCreateWithoutUserInput = {
    id?: string;
    name: string;
    type: $Enums.AccountType;
    currency?: string;
    balance?: number;
    isActive?: boolean;
    isDemo?: boolean;
    color?: string | null;
    icon?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: TransactionUncheckedCreateNestedManyWithoutAccountInput;
    transfersTo?: TransactionUncheckedCreateNestedManyWithoutTransferToInput;
  };

  export type FinanceAccountCreateOrConnectWithoutUserInput = {
    where: FinanceAccountWhereUniqueInput;
    create: XOR<
      FinanceAccountCreateWithoutUserInput,
      FinanceAccountUncheckedCreateWithoutUserInput
    >;
  };

  export type FinanceAccountCreateManyUserInputEnvelope = {
    data: FinanceAccountCreateManyUserInput | FinanceAccountCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type TransactionCreateWithoutUserInput = {
    id?: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    account: FinanceAccountCreateNestedOneWithoutTransactionsInput;
    category: TransactionCategoryCreateNestedOneWithoutTransactionsInput;
    transferTo?: FinanceAccountCreateNestedOneWithoutTransfersToInput;
  };

  export type TransactionUncheckedCreateWithoutUserInput = {
    id?: string;
    accountId: string;
    categoryId: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    transferToId?: string | null;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionCreateOrConnectWithoutUserInput = {
    where: TransactionWhereUniqueInput;
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>;
  };

  export type TransactionCreateManyUserInputEnvelope = {
    data: TransactionCreateManyUserInput | TransactionCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type TransactionCategoryCreateWithoutUserInput = {
    id?: string;
    name: string;
    type: $Enums.TransactionType;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    parent?: TransactionCategoryCreateNestedOneWithoutChildrenInput;
    children?: TransactionCategoryCreateNestedManyWithoutParentInput;
    transactions?: TransactionCreateNestedManyWithoutCategoryInput;
    budgetCategories?: BudgetCategoryCreateNestedManyWithoutCategoryInput;
  };

  export type TransactionCategoryUncheckedCreateWithoutUserInput = {
    id?: string;
    name: string;
    type: $Enums.TransactionType;
    parentId?: string | null;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    children?: TransactionCategoryUncheckedCreateNestedManyWithoutParentInput;
    transactions?: TransactionUncheckedCreateNestedManyWithoutCategoryInput;
    budgetCategories?: BudgetCategoryUncheckedCreateNestedManyWithoutCategoryInput;
  };

  export type TransactionCategoryCreateOrConnectWithoutUserInput = {
    where: TransactionCategoryWhereUniqueInput;
    create: XOR<
      TransactionCategoryCreateWithoutUserInput,
      TransactionCategoryUncheckedCreateWithoutUserInput
    >;
  };

  export type TransactionCategoryCreateManyUserInputEnvelope = {
    data: TransactionCategoryCreateManyUserInput | TransactionCategoryCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type BudgetCreateWithoutUserInput = {
    id?: string;
    name: string;
    period: $Enums.BudgetPeriod;
    startDate: Date | string;
    endDate: Date | string;
    currency?: string;
    totalPlanned: number;
    totalActual?: number;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    categories?: BudgetCategoryCreateNestedManyWithoutBudgetInput;
  };

  export type BudgetUncheckedCreateWithoutUserInput = {
    id?: string;
    name: string;
    period: $Enums.BudgetPeriod;
    startDate: Date | string;
    endDate: Date | string;
    currency?: string;
    totalPlanned: number;
    totalActual?: number;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    categories?: BudgetCategoryUncheckedCreateNestedManyWithoutBudgetInput;
  };

  export type BudgetCreateOrConnectWithoutUserInput = {
    where: BudgetWhereUniqueInput;
    create: XOR<BudgetCreateWithoutUserInput, BudgetUncheckedCreateWithoutUserInput>;
  };

  export type BudgetCreateManyUserInputEnvelope = {
    data: BudgetCreateManyUserInput | BudgetCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type FinancialGoalCreateWithoutUserInput = {
    id?: string;
    name: string;
    description?: string | null;
    targetAmount: number;
    currentAmount?: number;
    currency?: string;
    deadline?: Date | string | null;
    color: string;
    icon: string;
    isActive?: boolean;
    isCompleted?: boolean;
    isDemo?: boolean;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type FinancialGoalUncheckedCreateWithoutUserInput = {
    id?: string;
    name: string;
    description?: string | null;
    targetAmount: number;
    currentAmount?: number;
    currency?: string;
    deadline?: Date | string | null;
    color: string;
    icon: string;
    isActive?: boolean;
    isCompleted?: boolean;
    isDemo?: boolean;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type FinancialGoalCreateOrConnectWithoutUserInput = {
    where: FinancialGoalWhereUniqueInput;
    create: XOR<FinancialGoalCreateWithoutUserInput, FinancialGoalUncheckedCreateWithoutUserInput>;
  };

  export type FinancialGoalCreateManyUserInputEnvelope = {
    data: FinancialGoalCreateManyUserInput | FinancialGoalCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type TradeUpsertWithWhereUniqueWithoutUserInput = {
    where: TradeWhereUniqueInput;
    update: XOR<TradeUpdateWithoutUserInput, TradeUncheckedUpdateWithoutUserInput>;
    create: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput>;
  };

  export type TradeUpdateWithWhereUniqueWithoutUserInput = {
    where: TradeWhereUniqueInput;
    data: XOR<TradeUpdateWithoutUserInput, TradeUncheckedUpdateWithoutUserInput>;
  };

  export type TradeUpdateManyWithWhereWithoutUserInput = {
    where: TradeScalarWhereInput;
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyWithoutUserInput>;
  };

  export type TradeScalarWhereInput = {
    AND?: TradeScalarWhereInput | TradeScalarWhereInput[];
    OR?: TradeScalarWhereInput[];
    NOT?: TradeScalarWhereInput | TradeScalarWhereInput[];
    id?: StringFilter<'Trade'> | string;
    userId?: StringFilter<'Trade'> | string;
    categoryId?: StringFilter<'Trade'> | string;
    date?: DateTimeFilter<'Trade'> | Date | string;
    symbol?: StringFilter<'Trade'> | string;
    side?: EnumTradeSideFilter<'Trade'> | $Enums.TradeSide;
    entryPrice?: FloatFilter<'Trade'> | number;
    positionSize?: FloatFilter<'Trade'> | number;
    stopLoss?: FloatFilter<'Trade'> | number;
    exitPrice?: FloatFilter<'Trade'> | number;
    commission?: FloatFilter<'Trade'> | number;
    riskPercent?: FloatFilter<'Trade'> | number;
    pnl?: FloatFilter<'Trade'> | number;
    result?: EnumTradeResultFilter<'Trade'> | $Enums.TradeResult;
    leverage?: FloatNullableFilter<'Trade'> | number | null;
    investment?: FloatNullableFilter<'Trade'> | number | null;
    createdAt?: DateTimeFilter<'Trade'> | Date | string;
    deposit?: FloatFilter<'Trade'> | number;
    isDemo?: BoolFilter<'Trade'> | boolean;
    comment?: StringNullableFilter<'Trade'> | string | null;
  };

  export type CategoryUpsertWithWhereUniqueWithoutUserInput = {
    where: CategoryWhereUniqueInput;
    update: XOR<CategoryUpdateWithoutUserInput, CategoryUncheckedUpdateWithoutUserInput>;
    create: XOR<CategoryCreateWithoutUserInput, CategoryUncheckedCreateWithoutUserInput>;
  };

  export type CategoryUpdateWithWhereUniqueWithoutUserInput = {
    where: CategoryWhereUniqueInput;
    data: XOR<CategoryUpdateWithoutUserInput, CategoryUncheckedUpdateWithoutUserInput>;
  };

  export type CategoryUpdateManyWithWhereWithoutUserInput = {
    where: CategoryScalarWhereInput;
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyWithoutUserInput>;
  };

  export type CategoryScalarWhereInput = {
    AND?: CategoryScalarWhereInput | CategoryScalarWhereInput[];
    OR?: CategoryScalarWhereInput[];
    NOT?: CategoryScalarWhereInput | CategoryScalarWhereInput[];
    id?: StringFilter<'Category'> | string;
    name?: StringFilter<'Category'> | string;
    userId?: StringFilter<'Category'> | string;
    createdAt?: DateTimeFilter<'Category'> | Date | string;
  };

  export type FinanceAccountUpsertWithWhereUniqueWithoutUserInput = {
    where: FinanceAccountWhereUniqueInput;
    update: XOR<
      FinanceAccountUpdateWithoutUserInput,
      FinanceAccountUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      FinanceAccountCreateWithoutUserInput,
      FinanceAccountUncheckedCreateWithoutUserInput
    >;
  };

  export type FinanceAccountUpdateWithWhereUniqueWithoutUserInput = {
    where: FinanceAccountWhereUniqueInput;
    data: XOR<FinanceAccountUpdateWithoutUserInput, FinanceAccountUncheckedUpdateWithoutUserInput>;
  };

  export type FinanceAccountUpdateManyWithWhereWithoutUserInput = {
    where: FinanceAccountScalarWhereInput;
    data: XOR<
      FinanceAccountUpdateManyMutationInput,
      FinanceAccountUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type FinanceAccountScalarWhereInput = {
    AND?: FinanceAccountScalarWhereInput | FinanceAccountScalarWhereInput[];
    OR?: FinanceAccountScalarWhereInput[];
    NOT?: FinanceAccountScalarWhereInput | FinanceAccountScalarWhereInput[];
    id?: StringFilter<'FinanceAccount'> | string;
    userId?: StringFilter<'FinanceAccount'> | string;
    name?: StringFilter<'FinanceAccount'> | string;
    type?: EnumAccountTypeFilter<'FinanceAccount'> | $Enums.AccountType;
    currency?: StringFilter<'FinanceAccount'> | string;
    balance?: FloatFilter<'FinanceAccount'> | number;
    isActive?: BoolFilter<'FinanceAccount'> | boolean;
    isDemo?: BoolFilter<'FinanceAccount'> | boolean;
    color?: StringNullableFilter<'FinanceAccount'> | string | null;
    icon?: StringNullableFilter<'FinanceAccount'> | string | null;
    description?: StringNullableFilter<'FinanceAccount'> | string | null;
    createdAt?: DateTimeFilter<'FinanceAccount'> | Date | string;
    updatedAt?: DateTimeFilter<'FinanceAccount'> | Date | string;
  };

  export type TransactionUpsertWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput;
    update: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>;
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>;
  };

  export type TransactionUpdateWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput;
    data: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>;
  };

  export type TransactionUpdateManyWithWhereWithoutUserInput = {
    where: TransactionScalarWhereInput;
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutUserInput>;
  };

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
    OR?: TransactionScalarWhereInput[];
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
    id?: StringFilter<'Transaction'> | string;
    userId?: StringFilter<'Transaction'> | string;
    accountId?: StringFilter<'Transaction'> | string;
    categoryId?: StringFilter<'Transaction'> | string;
    type?: EnumTransactionTypeFilter<'Transaction'> | $Enums.TransactionType;
    amount?: FloatFilter<'Transaction'> | number;
    currency?: StringFilter<'Transaction'> | string;
    description?: StringNullableFilter<'Transaction'> | string | null;
    date?: DateTimeFilter<'Transaction'> | Date | string;
    tags?: StringNullableListFilter<'Transaction'>;
    isDemo?: BoolFilter<'Transaction'> | boolean;
    transferToId?: StringNullableFilter<'Transaction'> | string | null;
    isRecurring?: BoolFilter<'Transaction'> | boolean;
    recurringPattern?:
      | EnumRecurringPatternNullableFilter<'Transaction'>
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: StringNullableFilter<'Transaction'> | string | null;
    createdAt?: DateTimeFilter<'Transaction'> | Date | string;
    updatedAt?: DateTimeFilter<'Transaction'> | Date | string;
  };

  export type TransactionCategoryUpsertWithWhereUniqueWithoutUserInput = {
    where: TransactionCategoryWhereUniqueInput;
    update: XOR<
      TransactionCategoryUpdateWithoutUserInput,
      TransactionCategoryUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      TransactionCategoryCreateWithoutUserInput,
      TransactionCategoryUncheckedCreateWithoutUserInput
    >;
  };

  export type TransactionCategoryUpdateWithWhereUniqueWithoutUserInput = {
    where: TransactionCategoryWhereUniqueInput;
    data: XOR<
      TransactionCategoryUpdateWithoutUserInput,
      TransactionCategoryUncheckedUpdateWithoutUserInput
    >;
  };

  export type TransactionCategoryUpdateManyWithWhereWithoutUserInput = {
    where: TransactionCategoryScalarWhereInput;
    data: XOR<
      TransactionCategoryUpdateManyMutationInput,
      TransactionCategoryUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type TransactionCategoryScalarWhereInput = {
    AND?: TransactionCategoryScalarWhereInput | TransactionCategoryScalarWhereInput[];
    OR?: TransactionCategoryScalarWhereInput[];
    NOT?: TransactionCategoryScalarWhereInput | TransactionCategoryScalarWhereInput[];
    id?: StringFilter<'TransactionCategory'> | string;
    userId?: StringFilter<'TransactionCategory'> | string;
    name?: StringFilter<'TransactionCategory'> | string;
    type?: EnumTransactionTypeFilter<'TransactionCategory'> | $Enums.TransactionType;
    parentId?: StringNullableFilter<'TransactionCategory'> | string | null;
    color?: StringFilter<'TransactionCategory'> | string;
    icon?: StringFilter<'TransactionCategory'> | string;
    isDefault?: BoolFilter<'TransactionCategory'> | boolean;
    isActive?: BoolFilter<'TransactionCategory'> | boolean;
    isDemo?: BoolFilter<'TransactionCategory'> | boolean;
    createdAt?: DateTimeFilter<'TransactionCategory'> | Date | string;
  };

  export type BudgetUpsertWithWhereUniqueWithoutUserInput = {
    where: BudgetWhereUniqueInput;
    update: XOR<BudgetUpdateWithoutUserInput, BudgetUncheckedUpdateWithoutUserInput>;
    create: XOR<BudgetCreateWithoutUserInput, BudgetUncheckedCreateWithoutUserInput>;
  };

  export type BudgetUpdateWithWhereUniqueWithoutUserInput = {
    where: BudgetWhereUniqueInput;
    data: XOR<BudgetUpdateWithoutUserInput, BudgetUncheckedUpdateWithoutUserInput>;
  };

  export type BudgetUpdateManyWithWhereWithoutUserInput = {
    where: BudgetScalarWhereInput;
    data: XOR<BudgetUpdateManyMutationInput, BudgetUncheckedUpdateManyWithoutUserInput>;
  };

  export type BudgetScalarWhereInput = {
    AND?: BudgetScalarWhereInput | BudgetScalarWhereInput[];
    OR?: BudgetScalarWhereInput[];
    NOT?: BudgetScalarWhereInput | BudgetScalarWhereInput[];
    id?: StringFilter<'Budget'> | string;
    userId?: StringFilter<'Budget'> | string;
    name?: StringFilter<'Budget'> | string;
    period?: EnumBudgetPeriodFilter<'Budget'> | $Enums.BudgetPeriod;
    startDate?: DateTimeFilter<'Budget'> | Date | string;
    endDate?: DateTimeFilter<'Budget'> | Date | string;
    currency?: StringFilter<'Budget'> | string;
    totalPlanned?: FloatFilter<'Budget'> | number;
    totalActual?: FloatFilter<'Budget'> | number;
    isActive?: BoolFilter<'Budget'> | boolean;
    isDemo?: BoolFilter<'Budget'> | boolean;
    createdAt?: DateTimeFilter<'Budget'> | Date | string;
    updatedAt?: DateTimeFilter<'Budget'> | Date | string;
  };

  export type FinancialGoalUpsertWithWhereUniqueWithoutUserInput = {
    where: FinancialGoalWhereUniqueInput;
    update: XOR<FinancialGoalUpdateWithoutUserInput, FinancialGoalUncheckedUpdateWithoutUserInput>;
    create: XOR<FinancialGoalCreateWithoutUserInput, FinancialGoalUncheckedCreateWithoutUserInput>;
  };

  export type FinancialGoalUpdateWithWhereUniqueWithoutUserInput = {
    where: FinancialGoalWhereUniqueInput;
    data: XOR<FinancialGoalUpdateWithoutUserInput, FinancialGoalUncheckedUpdateWithoutUserInput>;
  };

  export type FinancialGoalUpdateManyWithWhereWithoutUserInput = {
    where: FinancialGoalScalarWhereInput;
    data: XOR<
      FinancialGoalUpdateManyMutationInput,
      FinancialGoalUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type FinancialGoalScalarWhereInput = {
    AND?: FinancialGoalScalarWhereInput | FinancialGoalScalarWhereInput[];
    OR?: FinancialGoalScalarWhereInput[];
    NOT?: FinancialGoalScalarWhereInput | FinancialGoalScalarWhereInput[];
    id?: StringFilter<'FinancialGoal'> | string;
    userId?: StringFilter<'FinancialGoal'> | string;
    name?: StringFilter<'FinancialGoal'> | string;
    description?: StringNullableFilter<'FinancialGoal'> | string | null;
    targetAmount?: FloatFilter<'FinancialGoal'> | number;
    currentAmount?: FloatFilter<'FinancialGoal'> | number;
    currency?: StringFilter<'FinancialGoal'> | string;
    deadline?: DateTimeNullableFilter<'FinancialGoal'> | Date | string | null;
    color?: StringFilter<'FinancialGoal'> | string;
    icon?: StringFilter<'FinancialGoal'> | string;
    isActive?: BoolFilter<'FinancialGoal'> | boolean;
    isCompleted?: BoolFilter<'FinancialGoal'> | boolean;
    isDemo?: BoolFilter<'FinancialGoal'> | boolean;
    completedAt?: DateTimeNullableFilter<'FinancialGoal'> | Date | string | null;
    createdAt?: DateTimeFilter<'FinancialGoal'> | Date | string;
    updatedAt?: DateTimeFilter<'FinancialGoal'> | Date | string;
  };

  export type UserCreateWithoutCategoriesInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountCreateNestedManyWithoutUserInput;
    transactions?: TransactionCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryCreateNestedManyWithoutUserInput;
    budgets?: BudgetCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutCategoriesInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountUncheckedCreateNestedManyWithoutUserInput;
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryUncheckedCreateNestedManyWithoutUserInput;
    budgets?: BudgetUncheckedCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutCategoriesInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutCategoriesInput, UserUncheckedCreateWithoutCategoriesInput>;
  };

  export type TradeCreateWithoutCategoryInput = {
    id?: string;
    date?: Date | string;
    symbol: string;
    side: $Enums.TradeSide;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: $Enums.TradeResult;
    leverage?: number | null;
    investment?: number | null;
    createdAt?: Date | string;
    deposit: number;
    isDemo?: boolean;
    comment?: string | null;
    user: UserCreateNestedOneWithoutTradesInput;
    screenshots?: ScreenshotCreateNestedManyWithoutTradeInput;
  };

  export type TradeUncheckedCreateWithoutCategoryInput = {
    id?: string;
    userId: string;
    date?: Date | string;
    symbol: string;
    side: $Enums.TradeSide;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: $Enums.TradeResult;
    leverage?: number | null;
    investment?: number | null;
    createdAt?: Date | string;
    deposit: number;
    isDemo?: boolean;
    comment?: string | null;
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutTradeInput;
  };

  export type TradeCreateOrConnectWithoutCategoryInput = {
    where: TradeWhereUniqueInput;
    create: XOR<TradeCreateWithoutCategoryInput, TradeUncheckedCreateWithoutCategoryInput>;
  };

  export type TradeCreateManyCategoryInputEnvelope = {
    data: TradeCreateManyCategoryInput | TradeCreateManyCategoryInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutCategoriesInput = {
    update: XOR<UserUpdateWithoutCategoriesInput, UserUncheckedUpdateWithoutCategoriesInput>;
    create: XOR<UserCreateWithoutCategoriesInput, UserUncheckedCreateWithoutCategoriesInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutCategoriesInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutCategoriesInput, UserUncheckedUpdateWithoutCategoriesInput>;
  };

  export type UserUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUncheckedUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUncheckedUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type TradeUpsertWithWhereUniqueWithoutCategoryInput = {
    where: TradeWhereUniqueInput;
    update: XOR<TradeUpdateWithoutCategoryInput, TradeUncheckedUpdateWithoutCategoryInput>;
    create: XOR<TradeCreateWithoutCategoryInput, TradeUncheckedCreateWithoutCategoryInput>;
  };

  export type TradeUpdateWithWhereUniqueWithoutCategoryInput = {
    where: TradeWhereUniqueInput;
    data: XOR<TradeUpdateWithoutCategoryInput, TradeUncheckedUpdateWithoutCategoryInput>;
  };

  export type TradeUpdateManyWithWhereWithoutCategoryInput = {
    where: TradeScalarWhereInput;
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyWithoutCategoryInput>;
  };

  export type UserCreateWithoutTradesInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    categories?: CategoryCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountCreateNestedManyWithoutUserInput;
    transactions?: TransactionCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryCreateNestedManyWithoutUserInput;
    budgets?: BudgetCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutTradesInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    categories?: CategoryUncheckedCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountUncheckedCreateNestedManyWithoutUserInput;
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryUncheckedCreateNestedManyWithoutUserInput;
    budgets?: BudgetUncheckedCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutTradesInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutTradesInput, UserUncheckedCreateWithoutTradesInput>;
  };

  export type CategoryCreateWithoutTradesInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutCategoriesInput;
  };

  export type CategoryUncheckedCreateWithoutTradesInput = {
    id?: string;
    name: string;
    userId: string;
    createdAt?: Date | string;
  };

  export type CategoryCreateOrConnectWithoutTradesInput = {
    where: CategoryWhereUniqueInput;
    create: XOR<CategoryCreateWithoutTradesInput, CategoryUncheckedCreateWithoutTradesInput>;
  };

  export type ScreenshotCreateWithoutTradeInput = {
    id?: string;
    imageData: string;
    createdAt?: Date | string;
    order?: number;
  };

  export type ScreenshotUncheckedCreateWithoutTradeInput = {
    id?: string;
    imageData: string;
    createdAt?: Date | string;
    order?: number;
  };

  export type ScreenshotCreateOrConnectWithoutTradeInput = {
    where: ScreenshotWhereUniqueInput;
    create: XOR<ScreenshotCreateWithoutTradeInput, ScreenshotUncheckedCreateWithoutTradeInput>;
  };

  export type ScreenshotCreateManyTradeInputEnvelope = {
    data: ScreenshotCreateManyTradeInput | ScreenshotCreateManyTradeInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutTradesInput = {
    update: XOR<UserUpdateWithoutTradesInput, UserUncheckedUpdateWithoutTradesInput>;
    create: XOR<UserCreateWithoutTradesInput, UserUncheckedCreateWithoutTradesInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutTradesInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutTradesInput, UserUncheckedUpdateWithoutTradesInput>;
  };

  export type UserUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    categories?: CategoryUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    categories?: CategoryUncheckedUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUncheckedUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUncheckedUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type CategoryUpsertWithoutTradesInput = {
    update: XOR<CategoryUpdateWithoutTradesInput, CategoryUncheckedUpdateWithoutTradesInput>;
    create: XOR<CategoryCreateWithoutTradesInput, CategoryUncheckedCreateWithoutTradesInput>;
    where?: CategoryWhereInput;
  };

  export type CategoryUpdateToOneWithWhereWithoutTradesInput = {
    where?: CategoryWhereInput;
    data: XOR<CategoryUpdateWithoutTradesInput, CategoryUncheckedUpdateWithoutTradesInput>;
  };

  export type CategoryUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutCategoriesNestedInput;
  };

  export type CategoryUncheckedUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ScreenshotUpsertWithWhereUniqueWithoutTradeInput = {
    where: ScreenshotWhereUniqueInput;
    update: XOR<ScreenshotUpdateWithoutTradeInput, ScreenshotUncheckedUpdateWithoutTradeInput>;
    create: XOR<ScreenshotCreateWithoutTradeInput, ScreenshotUncheckedCreateWithoutTradeInput>;
  };

  export type ScreenshotUpdateWithWhereUniqueWithoutTradeInput = {
    where: ScreenshotWhereUniqueInput;
    data: XOR<ScreenshotUpdateWithoutTradeInput, ScreenshotUncheckedUpdateWithoutTradeInput>;
  };

  export type ScreenshotUpdateManyWithWhereWithoutTradeInput = {
    where: ScreenshotScalarWhereInput;
    data: XOR<ScreenshotUpdateManyMutationInput, ScreenshotUncheckedUpdateManyWithoutTradeInput>;
  };

  export type ScreenshotScalarWhereInput = {
    AND?: ScreenshotScalarWhereInput | ScreenshotScalarWhereInput[];
    OR?: ScreenshotScalarWhereInput[];
    NOT?: ScreenshotScalarWhereInput | ScreenshotScalarWhereInput[];
    id?: StringFilter<'Screenshot'> | string;
    tradeId?: StringFilter<'Screenshot'> | string;
    imageData?: StringFilter<'Screenshot'> | string;
    createdAt?: DateTimeFilter<'Screenshot'> | Date | string;
    order?: IntFilter<'Screenshot'> | number;
  };

  export type TradeCreateWithoutScreenshotsInput = {
    id?: string;
    date?: Date | string;
    symbol: string;
    side: $Enums.TradeSide;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: $Enums.TradeResult;
    leverage?: number | null;
    investment?: number | null;
    createdAt?: Date | string;
    deposit: number;
    isDemo?: boolean;
    comment?: string | null;
    user: UserCreateNestedOneWithoutTradesInput;
    category: CategoryCreateNestedOneWithoutTradesInput;
  };

  export type TradeUncheckedCreateWithoutScreenshotsInput = {
    id?: string;
    userId: string;
    categoryId: string;
    date?: Date | string;
    symbol: string;
    side: $Enums.TradeSide;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: $Enums.TradeResult;
    leverage?: number | null;
    investment?: number | null;
    createdAt?: Date | string;
    deposit: number;
    isDemo?: boolean;
    comment?: string | null;
  };

  export type TradeCreateOrConnectWithoutScreenshotsInput = {
    where: TradeWhereUniqueInput;
    create: XOR<TradeCreateWithoutScreenshotsInput, TradeUncheckedCreateWithoutScreenshotsInput>;
  };

  export type TradeUpsertWithoutScreenshotsInput = {
    update: XOR<TradeUpdateWithoutScreenshotsInput, TradeUncheckedUpdateWithoutScreenshotsInput>;
    create: XOR<TradeCreateWithoutScreenshotsInput, TradeUncheckedCreateWithoutScreenshotsInput>;
    where?: TradeWhereInput;
  };

  export type TradeUpdateToOneWithWhereWithoutScreenshotsInput = {
    where?: TradeWhereInput;
    data: XOR<TradeUpdateWithoutScreenshotsInput, TradeUncheckedUpdateWithoutScreenshotsInput>;
  };

  export type TradeUpdateWithoutScreenshotsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    symbol?: StringFieldUpdateOperationsInput | string;
    side?: EnumTradeSideFieldUpdateOperationsInput | $Enums.TradeSide;
    entryPrice?: FloatFieldUpdateOperationsInput | number;
    positionSize?: FloatFieldUpdateOperationsInput | number;
    stopLoss?: FloatFieldUpdateOperationsInput | number;
    exitPrice?: FloatFieldUpdateOperationsInput | number;
    commission?: FloatFieldUpdateOperationsInput | number;
    riskPercent?: FloatFieldUpdateOperationsInput | number;
    pnl?: FloatFieldUpdateOperationsInput | number;
    result?: EnumTradeResultFieldUpdateOperationsInput | $Enums.TradeResult;
    leverage?: NullableFloatFieldUpdateOperationsInput | number | null;
    investment?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deposit?: FloatFieldUpdateOperationsInput | number;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    comment?: NullableStringFieldUpdateOperationsInput | string | null;
    user?: UserUpdateOneRequiredWithoutTradesNestedInput;
    category?: CategoryUpdateOneRequiredWithoutTradesNestedInput;
  };

  export type TradeUncheckedUpdateWithoutScreenshotsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    symbol?: StringFieldUpdateOperationsInput | string;
    side?: EnumTradeSideFieldUpdateOperationsInput | $Enums.TradeSide;
    entryPrice?: FloatFieldUpdateOperationsInput | number;
    positionSize?: FloatFieldUpdateOperationsInput | number;
    stopLoss?: FloatFieldUpdateOperationsInput | number;
    exitPrice?: FloatFieldUpdateOperationsInput | number;
    commission?: FloatFieldUpdateOperationsInput | number;
    riskPercent?: FloatFieldUpdateOperationsInput | number;
    pnl?: FloatFieldUpdateOperationsInput | number;
    result?: EnumTradeResultFieldUpdateOperationsInput | $Enums.TradeResult;
    leverage?: NullableFloatFieldUpdateOperationsInput | number | null;
    investment?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deposit?: FloatFieldUpdateOperationsInput | number;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    comment?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type UserCreateWithoutFinanceAccountsInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeCreateNestedManyWithoutUserInput;
    categories?: CategoryCreateNestedManyWithoutUserInput;
    transactions?: TransactionCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryCreateNestedManyWithoutUserInput;
    budgets?: BudgetCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutFinanceAccountsInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput;
    categories?: CategoryUncheckedCreateNestedManyWithoutUserInput;
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryUncheckedCreateNestedManyWithoutUserInput;
    budgets?: BudgetUncheckedCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutFinanceAccountsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutFinanceAccountsInput,
      UserUncheckedCreateWithoutFinanceAccountsInput
    >;
  };

  export type TransactionCreateWithoutAccountInput = {
    id?: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutTransactionsInput;
    category: TransactionCategoryCreateNestedOneWithoutTransactionsInput;
    transferTo?: FinanceAccountCreateNestedOneWithoutTransfersToInput;
  };

  export type TransactionUncheckedCreateWithoutAccountInput = {
    id?: string;
    userId: string;
    categoryId: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    transferToId?: string | null;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionCreateOrConnectWithoutAccountInput = {
    where: TransactionWhereUniqueInput;
    create: XOR<
      TransactionCreateWithoutAccountInput,
      TransactionUncheckedCreateWithoutAccountInput
    >;
  };

  export type TransactionCreateManyAccountInputEnvelope = {
    data: TransactionCreateManyAccountInput | TransactionCreateManyAccountInput[];
    skipDuplicates?: boolean;
  };

  export type TransactionCreateWithoutTransferToInput = {
    id?: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutTransactionsInput;
    account: FinanceAccountCreateNestedOneWithoutTransactionsInput;
    category: TransactionCategoryCreateNestedOneWithoutTransactionsInput;
  };

  export type TransactionUncheckedCreateWithoutTransferToInput = {
    id?: string;
    userId: string;
    accountId: string;
    categoryId: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionCreateOrConnectWithoutTransferToInput = {
    where: TransactionWhereUniqueInput;
    create: XOR<
      TransactionCreateWithoutTransferToInput,
      TransactionUncheckedCreateWithoutTransferToInput
    >;
  };

  export type TransactionCreateManyTransferToInputEnvelope = {
    data: TransactionCreateManyTransferToInput | TransactionCreateManyTransferToInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutFinanceAccountsInput = {
    update: XOR<
      UserUpdateWithoutFinanceAccountsInput,
      UserUncheckedUpdateWithoutFinanceAccountsInput
    >;
    create: XOR<
      UserCreateWithoutFinanceAccountsInput,
      UserUncheckedCreateWithoutFinanceAccountsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutFinanceAccountsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutFinanceAccountsInput,
      UserUncheckedUpdateWithoutFinanceAccountsInput
    >;
  };

  export type UserUpdateWithoutFinanceAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUpdateManyWithoutUserNestedInput;
    categories?: CategoryUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutFinanceAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput;
    categories?: CategoryUncheckedUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUncheckedUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type TransactionUpsertWithWhereUniqueWithoutAccountInput = {
    where: TransactionWhereUniqueInput;
    update: XOR<
      TransactionUpdateWithoutAccountInput,
      TransactionUncheckedUpdateWithoutAccountInput
    >;
    create: XOR<
      TransactionCreateWithoutAccountInput,
      TransactionUncheckedCreateWithoutAccountInput
    >;
  };

  export type TransactionUpdateWithWhereUniqueWithoutAccountInput = {
    where: TransactionWhereUniqueInput;
    data: XOR<TransactionUpdateWithoutAccountInput, TransactionUncheckedUpdateWithoutAccountInput>;
  };

  export type TransactionUpdateManyWithWhereWithoutAccountInput = {
    where: TransactionScalarWhereInput;
    data: XOR<
      TransactionUpdateManyMutationInput,
      TransactionUncheckedUpdateManyWithoutAccountInput
    >;
  };

  export type TransactionUpsertWithWhereUniqueWithoutTransferToInput = {
    where: TransactionWhereUniqueInput;
    update: XOR<
      TransactionUpdateWithoutTransferToInput,
      TransactionUncheckedUpdateWithoutTransferToInput
    >;
    create: XOR<
      TransactionCreateWithoutTransferToInput,
      TransactionUncheckedCreateWithoutTransferToInput
    >;
  };

  export type TransactionUpdateWithWhereUniqueWithoutTransferToInput = {
    where: TransactionWhereUniqueInput;
    data: XOR<
      TransactionUpdateWithoutTransferToInput,
      TransactionUncheckedUpdateWithoutTransferToInput
    >;
  };

  export type TransactionUpdateManyWithWhereWithoutTransferToInput = {
    where: TransactionScalarWhereInput;
    data: XOR<
      TransactionUpdateManyMutationInput,
      TransactionUncheckedUpdateManyWithoutTransferToInput
    >;
  };

  export type UserCreateWithoutTransactionsInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeCreateNestedManyWithoutUserInput;
    categories?: CategoryCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryCreateNestedManyWithoutUserInput;
    budgets?: BudgetCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutTransactionsInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput;
    categories?: CategoryUncheckedCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountUncheckedCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryUncheckedCreateNestedManyWithoutUserInput;
    budgets?: BudgetUncheckedCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutTransactionsInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>;
  };

  export type FinanceAccountCreateWithoutTransactionsInput = {
    id?: string;
    name: string;
    type: $Enums.AccountType;
    currency?: string;
    balance?: number;
    isActive?: boolean;
    isDemo?: boolean;
    color?: string | null;
    icon?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutFinanceAccountsInput;
    transfersTo?: TransactionCreateNestedManyWithoutTransferToInput;
  };

  export type FinanceAccountUncheckedCreateWithoutTransactionsInput = {
    id?: string;
    userId: string;
    name: string;
    type: $Enums.AccountType;
    currency?: string;
    balance?: number;
    isActive?: boolean;
    isDemo?: boolean;
    color?: string | null;
    icon?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transfersTo?: TransactionUncheckedCreateNestedManyWithoutTransferToInput;
  };

  export type FinanceAccountCreateOrConnectWithoutTransactionsInput = {
    where: FinanceAccountWhereUniqueInput;
    create: XOR<
      FinanceAccountCreateWithoutTransactionsInput,
      FinanceAccountUncheckedCreateWithoutTransactionsInput
    >;
  };

  export type TransactionCategoryCreateWithoutTransactionsInput = {
    id?: string;
    name: string;
    type: $Enums.TransactionType;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutTransactionCategoriesInput;
    parent?: TransactionCategoryCreateNestedOneWithoutChildrenInput;
    children?: TransactionCategoryCreateNestedManyWithoutParentInput;
    budgetCategories?: BudgetCategoryCreateNestedManyWithoutCategoryInput;
  };

  export type TransactionCategoryUncheckedCreateWithoutTransactionsInput = {
    id?: string;
    userId: string;
    name: string;
    type: $Enums.TransactionType;
    parentId?: string | null;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    children?: TransactionCategoryUncheckedCreateNestedManyWithoutParentInput;
    budgetCategories?: BudgetCategoryUncheckedCreateNestedManyWithoutCategoryInput;
  };

  export type TransactionCategoryCreateOrConnectWithoutTransactionsInput = {
    where: TransactionCategoryWhereUniqueInput;
    create: XOR<
      TransactionCategoryCreateWithoutTransactionsInput,
      TransactionCategoryUncheckedCreateWithoutTransactionsInput
    >;
  };

  export type FinanceAccountCreateWithoutTransfersToInput = {
    id?: string;
    name: string;
    type: $Enums.AccountType;
    currency?: string;
    balance?: number;
    isActive?: boolean;
    isDemo?: boolean;
    color?: string | null;
    icon?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutFinanceAccountsInput;
    transactions?: TransactionCreateNestedManyWithoutAccountInput;
  };

  export type FinanceAccountUncheckedCreateWithoutTransfersToInput = {
    id?: string;
    userId: string;
    name: string;
    type: $Enums.AccountType;
    currency?: string;
    balance?: number;
    isActive?: boolean;
    isDemo?: boolean;
    color?: string | null;
    icon?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: TransactionUncheckedCreateNestedManyWithoutAccountInput;
  };

  export type FinanceAccountCreateOrConnectWithoutTransfersToInput = {
    where: FinanceAccountWhereUniqueInput;
    create: XOR<
      FinanceAccountCreateWithoutTransfersToInput,
      FinanceAccountUncheckedCreateWithoutTransfersToInput
    >;
  };

  export type UserUpsertWithoutTransactionsInput = {
    update: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>;
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>;
  };

  export type UserUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUpdateManyWithoutUserNestedInput;
    categories?: CategoryUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput;
    categories?: CategoryUncheckedUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUncheckedUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUncheckedUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type FinanceAccountUpsertWithoutTransactionsInput = {
    update: XOR<
      FinanceAccountUpdateWithoutTransactionsInput,
      FinanceAccountUncheckedUpdateWithoutTransactionsInput
    >;
    create: XOR<
      FinanceAccountCreateWithoutTransactionsInput,
      FinanceAccountUncheckedCreateWithoutTransactionsInput
    >;
    where?: FinanceAccountWhereInput;
  };

  export type FinanceAccountUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: FinanceAccountWhereInput;
    data: XOR<
      FinanceAccountUpdateWithoutTransactionsInput,
      FinanceAccountUncheckedUpdateWithoutTransactionsInput
    >;
  };

  export type FinanceAccountUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType;
    currency?: StringFieldUpdateOperationsInput | string;
    balance?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutFinanceAccountsNestedInput;
    transfersTo?: TransactionUpdateManyWithoutTransferToNestedInput;
  };

  export type FinanceAccountUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType;
    currency?: StringFieldUpdateOperationsInput | string;
    balance?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transfersTo?: TransactionUncheckedUpdateManyWithoutTransferToNestedInput;
  };

  export type TransactionCategoryUpsertWithoutTransactionsInput = {
    update: XOR<
      TransactionCategoryUpdateWithoutTransactionsInput,
      TransactionCategoryUncheckedUpdateWithoutTransactionsInput
    >;
    create: XOR<
      TransactionCategoryCreateWithoutTransactionsInput,
      TransactionCategoryUncheckedCreateWithoutTransactionsInput
    >;
    where?: TransactionCategoryWhereInput;
  };

  export type TransactionCategoryUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: TransactionCategoryWhereInput;
    data: XOR<
      TransactionCategoryUpdateWithoutTransactionsInput,
      TransactionCategoryUncheckedUpdateWithoutTransactionsInput
    >;
  };

  export type TransactionCategoryUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutTransactionCategoriesNestedInput;
    parent?: TransactionCategoryUpdateOneWithoutChildrenNestedInput;
    children?: TransactionCategoryUpdateManyWithoutParentNestedInput;
    budgetCategories?: BudgetCategoryUpdateManyWithoutCategoryNestedInput;
  };

  export type TransactionCategoryUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: TransactionCategoryUncheckedUpdateManyWithoutParentNestedInput;
    budgetCategories?: BudgetCategoryUncheckedUpdateManyWithoutCategoryNestedInput;
  };

  export type FinanceAccountUpsertWithoutTransfersToInput = {
    update: XOR<
      FinanceAccountUpdateWithoutTransfersToInput,
      FinanceAccountUncheckedUpdateWithoutTransfersToInput
    >;
    create: XOR<
      FinanceAccountCreateWithoutTransfersToInput,
      FinanceAccountUncheckedCreateWithoutTransfersToInput
    >;
    where?: FinanceAccountWhereInput;
  };

  export type FinanceAccountUpdateToOneWithWhereWithoutTransfersToInput = {
    where?: FinanceAccountWhereInput;
    data: XOR<
      FinanceAccountUpdateWithoutTransfersToInput,
      FinanceAccountUncheckedUpdateWithoutTransfersToInput
    >;
  };

  export type FinanceAccountUpdateWithoutTransfersToInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType;
    currency?: StringFieldUpdateOperationsInput | string;
    balance?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutFinanceAccountsNestedInput;
    transactions?: TransactionUpdateManyWithoutAccountNestedInput;
  };

  export type FinanceAccountUncheckedUpdateWithoutTransfersToInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType;
    currency?: StringFieldUpdateOperationsInput | string;
    balance?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: TransactionUncheckedUpdateManyWithoutAccountNestedInput;
  };

  export type UserCreateWithoutTransactionCategoriesInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeCreateNestedManyWithoutUserInput;
    categories?: CategoryCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountCreateNestedManyWithoutUserInput;
    transactions?: TransactionCreateNestedManyWithoutUserInput;
    budgets?: BudgetCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutTransactionCategoriesInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput;
    categories?: CategoryUncheckedCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountUncheckedCreateNestedManyWithoutUserInput;
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput;
    budgets?: BudgetUncheckedCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutTransactionCategoriesInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutTransactionCategoriesInput,
      UserUncheckedCreateWithoutTransactionCategoriesInput
    >;
  };

  export type TransactionCategoryCreateWithoutChildrenInput = {
    id?: string;
    name: string;
    type: $Enums.TransactionType;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutTransactionCategoriesInput;
    parent?: TransactionCategoryCreateNestedOneWithoutChildrenInput;
    transactions?: TransactionCreateNestedManyWithoutCategoryInput;
    budgetCategories?: BudgetCategoryCreateNestedManyWithoutCategoryInput;
  };

  export type TransactionCategoryUncheckedCreateWithoutChildrenInput = {
    id?: string;
    userId: string;
    name: string;
    type: $Enums.TransactionType;
    parentId?: string | null;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    transactions?: TransactionUncheckedCreateNestedManyWithoutCategoryInput;
    budgetCategories?: BudgetCategoryUncheckedCreateNestedManyWithoutCategoryInput;
  };

  export type TransactionCategoryCreateOrConnectWithoutChildrenInput = {
    where: TransactionCategoryWhereUniqueInput;
    create: XOR<
      TransactionCategoryCreateWithoutChildrenInput,
      TransactionCategoryUncheckedCreateWithoutChildrenInput
    >;
  };

  export type TransactionCategoryCreateWithoutParentInput = {
    id?: string;
    name: string;
    type: $Enums.TransactionType;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutTransactionCategoriesInput;
    children?: TransactionCategoryCreateNestedManyWithoutParentInput;
    transactions?: TransactionCreateNestedManyWithoutCategoryInput;
    budgetCategories?: BudgetCategoryCreateNestedManyWithoutCategoryInput;
  };

  export type TransactionCategoryUncheckedCreateWithoutParentInput = {
    id?: string;
    userId: string;
    name: string;
    type: $Enums.TransactionType;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    children?: TransactionCategoryUncheckedCreateNestedManyWithoutParentInput;
    transactions?: TransactionUncheckedCreateNestedManyWithoutCategoryInput;
    budgetCategories?: BudgetCategoryUncheckedCreateNestedManyWithoutCategoryInput;
  };

  export type TransactionCategoryCreateOrConnectWithoutParentInput = {
    where: TransactionCategoryWhereUniqueInput;
    create: XOR<
      TransactionCategoryCreateWithoutParentInput,
      TransactionCategoryUncheckedCreateWithoutParentInput
    >;
  };

  export type TransactionCategoryCreateManyParentInputEnvelope = {
    data: TransactionCategoryCreateManyParentInput | TransactionCategoryCreateManyParentInput[];
    skipDuplicates?: boolean;
  };

  export type TransactionCreateWithoutCategoryInput = {
    id?: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutTransactionsInput;
    account: FinanceAccountCreateNestedOneWithoutTransactionsInput;
    transferTo?: FinanceAccountCreateNestedOneWithoutTransfersToInput;
  };

  export type TransactionUncheckedCreateWithoutCategoryInput = {
    id?: string;
    userId: string;
    accountId: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    transferToId?: string | null;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionCreateOrConnectWithoutCategoryInput = {
    where: TransactionWhereUniqueInput;
    create: XOR<
      TransactionCreateWithoutCategoryInput,
      TransactionUncheckedCreateWithoutCategoryInput
    >;
  };

  export type TransactionCreateManyCategoryInputEnvelope = {
    data: TransactionCreateManyCategoryInput | TransactionCreateManyCategoryInput[];
    skipDuplicates?: boolean;
  };

  export type BudgetCategoryCreateWithoutCategoryInput = {
    id?: string;
    planned: number;
    actual?: number;
    budget: BudgetCreateNestedOneWithoutCategoriesInput;
  };

  export type BudgetCategoryUncheckedCreateWithoutCategoryInput = {
    id?: string;
    budgetId: string;
    planned: number;
    actual?: number;
  };

  export type BudgetCategoryCreateOrConnectWithoutCategoryInput = {
    where: BudgetCategoryWhereUniqueInput;
    create: XOR<
      BudgetCategoryCreateWithoutCategoryInput,
      BudgetCategoryUncheckedCreateWithoutCategoryInput
    >;
  };

  export type BudgetCategoryCreateManyCategoryInputEnvelope = {
    data: BudgetCategoryCreateManyCategoryInput | BudgetCategoryCreateManyCategoryInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutTransactionCategoriesInput = {
    update: XOR<
      UserUpdateWithoutTransactionCategoriesInput,
      UserUncheckedUpdateWithoutTransactionCategoriesInput
    >;
    create: XOR<
      UserCreateWithoutTransactionCategoriesInput,
      UserUncheckedCreateWithoutTransactionCategoriesInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutTransactionCategoriesInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutTransactionCategoriesInput,
      UserUncheckedUpdateWithoutTransactionCategoriesInput
    >;
  };

  export type UserUpdateWithoutTransactionCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUpdateManyWithoutUserNestedInput;
    categories?: CategoryUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutTransactionCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput;
    categories?: CategoryUncheckedUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUncheckedUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUncheckedUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type TransactionCategoryUpsertWithoutChildrenInput = {
    update: XOR<
      TransactionCategoryUpdateWithoutChildrenInput,
      TransactionCategoryUncheckedUpdateWithoutChildrenInput
    >;
    create: XOR<
      TransactionCategoryCreateWithoutChildrenInput,
      TransactionCategoryUncheckedCreateWithoutChildrenInput
    >;
    where?: TransactionCategoryWhereInput;
  };

  export type TransactionCategoryUpdateToOneWithWhereWithoutChildrenInput = {
    where?: TransactionCategoryWhereInput;
    data: XOR<
      TransactionCategoryUpdateWithoutChildrenInput,
      TransactionCategoryUncheckedUpdateWithoutChildrenInput
    >;
  };

  export type TransactionCategoryUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutTransactionCategoriesNestedInput;
    parent?: TransactionCategoryUpdateOneWithoutChildrenNestedInput;
    transactions?: TransactionUpdateManyWithoutCategoryNestedInput;
    budgetCategories?: BudgetCategoryUpdateManyWithoutCategoryNestedInput;
  };

  export type TransactionCategoryUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: TransactionUncheckedUpdateManyWithoutCategoryNestedInput;
    budgetCategories?: BudgetCategoryUncheckedUpdateManyWithoutCategoryNestedInput;
  };

  export type TransactionCategoryUpsertWithWhereUniqueWithoutParentInput = {
    where: TransactionCategoryWhereUniqueInput;
    update: XOR<
      TransactionCategoryUpdateWithoutParentInput,
      TransactionCategoryUncheckedUpdateWithoutParentInput
    >;
    create: XOR<
      TransactionCategoryCreateWithoutParentInput,
      TransactionCategoryUncheckedCreateWithoutParentInput
    >;
  };

  export type TransactionCategoryUpdateWithWhereUniqueWithoutParentInput = {
    where: TransactionCategoryWhereUniqueInput;
    data: XOR<
      TransactionCategoryUpdateWithoutParentInput,
      TransactionCategoryUncheckedUpdateWithoutParentInput
    >;
  };

  export type TransactionCategoryUpdateManyWithWhereWithoutParentInput = {
    where: TransactionCategoryScalarWhereInput;
    data: XOR<
      TransactionCategoryUpdateManyMutationInput,
      TransactionCategoryUncheckedUpdateManyWithoutParentInput
    >;
  };

  export type TransactionUpsertWithWhereUniqueWithoutCategoryInput = {
    where: TransactionWhereUniqueInput;
    update: XOR<
      TransactionUpdateWithoutCategoryInput,
      TransactionUncheckedUpdateWithoutCategoryInput
    >;
    create: XOR<
      TransactionCreateWithoutCategoryInput,
      TransactionUncheckedCreateWithoutCategoryInput
    >;
  };

  export type TransactionUpdateWithWhereUniqueWithoutCategoryInput = {
    where: TransactionWhereUniqueInput;
    data: XOR<
      TransactionUpdateWithoutCategoryInput,
      TransactionUncheckedUpdateWithoutCategoryInput
    >;
  };

  export type TransactionUpdateManyWithWhereWithoutCategoryInput = {
    where: TransactionScalarWhereInput;
    data: XOR<
      TransactionUpdateManyMutationInput,
      TransactionUncheckedUpdateManyWithoutCategoryInput
    >;
  };

  export type BudgetCategoryUpsertWithWhereUniqueWithoutCategoryInput = {
    where: BudgetCategoryWhereUniqueInput;
    update: XOR<
      BudgetCategoryUpdateWithoutCategoryInput,
      BudgetCategoryUncheckedUpdateWithoutCategoryInput
    >;
    create: XOR<
      BudgetCategoryCreateWithoutCategoryInput,
      BudgetCategoryUncheckedCreateWithoutCategoryInput
    >;
  };

  export type BudgetCategoryUpdateWithWhereUniqueWithoutCategoryInput = {
    where: BudgetCategoryWhereUniqueInput;
    data: XOR<
      BudgetCategoryUpdateWithoutCategoryInput,
      BudgetCategoryUncheckedUpdateWithoutCategoryInput
    >;
  };

  export type BudgetCategoryUpdateManyWithWhereWithoutCategoryInput = {
    where: BudgetCategoryScalarWhereInput;
    data: XOR<
      BudgetCategoryUpdateManyMutationInput,
      BudgetCategoryUncheckedUpdateManyWithoutCategoryInput
    >;
  };

  export type BudgetCategoryScalarWhereInput = {
    AND?: BudgetCategoryScalarWhereInput | BudgetCategoryScalarWhereInput[];
    OR?: BudgetCategoryScalarWhereInput[];
    NOT?: BudgetCategoryScalarWhereInput | BudgetCategoryScalarWhereInput[];
    id?: StringFilter<'BudgetCategory'> | string;
    budgetId?: StringFilter<'BudgetCategory'> | string;
    categoryId?: StringFilter<'BudgetCategory'> | string;
    planned?: FloatFilter<'BudgetCategory'> | number;
    actual?: FloatFilter<'BudgetCategory'> | number;
  };

  export type UserCreateWithoutBudgetsInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeCreateNestedManyWithoutUserInput;
    categories?: CategoryCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountCreateNestedManyWithoutUserInput;
    transactions?: TransactionCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutBudgetsInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput;
    categories?: CategoryUncheckedCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountUncheckedCreateNestedManyWithoutUserInput;
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryUncheckedCreateNestedManyWithoutUserInput;
    financialGoals?: FinancialGoalUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutBudgetsInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutBudgetsInput, UserUncheckedCreateWithoutBudgetsInput>;
  };

  export type BudgetCategoryCreateWithoutBudgetInput = {
    id?: string;
    planned: number;
    actual?: number;
    category: TransactionCategoryCreateNestedOneWithoutBudgetCategoriesInput;
  };

  export type BudgetCategoryUncheckedCreateWithoutBudgetInput = {
    id?: string;
    categoryId: string;
    planned: number;
    actual?: number;
  };

  export type BudgetCategoryCreateOrConnectWithoutBudgetInput = {
    where: BudgetCategoryWhereUniqueInput;
    create: XOR<
      BudgetCategoryCreateWithoutBudgetInput,
      BudgetCategoryUncheckedCreateWithoutBudgetInput
    >;
  };

  export type BudgetCategoryCreateManyBudgetInputEnvelope = {
    data: BudgetCategoryCreateManyBudgetInput | BudgetCategoryCreateManyBudgetInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutBudgetsInput = {
    update: XOR<UserUpdateWithoutBudgetsInput, UserUncheckedUpdateWithoutBudgetsInput>;
    create: XOR<UserCreateWithoutBudgetsInput, UserUncheckedCreateWithoutBudgetsInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutBudgetsInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutBudgetsInput, UserUncheckedUpdateWithoutBudgetsInput>;
  };

  export type UserUpdateWithoutBudgetsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUpdateManyWithoutUserNestedInput;
    categories?: CategoryUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutBudgetsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput;
    categories?: CategoryUncheckedUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUncheckedUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUncheckedUpdateManyWithoutUserNestedInput;
    financialGoals?: FinancialGoalUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type BudgetCategoryUpsertWithWhereUniqueWithoutBudgetInput = {
    where: BudgetCategoryWhereUniqueInput;
    update: XOR<
      BudgetCategoryUpdateWithoutBudgetInput,
      BudgetCategoryUncheckedUpdateWithoutBudgetInput
    >;
    create: XOR<
      BudgetCategoryCreateWithoutBudgetInput,
      BudgetCategoryUncheckedCreateWithoutBudgetInput
    >;
  };

  export type BudgetCategoryUpdateWithWhereUniqueWithoutBudgetInput = {
    where: BudgetCategoryWhereUniqueInput;
    data: XOR<
      BudgetCategoryUpdateWithoutBudgetInput,
      BudgetCategoryUncheckedUpdateWithoutBudgetInput
    >;
  };

  export type BudgetCategoryUpdateManyWithWhereWithoutBudgetInput = {
    where: BudgetCategoryScalarWhereInput;
    data: XOR<
      BudgetCategoryUpdateManyMutationInput,
      BudgetCategoryUncheckedUpdateManyWithoutBudgetInput
    >;
  };

  export type BudgetCreateWithoutCategoriesInput = {
    id?: string;
    name: string;
    period: $Enums.BudgetPeriod;
    startDate: Date | string;
    endDate: Date | string;
    currency?: string;
    totalPlanned: number;
    totalActual?: number;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutBudgetsInput;
  };

  export type BudgetUncheckedCreateWithoutCategoriesInput = {
    id?: string;
    userId: string;
    name: string;
    period: $Enums.BudgetPeriod;
    startDate: Date | string;
    endDate: Date | string;
    currency?: string;
    totalPlanned: number;
    totalActual?: number;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BudgetCreateOrConnectWithoutCategoriesInput = {
    where: BudgetWhereUniqueInput;
    create: XOR<BudgetCreateWithoutCategoriesInput, BudgetUncheckedCreateWithoutCategoriesInput>;
  };

  export type TransactionCategoryCreateWithoutBudgetCategoriesInput = {
    id?: string;
    name: string;
    type: $Enums.TransactionType;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutTransactionCategoriesInput;
    parent?: TransactionCategoryCreateNestedOneWithoutChildrenInput;
    children?: TransactionCategoryCreateNestedManyWithoutParentInput;
    transactions?: TransactionCreateNestedManyWithoutCategoryInput;
  };

  export type TransactionCategoryUncheckedCreateWithoutBudgetCategoriesInput = {
    id?: string;
    userId: string;
    name: string;
    type: $Enums.TransactionType;
    parentId?: string | null;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    children?: TransactionCategoryUncheckedCreateNestedManyWithoutParentInput;
    transactions?: TransactionUncheckedCreateNestedManyWithoutCategoryInput;
  };

  export type TransactionCategoryCreateOrConnectWithoutBudgetCategoriesInput = {
    where: TransactionCategoryWhereUniqueInput;
    create: XOR<
      TransactionCategoryCreateWithoutBudgetCategoriesInput,
      TransactionCategoryUncheckedCreateWithoutBudgetCategoriesInput
    >;
  };

  export type BudgetUpsertWithoutCategoriesInput = {
    update: XOR<BudgetUpdateWithoutCategoriesInput, BudgetUncheckedUpdateWithoutCategoriesInput>;
    create: XOR<BudgetCreateWithoutCategoriesInput, BudgetUncheckedCreateWithoutCategoriesInput>;
    where?: BudgetWhereInput;
  };

  export type BudgetUpdateToOneWithWhereWithoutCategoriesInput = {
    where?: BudgetWhereInput;
    data: XOR<BudgetUpdateWithoutCategoriesInput, BudgetUncheckedUpdateWithoutCategoriesInput>;
  };

  export type BudgetUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    period?: EnumBudgetPeriodFieldUpdateOperationsInput | $Enums.BudgetPeriod;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    currency?: StringFieldUpdateOperationsInput | string;
    totalPlanned?: FloatFieldUpdateOperationsInput | number;
    totalActual?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutBudgetsNestedInput;
  };

  export type BudgetUncheckedUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    period?: EnumBudgetPeriodFieldUpdateOperationsInput | $Enums.BudgetPeriod;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    currency?: StringFieldUpdateOperationsInput | string;
    totalPlanned?: FloatFieldUpdateOperationsInput | number;
    totalActual?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionCategoryUpsertWithoutBudgetCategoriesInput = {
    update: XOR<
      TransactionCategoryUpdateWithoutBudgetCategoriesInput,
      TransactionCategoryUncheckedUpdateWithoutBudgetCategoriesInput
    >;
    create: XOR<
      TransactionCategoryCreateWithoutBudgetCategoriesInput,
      TransactionCategoryUncheckedCreateWithoutBudgetCategoriesInput
    >;
    where?: TransactionCategoryWhereInput;
  };

  export type TransactionCategoryUpdateToOneWithWhereWithoutBudgetCategoriesInput = {
    where?: TransactionCategoryWhereInput;
    data: XOR<
      TransactionCategoryUpdateWithoutBudgetCategoriesInput,
      TransactionCategoryUncheckedUpdateWithoutBudgetCategoriesInput
    >;
  };

  export type TransactionCategoryUpdateWithoutBudgetCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutTransactionCategoriesNestedInput;
    parent?: TransactionCategoryUpdateOneWithoutChildrenNestedInput;
    children?: TransactionCategoryUpdateManyWithoutParentNestedInput;
    transactions?: TransactionUpdateManyWithoutCategoryNestedInput;
  };

  export type TransactionCategoryUncheckedUpdateWithoutBudgetCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: TransactionCategoryUncheckedUpdateManyWithoutParentNestedInput;
    transactions?: TransactionUncheckedUpdateManyWithoutCategoryNestedInput;
  };

  export type UserCreateWithoutFinancialGoalsInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeCreateNestedManyWithoutUserInput;
    categories?: CategoryCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountCreateNestedManyWithoutUserInput;
    transactions?: TransactionCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryCreateNestedManyWithoutUserInput;
    budgets?: BudgetCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutFinancialGoalsInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput;
    categories?: CategoryUncheckedCreateNestedManyWithoutUserInput;
    financeAccounts?: FinanceAccountUncheckedCreateNestedManyWithoutUserInput;
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput;
    transactionCategories?: TransactionCategoryUncheckedCreateNestedManyWithoutUserInput;
    budgets?: BudgetUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutFinancialGoalsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutFinancialGoalsInput,
      UserUncheckedCreateWithoutFinancialGoalsInput
    >;
  };

  export type UserUpsertWithoutFinancialGoalsInput = {
    update: XOR<
      UserUpdateWithoutFinancialGoalsInput,
      UserUncheckedUpdateWithoutFinancialGoalsInput
    >;
    create: XOR<
      UserCreateWithoutFinancialGoalsInput,
      UserUncheckedCreateWithoutFinancialGoalsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutFinancialGoalsInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutFinancialGoalsInput, UserUncheckedUpdateWithoutFinancialGoalsInput>;
  };

  export type UserUpdateWithoutFinancialGoalsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUpdateManyWithoutUserNestedInput;
    categories?: CategoryUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutFinancialGoalsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput;
    categories?: CategoryUncheckedUpdateManyWithoutUserNestedInput;
    financeAccounts?: FinanceAccountUncheckedUpdateManyWithoutUserNestedInput;
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput;
    transactionCategories?: TransactionCategoryUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: BudgetUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type TradeCreateManyUserInput = {
    id?: string;
    categoryId: string;
    date?: Date | string;
    symbol: string;
    side: $Enums.TradeSide;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: $Enums.TradeResult;
    leverage?: number | null;
    investment?: number | null;
    createdAt?: Date | string;
    deposit: number;
    isDemo?: boolean;
    comment?: string | null;
  };

  export type CategoryCreateManyUserInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
  };

  export type FinanceAccountCreateManyUserInput = {
    id?: string;
    name: string;
    type: $Enums.AccountType;
    currency?: string;
    balance?: number;
    isActive?: boolean;
    isDemo?: boolean;
    color?: string | null;
    icon?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionCreateManyUserInput = {
    id?: string;
    accountId: string;
    categoryId: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    transferToId?: string | null;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionCategoryCreateManyUserInput = {
    id?: string;
    name: string;
    type: $Enums.TransactionType;
    parentId?: string | null;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
  };

  export type BudgetCreateManyUserInput = {
    id?: string;
    name: string;
    period: $Enums.BudgetPeriod;
    startDate: Date | string;
    endDate: Date | string;
    currency?: string;
    totalPlanned: number;
    totalActual?: number;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type FinancialGoalCreateManyUserInput = {
    id?: string;
    name: string;
    description?: string | null;
    targetAmount: number;
    currentAmount?: number;
    currency?: string;
    deadline?: Date | string | null;
    color: string;
    icon: string;
    isActive?: boolean;
    isCompleted?: boolean;
    isDemo?: boolean;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TradeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    symbol?: StringFieldUpdateOperationsInput | string;
    side?: EnumTradeSideFieldUpdateOperationsInput | $Enums.TradeSide;
    entryPrice?: FloatFieldUpdateOperationsInput | number;
    positionSize?: FloatFieldUpdateOperationsInput | number;
    stopLoss?: FloatFieldUpdateOperationsInput | number;
    exitPrice?: FloatFieldUpdateOperationsInput | number;
    commission?: FloatFieldUpdateOperationsInput | number;
    riskPercent?: FloatFieldUpdateOperationsInput | number;
    pnl?: FloatFieldUpdateOperationsInput | number;
    result?: EnumTradeResultFieldUpdateOperationsInput | $Enums.TradeResult;
    leverage?: NullableFloatFieldUpdateOperationsInput | number | null;
    investment?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deposit?: FloatFieldUpdateOperationsInput | number;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    comment?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: CategoryUpdateOneRequiredWithoutTradesNestedInput;
    screenshots?: ScreenshotUpdateManyWithoutTradeNestedInput;
  };

  export type TradeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    symbol?: StringFieldUpdateOperationsInput | string;
    side?: EnumTradeSideFieldUpdateOperationsInput | $Enums.TradeSide;
    entryPrice?: FloatFieldUpdateOperationsInput | number;
    positionSize?: FloatFieldUpdateOperationsInput | number;
    stopLoss?: FloatFieldUpdateOperationsInput | number;
    exitPrice?: FloatFieldUpdateOperationsInput | number;
    commission?: FloatFieldUpdateOperationsInput | number;
    riskPercent?: FloatFieldUpdateOperationsInput | number;
    pnl?: FloatFieldUpdateOperationsInput | number;
    result?: EnumTradeResultFieldUpdateOperationsInput | $Enums.TradeResult;
    leverage?: NullableFloatFieldUpdateOperationsInput | number | null;
    investment?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deposit?: FloatFieldUpdateOperationsInput | number;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    comment?: NullableStringFieldUpdateOperationsInput | string | null;
    screenshots?: ScreenshotUncheckedUpdateManyWithoutTradeNestedInput;
  };

  export type TradeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    symbol?: StringFieldUpdateOperationsInput | string;
    side?: EnumTradeSideFieldUpdateOperationsInput | $Enums.TradeSide;
    entryPrice?: FloatFieldUpdateOperationsInput | number;
    positionSize?: FloatFieldUpdateOperationsInput | number;
    stopLoss?: FloatFieldUpdateOperationsInput | number;
    exitPrice?: FloatFieldUpdateOperationsInput | number;
    commission?: FloatFieldUpdateOperationsInput | number;
    riskPercent?: FloatFieldUpdateOperationsInput | number;
    pnl?: FloatFieldUpdateOperationsInput | number;
    result?: EnumTradeResultFieldUpdateOperationsInput | $Enums.TradeResult;
    leverage?: NullableFloatFieldUpdateOperationsInput | number | null;
    investment?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deposit?: FloatFieldUpdateOperationsInput | number;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    comment?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type CategoryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    trades?: TradeUpdateManyWithoutCategoryNestedInput;
  };

  export type CategoryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    trades?: TradeUncheckedUpdateManyWithoutCategoryNestedInput;
  };

  export type CategoryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FinanceAccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType;
    currency?: StringFieldUpdateOperationsInput | string;
    balance?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: TransactionUpdateManyWithoutAccountNestedInput;
    transfersTo?: TransactionUpdateManyWithoutTransferToNestedInput;
  };

  export type FinanceAccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType;
    currency?: StringFieldUpdateOperationsInput | string;
    balance?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: TransactionUncheckedUpdateManyWithoutAccountNestedInput;
    transfersTo?: TransactionUncheckedUpdateManyWithoutTransferToNestedInput;
  };

  export type FinanceAccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType;
    currency?: StringFieldUpdateOperationsInput | string;
    balance?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    account?: FinanceAccountUpdateOneRequiredWithoutTransactionsNestedInput;
    category?: TransactionCategoryUpdateOneRequiredWithoutTransactionsNestedInput;
    transferTo?: FinanceAccountUpdateOneWithoutTransfersToNestedInput;
  };

  export type TransactionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    transferToId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    transferToId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionCategoryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: TransactionCategoryUpdateOneWithoutChildrenNestedInput;
    children?: TransactionCategoryUpdateManyWithoutParentNestedInput;
    transactions?: TransactionUpdateManyWithoutCategoryNestedInput;
    budgetCategories?: BudgetCategoryUpdateManyWithoutCategoryNestedInput;
  };

  export type TransactionCategoryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: TransactionCategoryUncheckedUpdateManyWithoutParentNestedInput;
    transactions?: TransactionUncheckedUpdateManyWithoutCategoryNestedInput;
    budgetCategories?: BudgetCategoryUncheckedUpdateManyWithoutCategoryNestedInput;
  };

  export type TransactionCategoryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BudgetUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    period?: EnumBudgetPeriodFieldUpdateOperationsInput | $Enums.BudgetPeriod;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    currency?: StringFieldUpdateOperationsInput | string;
    totalPlanned?: FloatFieldUpdateOperationsInput | number;
    totalActual?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    categories?: BudgetCategoryUpdateManyWithoutBudgetNestedInput;
  };

  export type BudgetUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    period?: EnumBudgetPeriodFieldUpdateOperationsInput | $Enums.BudgetPeriod;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    currency?: StringFieldUpdateOperationsInput | string;
    totalPlanned?: FloatFieldUpdateOperationsInput | number;
    totalActual?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    categories?: BudgetCategoryUncheckedUpdateManyWithoutBudgetNestedInput;
  };

  export type BudgetUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    period?: EnumBudgetPeriodFieldUpdateOperationsInput | $Enums.BudgetPeriod;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    currency?: StringFieldUpdateOperationsInput | string;
    totalPlanned?: FloatFieldUpdateOperationsInput | number;
    totalActual?: FloatFieldUpdateOperationsInput | number;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FinancialGoalUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    targetAmount?: FloatFieldUpdateOperationsInput | number;
    currentAmount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isCompleted?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FinancialGoalUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    targetAmount?: FloatFieldUpdateOperationsInput | number;
    currentAmount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isCompleted?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FinancialGoalUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    targetAmount?: FloatFieldUpdateOperationsInput | number;
    currentAmount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isCompleted?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TradeCreateManyCategoryInput = {
    id?: string;
    userId: string;
    date?: Date | string;
    symbol: string;
    side: $Enums.TradeSide;
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    exitPrice: number;
    commission: number;
    riskPercent: number;
    pnl: number;
    result: $Enums.TradeResult;
    leverage?: number | null;
    investment?: number | null;
    createdAt?: Date | string;
    deposit: number;
    isDemo?: boolean;
    comment?: string | null;
  };

  export type TradeUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    symbol?: StringFieldUpdateOperationsInput | string;
    side?: EnumTradeSideFieldUpdateOperationsInput | $Enums.TradeSide;
    entryPrice?: FloatFieldUpdateOperationsInput | number;
    positionSize?: FloatFieldUpdateOperationsInput | number;
    stopLoss?: FloatFieldUpdateOperationsInput | number;
    exitPrice?: FloatFieldUpdateOperationsInput | number;
    commission?: FloatFieldUpdateOperationsInput | number;
    riskPercent?: FloatFieldUpdateOperationsInput | number;
    pnl?: FloatFieldUpdateOperationsInput | number;
    result?: EnumTradeResultFieldUpdateOperationsInput | $Enums.TradeResult;
    leverage?: NullableFloatFieldUpdateOperationsInput | number | null;
    investment?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deposit?: FloatFieldUpdateOperationsInput | number;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    comment?: NullableStringFieldUpdateOperationsInput | string | null;
    user?: UserUpdateOneRequiredWithoutTradesNestedInput;
    screenshots?: ScreenshotUpdateManyWithoutTradeNestedInput;
  };

  export type TradeUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    symbol?: StringFieldUpdateOperationsInput | string;
    side?: EnumTradeSideFieldUpdateOperationsInput | $Enums.TradeSide;
    entryPrice?: FloatFieldUpdateOperationsInput | number;
    positionSize?: FloatFieldUpdateOperationsInput | number;
    stopLoss?: FloatFieldUpdateOperationsInput | number;
    exitPrice?: FloatFieldUpdateOperationsInput | number;
    commission?: FloatFieldUpdateOperationsInput | number;
    riskPercent?: FloatFieldUpdateOperationsInput | number;
    pnl?: FloatFieldUpdateOperationsInput | number;
    result?: EnumTradeResultFieldUpdateOperationsInput | $Enums.TradeResult;
    leverage?: NullableFloatFieldUpdateOperationsInput | number | null;
    investment?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deposit?: FloatFieldUpdateOperationsInput | number;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    comment?: NullableStringFieldUpdateOperationsInput | string | null;
    screenshots?: ScreenshotUncheckedUpdateManyWithoutTradeNestedInput;
  };

  export type TradeUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    symbol?: StringFieldUpdateOperationsInput | string;
    side?: EnumTradeSideFieldUpdateOperationsInput | $Enums.TradeSide;
    entryPrice?: FloatFieldUpdateOperationsInput | number;
    positionSize?: FloatFieldUpdateOperationsInput | number;
    stopLoss?: FloatFieldUpdateOperationsInput | number;
    exitPrice?: FloatFieldUpdateOperationsInput | number;
    commission?: FloatFieldUpdateOperationsInput | number;
    riskPercent?: FloatFieldUpdateOperationsInput | number;
    pnl?: FloatFieldUpdateOperationsInput | number;
    result?: EnumTradeResultFieldUpdateOperationsInput | $Enums.TradeResult;
    leverage?: NullableFloatFieldUpdateOperationsInput | number | null;
    investment?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deposit?: FloatFieldUpdateOperationsInput | number;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    comment?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type ScreenshotCreateManyTradeInput = {
    id?: string;
    imageData: string;
    createdAt?: Date | string;
    order?: number;
  };

  export type ScreenshotUpdateWithoutTradeInput = {
    id?: StringFieldUpdateOperationsInput | string;
    imageData?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    order?: IntFieldUpdateOperationsInput | number;
  };

  export type ScreenshotUncheckedUpdateWithoutTradeInput = {
    id?: StringFieldUpdateOperationsInput | string;
    imageData?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    order?: IntFieldUpdateOperationsInput | number;
  };

  export type ScreenshotUncheckedUpdateManyWithoutTradeInput = {
    id?: StringFieldUpdateOperationsInput | string;
    imageData?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    order?: IntFieldUpdateOperationsInput | number;
  };

  export type TransactionCreateManyAccountInput = {
    id?: string;
    userId: string;
    categoryId: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    transferToId?: string | null;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionCreateManyTransferToInput = {
    id?: string;
    userId: string;
    accountId: string;
    categoryId: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput;
    category?: TransactionCategoryUpdateOneRequiredWithoutTransactionsNestedInput;
    transferTo?: FinanceAccountUpdateOneWithoutTransfersToNestedInput;
  };

  export type TransactionUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    transferToId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    transferToId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionUpdateWithoutTransferToInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput;
    account?: FinanceAccountUpdateOneRequiredWithoutTransactionsNestedInput;
    category?: TransactionCategoryUpdateOneRequiredWithoutTransactionsNestedInput;
  };

  export type TransactionUncheckedUpdateWithoutTransferToInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionUncheckedUpdateManyWithoutTransferToInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionCategoryCreateManyParentInput = {
    id?: string;
    userId: string;
    name: string;
    type: $Enums.TransactionType;
    color: string;
    icon: string;
    isDefault?: boolean;
    isActive?: boolean;
    isDemo?: boolean;
    createdAt?: Date | string;
  };

  export type TransactionCreateManyCategoryInput = {
    id?: string;
    userId: string;
    accountId: string;
    type: $Enums.TransactionType;
    amount: number;
    currency?: string;
    description?: string | null;
    date?: Date | string;
    tags?: TransactionCreatetagsInput | string[];
    isDemo?: boolean;
    transferToId?: string | null;
    isRecurring?: boolean;
    recurringPattern?: $Enums.RecurringPattern | null;
    parentTransactionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BudgetCategoryCreateManyCategoryInput = {
    id?: string;
    budgetId: string;
    planned: number;
    actual?: number;
  };

  export type TransactionCategoryUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutTransactionCategoriesNestedInput;
    children?: TransactionCategoryUpdateManyWithoutParentNestedInput;
    transactions?: TransactionUpdateManyWithoutCategoryNestedInput;
    budgetCategories?: BudgetCategoryUpdateManyWithoutCategoryNestedInput;
  };

  export type TransactionCategoryUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: TransactionCategoryUncheckedUpdateManyWithoutParentNestedInput;
    transactions?: TransactionUncheckedUpdateManyWithoutCategoryNestedInput;
    budgetCategories?: BudgetCategoryUncheckedUpdateManyWithoutCategoryNestedInput;
  };

  export type TransactionCategoryUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    color?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    isDefault?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput;
    account?: FinanceAccountUpdateOneRequiredWithoutTransactionsNestedInput;
    transferTo?: FinanceAccountUpdateOneWithoutTransfersToNestedInput;
  };

  export type TransactionUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    transferToId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    accountId?: StringFieldUpdateOperationsInput | string;
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType;
    amount?: FloatFieldUpdateOperationsInput | number;
    currency?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: TransactionUpdatetagsInput | string[];
    isDemo?: BoolFieldUpdateOperationsInput | boolean;
    transferToId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRecurring?: BoolFieldUpdateOperationsInput | boolean;
    recurringPattern?:
      | NullableEnumRecurringPatternFieldUpdateOperationsInput
      | $Enums.RecurringPattern
      | null;
    parentTransactionId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BudgetCategoryUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    planned?: FloatFieldUpdateOperationsInput | number;
    actual?: FloatFieldUpdateOperationsInput | number;
    budget?: BudgetUpdateOneRequiredWithoutCategoriesNestedInput;
  };

  export type BudgetCategoryUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    budgetId?: StringFieldUpdateOperationsInput | string;
    planned?: FloatFieldUpdateOperationsInput | number;
    actual?: FloatFieldUpdateOperationsInput | number;
  };

  export type BudgetCategoryUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    budgetId?: StringFieldUpdateOperationsInput | string;
    planned?: FloatFieldUpdateOperationsInput | number;
    actual?: FloatFieldUpdateOperationsInput | number;
  };

  export type BudgetCategoryCreateManyBudgetInput = {
    id?: string;
    categoryId: string;
    planned: number;
    actual?: number;
  };

  export type BudgetCategoryUpdateWithoutBudgetInput = {
    id?: StringFieldUpdateOperationsInput | string;
    planned?: FloatFieldUpdateOperationsInput | number;
    actual?: FloatFieldUpdateOperationsInput | number;
    category?: TransactionCategoryUpdateOneRequiredWithoutBudgetCategoriesNestedInput;
  };

  export type BudgetCategoryUncheckedUpdateWithoutBudgetInput = {
    id?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    planned?: FloatFieldUpdateOperationsInput | number;
    actual?: FloatFieldUpdateOperationsInput | number;
  };

  export type BudgetCategoryUncheckedUpdateManyWithoutBudgetInput = {
    id?: StringFieldUpdateOperationsInput | string;
    categoryId?: StringFieldUpdateOperationsInput | string;
    planned?: FloatFieldUpdateOperationsInput | number;
    actual?: FloatFieldUpdateOperationsInput | number;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
