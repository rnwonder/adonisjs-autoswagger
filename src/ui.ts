import path from "path";
import { existsSync } from "fs";
import { scalarCustomCss } from "./scalarCustomCss";
import type { options } from "./types";

interface SwaggerUIOptions {
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

export class UIService {
  private swaggerUiAssetPath: string = "";
  private htmlTplString: string = `
<!-- HTML for static distribution bundle build -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <% robotsMetaString %>
  <title><% title %></title>
  <link rel="stylesheet" type="text/css" href="./swagger-ui.css" >
  <% favIconString %>
  <style>
    html
    {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *,
    *:before,
    *:after
    {
      box-sizing: inherit;
    }

    body {
      margin:0;
      background: #fafafa;
    }
  </style>
</head>

<body>

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position:absolute;width:0;height:0">
  <defs>
    <symbol viewBox="0 0 20 20" id="unlocked">
      <path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z"></path>
    </symbol>

    <symbol viewBox="0 0 20 20" id="locked">
      <path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8zM12 8H8V5.199C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8z"/>
    </symbol>

    <symbol viewBox="0 0 20 20" id="close">
      <path d="M14.348 14.849c-.469.469-1.229.469-1.697 0L10 11.819l-2.651 3.029c-.469.469-1.229.469-1.697 0-.469-.469-.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-.469-.469-.469-1.228 0-1.697.469-.469 1.228-.469 1.697 0L10 8.183l2.651-3.031c.469-.469 1.228-.469 1.697 0 .469.469.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c.469.469.469 1.229 0 1.698z"/>
    </symbol>

    <symbol viewBox="0 0 20 20" id="large-arrow">
      <path d="M13.25 10L6.109 2.58c-.268-.27-.268-.707 0-.979.268-.27.701-.27.969 0l7.83 7.908c.268.271.268.709 0 .979l-7.83 7.908c-.268.271-.701.27-.969 0-.268-.269-.268-.707 0-.979L13.25 10z"/>
    </symbol>

    <symbol viewBox="0 0 20 20" id="large-arrow-down">
      <path d="M17.418 6.109c.272-.268.709-.268.979 0s.271.701 0 .969l-7.908 7.83c-.27.268-.707.268-.979 0l-7.908-7.83c-.27-.268-.27-.701 0-.969.271-.268.709-.268.979 0L10 13.25l7.418-7.141z"/>
    </symbol>

    <symbol viewBox="0 0 24 24" id="jump-to">
      <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/>
    </symbol>

    <symbol viewBox="0 0 24 24" id="expand">
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
    </symbol>

  </defs>
</svg>

<div id="swagger-ui"></div>

<script src="./swagger-ui-bundle.js"> </script>
<script src="./swagger-ui-standalone-preset.js"> </script>
<script src="./swagger-ui-init.js"> </script>
<% customJs %>
<% customJsStr %>
<% customCssUrl %>
<style>
  <% customCss %>
</style>
</body>

</html>
`;

  private jsTplString: string = `
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  <% swaggerOptions %>
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  
  // Process spec to convert escaped newlines in descriptions to <br> tags
// Process spec to convert escaped newlines in descriptions to <br> tags
function processDescriptionsForRendering(obj, path = '') {
  // debug: log we were called at root or on nested path
  if (typeof window !== 'undefined' && window.console) {
    console.log('[DESCRIPTIONS] called for path:', path, typeof obj);
  }

  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item, i) => processDescriptionsForRendering(item, path + '[' + i + ']'));
  }

  const processed = {};
  for (const key in obj) {
    const curPath = path ? (path + '.' + key) : key;
    const val = obj[key];

    if (key === 'description' && typeof val === 'string') {
      // debug: log original snippet (short)
      if (typeof window !== 'undefined' && window.console) {
        console.log('[DESCRIPTIONS] original @', curPath, ':', (val.length > 200 ? val.slice(0,200) + '...' : val));
      }

      // Work on a single working copy, handle multiple escape levels
      let desc = val;
      desc = desc.replace(/\\\\n/g, '<br>'); // handles "\\\\n"
      desc = desc.replace(/\\n/g, '<br>');   // handles "\\n"
      desc = desc.replace(/\n/g, '<br>');    // handles real newlines

      // assign processed string
      processed[key] = desc;

      if (typeof window !== 'undefined' && window.console) {
        console.log('[DESCRIPTIONS] replaced @', curPath, ' -> (first 100 chars):', processed[key].slice(0,100));
      }
    } else if (typeof val === 'object' && val !== null) {
      processed[key] = processDescriptionsForRendering(val, curPath);
    } else {
      processed[key] = val;
    }
  }
  return processed;
}
  
  spec1 = processDescriptionsForRendering(spec1);

  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }

  // finalize UI after creation (shared for sync and async init)
  function finalizeUI(ui) {
    if (customOptions.oauth) {
      ui.initOAuth(customOptions.oauth)
    }

    if (customOptions.preauthorizeApiKey) {
      const key = customOptions.preauthorizeApiKey.authDefinitionKey;
      const value = customOptions.preauthorizeApiKey.apiKeyValue;
      if (!!key && !!value) {
        const pid = setInterval(() => {
          const authorized = ui.preauthorizeApiKey(key, value);
          if(!!authorized) clearInterval(pid);
        }, 500)
      }
    }

    if (customOptions.authAction) {
      ui.authActions.authorize(customOptions.authAction)
    }

    window.ui = ui
  }

  // If an inline spec was provided, it has already been processed above.
  if (swaggerOptions.spec) {
    var ui = SwaggerUIBundle(swaggerOptions)
    finalizeUI(ui)
  } else if (swaggerOptions.url) {
    // Fetch the remote spec, process descriptions, then initialize
    try {
      fetch(swaggerOptions.url)
        .then(function (resp) {
          if (!resp.ok) throw new Error('Failed to fetch spec: ' + resp.status)
          return resp.json()
        })
        .then(function (remoteSpec) {
          try {
            const processed = processDescriptionsForRendering(remoteSpec)
            swaggerOptions.spec = processed
            // Remove url/urls to ensure SwaggerUI uses inline spec we provide
            delete swaggerOptions.url
            delete swaggerOptions.urls
          } catch (e) {
            console.error('[DESCRIPTIONS] processing error', e)
          }
          var ui = SwaggerUIBundle(swaggerOptions)
          finalizeUI(ui)
        })
        .catch(function (err) {
          console.error('[DESCRIPTIONS] fetch error', err)
          // Fallback: initialize with original options (will let Swagger UI fetch)
          var ui = SwaggerUIBundle(swaggerOptions)
          finalizeUI(ui)
        })
    } catch (e) {
      console.error('[DESCRIPTIONS] fetch failed', e)
      var ui = SwaggerUIBundle(swaggerOptions)
      finalizeUI(ui)
    }
  } else {
    var ui = SwaggerUIBundle(swaggerOptions)
    finalizeUI(ui)
  }
}
`;

