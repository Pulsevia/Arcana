declare namespace jest {
  type MockFn = Mock<any, any[]>;
  interface Mock<TResult = any, TArgs extends any[] = any[]>
    extends Function {
    (...args: TArgs): TResult;
    mock: {
      calls: TArgs[];
      results: Array<
        | { type: 'return'; value: TResult }
        | { type: 'throw'; value: any }
      >;
      instances: any[];
      contexts: any[];
    };
    getMockName(): string;
    mockName(name: string): this;
    mockClear(): this;
    mockReset(): this;
    mockRestore(): void;
    mockImplementation(fn: (...args: TArgs) => TResult): this;
    mockImplementationOnce(fn: (...args: TArgs) => TResult): this;
    mockName(name: string): this;
    mockReturnThis(): this;
    mockReturnValue(value: TResult): this;
    mockReturnValueOnce(value: TResult): this;
    mockResolvedValue(value: TResult extends PromiseLike<infer U> ? U | PromiseLike<U> : never): this;
    mockResolvedValueOnce(value: any): this;
    mockRejectedValue(value: any): this;
    mockRejectedValueOnce(value: any): this;
    withImplementation(fn: (...args: TArgs) => TResult, cb: () => void): void;
  }
  type DoneCallback = (error?: any) => void;
  type ProvidesCallback = (
    cb: DoneCallback,
  ) => any | undefined;
  type ProvidesHookCallback = (
    cb: DoneCallback,
  ) => any | undefined;
  interface Matchers<R, T = {}> {
    toBe(expected: any): R;
    toBeCloseTo(num: number, numDigits?: number): R;
    toBeDefined(): R;
    toBeFalsy(): R;
    toBeGreaterThan(num: number): R;
    toBeGreaterThanOrEqual(num: number): R;
    toBeInstanceOf(expected: any): R;
    toBeLessThan(num: number): R;
    toBeLessThanOrEqual(num: number): R;
    toBeNaN(): R;
    toBeNull(): R;
    toBeTruthy(): R;
    toBeUndefined(): R;
    toContain(item: any): R;
    toContainEqual(item: any): R;
    toEqual(expected: any): R;
    toHaveLength(length: number): R;
    toHaveProperty(prop: string, value?: any): R;
    toMatch(regexpOrString: RegExp | string): R;
    toMatchObject(expected: Record<string, any> | any[]): R;
    toStrictEqual(expected: any): R;
    toThrow(): R;
    toThrow(message: string | RegExp): R;
    toThrow(constructor: new (...args: any[]) => any, message?: string | RegExp): R;
    toThrowError(): R;
    toThrowError(message: string | RegExp): R;
    toThrowError(constructor: new (...args: any[]) => any, message?: string | RegExp): R;
    toHaveBeenCalled(): R;
    toHaveBeenCalledTimes(n: number): R;
    toHaveBeenCalledWith(...args: any[]): R;
    toHaveBeenLastCalledWith(...args: any[]): R;
    toHaveBeenNthCalledWith(n: number, ...args: any[]): R;
    toHaveReturned(): R;
    toHaveReturnedTimes(n: number): R;
    toHaveReturnedWith(value: any): R;
    toHaveLastReturnedWith(value: any): R;
    toHaveNthReturnedWith(n: number, value: any): R;
    resolves: Matchers<R>;
    rejects: Matchers<R>;
    not: Matchers<R>;
  }
}

declare const describe: {
  (name: string, fn: () => void): void;
  only: (name: string, fn: () => void) => void;
  skip: (name: string, fn: () => void) => void;
  each: (table: any[]) => (name: string, fn: (...args: any[]) => any) => void;
};

declare const xdescribe: (name: string, fn: () => void) => void;
declare const fdescribe: (name: string, fn: () => void) => void;

declare const test: {
  (name: string, fn?: jest.ProvidesCallback, timeout?: number): void;
  only: (name: string, fn?: jest.ProvidesCallback, timeout?: number) => void;
  skip: (name: string, fn?: jest.ProvidesCallback, timeout?: number) => void;
  each: (table: any[]) => (name: string, fn: (...args: any[]) => any, timeout?: number) => void;
  todo: (name: string) => void;
  failing: {
    (name: string, fn?: jest.ProvidesCallback, timeout?: number): void;
    each: (table: any[]) => (name: string, fn: (...args: any[]) => any, timeout?: number) => void;
  };
  concurrent: {
    (name: string, fn?: jest.ProvidesCallback, timeout?: number): void;
    each: (table: any[]) => (name: string, fn: (...args: any[]) => any, timeout?: number) => void;
    skip: (name: string, fn?: jest.ProvidesCallback, timeout?: number) => void;
    only: (name: string, fn?: jest.ProvidesCallback, timeout?: number) => void;
  };
};

declare const it: {
  (name: string, fn?: jest.ProvidesCallback, timeout?: number): void;
  only: (name: string, fn?: jest.ProvidesCallback, timeout?: number) => void;
  skip: (name: string, fn?: jest.ProvidesCallback, timeout?: number) => void;
  each: (table: any[]) => (name: string, fn: (...args: any[]) => any, timeout?: number) => void;
  todo: (name: string) => void;
  failing: {
    (name: string, fn?: jest.ProvidesCallback, timeout?: number): void;
    each: (table: any[]) => (name: string, fn: (...args: any[]) => any, timeout?: number) => void;
  };
  concurrent: {
    (name: string, fn?: jest.ProvidesCallback, timeout?: number): void;
    each: (table: any[]) => (name: string, fn: (...args: any[]) => any, timeout?: number) => void;
    skip: (name: string, fn?: jest.ProvidesCallback, timeout?: number) => void;
    only: (name: string, fn?: jest.ProvidesCallback, timeout?: number) => void;
  };
};

