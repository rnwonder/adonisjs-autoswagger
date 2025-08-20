import { AutoSwagger } from './autoswagger';
// @ts-expect-error moduleResolution:nodenext issue 54523
import { VineValidator } from '@vinejs/vine';

/**
 * Helper function to register validators for HMR compatibility
 * 
 * Usage in your app startup (e.g., in start/kernel.ts or similar):
 * 
 * ```typescript
 * import { registerValidators } from 'adonis-autoswagger/validator-registry'
 * import AddressValidator from '#validators/address_validator'
 * import UserValidator from '#validators/user_validator'
 * 
 * // Register individual validators
 * registerValidators({
 *   AddressValidator,
 *   UserValidator,
 * })
 * ```
 */
export function registerValidators(validators: Record<string, VineValidator<any, any>>) {
  AutoSwagger.registerValidators(validators);
}

/**
 * Register a single validator
 */
export function registerValidator(name: string, validator: VineValidator<any, any>) {
  AutoSwagger.registerValidator(name, validator);
}

/**
 * Clear all registered validators (useful for testing)
 */
export function clearValidators() {
  AutoSwagger.clearValidators();
}

/**
 * Get all registered validators
 */
export function getRegisteredValidators() {
  return AutoSwagger.getRegisteredValidators();
}