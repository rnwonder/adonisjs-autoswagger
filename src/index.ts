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
