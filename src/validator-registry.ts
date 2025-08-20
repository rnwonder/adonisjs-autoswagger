import { AutoSwagger } from './autoswagger';
// @ts-expect-error moduleResolution:nodenext issue 54523
import { VineValidator } from '@vinejs/vine';

/**
 * Helper function to register validators for HMR compatibility
 * Validators are automatically skipped based on configuration set via AutoSwagger options.
 * 
 * Usage in your app startup (e.g., in start/kernel.ts or similar):
 * 
 * ```typescript
 * import { registerValidators } from 'adonis-autoswagger/validator-registry'
 * import AddressValidator from '#validators/address_validator'
 * import UserValidator from '#validators/user_validator'
 * 
 * // Register individual validators (behavior controlled by AutoSwagger options)
 * registerValidators({
 *   AddressValidator,
 *   UserValidator,
 * })
 * ```
 * 
 * To configure when validators should be skipped, set options in your AutoSwagger configuration:
 * 
 * ```typescript
 * const options = {
 *   // ... other options
 *   productionEnv: 'production', // Skip when NODE_ENV matches this
 *   skipValidatorRegistration: false, // Or set to true to always skip
 * }
 * 
 * await autoswagger.writeFile(routes, options)
 * ```
 * 
 * @param validators - Record of validator instances
 */
export function registerValidators(validators: Record<string, VineValidator<any, any>>) {
  AutoSwagger.registerValidators(validators);
}

/**
 * Register a single validator
 * Validators are automatically skipped based on configuration set via AutoSwagger options.
 * 
 * @param name - Name of the validator
 * @param validator - Validator instance 
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