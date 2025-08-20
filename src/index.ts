import { AutoSwagger } from "./autoswagger";
export default new AutoSwagger();

// Export validator registry functions for HMR compatibility
export { 
  registerValidators, 
  registerValidator, 
  clearValidators, 
  getRegisteredValidators 
} from "./validator-registry";