declare const xit: (name: string, fn?: jest.ProvidesCallback, timeout?: number) => void;
declare const fit: (name: string, fn?: jest.ProvidesCallback, timeout?: number) => void;
declare const xtest: (name: string, fn?: jest.ProvidesCallback, timeout?: number) => void;

declare const beforeAll: (fn: jest.ProvidesHookCallback, timeout?: number) => void;
declare const beforeEach: (fn: jest.ProvidesHookCallback, timeout?: number) => void;
declare const afterAll: (fn: jest.ProvidesHookCallback, timeout?: number) => void;
declare const afterEach: (fn: jest.ProvidesHookCallback, timeout?: number) => void;

declare function expect<T = any>(actual: T): jest.Matchers<any> & {
  not: jest.Matchers<any>;
  resolves: jest.Matchers<any>;
  rejects: jest.Matchers<any>;
};
declare namespace expect {
  function extend(matchers: any): void;
  function anything(): any;
  function any(constructor: any): any;
  function arrayContaining(arr: any[]): any;
  function objectContaining(obj: Record<string, any>): any;
  function stringContaining(str: string): any;
  function stringMatching(str: string | RegExp): any;
  function assertions(count: number): void;
  function hasAssertions(): void;
  const setState: (state: any) => void;
  const getState: () => any;
}

declare const jest: {
  // Lifecycle / mock control
  setTimeout(timeout: number): void;
  useFakeTimers(implementation?: any): typeof jest;
  useRealTimers(): typeof jest;
  clearAllTimers(): void;
  runAllTicks(): void;
  runAllTimers(): void;
  runOnlyPendingTimers(): void;
  runAllImmediates(): void;
  advanceTimersByTime(msToRun: number): void;
  advanceTimersToNextTimer(steps?: number): void;
  getTimerCount(): number;
  setMock<T = unknown>(moduleName: string, mock: T): typeof jest;
  clearAllMocks(): void;
  resetAllMocks(): void;
  restoreAllMocks(): void;
  resetModules(): typeof jest;
  isMockFunction(fn: any): fn is jest.Mock<any, any[]>;
  mock<T = unknown>(moduleName: string, factory?: () => T, options?: { virtual?: boolean }): typeof jest;
  unmock(moduleName: string): typeof jest;
  doMock<T = unknown>(moduleName: string, factory?: () => T, options?: { virtual?: boolean }): typeof jest;
  dontMock(moduleName: string): typeof jest;
  requireActual<TModule = never>(moduleName: string): TModule;
  requireMock<TModule = never>(moduleName: string): TModule;
  spyOn<T extends {}, M extends keyof T>(
    object: T,
    method: M,
    accessType?: 'get' | 'set'
  ): jest.Mock<any, any[]>;
  fn<TResult = any, TArgs extends any[] = any[]>(
    implementation?: (...args: TArgs) => TResult
  ): jest.Mock<TResult, TArgs>;
  each(table: any[]): (name: string, fn: (...args: any[]) => any, timeout?: number) => void;
  /** @deprecated */
  disableAutomock(): typeof jest;
  /** @deprecated */
  enableAutomock(): typeof jest;
  mocked<T extends {}, K extends keyof T>(object: T, key: K): any;
};

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string;
    PORT?: string;
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    JWT_REFRESH_EXPIRES_IN?: string;
    [key: string]: string | undefined;
  }
  interface Process {
    env: ProcessEnv;
    exit(code?: number): never;
    cwd(): string;
    nextTick: (callback: (...args: any[]) => void, ...args: any[]) => void;
    platform: string;
    version: string;
    versions: { node: string; v8?: string; uv?: string; zlib?: string; [key: string]: string | undefined };
    argv: string[];
    argv0: string;
    execPath: string;
    pid: number;
    ppid: number;
    title: string;
    arch: string;
  }
}

declare const process: NodeJS.Process;

declare const Buffer: {
  isBuffer(obj: any): boolean;
  from(str: string, encoding?: string): any;
  concat(list: any[], totalLength?: number): any;
  alloc(size: number, fill?: string | number | any[] | Uint8Array, encoding?: string): any;
  allocUnsafe(size: number): any;
  byteLength(string: any, encoding?: string): number;
  compare(buf1: any, buf2: any): number;
};

