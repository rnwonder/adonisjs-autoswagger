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

/**
 * Parse a potentially multi-line description from JSDoc comments
 * Supports both old format (single line) and new format (quoted multi-line)
 * 
 * @example
 * // Old format
 * parseDescription("This is a simple description")
 * // Returns: "This is a simple description"
 * 
 * @example
 * // New format (multi-line with quotes)
 * parseDescription('"This is a\\nmulti-line\\ndescription"')
 * // Returns: "This is a\nmulti-line\ndescription"
 */
export function parseDescription(descContent: string): {
  isMultiLine: boolean;
  content: string;
} {
  const trimmed = descContent.trim();

  // Check if it's the new quoted format
  if (trimmed.startsWith('"')) {
    // Check if it's a single-line quoted description
    if (trimmed.endsWith('"') && trimmed.length > 1) {
      return {
        isMultiLine: false,
        content: trimmed.slice(1, -1).trim(),
      };
    }
    
    // It's a multi-line description starting with a quote
    return {
      isMultiLine: true,
      content: trimmed.slice(1), // Remove opening quote
    };
  }

  // Old format: single-line description without quotes
  return {
    isMultiLine: false,
    content: trimmed,
  };
}

/**
 * Clean multi-line description by removing comment markers and preserving structure
 * Converts markdown-style descriptions to properly formatted text with line breaks
 * 
 * @example
 * cleanMultiLineDescription('This is line 1\\n * This is line 2\\n * \\n * This is line 4"')
 * // Returns: "This is line 1\nThis is line 2\n\nThis is line 4"
 */
export function cleanMultiLineDescription(fullDesc: string): string {
  const lines = fullDesc
    .split("\n")
    .map((line) => {
      // Remove leading whitespace and comment markers (*, */, etc)
      return line
        .replace(/^\s*\*\s?/, "") // Remove comment marker *
        .replace(/^\s*/, "") // Remove leading whitespace
        .trim();
    });

  // Process lines to preserve structure
  const processedLines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip stray markers
    if (line === "/" || line === "*") {
      continue;
    }
    
    // Keep the line (including empty lines for paragraph breaks)
    processedLines.push(line);
  }

  // Join with newlines and clean up formatting
  let result = processedLines
    .join("\n")
    .replace(/^"/, "") // Remove leading quote if present
    .replace(/"$/, "") // Remove trailing quote if present
    .replace(/\n\n+/g, "\n\n"); // Normalize multiple blank lines to exactly 2 newlines

  // Convert newlines to <br> tags for HTML rendering in Swagger UI
  result = result.replace(/\n/g, "<br>");

  return result.trim();
}

