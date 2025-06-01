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
}

export type TradeSide = $Enums.TradeSide;

export const TradeSide: typeof $Enums.TradeSide;

export type TradeResult = $Enums.TradeResult;

export const TradeResult: typeof $Enums.TradeResult;

export type TradeCategory = $Enums.TradeCategory;

export const TradeCategory: typeof $Enums.TradeCategory;

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
  U = 'log' extends keyof ClientOptions
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
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
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
      modelProps: 'user' | 'category' | 'trade' | 'screenshot';
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
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
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
  };

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition
    ? T['emit'] extends 'event'
      ? T['level']
      : never
    : never;
  export type GetEvents<T extends any> =
    T extends Array<LogLevel | LogDefinition>
      ? GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
      : never;

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
  };

  export type UserCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    trades?: boolean | UserCountOutputTypeCountTradesArgs;
    categories?: boolean | UserCountOutputTypeCountCategoriesArgs;
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
  };

  export type UserOrderByWithRelationInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    createdAt?: SortOrder;
    defaultCategory?: SortOrder;
    trades?: TradeOrderByRelationAggregateInput;
    categories?: CategoryOrderByRelationAggregateInput;
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

  export type UserCreateInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeCreateNestedManyWithoutUserInput;
    categories?: CategoryCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput;
    categories?: CategoryUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUpdateManyWithoutUserNestedInput;
    categories?: CategoryUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput;
    categories?: CategoryUncheckedUpdateManyWithoutUserNestedInput;
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

  export type TradeOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type CategoryOrderByRelationAggregateInput = {
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

  export type UserCreateWithoutCategoriesInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutCategoriesInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput;
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
  };

  export type UserUncheckedUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput;
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
  };

  export type UserUncheckedCreateWithoutTradesInput = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    defaultCategory?: string;
    categories?: CategoryUncheckedCreateNestedManyWithoutUserInput;
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
  };

  export type UserUncheckedUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    defaultCategory?: StringFieldUpdateOperationsInput | string;
    categories?: CategoryUncheckedUpdateManyWithoutUserNestedInput;
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