  private favIconHtml: string =
    '<link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />' +
    '<link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />';

  constructor() {
    // Lazy load swagger-ui-dist only when needed to avoid import errors during docs generation
    // The assets path is only used when serving UI, not during docs generation
    try {
      this.swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath();
    } catch (e) {
      // swagger-ui-dist may not be required for docs generation
      this.swaggerUiAssetPath = "";
    }
  }

  /**
   * Convert string or array to external script tags
   */
  private toExternalScriptTag(url: string): string {
    return `<script src='${url}'></script>`;
  }

  /**
   * Convert string or array to inline script tags
   */
  private toInlineScriptTag(jsCode: string): string {
    return `<script>${jsCode}</script>`;
  }

  /**
   * Convert string or array to external stylesheet tags
   */
  private toExternalStylesheetTag(url: string): string {
    return `<link href='${url}' rel='stylesheet'>`;
  }

  /**
   * Convert custom code (string or array) to HTML tags
   */
  private toTags(
    customCode: string | string[] | undefined,
    toScript: (code: string) => string
  ): string {
    if (typeof customCode === "string") {
      return toScript(customCode);
    } else if (Array.isArray(customCode)) {
      return customCode.map(toScript).join("\n");
    } else {
      return "";
    }
  }

  /**
   * Stringify options object with function support
   */
  private stringify(obj: any): string {
    const placeholder = "____FUNCTIONPLACEHOLDER____";
    const fns: Function[] = [];

    let json = JSON.stringify(
      obj,
      function (key, value) {
        if (typeof value === "function") {
          fns.push(value);
          return placeholder;
        }
        return value;
      },
      2
    );

    json = json.replace(new RegExp('"' + placeholder + '"', "g"), function (_) {
      return fns.shift()!.toString();
    });

    return "var options = " + json + ";";
  }

  /**
   * Generate HTML for Swagger UI with all customizations
   */
  public generateHTML(swaggerDoc?: any, opts?: SwaggerUIOptions): string {
    const options = opts?.swaggerOptions || {};
    const customCss = opts?.customCss || "";
    const customJs = opts?.customJs;
    const customJsStr = opts?.customJsStr;
    const customfavIcon = opts?.customfavIcon || false;
    const customRobots = opts?.customRobots;
    const swaggerUrl = opts?.swaggerUrl;
    const swaggerUrls = opts?.swaggerUrls;
    const isExplorer = opts?.explorer || !!swaggerUrls;
    const customSiteTitle = opts?.customSiteTitle || "Swagger UI";
    const customCssUrl = opts?.customCssUrl;

    // Hide download URL wrapper if not in explorer mode
    const explorerString = isExplorer
      ? ""
      : ".swagger-ui .topbar .download-url-wrapper { display: none }";

    const finalCustomCss = explorerString + " " + customCss;

    // Replace robots meta tag
    const robotsMetaString = customRobots
      ? '<meta name="robots" content="' + customRobots + '" />'
      : "";

    // Replace favicon
    const favIconString = customfavIcon
      ? '<link rel="icon" href="' + customfavIcon + '" />'
      : this.favIconHtml;

    // Build HTML with replacements
    let html = this.htmlTplString
      .replace("<% customCss %>", finalCustomCss)
      .replace("<% robotsMetaString %>", robotsMetaString)
      .replace("<% favIconString %>", favIconString)
      .replace(
        "<% customJs %>",
        this.toTags(customJs, this.toExternalScriptTag.bind(this))
      )
      .replace(
        "<% customJsStr %>",
        this.toTags(customJsStr, this.toInlineScriptTag.bind(this))
      )
      .replace(
        "<% customCssUrl %>",
        this.toTags(customCssUrl, this.toExternalStylesheetTag.bind(this))
      )
      .replace("<% title %>", customSiteTitle);

    // Generate init options
    const initOptions = {
      swaggerDoc: swaggerDoc || undefined,
      customOptions: options,
      swaggerUrl: swaggerUrl || undefined,
      swaggerUrls: swaggerUrls || undefined,
    };

    return html;
  }

