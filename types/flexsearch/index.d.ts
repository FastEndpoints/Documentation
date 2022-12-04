// Index type declaration from DefinitelyTyped below
// Added generic id type parameter to Index

// Type definitions for flexsearch 0.7
// Project: https://github.com/nextapps-de/flexsearch/
// Definitions by: LOSSES Don <https://github.com/Losses>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
declare module "flexsearch" {
      /**
    * **Index:**
    * * Basic usage and variants: https://github.com/nextapps-de/flexsearch#basic-usage-and-variants
    * * API overview: https://github.com/nextapps-de/flexsearch#api-overview
    * * Usage: https://github.com/nextapps-de/flexsearch#usage
    */
   class Index<TId extends Id> {
      constructor(x?: Preset | IndexOptions<string>);
      add(id: TId, item: string): this;
      append(id: TId, item: string): this;
      update(id: TId, item: string): this;
      remove(target: TId): this;
      search(query: string, options?: Limit | SearchOptions): IndexSearchResult<TId>;
      search(
         query: string,
         limit: number,
         options: SearchOptions
      ): IndexSearchResult<TId>;
      search(options: SearchOptions): IndexSearchResult<TId>;

      // https://github.com/nextapps-de/flexsearch#check-existence-of-already-indexed-ids
      contain(id: TId): boolean;

      export(handler: ExportHandler<string>): Promise<void>;
      import(id: TId, item: string): Promise<void>;

      // Async Methods
      addAsync(id: TId, item: string, callback?: AsyncCallback<this>): Promise<this>;
      appendAsync(id: TId, item: string, callback?: AsyncCallback<this>): Promise<this>;
      updateAsync(id: TId, item: string, callback?: AsyncCallback<this>): Promise<this>;
      removeAsync(target: TId, callback?: AsyncCallback<this>): Promise<this>;
      searchAsync(
         query: string,
         options?: Limit | SearchOptions,
         callback?: AsyncCallback<IndexSearchResult<TId>>
      ): Promise<IndexSearchResult<TId>>;
      searchAsync(
         query: string,
         limit: number,
         options?: Limit | SearchOptions
      ): IndexSearchResult<TId>;
      searchAsync(options: SearchOptions): Promise<IndexSearchResult<TId>>;
   }

   export = Index;

   export type Id = number | string;
   export type Limit = number;
   export type ExportHandler<T> = (id: string | number, value: T) => void;
   export type AsyncCallback<T = undefined> = T extends undefined ? () => void : (result: T) => void;
   export type UnknownFunction = (...x: unknown[]) => unknown;

   export type StoreOption = boolean | string | string[];
   export type EnrichStoreOption = true | string | string[];

   /************************************/
   /* Common Options                   */
   /************************************/

   /**
    * **Document:**
    * * Presets: https://github.com/nextapps-de/flexsearch#presets
    */
   export type Preset = "memory" | "performance" | "match" | "score" | "default";

   /**
    * **Document:**
    * * Tokenizer: https://github.com/nextapps-de/flexsearch#tokenizer-prefix-search
    * * Add custom tokenizer: https://github.com/nextapps-de/flexsearch#add-custom-tokenizer
    */
   export type Tokenizer =
      | "strict"
      | "forward"
      | "reverse"
      | "full"
      | ((x: string) => string[]);

   /**
    * **Document:**
    * * Encoders: https://github.com/nextapps-de/flexsearch#encoders
    */
   export type Encoders =
      | false
      | "default"
      | "simple"
      | "balance"
      | "advanced"
      | "extra"
      | ((x: string) => string[]);

   /**
    * **Document:**
    * * Contextual search: https://github.com/nextapps-de/flexsearch#contextual
    */
   export interface ContextOptions {
      resolution: number;
      depth: false | number;
      bidirectional: boolean;
   }

   /**
    * **Document:**
    * * Search options: https://github.com/nextapps-de/flexsearch#search-options
    */
   export interface SearchOptions {
      query?: string;
      limit?: number;
      offset?: number;
      suggest?: boolean;
   }

   /**
    * **Document:**
    * * The document descriptor: https://github.com/nextapps-de/flexsearch#the-document-descriptor
    */
   export interface Descriptor<T, Store extends StoreOption = false> {
      id: string | number;
      field: string[] | Array<IndexOptions<T, Store>>;
   }

   /**
    * **Document:**
    * * Context Options: https://github.com/nextapps-de/flexsearch#context-options
    */
   export interface ContextOptions {
      resolution: number;
      depth: false | number;
      bidirectional: boolean;
   }

   /**
    * **Document:**
    * * Charset options: https://github.com/nextapps-de/flexsearch#charset-options
    */
   export interface CharsetOptions {
      split: false | string | RegExp;
      rtl: boolean;
      encode: (x: string) => string[];
   }

   export interface Stemmer {
      [key: string]: string;
   }

   export interface Matcher {
      [key: string]: string;
   }

   export type FilterFunction = (x: string) => boolean;
   export type FilterArray = string[];

   /**
    * **Document:**
    * * Language Options: https://github.com/nextapps-de/flexsearch#language-options
    * * Language: https://github.com/nextapps-de/flexsearch#languages
    */
   export interface LanguageOptions {
      stemmer: false | string | Stemmer | UnknownFunction;
      filter: false | string | FilterArray | FilterFunction;
      matcher: false | string | Matcher | UnknownFunction;
   }

   /**
    * These options will determine how the documents be indexed.
    *
    * **Generic type parameters:**
    *
    * @template T The type of the document.
    * @template Store If store is enabled.
    *
    * **Document:**
    * * Index options: https://github.com/nextapps-de/flexsearch#index-options
    * * Language: https://github.com/nextapps-de/flexsearch#languages
    */
   export interface IndexOptions<T, Store extends StoreOption = false> {
      preset?: Preset;
      tokenize?: Tokenizer;
      cache?: boolean | number;
      resolution?: number;
      context?: boolean | IndexOptions<T, Store> | ContextOptions;
      optimize?: boolean;
      boost?: (words: string[], term: string, index: number) => number;

      // Language-specific Options and Encoding
      charset?: CharsetOptions | string;
      language?: LanguageOptions | string;
      encode?: Encoders;
      stemmer?: LanguageOptions['stemmer'];
      filter?: LanguageOptions['filter'];
      matcher?: LanguageOptions['matcher'];
   }

   /************************************/
   /* Index Search                     */
   /************************************/

   export type IndexSearchResult<TId extends Id> = TId[];
}