declare const console: {
  log(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
  trace(...args: any[]): void;
  assert(condition: boolean, ...args: any[]): void;
  clear(): void;
  count(label?: string): void;
  countReset(label?: string): void;
  dir(obj: any, options?: any): void;
  group(...label: any[]): void;
  groupEnd(): void;
  time(label?: string): void;
  timeEnd(label?: string): void;
  timeLog(label?: string, ...data: any[]): void;
};

declare const global: typeof globalThis;

declare const __dirname: string;
declare const __filename: string;

declare function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
declare function clearInterval(handle: any): void;
declare function clearTimeout(handle: any): void;
declare function setImmediate(callback: (...args: any[]) => void, ...args: any[]): any;
declare function clearImmediate(handle: any): void;
declare function queueMicrotask(callback: () => void): void;

interface ErrorConstructor {
  new (message?: string): Error;
  (message?: string): Error;
  readonly prototype: Error;
  captureStackTrace(targetObject: Object, constructorOpt?: Function): void;
  stackTraceLimit: number;
}
declare var Error: ErrorConstructor;

interface WebCrypto {
  getRandomValues<T extends ArrayBufferView | null>(array: T): T;
  randomUUID(): string;
  subtle?: any;
}
declare namespace NodeJS {
  interface Crypto {
    webcrypto: WebCrypto;
  }
}

declare module 'crypto' {
  const webcrypto: WebCrypto;
  export { webcrypto };
}

declare module 'express' {
  import type { IncomingMessage, ServerResponse, Server } from 'node:http';

  type RequestHandler<Req extends Request = Request, Res extends Response = Response> =
    (req: Req, res: Res, next: NextFunction) => any;
  type ErrorRequestHandler =
    (err: any, req: Request, res: Response, next: NextFunction) => any;
  type NextFunction = (err?: any) => void;

  interface Request<P = Record<string, any>, ResBody = any, ReqBody = any, ReqQuery = Record<string, any>, LocalsObj = Record<string, any>>
    extends IncomingMessage {
    params: P;
    body: ReqBody;
    query: ReqQuery;
    headers: Record<string, string | string[] | undefined>;
    rawHeaders: string[];
    method: string;
    url: string;
    originalUrl: string;
    baseUrl: string;
    path: string;
    hostname: string;
    ip: string;
    ips: string[];
    protocol: string;
    secure: boolean;
    xhr: boolean;
    subdomains: string[];
    cookies: Record<string, any>;
    signedCookies: Record<string, any>;
    app: Express;
    res: Response;
    next: NextFunction;
    route: any;
    accepts: (types: string | string[]) => string | false | string[];
    acceptsCharsets: (...charsets: string[]) => string | false;
    acceptsEncodings: (...encodings: string[]) => string | false;
    acceptsLanguages: (...languages: string[]) => string | false;
    get: (name: string) => string | undefined;
    header: (name: string) => string | undefined;
    is: (types: string | string[]) => string | false;
    param: (name: string, defaultValue?: any) => any;
    range: (size: number, options?: any) => any;
    locals: LocalsObj;
    user?: any;
    [key: string]: any;
  }

  interface Response<ResBody = any, LocalsObj = Record<string, any>>
    extends ServerResponse {
    app: Express;
    locals: LocalsObj;
    send: (body?: any) => this;
    json: (body?: any) => this;
    status: (code: number) => this;
    sendStatus: (code: number) => this;
    sendFile: (path: string, options?: any, cb?: (err?: any) => void) => this;
    download: (path: string, filename?: string, cb?: (err?: any) => void) => this;
    contentType: (type: string) => this;
    type: (type: string) => this;
    format: (obj: Record<string, any>) => this;
    attachment: (filename?: string) => this;
    set: (field: string | Record<string, any>, value?: string | string[]) => this;
    header: (field: string | Record<string, any>, value?: string | string[]) => this;
    get: (field: string) => string | undefined;
    clearCookie: (name: string, options?: any) => this;
    cookie: (name: string, value: any, options?: any) => this;
    redirect: (url: string) => void;
    redirect: (status: number, url: string) => void;
    location: (url: string) => this;
    links: (links: Record<string, string>) => this;
    jsonp: (obj: any) => this;
    render: (view: string, options?: any, callback?: (err: Error, html: string) => void) => void;
    end: ((data?: any, encoding?: string) => this) & ((cb?: () => void) => this);
    statusCode: number;
    statusMessage: string;
    headersSent: boolean;
  }

  interface IRouterMatcher<T> {
    (path: string, ...handlers: RequestHandler[]): T;
    (path: string, ...handlers: (RequestHandler | ErrorRequestHandler | Router | Express)[]): T;
    (path: RegExp, ...handlers: RequestHandler[]): T;
    (path: RegExp, ...handlers: (RequestHandler | ErrorRequestHandler | Router | Express)[]): T;
    <P = Record<string, any>, ResBody = any, ReqBody = any, ReqQuery = Record<string, any>>(
      path: string,
      ...handlers: Array<RequestHandler<Request<P, ResBody, ReqBody, ReqQuery>>>
    ): T;
  }

  interface IRouterHandler<T> {
    (...handlers: RequestHandler[]): T;
    (...handlers: (RequestHandler | ErrorRequestHandler | Router | Express)[]): T;
    (routerOrApp: Router | Express): T;
  }

  interface Router extends IRouterMatcher<Router> {
    use: IRouterHandler<Router> & IRouterMatcher<Router>;
    route: (prefix: string) => IRoute;
    all: IRouterMatcher<this>;
    get: IRouterMatcher<this>;
    post: IRouterMatcher<this>;
    put: IRouterMatcher<this>;
    delete: IRouterMatcher<this>;
    patch: IRouterMatcher<this>;
    options: IRouterMatcher<this>;
    head: IRouterMatcher<this>;
    param: (name: string, handler: RequestHandler) => Router;
    stack: any[];
  }

  interface IRoute {
    all: IRouterHandler<this>;
    get: IRouterHandler<this>;
    post: IRouterHandler<this>;
    put: IRouterHandler<this>;
    delete: IRouterHandler<this>;
    patch: IRouterHandler<this>;
    options: IRouterHandler<this>;
    head: IRouterHandler<this>;
  }

  interface Express extends IRouterMatcher<Express> {
    (req: IncomingMessage | Request, res: ServerResponse | Response): any;
    set: (setting: string, value: any) => Express;
    get: ((name: string) => any) & IRouterMatcher<Express>;
    enable: (setting: string) => Express;
    disable: (setting: string) => Express;
    enabled: (setting: string) => boolean;
    disabled: (setting: string) => boolean;
    use: IRouterHandler<Express> & IRouterMatcher<Express>;
    route: (prefix: string) => IRoute;
    engine: (ext: string, fn: any) => Express;
    param: (name: string, handler: RequestHandler) => Express;
    listen: (port: number | string, callback?: () => void) => Server;
    listen: (port: number | string, hostname?: string, callback?: () => void) => Server;
    listen: (port: number | string, hostname?: string, backlog?: number, callback?: () => void) => Server;
    listen: (path: string, callback?: () => void) => Server;
    listen: (handle: any, listeningListener?: () => void) => Server;
    all: IRouterMatcher<Express>;
    post: IRouterMatcher<Express>;
    put: IRouterMatcher<Express>;
    delete: IRouterMatcher<Express>;
    patch: IRouterMatcher<Express>;
    options: IRouterMatcher<Express>;
    head: IRouterMatcher<Express>;
    checkout: IRouterMatcher<Express>;
    connect: IRouterMatcher<Express>;
    copy: IRouterMatcher<Express>;
    lock: IRouterMatcher<Express>;
    merge: IRouterMatcher<Express>;
    mkactivity: IRouterMatcher<Express>;
    mkcol: IRouterMatcher<Express>;
    move: IRouterMatcher<Express>;
    'm-search': IRouterMatcher<Express>;
    notify: IRouterMatcher<Express>;
    purge: IRouterMatcher<Express>;
    report: IRouterMatcher<Express>;
    search: IRouterMatcher<Express>;
    subscribe: IRouterMatcher<Express>;
    trace: IRouterMatcher<Express>;
    unlock: IRouterMatcher<Express>;
    unsubscribe: IRouterMatcher<Express>;
    locals: Record<string, any>;
    mountpath: string | string[];
    routers?: any[];
    settings: Record<string, any>;
    parent?: any;
    _router: any;
    jsonp: any;
    paths: () => string[];
    render: (view: string, options?: any, callback?: (err: Error, html: string) => void) => void;
    errors?: any[];
  }

  type Application = Express;

  interface ExpressJSONOptions {
    inflate?: boolean;
    limit?: string | number;
    reviver?: (key: any, value: any) => any;
    strict?: boolean;
    type?: string | string[];
    verify?: any;
  }
  interface ExpressUrlEncodedOptions extends ExpressJSONOptions {
    extended?: boolean;
    parameterLimit?: number;
  }

  interface ExpressStatic {
    (root: string, options?: any): RequestHandler;
    mime?: any;
    serveStatic?: any;
  }

  interface ExpressInstance {
    (): Express;
    Router: { new (): Router; (opts?: any): Router };
    json: (options?: ExpressJSONOptions) => RequestHandler;
    urlencoded: (options?: ExpressUrlEncodedOptions) => RequestHandler;
    raw: (options?: any) => RequestHandler;
    text: (options?: any) => RequestHandler;
    static: ExpressStatic;
    Application: Express;
    Request: Request;
    Response: Response;
    Route: IRoute;
    query: any;
  }

  const createApplication: ExpressInstance;
  const expressDefault: ExpressInstance;
  export default expressDefault;
  export {
    createApplication,
    Router,
    RequestHandler,
    ErrorRequestHandler,
    NextFunction,
    Application,
    Express,
    Request,
    Response,
  };
}

declare module 'zod' {
  export type ZodRawShape = Record<string, any>;
  export type ZodTypeAny = any;

  export interface ZodSchema<T = any> {
    _type: T;
    _output: T;
    _input: any;
    parse(input: unknown, params?: Partial<any>): T;
    safeParse(input: unknown, params?: Partial<any>): { success: true; data: T } | { success: false; error: ZodError<T> };
    parseAsync(input: unknown, params?: Partial<any>): Promise<T>;
    safeParseAsync(input: unknown, params?: Partial<any>): Promise<{ success: true; data: T } | { success: false; error: ZodError<T> }>;
    refine<O extends T>(check: (arg: T) => arg is O, message?: string | { message?: string; path?: (string | number)[] }): this;
    refine(check: (arg: T) => any, message?: string | { message?: string; path?: (string | number)[]; params?: any }): this;
    refinement<O extends T>(check: (arg: T) => arg is O, message?: string | { message?: string; path?: (string | number)[] }): this;
    superRefine(val: any, ctx: any): any;
    optional(): this;
    nullable(): this;
    nullish(): this;
    or<U>(schema: ZodSchema<U>): this;
    and<U>(schema: ZodSchema<U>): ZodSchema<T & U>;
    transform<U>(transform: (arg: T, ctx: any) => U): ZodSchema<U>;
    default(def: T): this;
    describe(description: string): this;
    catch(def: T): this;
  }

  export interface ZodIssue {
    code: string;
    path: (string | number)[];
    message: string;
    fatal?: boolean;
  }

  export class ZodError<T = any> extends Error {
    issues: ZodIssue[];
    name: 'ZodError';
    constructor(issues: ZodIssue[]);
    format(): any;
    static create: (issues: ZodIssue[]) => ZodError;
  }

  export interface StringValidation extends ZodSchema<string> {
    min(value: number, message?: string): this;
    max(value: number, message?: string): this;
    length(value: number, message?: string): this;
    email(message?: string): this;
    url(message?: string): this;
    uuid(message?: string): this;
    cuid(message?: string): this;
    regex(re: RegExp, message?: string): this;
    trim(): this;
    toLowerCase(): this;
    toUpperCase(): this;
    startsWith(value: string, message?: string): this;
    endsWith(value: string, message?: string): this;
    datetime(message?: string): this;
  }

  export interface NumberValidation extends ZodSchema<number> {
    min(value: number, message?: string): this;
    max(value: number, message?: string): this;
    gt(value: number, message?: string): this;
    lt(value: number, message?: string): this;
    gte(value: number, message?: string): this;
    lte(value: number, message?: string): this;
    step(value: number, message?: string): this;
    int(message?: string): this;
    positive(message?: string): this;
    nonpositive(message?: string): this;
    negative(message?: string): this;
    nonnegative(message?: string): this;
    multipleOf(value: number, message?: string): this;
    finite(message?: string): this;
    safe(message?: string): this;
  }

  export interface ObjectValidation<T extends any> extends ZodSchema<T> {
    passthrough(): this;
    strict(): this;
    strip(): this;
    extend<U extends ZodRawShape>(shape: U): ZodSchema<T & { [k in keyof U]: any }>;
    merge<U extends ZodSchema<any>>(other: U): ZodSchema<any>;
    pick<K extends keyof T & string>(keys: K[]): ZodSchema<Pick<T, K>>;
    omit<K extends keyof T & string>(keys: K[]): ZodSchema<Omit<T, K>>;
    partial(): ZodSchema<{ [k in keyof T]?: any }>;
    required(): ZodSchema<{ [k in keyof T]-?: any }>;
    shape: Record<string, ZodTypeAny>;
    keyof(): ZodSchema<keyof T>;
  }

  export interface ArrayValidation<T extends ZodTypeAny> extends ZodSchema<any[]> {
    nonempty(message?: string): this;
    min(value: number, message?: string): this;
    max(value: number, message?: string): this;
    length(value: number, message?: string): this;
    element: T;
  }

  export const z: {
    string: (options?: { required_error?: string; invalid_type_error?: string; description?: string }) => StringValidation;
    number: (options?: { required_error?: string; invalid_type_error?: string; description?: string }) => NumberValidation;
    boolean: (options?: { required_error?: string; invalid_type_error?: string; description?: string }) => ZodSchema<boolean>;
    bigint: (options?: { required_error?: string; invalid_type_error?: string; description?: string }) => ZodSchema<bigint>;
    date: (options?: { required_error?: string; invalid_type_error?: string; description?: string }) => ZodSchema<Date>;
    symbol: (options?: { required_error?: string; invalid_type_error?: string; description?: string }) => ZodSchema<symbol>;
    any: () => ZodSchema<any>;
    unknown: () => ZodSchema<unknown>;
    never: () => ZodSchema<never>;
    void: () => ZodSchema<void>;
    undefined: () => ZodSchema<undefined>;
    null: () => ZodSchema<null>;
    nullable: <T>(schema: ZodSchema<T>) => ZodSchema<T | null>;
    nullish: <T>(schema: ZodSchema<T>) => ZodSchema<T | null | undefined>;
    nan: () => ZodSchema<number>;
    lazy: <T>(fn: () => ZodSchema<T>) => ZodSchema<T>;
    literal: <T extends string | number | boolean | null | undefined | bigint>(value: T) => ZodSchema<T>;
    enum: <T extends [string, ...string[]]>(values: T) => ZodSchema<T[number]>;
    nativeEnum: <T extends Record<string, any>>(enumObj: T) => ZodSchema<T[keyof T]>;
    object: <T extends ZodRawShape>(shape: T) => ObjectValidation<{ [k in keyof T]: any }>;
    record: <Key extends ZodSchema<any>, Value extends ZodSchema<any>>(key: Key, value: Value) => ZodSchema<Record<any, any>>;
    record: <Value extends ZodSchema<any>>(value: Value) => ZodSchema<Record<string, any>>;
    array: <T extends ZodTypeAny>(schema: T) => ArrayValidation<T>;
    tuple: <T extends ZodTypeAny[]>(schemas: T) => ZodSchema<{ [k in keyof T]: any }>;
    set: <T extends ZodTypeAny>(schema: T) => ZodSchema<Set<any>>;
    map: <K extends ZodTypeAny, V extends ZodTypeAny>(key: K, value: V) => ZodSchema<Map<any, any>>;
    intersection: <A extends ZodTypeAny, B extends ZodTypeAny>(one: A, two: B) => ZodSchema<any>;
    union: <T extends [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]>(types: T) => ZodSchema<any>;
    discriminatedUnion: <T extends ZodTypeAny, Discriminator extends string>(discriminator: Discriminator, options: T[]) => ZodSchema<any>;
    optional: <T>(schema: ZodSchema<T>) => ZodSchema<T | undefined>;
    default: <T>(def: T) => ZodSchema<T>;
    catch: <T>(def: T) => ZodSchema<T>;
    function: <Args extends ZodTypeAny[] = [], Returns extends ZodTypeAny = any>(...args: any[]) => ZodSchema<(...args: any[]) => any>;
    promise: <T>(schema: ZodSchema<T>) => ZodSchema<Promise<T>>;
    preprocess: <To, Out>(preprocess: (arg: To) => any, schema: ZodSchema<Out>) => ZodSchema<Out>;
    postprocess: <T>(schema: ZodSchema<T>, postprocess: (arg: T, ctx: any) => any) => ZodSchema<any>;
    refine: any;
    effect: any;
    custom: <T>(check?: (input: unknown) => any, params?: any) => ZodSchema<T>;
    instanceOf: <T>(clazz: new (...args: any[]) => T, params?: any) => ZodSchema<T>;
    json: (schema: ZodSchema<any>) => ZodSchema<any>;
    pipeline: <A extends ZodSchema<any>, B extends ZodSchema<any>>(first: A, second: B) => ZodSchema<any>;
    coerce: {
      string: () => StringValidation;
      number: () => NumberValidation;
      boolean: () => ZodSchema<boolean>;
      bigint: () => ZodSchema<bigint>;
      date: () => ZodSchema<Date>;
    };
    brandom: any;
    ZodError: typeof ZodError;
    ZodString: StringValidation;
    ZodNumber: NumberValidation;
    ZodBoolean: ZodSchema<boolean>;
    ZodObject: ObjectValidation<any>;
    ZodArray: ArrayValidation<any>;
  };

  export { ZodError as ZodErrorCls };
  export type ZodInfer<T extends ZodSchema<any>> = T['_type'];
  export type infer<T extends ZodSchema<any>> = T['_type'];
}

declare module 'bcryptjs' {
  /**
   * Generate a salt for the given rounds.
   */
  export function genSaltSync(rounds?: number, seedLength?: number): string;
  export function genSalt(rounds?: number, seedLength?: number, callback?: (err: Error, salt: string) => void): Promise<string>;
  export function genSalt(rounds?: number, callback?: (err: Error, salt: string) => void): Promise<string>;

  /**
   * Hash the given data using the given salt/rounds.
   */
  export function hashSync(data: string, saltOrRounds: string | number): string;
  export function hash(data: string, saltOrRounds: string | number, callback?: (err: Error, encrypted: string) => void): Promise<string>;

  /**
   * Compare given data against given hash.
   */
  export function compareSync(data: string, encrypted: string): boolean;
  export function compare(data: string, encrypted: string, callback?: (err: Error, same: boolean) => void): Promise<boolean>;

  /**
   * Get number of rounds used to produce the given hash.
   */
  export function getRounds(encrypted: string): number;

  /**
   * Encode / decode salts.
   */
  export function encodeBase64(bytes: number[]): string;
  export function decodeBase64(s: string): number[];
}

declare module 'jsonwebtoken' {
  export type SignOptions = {
    algorithm?: string;
    keyid?: string;
    expiresIn?: string | number;
    notBefore?: string | number;
    audience?: string | string[];
    subject?: string;
    issuer?: string;
    jwtid?: string;
    noTimestamp?: boolean;
    header?: Record<string, any>;
    encoding?: string;
    mutatePayload?: boolean;
  };

  export type VerifyOptions = {
    algorithms?: string[];
    audience?: string | string[];
    clockTimestamp?: number;
    clockTolerance?: number;
    complete?: boolean;
    issuer?: string | string[];
    ignoreExpiration?: boolean;
    ignoreNotBefore?: boolean;
    jwtid?: string;
    nonce?: string;
    subject?: string;
    maxAge?: string | number;
  };

  export type DecodeOptions = {
    complete?: boolean;
    json?: boolean;
  };

  export interface JwtPayload {
    [key: string]: any;
    iss?: string;
    sub?: string;
    aud?: string | string[];
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
  }

  export class JsonWebTokenError extends Error {
    name: 'JsonWebTokenError';
    message: string;
    inner?: Error;
    constructor(message: string, error?: Error);
  }

  export class TokenExpiredError extends JsonWebTokenError {
    name: 'TokenExpiredError';
    message: string;
    expiredAt: Date;
    constructor(message: string, expiredAt: Date);
  }

  export class NotBeforeError extends JsonWebTokenError {
    name: 'NotBeforeError';
    message: string;
    date: Date;
    constructor(message: string, date: Date);
  }

  export function sign(
    payload: string | Record<string, any> | Buffer,
    secretOrPrivateKey: Secret,
    options?: SignOptions,
    callback?: (err: Error | null, encoded?: string) => void,
  ): string;
  export function sign(
    payload: string | Record<string, any> | Buffer,
    secretOrPrivateKey: Secret,
    callback: (err: Error | null, encoded?: string) => void,
  ): void;

  export type Secret = string | Buffer | { key: string | Buffer; passphrase: string };
  export type GetPublicKeyOrSecret = (
    header: any,
    callback: (err: Error | null, publicKeyOrSecret?: Secret) => void,
  ) => void;

  export function verify(
    token: string,
    secretOrPublicKey: Secret | GetPublicKeyOrSecret,
    options?: VerifyOptions,
    callback?: (err: JsonWebTokenError | TokenExpiredError | NotBeforeError | null, decoded?: any) => void,
  ): any;
  export function verify(
    token: string,
    secretOrPublicKey: Secret | GetPublicKeyOrSecret,
    callback: (err: JsonWebTokenError | TokenExpiredError | NotBeforeError | null, decoded?: any) => void,
  ): void;

  export function decode(token: string, options?: DecodeOptions): null | JwtPayload | string | { [key: string]: any };
}

declare module 'supertest' {
  import type { Server } from 'node:http';
  import type { Express } from 'express';

  type Response = any;
  type Request = any;
  type CallbackHandler = (err: any, res: Response) => void;
  interface Test extends Promise<Response> {
    send(data?: any): Test;
    query(params: Record<string, any> | string): Test;
    set(field: string, value: string | string[]): Test;
    set(fields: Record<string, string | string[]>): Test;
    accept(type: string): Test;
    timeout(ms: number | { deadline?: number; response?: number }): Test;
    expect(status: number, callback?: CallbackHandler): Test;
    expect(body: string, callback?: CallbackHandler): Test;
    expect(body: RegExp, callback?: CallbackHandler): Test;
    expect(body: Record<string, any>, callback?: CallbackHandler): Test;
    expect(status: number, body: string | Record<string, any> | RegExp, callback?: CallbackHandler): Test;
    expect(field: string, value: string | RegExp | number, callback?: CallbackHandler): Test;
    expect(field: string, value: number, callback?: CallbackHandler): Test;
    expect(check: (res: Response) => any, callback?: CallbackHandler): Test;
    end(callback?: (err: any, res: Response) => any): this;
    auth(user: string, pass: string, options?: any): Test;
    field(name: string, value: any): Test;
    attach(field: string, file: any, filename?: string | Record<string, any>): Test;
    type(v: string): Test;
    then<U>(onFulfilled?: (value: Response) => U | PromiseLike<U>, onRejected?: (error: any) => U | PromiseLike<U>): Promise<U>;
    catch<U>(onRejected?: (error: any) => U | PromiseLike<U>): Promise<U>;
    finally(onFinally?: () => void): Promise<Response>;
    serverAddress(app: any, path: string): string;
  }

  interface SuperTest<T extends Test> {
    get(url: string): Test;
    post(url: string): Test;
    put(url: string): Test;
    delete(url: string): Test;
    patch(url: string): Test;
    options(url: string): Test;
    head(url: string): Test;
    trace(url: string): Test;
    checkout(url: string): Test;
    connect(url: string): Test;
    copy(url: string): Test;
    lock(url: string): Test;
    merge(url: string): Test;
    mkactivity(url: string): Test;
    mkcol(url: string): Test;
    move(url: string): Test;
    notify(url: string): Test;
    propfind(url: string): Test;
    proppatch(url: string): Test;
    purge(url: string): Test;
    report(url: string): Test;
    search(url: string): Test;
    subscribe(url: string): Test;
    unlock(url: string): Test;
    unsubscribe(url: string): Test;
  }

  function agent(app: any, options?: any): SuperTest<Test>;

  interface SuperTestExport extends SuperTest<Test> {
    Test: new (app: any, method: string, url: string) => Test;
    agent: typeof agent;
    (app: Server | Express | any, options?: any): SuperTest<Test>;
  }

  const mod: SuperTestExport;
  export = mod;
}

declare module 'morgan' {
  import type { Request, Response, RequestHandler } from 'express';

  type FormatFn = (tokens: TokenIndexer, req: Request, res: Response) => string;

  interface TokenIndexer {
    [tokenName: string]: (req: Request, res: Response, arg?: string | number | boolean) => string | undefined;
  }

  interface FormatFnOptions {
    immediate?: boolean;
    skip?: (req: Request, res: Response) => boolean;
    stream?: { write: (str: string) => void };
    buffer?: boolean;
  }

  function morgan(format?: string | FormatFn, options?: FormatFnOptions): RequestHandler;
  namespace morgan {
    function token(name: string, callback: (req: Request, res: Response) => string): typeof morgan;
    function compile(format: string): FormatFn;
    function format(name: string, fmt: string | FormatFn): typeof morgan;
  }
  export = morgan;
}

declare module 'helmet' {
  import type { RequestHandler } from 'express';

  interface HelmetOptions {
    contentSecurityPolicy?: any | boolean;
    crossOriginEmbedderPolicy?: any | boolean;
    crossOriginOpenerPolicy?: any | boolean;
    crossOriginResourcePolicy?: any | boolean;
    dnsPrefetchControl?: any | boolean;
    expectCt?: any | boolean;
    frameguard?: any | boolean;
    hidePoweredBy?: any | boolean;
    hsts?: any | boolean;
    ieNoOpen?: any | boolean;
    noSniff?: any | boolean;
    originAgentCluster?: boolean;
    permittedCrossDomainPolicies?: any | boolean;
    referrerPolicy?: any | boolean;
    xssFilter?: any | boolean;
  }

  function helmet(options?: HelmetOptions): RequestHandler;
  namespace helmet {
    function contentSecurityPolicy(options?: any): RequestHandler;
    function crossOriginEmbedderPolicy(options?: any): RequestHandler;
    function crossOriginOpenerPolicy(options?: any): RequestHandler;
    function crossOriginResourcePolicy(options?: any): RequestHandler;
    function dnsPrefetchControl(options?: any): RequestHandler;
    function expectCt(options?: any): RequestHandler;
    function frameguard(options?: any): RequestHandler;
    function hidePoweredBy(options?: any): RequestHandler;
    function hsts(options?: any): RequestHandler;
    function ieNoOpen(options?: any): RequestHandler;
    function noSniff(options?: any): RequestHandler;
    function originAgentCluster(): RequestHandler;
    function permittedCrossDomainPolicies(options?: any): RequestHandler;
    function referrerPolicy(options?: any): RequestHandler;
    function xssFilter(options?: any): RequestHandler;
  }
  export = helmet;
}

declare module 'dotenv/config';
declare module 'dotenv' {
  interface DotenvConfigOptions {
    path?: string;
    encoding?: string;
    debug?: boolean;
    override?: boolean;
  }
  interface DotenvConfigOutput {
    error?: Error;
    parsed?: Record<string, string>;
  }
  export function config(options?: DotenvConfigOptions): DotenvConfigOutput;
  export function parse(src: string | Buffer | ArrayBuffer): Record<string, string>;
}

declare module 'swagger-jsdoc' {
  interface SwaggerDefinition {
    openapi: string;
    info: {
      title: string;
      version: string;
      description?: string;
      termsOfService?: string;
      contact?: { name?: string; url?: string; email?: string };
      license?: { name: string; url?: string };
    };
    servers?: Array<{ url: string; description?: string }>;
    tags?: Array<{ name: string; description?: string }>;
    components?: any;
    security?: Array<Record<string, string[]>>;
    paths?: any;
    [key: string]: any;
  }

  interface Options {
    definition?: SwaggerDefinition;
    swaggerDefinition?: SwaggerDefinition;
    apis: string[];
    encoding?: BufferEncoding;
    verbose?: boolean;
    format?: 'json' | 'yaml' | 'yml';
    failOnErrors?: boolean;
  }

  interface SwaggerJsDocFn {
    (options: Options): Promise<Record<string, any>>;
    (options: Options, callback: (err: Error | null, spec: Record<string, any>) => void): void;
    Options: Options;
    SwaggerDefinition: SwaggerDefinition;
  }

  const swaggerJSDoc: SwaggerJsDocFn;
  export = swaggerJSDoc;
}

declare module 'swagger-ui-express' {
  import type { RequestHandler } from 'express';

  interface SwaggerUiOptions {
    swaggerOptions?: any;
    customCss?: string;
    customCssUrl?: string | string[];
    customJs?: string | string[];
    customfavIcon?: string;
    swaggerUrl?: string | string[];
    swaggerUrls?: Array<{ name: string; url: string; primaryName?: string }>;
    customSiteTitle?: string;
    explorer?: boolean;
    isExplorer?: boolean;
    authOptions?: any;
    url?: string;
    urls?: Array<{ name: string; url: string }>;
    layout?: string;
    validatorUrl?: string;
  }

  function swaggerUiServe(req: any, res: any, next: any): any;
  function swaggerUiSetup(swaggerDoc: any, opts?: SwaggerUiOptions, options?: SwaggerUiOptions, customCss?: string, customfavIcon?: string, swaggerUrl?: string, customSiteTitle?: string): RequestHandler;
  function swaggerUiGenerateHTML(swaggerDoc: any, opts?: SwaggerUiOptions, options?: SwaggerUiOptions, customCss?: string, customfavIcon?: string, swaggerUrl?: string, customSiteTitle?: string): string;
  function swaggerUiGenerateHTML(opts?: SwaggerUiOptions, options?: SwaggerUiOptions, customCss?: string, customfavIcon?: string, swaggerUrl?: string, customSiteTitle?: string): string;

  export {
    swaggerUiServe as serve,
    swaggerUiSetup as setup,
    swaggerUiGenerateHTML as generateHTML,
  };

  const defaultExport: {
    serve: typeof swaggerUiServe;
    setup: typeof swaggerUiSetup;
    generateHTML: typeof swaggerUiGenerateHTML;
    serveFiles: any;
  };
  export default defaultExport;
}

declare module '@prisma/client' {
  export type PrismaPromise<T> = Promise<T> & { [Symbol.toStringTag]: 'PrismaPromise' };
  export type Decimal = any;
  export const Decimal: {
    new (value?: any): any;
  };
  export type JsonValue = boolean | number | string | null | { [k: string]: JsonValue } | JsonValue[];
  export type Json = JsonValue | { [k: string]: JsonValue };

  export type User = {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    profile?: any | null;
    transactions: any[];
    financialData: any[];
  };

  export type FinancialData = {
    id: string;
    userId: string;
    accountNumber: string | null;
    accountType: string;
    institutionName: string;
    balance: any;
    currency: string;
    dataSource: string;
    isEncrypted: boolean;
    encryptionKeyId: string | null;
    metadata: JsonValue | null;
    lastSyncedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    user: User;
  };

  export type Transaction = any;
  export type Profile = any;

  export interface UserArgs {
    where?: any;
    select?: any;
    include?: any;
    skip?: number;
    take?: number;
    cursor?: any;
    orderBy?: any;
    distinct?: any;
    data?: any;
  }

  export interface Delegate<T, Args = any> {
    findUnique: <U extends Args = Args>(args: U) => PrismaPromise<(T & any) | null>;
    findUniqueOrThrow: <U extends Args = Args>(args?: U) => PrismaPromise<T & any>;
    findFirst: <U extends Args = Args>(args?: U) => PrismaPromise<(T & any) | null>;
    findFirstOrThrow: <U extends Args = Args>(args?: U) => PrismaPromise<T & any>;
    findMany: <U extends Args = Args>(args?: U) => PrismaPromise<Array<T & any>>;
    create: <U extends Args = Args>(args: U) => PrismaPromise<T & any>;
    createMany: <U extends Args = Args>(args: U) => PrismaPromise<{ count: number }>;
    update: <U extends Args = Args>(args: U) => PrismaPromise<T & any>;
    updateMany: <U extends Args = Args>(args: U) => PrismaPromise<{ count: number }>;
    upsert: <U extends Args = Args>(args: U) => PrismaPromise<T & any>;
    delete: <U extends Args = Args>(args: U) => PrismaPromise<T & any>;
    deleteMany: <U extends Args = Args>(args?: U) => PrismaPromise<{ count: number }>;
    count: <U extends Args = Args>(args?: U) => PrismaPromise<number>;
    aggregate: (args?: any) => PrismaPromise<any>;
    groupBy: (args: any) => PrismaPromise<any[]>;
  }

  export class PrismaClient {
    constructor(options?: {
      datasources?: any;
      errorFormat?: 'pretty' | 'colorless' | 'minimal';
      log?: Array<'query' | 'info' | 'warn' | 'error' | any>;
    });
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $on(event: string, callback: (e: any) => void): void;
    $queryRaw<T = unknown>(query: TemplateStringsArray | string, ...values: any[]): PrismaPromise<T>;
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;
    $executeRaw(query: TemplateStringsArray | string, ...values: any[]): PrismaPromise<number>;
    $executeRawUnsafe(query: string, ...values: any[]): PrismaPromise<number>;
    $transaction<P extends PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: any }): Promise<any[]>;
    $transaction<R>(fn: (client: PrismaClient) => Promise<R>, options?: { maxWait?: number; timeout?: number; isolationLevel?: any }): Promise<R>;
    $use(...args: any[]): void;

    user: Delegate<User>;
    profile: Delegate<any>;
    transaction: Delegate<any>;
    transactions?: Delegate<any>;
    financialData: Delegate<FinancialData>;
    $extends: any;
  }

  export const Prisma: {
    prismaVersion: string;
    ModelName: {
      User: 'User';
      Profile: 'Profile';
      Transaction: 'Transaction';
      FinancialData: 'FinancialData';
    };
    scalar: any;
    sql: any;
    empty: any;
    raw: any;
    join: any;
    Define: any;
    validator: any;
    dmmf: any;
    PrismaClientKnownRequestError: new (message: string, code: string, clientVersion: string, meta?: any) => Error;
    PrismaClientUnknownRequestError: new (message: string, clientVersion: string) => Error;
    PrismaClientRustPanicError: new (message: string, clientVersion: string) => Error;
    PrismaClientInitializationError: new (message: string, errorCode?: string, clientVersion?: string) => Error;
    PrismaClientValidationError: new (message: string, clientVersion?: string) => Error;
  };
}

declare module '@arcana/types' {
  export * from '../../../packages/types/src/index';
}
