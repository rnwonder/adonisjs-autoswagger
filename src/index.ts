import { AutoSwagger } from "./autoswagger";
export default new AutoSwagger();

// Export validator registry functions for HMR compatibility
export { 
  registerValidators, 
  registerValidator, 
  clearValidators, 
  getRegisteredValidators 
} from "./validator-registry";

// Export AutoSwagger class and configure method for advanced usage
export { AutoSwagger };

// Export UI service
export { UIService } from "./ui";

// Export types
export * from "./types";

export interface SwaggerUIOptions {
  swaggerDoc?: any;
  swaggerUrl?: string;
  swaggerUrls?: Array<{ url: string; name: string }>;
  customCss?: string;
  customCssUrl?: string | string[];
  customJs?: string | string[];
  customJsStr?: string | string[];
  customfavIcon?: string;
  customSiteTitle?: string;
  customRobots?: string;
  swaggerOptions?: any;
  explorer?: boolean;
}

