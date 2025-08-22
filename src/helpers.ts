/**
 * Check if a string is a valid JSON
 */
import camelCase from "lodash/camelCase";
import startCase from "lodash/startCase";

export function isJSONString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

export function getBetweenBrackets(value: string, start: string) {
  let match = value.match(new RegExp(start + "\\(([^()]*)\\)", "g"));

  if (match !== null) {
    let m = match[0].replace(start + "(", "").replace(")", "");

    if (start !== "example") {
      m = m.replace(/ /g, "");
    }
    if (start === "paginated") {
      return "true";
    }
    return m;
  }

  return "";
}

export function mergeParams(initial, custom) {
  let merge = Object.assign(initial, custom);
  let params = [];
  for (const [key, value] of Object.entries(merge)) {
    params.push(value);
  }

  return params;
}

/**
 * Helpers
 */

export function formatOperationId(inputString: string): string {
  // Remove non-alphanumeric characters and split the string into words
  const cleanedWords = inputString.replace(/[^a-zA-Z0-9]/g, " ").split(" ");

  // Pascal casing words
  const pascalCasedWords = cleanedWords.map((word) =>
    startCase(camelCase(word))
  );

  // Generate operationId by joining every parts
  const operationId = pascalCasedWords.join();

  // CamelCase the operationId
  return camelCase(operationId);
}

/**
 * Resolve model file path with proper extension handling for dev/prod environments
 */
export function resolveModelFilePath(filePath: string): string {
  // Return the original path as-is since it already includes the correct extension
  // This helper ensures we don't accidentally strip extensions when reading files
  return filePath;
}

/**
 * Extract clean model name from file path by removing extensions and path prefixes
 */
export function extractModelName(filePath: string): string {
  // Remove both .js and .ts extensions for clean naming
  const cleanPath = filePath.replace(/\.(js|ts)$/, '');
  const split = cleanPath.split("/");
  return split[split.length - 1];
}