  /**
   * Generate JavaScript initialization code
   */
  public generateSwaggerInitJS(
    swaggerDoc?: any,
    opts?: SwaggerUIOptions
  ): string {
    const options = opts?.swaggerOptions || {};
    const swaggerUrl = opts?.swaggerUrl;
    const swaggerUrls = opts?.swaggerUrls;

    const initOptions = {
      swaggerDoc: swaggerDoc || undefined,
      customOptions: options,
      swaggerUrl: swaggerUrl || undefined,
      swaggerUrls: swaggerUrls || undefined,
    };

    return this.jsTplString.replace(
      "<% swaggerOptions %>",
      this.stringify(initOptions)
    );
  }

  /**
   * Get Swagger UI asset path
   */
  public getSwaggerAssetsPath(): string {
    return this.swaggerUiAssetPath;
  }

  /**
   * Check if file exists in Swagger UI assets
   */
  public isSwaggerAsset(filename: string): boolean {
    const filePath = path.join(this.swaggerUiAssetPath, filename);
    return existsSync(filePath);
  }

  /**
   * Get absolute path for a Swagger UI asset
   */
  public getAssetPath(filename: string): string {
    return path.join(this.swaggerUiAssetPath, filename);
  }

  /**
   * Swagger UI
   * @param url string
   * @param options options
   * @returns
   */
  ui(url: string, options?: options) {
    const persistAuthString = options?.persistAuthorization
      ? "persistAuthorization: true,"
      : "";
    return `<!DOCTYPE html> 
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui-standalone-preset.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui-bundle.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui.css" />
<title>Documentation</title>
</head>
<body>
<div id="swagger-ui"></div>
<script>
window.onload = function() {
SwaggerUIBundle({
url: "${url}",
dom_id: '#swagger-ui',
presets: [
SwaggerUIBundle.presets.apis,
SwaggerUIStandalonePreset
],
layout: "BaseLayout",
${persistAuthString}
})
}
</script>
</body>
</html>`;
  }

  /**
   * Rapidoc UI
   * @param url string
   * @param style string
   * @returns
   */
  rapidoc(url: string, style = "view") {
    return (
      ` 
<!doctype html> <!-- Important: must specify -->
<html>
<head>
<meta charset="utf-8"> <!-- Important: rapi-doc uses utf8 characters -->
<script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
<title>Documentation</title>
</head>
<body>
<rapi-doc
spec-url = "` +
      url +
      `"
theme = "dark"
bg-color = "#24283b"
schema-style="tree"
schema-expand-level = "10"
header-color = "#1a1b26"
allow-try = "true"
nav-hover-bg-color = "#1a1b26"
nav-bg-color = "#24283b"
text-color = "#c0caf5"
nav-text-color = "#c0caf5"
primary-color = "#9aa5ce"
heading-text = "Documentation"
sort-tags = "true"
render-style = "` +
      style +
      `"
default-schema-tab = "example"
show-components = "true"
allow-spec-url-load = "false"
allow-spec-file-load = "false"
sort-endpoints-by = "path"

> </rapi-doc>
</body>
</html>
`
    );
  }

  /**
   * Scalar UI
   * @param url string
   * @param proxyUrl string
   * @returns
   */
  scalar(url: string, proxyUrl: string = "https://proxy.scalar.com") {
    return `
<!doctype html>
<html>
<head>
<title>API Reference</title>
<meta charset="utf-8" />
<meta
name="viewport"
content="width=device-width, initial-scale=1" />
<style>
${scalarCustomCss}
</style>
</head>
<body>
<script
id="api-reference"
data-url="${url}"
data-proxy-url="${proxyUrl}"></script>
<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>
`;
  }

  /**
   * Stoplight UI
   * @param url string
   * @param theme "light" | "dark"
   * @returns
   */
  stoplight(url: string, theme: "light" | "dark" = "dark") {
    return `
<!doctype html>
<html data-theme="${theme}">
<head>
<title>API Documentation - Stoplight</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
</head>
<body style="min-height:100vh">
<elements-api
style="display:block;height:100vh;width:100%;"
apiDescriptionUrl=${url}
router="hash"
layout="sidebar"
/>
</body>
</html>
`;
  }
}
