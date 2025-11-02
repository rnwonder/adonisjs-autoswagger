/**
 * Autoswagger interfaces
 */
export interface options {
  title?: string;
  ignore: string[];
  version?: string;
  description?: string;
  path: string;
  tagIndex: number;
  snakeCase: boolean;
  common: common;
  fileNameInSummary?: boolean;
  preferredPutPatch?: string;
  persistAuthorization?: boolean;
  appPath?: string;
  debug?: boolean;
  info?: any;
  securitySchemes?: any;
  productionEnv?: string;
  authMiddlewares?: string[];
  defaultSecurityScheme?: string;
  ignoreDefaultPatterns?: boolean; // Option to disable default ignore patterns
  skipValidatorRegistration?: boolean; // Option to skip validator registration entirely
}

export interface common {
  headers: any;
  parameters: any;
}

/**
 * Adonis routes
 */
export interface AdonisRouteMeta {
  resolvedHandler: {
    type: string;
    namespace?: string;
    method?: string;
  };
  resolvedMiddleware: Array<{
    type: string;
    args?: any[];
  }>;
}

export interface v6Handler {
  method?: string;
  moduleNameOrPath?: string;
  reference: string | any[];
  name: string;
}

export interface AdonisRoute {
  methods: string[];
  pattern: string;
  meta: AdonisRouteMeta;
  middleware: string[] | any;
  name?: string;
  params: string[];
  handler?: string | v6Handler;
}

export interface AdonisRoutes {
  root: AdonisRoute[];
}

export const standardTypes = [
  "string",
  "number",
  "integer",
  "datetime",
  "date",
  "boolean",
  "any",
  "uuid",
]
  .map((type) => [type, type + "[]"])
  .flat();

export interface SwaggerUIOptions {
  /** Swagger document object */
  swaggerDoc?: any;
  /** URL to fetch swagger document from */
  swaggerUrl?: string;
  /** Multiple swagger document URLs */
  swaggerUrls?: Array<{ url: string; name: string }>;
  /** Custom CSS string */
  customCss?: string;
  /** Custom CSS file URL(s) */
  customCssUrl?: string | string[];
  /** Custom JavaScript file URL(s) */
  customJs?: string | string[];
  /** Custom JavaScript code string(s) */
  customJsStr?: string | string[];
  /** Custom favicon URL */
  customfavIcon?: string;
  /** Custom site title */
  customSiteTitle?: string;
  /** Custom robots meta tag content */
  customRobots?: string;
  /** Swagger UI configuration options */
  swaggerOptions?: {
    /** OAuth configuration */
    oauth?: {
      clientId?: string;
      clientSecret?: string;
      realm?: string;
      appName?: string;
      scopeSeparator?: string;
      scopes?: string[];
      additionalQueryStringParams?: Record<string, any>;
      useBasicAuthenticationWithAccessCodeGrant?: boolean;
      usePkceWithAuthorizationCodeGrant?: boolean;
    };
    /** Pre-authorize API key */
    preauthorizeApiKey?: {
      authDefinitionKey: string;
      apiKeyValue: string;
    };
    /** Authorization action */
    authAction?: any;
    /** Display operation ID */
    displayOperationId?: boolean;
    /** Display request duration */
    displayRequestDuration?: boolean;
    /** Default models expand depth */
    defaultModelsExpandDepth?: number;
    /** Default model expand depth */
    defaultModelExpandDepth?: number;
    /** Default model rendering */
    defaultModelRendering?: "example" | "model";
    /** Document title */
    docExpansion?: "list" | "full" | "none";
    /** Filter */
    filter?: boolean | string;
    /** Show extensions */
    showExtensions?: boolean;
    /** Show common extensions */
    showCommonExtensions?: boolean;
    /** Try it out enabled */
    tryItOutEnabled?: boolean;
    /** Request snippets enabled */
    requestSnippetsEnabled?: boolean;
    /** Validator URL */
    validatorUrl?: string | null;
    /** Syntax highlight theme */
    syntaxHighlight?: {
      activate?: boolean;
      theme?: "agate" | "arta" | "monokai" | "nord" | "obsidian" | "tomorrow-night";
    };
    /** Persist authorization */
    persistAuthorization?: boolean;
    /** With credentials */
    withCredentials?: boolean;
    [key: string]: any;
  };
  /** Enable API explorer */
  explorer?: boolean;
}
