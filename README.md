<h1 align="center">
Adonis AutoSwagger <br />
<img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Swagger-logo.png" height="50" />
</h1>
<!-- 
[![Version](https://img.shields.io/github/tag/ad-on-is/adonis-autoswagger.svg?style=flat?branch=main)]()
[![GitHub stars](https://img.shields.io/github/stars/ad-on-is/adonis-autoswagger.svg?style=social&label=Star)]()
[![GitHub watchers](https://img.shields.io/github/watchers/ad-on-is/adonis-autoswagger.svg?style=social&label=Watch)]()
[![GitHub forks](https://img.shields.io/github/forks/ad-on-is/adonis-autoswagger.svg?style=social&label=Fork)]() -->

### Auto-Generate swagger docs for AdonisJS

## � Crediats

This package is based on the excellent work by [ad-on-is](https://github.com/ad-on-is) in the original [adonis-autoswagger](https://github.com/ad-on-is/adonis-autoswagger) project. This fork adds enhanced relation field selection capabilities, improved HMR support and other features while maintaining compatibility with the original API.

## 💻️ Install

```bash
pnpm i @rnwonder/adonis-autoswagger #using pnpm
```

> **🚀 Automated Releases**: This package uses automated version management. New versions are automatically published when changes are merged to the main branch. Check the [releases page](https://github.com/rnwonder/adonisjs-autoswagger/releases) for the latest updates.

---

## ⭐️ Features

- Creates **paths** automatically based on `routes.ts`
- Creates **schemas** automatically based on `app/Models/*`
- Creates **schemas** automatically based on `app/Interfaces/*`
- Creates **schemas** automatically based on `app/Validators/*` (only for adonisJS v6)
- Creates **schemas** automatically based on `app/Types/*` (only for adonisJS v6)
- **Rich configuration** via comments
- **Null value support** - Handle nullable fields with proper OpenAPI schemas
- **Multiple response bodies** - Support multiple response variations for the same status code using OpenAPI `oneOf`
- Works also in **production** mode
- `node ace docs:generate` command

---

## ✌️Usage

Create a file `/config/swagger.ts`

```ts
// for AdonisJS v6
import path from "node:path";
import url from "node:url";
// ---

export default {
  // path: __dirname + "/../", for AdonisJS v5
  path: path.dirname(url.fileURLToPath(import.meta.url)) + "/../", // for AdonisJS v6
  title: "Foo", // use info instead
  version: "1.0.0", // use info instead
  description: "", // use info instead
  tagIndex: 2,
  productionEnv: "production", // optional
  info: {
    title: "title",
    version: "1.0.0",
    description: "",
  },
  snakeCase: true,

  debug: false, // set to true, to get some useful debug output
  ignore: ["/swagger", "/docs"],
  preferredPutPatch: "PUT", // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  securitySchemes: {}, // optional
  authMiddlewares: ["auth", "auth:api"], // optional
  defaultSecurityScheme: "BearerAuth", // optional
  persistAuthorization: true, // persist authorization between reloads on the swagger page
  showFullPath: false, // the path displayed after endpoint summary
  ignoreDefaultPatterns: false, // ignore default patterns such as /uploads/* /assets/* /static/* /public/*
};
```

In your `routes.ts`

## 6️⃣ for AdonisJS v6

```js
import AutoSwagger from "adonis-autoswagger";
import swagger from "#config/swagger";
// returns swagger in YAML
router.get("/swagger", async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger);
});

// Renders Swagger-UI and passes YAML-output of /swagger
router.get("/docs", async () => {
  return AutoSwagger.default.ui("/swagger", swagger);
  // return AutoSwagger.default.scalar("/swagger"); to use Scalar instead. If you want, you can pass proxy url as second argument here.
  // return AutoSwagger.default.rapidoc("/swagger", "view"); to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
});
```

## 5️⃣ for AdonisJS v5

```js
import AutoSwagger from "adonis-autoswagger";
import swagger from "Config/swagger";
// returns swagger in YAML
Route.get("/swagger", async () => {
  return AutoSwagger.docs(Route.toJSON(), swagger);
});

// Renders Swagger-UI and passes YAML-output of /swagger
Route.get("/docs", async () => {
  return AutoSwagger.ui("/swagger", swagger);
});
```

### 👍️ Done

Visit `http://localhost:3333/docs` to see AutoSwagger in action.

## HMR (Hot Module Reloading) Support

If you're using `node ace serve --hmr`, validators might not appear in your Swagger documentation due to dynamic import limitations. To fix this, register your validators during app startup:

### Step 1: Register Validators

In your app startup file (e.g., `start/kernel.ts` or similar), register your validators:

```typescript
import { registerValidators } from "@rnwonder/adonis-autoswagger";
import AddressValidator from "#validators/address_validator";
import UserValidator from "#validators/user_validator";
import OrderValidator from "#validators/order_validator";

// Register all validators for HMR compatibility
registerValidators({
  AddressValidator,
  UserValidator,
  OrderValidator,
});
```

### Step 2: Use Validators in Documentation

Now you can use your validators in your controller annotations as usual:

```typescript
/**
 * @requestBody <AddressValidator>
 * @responseBody 200 - Address created successfully
 */
async create({ request }: HttpContextContract) {
  // Your controller logic
}
```

### Alternative: Use --watch instead of --hmr

If you prefer not to register validators manually, you can use:

```bash
node ace serve --watch
```

instead of `--hmr`. This mode supports automatic validator discovery.

### Functions

- `async docs(routes, conf)`: get the specification in YAML format
- `async json(routes, conf)`: get the specification in JSON format
- `ui(path, conf)`: get default swagger UI
- `rapidoc(path, style)`: get rapidoc UI
- `scalar(path, proxyUrl)`: get scalar UI
- `stoplight(path, theme)`: get stoplight elements UI
- `jsonToYaml(json)`: can be used to convert `json()` back to yaml

---

## 💡 Compatibility

For controllers to get detected properly, please load them lazily.

```ts
✅ const TestController = () => import('#controllers/test_controller')
❌ import TestController from '#controllers/test_controller'
```

## 🧑‍💻 Advanced usage

### Additional configuration

**info**
See [Swagger API General Info](https://swagger.io/docs/specification/api-general-info/) for details.

**securitySchemes**

Add/Overwrite security schemes [Swagger Authentication](https://swagger.io/docs/specification/authentication/) for details.

```ts
// example to override ApiKeyAuth
securitySchemes: {
  ApiKeyAuth: {
    type: "apiKey"
    in: "header",
    name: "X-API-Key"
  }
}
```

**defaultSecurityScheme**

Override the default security scheme.

- BearerAuth
- BasicAuth
- ApiKeyAuth
- your own defined under `securitySchemes`

**authMiddlewares**

If a route uses a middleware named `auth`, `auth:api`, AutoSwagger will detect it as a Swagger security method. However, you can implement other middlewares that handle authentication.

### Modify generated output

```ts
Route.get("/myswagger", async () => {
  const json = await AutoSwagger.json(Route.toJSON(), swagger);
  // modify json to your hearts content
  return AutoSwagger.jsonToYaml(json);
});

Route.get("/docs", async () => {
  return AutoSwagger.ui("/myswagger", swagger);
});
```

### Custom Paths in adonisJS v6

AutoSwagger supports the paths set in `package.json`. Interfaces are expected to be in `app/interfaces`, also all types and enums should be under `app/types`. However, you can override this, by modifying package.json as follows.

```json
//...
"imports": {
  // ...
  "#interfaces/*": "./app/custom/path/interfaces/*.js",
  "#types/*": "./app/custom/path/types/*.js"
  // ...
}
//...

```

---

## 📃 Configure

### `tagIndex`

Tags endpoints automatically

- If your routes are `/api/v1/products/...` then your tagIndex should be `3`
- If your routes are `/v1/products/...` then your tagIndex should be `2`
- If your routes are `/products/...` then your tagIndex should be `1`

### `ignore`

Ignores specified paths. When used with a wildcard (\*), AutoSwagger will ignore everything matching before/after the wildcard.
`/test/_`will ignore everything starting with`/test/`, whereas `\*/test`will ignore everything ending with`/test`.

### `common`

Sometimes you want to use specific parameters or headers on multiple responses.

_Example:_ Some resources use the same filter parameters or return the same headers.

Here's where you can set these and use them with `@paramUse()` and `@responseHeader() @use()`. See practical example for further details.

---

---

## Null Value Support

AutoSwagger now properly handles `null` values in JSON response bodies. You can document APIs that return either objects or `null` without parsing errors.

### Example

```ts
/**
 * @description Get user information
 * @responseBody 200 - {"user": null, "message": "User not found"}
 * @responseBody 200 - {"user": "<User>", "message": "User found"}
 */
public async getUser({ response }: HttpContextContract) {
  // Your logic here
}
```

This generates proper OpenAPI schemas with `nullable: true` for null values, following OpenAPI 3.0 specifications.

## Multiple Response Bodies

You can now document multiple response variations for the same HTTP status code. AutoSwagger automatically combines them using OpenAPI's `oneOf` schema with individual examples.

### Example

```ts
/**
 * @description User authentication endpoint
 * @responseBody 200 - {"user": "<User>", "message": "Login successful", "token": "string"}
 * @responseBody 200 - {"user": null, "message": "Invalid credentials", "token": null}
 * @responseBody 429 - {"error": "Too many requests", "retryAfter": "number"}
 */
public async login({ request, response }: HttpContextContract) {
  // Your authentication logic here
}
```

### Benefits

- **Clear API Documentation**: Shows all possible response variations
- **Better Developer Experience**: API consumers understand all possible responses
- **OpenAPI 3.0 Compliance**: Uses standard `oneOf` for multiple schemas
- **Individual Examples**: Each response variation has its own example
- **Backward Compatibility**: Single response bodies work exactly as before

---

# 💫 Extend Controllers

## Add additional documentation to your Controller-files

**@summary** (only one)
A summary of what the action does

**@tag** (only one)
Set a custom tag for this action

**@description** (only one)
A detailed description of what the action does.

**@operationId** (only one)
An optional unique string used to identify an operation. If provided, these IDs must be unique among all operations described in your API..

**@responseBody** (multiple)

Format: `<status> - <return> - <description>`

`<return>` can be either a `<Schema>`, `<Schema[]>/` or a custom JSON `{}`

**@responseHeader** (multiple)

Format: `<status> - <name> - <description> - <meta>`

**@param`Type`** (multiple)

`Type` can be one of [Parameter Types](https://swagger.io/docs/specification/describing-parameters/) (first letter in uppercase)

**@requestBody** (only one)
A definition of the expected requestBody

Format: `<body>`

`<body>` can be either a `<Schema>`, `<Schema[]>/`, or a custom JSON `{}`

**@requestFormDataBody** (only one)
A definition of the expected requestBody that will be sent with formData format.

**Schema**
A model or a validator.
Format: `<Schema>`

**Custom format**

Format: `{"fieldname": {"type":"string", "format": "email"}}`
This format should be a valid openapi 3.x json.

---

# 🤘Examples

## `@responseBody` examples

```ts
@responseBody <status> - Lorem ipsum Dolor sit amet

@responseBody <status> // returns standard <status> message

@responseBody <status> - <Model> // returns model specification

@responseBody <status> - <Model[]> // returns model-array specification

@responseBody <status> - <Model>.with(relations, property1, property2.relations, property3.subproperty.relations) // returns a model and a defined relation

@responseBody <status> - <Model[]>.with(relations).exclude(property1, property2, property3.subproperty) // returns model specification

@responseBody <status> - <Model[]>.append("some":"valid json") // append additional properties to a Model

@responseBody <status> - <Model[]>.paginated() // helper function to return adonisJS conform structure like {"data": [], "meta": {}}

@responseBody <status> - <Model[]>.paginated(dataName, metaName) // returns a paginated model with custom keys for the data array and meta object, use `.paginated(dataName)` or `.paginated(,metaName)` if you want to override only one. Don't forget the ',' for the second parameter.

@responseBody <status> - <Model>.only(property1, property2) // pick only specific properties

@responseBody <status> - <Model[]>.with(relations).only(relation.field1, relation.field2) // include relations but only show specific fields from each relation

@requestBody <status> <myCustomValidator> // returns a validator object

@responseBody <status> - {"foo": "bar", "baz": "<Model>"} //returns custom json object and also parses the model
@responseBody <status> - ["foo", "bar"] //returns custom json array

// 🆕 NEW: Null value support
@responseBody <status> - {"user": null, "message": "Not found"} // properly handles null values

// 🆕 NEW: Multiple response bodies for same status code
@responseBody 200 - {"user": "<User>", "status": "success"} // success case
@responseBody 200 - {"user": null, "status": "not_found"} // not found case
// Both responses above will be combined using OpenAPI oneOf with separate examples
```

### Advanced Relation Field Selection

You can now combine `.with()` and `.only()` to include specific relations while selecting only certain fields from each relation. This is particularly useful for optimizing API responses by including only the data you need.

#### Basic Syntax

```ts
@responseBody <status> - <Model[]>.with(relation1, relation2.nestedRelation).only(field1, field2, relation1.field1, relation2.nestedRelation.field1)
```

#### How it works

- **`.with()`** specifies which relations to include
- **`.only()`** specifies which fields to show from the model and its relations
- **Base model fields** are always included unless explicitly filtered
- **Relations** are only included if specified in `.with()` or have nested field specifications in `.only()`
- **Relation fields** are filtered based on the `.only()` specifications

#### Examples

**Example 1: Basic relation field selection**

```ts
/**
 * @responseBody 200 - <User[]>.with(profile, posts).only(id, name, profile.bio, profile.avatar, posts.title, posts.createdAt)
 */
```

Result: Users with only `id` and `name`, profile with only `bio` and `avatar`, posts with only `title` and `createdAt`.

**Example 2: Nested relation field selection**

```ts
/**
 * @responseBody 200 - <Order[]>.with(buyer, seller.user, products).only(id, status, buyer.firstName, buyer.lastName, seller.businessName, seller.user.email, products.name, products.price)
 */
```

Result: Orders with basic fields, buyer names, seller business name and user email, product name and price.

**Example 3: Deep nested relations**

```ts
/**
 * @responseBody 200 - <Post[]>.with(author.profile, comments.author).only(title, content, author.name, author.profile.bio, comments.text, comments.author.name)
 */
```

Result: Posts with title/content, author name and bio, comments with text and author names.

**Example 4: Mixed field selection (your working example)**

```ts
/**
 * @responseBody 200 - <HeadsUp[]>.with(funder, rotorParticipant.subscription, rotorParticipant.rotor, groupMember.group.creator, order.products, order.buyer, order.seller.user).only(funder, rotorParticipant.id, rotorParticipant.subscription.id, rotorParticipant.subscription.nextPaymentDate, rotorParticipant.rotor.name, groupMember.group.creator.firstName, order.products.name, order.buyer.firstName, order.seller.user.email).paginated()
 */
```

Result: HeadsUps with all base fields, complete funder object, selected fields from nested relations.

#### Important Notes

1. **Base model fields**: Always included unless you want to restrict them (rare use case)
2. **Relation inclusion**: Relations must be specified in `.with()` to be included
3. **Field filtering**: Use `.only()` to specify exactly which fields you want from each relation
4. **Nested paths**: Use dot notation like `relation.nestedRelation.field` for deep nesting
5. **Complete relations**: If a relation is in `.with()` but has no `.only()` specifications, all its fields are included
6. **Missing fields**: If you specify a field that doesn't exist in the schema, it will be ignored

#### Field Selection Rules

- **Include all relation fields**: `.with(relation)` (no `.only()` for that relation)
- **Include specific relation fields**: `.with(relation).only(relation.field1, relation.field2)`
- **Include nested relation fields**: `.with(relation.nested).only(relation.nested.field1)`
- **Include complete nested relation**: `.with(relation.nested)` (no `.only()` for nested relation)

````

## `@paramPath` and `@paramQuery` examples

```ts
// basicaly same as @response, just without a status
@paramPath <paramName> - Description - (meta)
@paramQuery <paramName> - Description - (meta)

@paramPath id - The ID of the source - @type(number) @required
@paramPath slug - The ID of the source - @type(string)

@paramQuery q - Search term - @type(string) @required
@paramQuery page - the Page number - @type(number)

````

## `@requestBody` examples

```ts
// basicaly same as @response, just without a status
@requestBody <Model> // Expects model specification
@requestBody <myCustomValidator> // Expects validator specification
@requestBody <Model>.with(relations) // Expects model and its relations
@requestBody <Model[]>.append("some":"valid json") // append additional properties to a Model
@requestBody {"foo": "bar"} // Expects a specific JSON
```

## `@requestFormDataBody` examples

```ts
// Providing a raw JSON
@requestFormDataBody {"name":{"type":"string"},"picture":{"type":"string","format":"binary"}} // Expects a valid OpenAPI 3.x JSON
```

```ts
// Providing a Model, and adding additional fields
@requestFormDataBody <Model> // Expects a valid OpenAPI 3.x JSON
@requestFormDataBody <Model>.exclude(property1).append("picture":{"type":"string","format":"binary"}) // Expects a valid OpenAPI 3.x JSON
```

---

# **Practical example**

`config/swagger.ts`

```ts
export default {
  path: __dirname + "../",
  title: "YourProject",
  version: "1.0.0",
  tagIndex: 2,
  ignore: ["/swagger", "/docs", "/v1", "/", "/something/*", "*/something"],
  common: {
    parameters: {
      sortable: [
        {
          in: "query",
          name: "sortBy",
          schema: { type: "string", example: "foo" },
        },
        {
          in: "query",
          name: "sortType",
          schema: { type: "string", example: "ASC" },
        },
      ],
    },
    headers: {
      paginated: {
        "X-Total-Pages": {
          description: "Total amount of pages",
          schema: { type: "integer", example: 5 },
        },
        "X-Total": {
          description: "Total amount of results",
          schema: { type: "integer", example: 100 },
        },
        "X-Per-Page": {
          description: "Results per page",
          schema: { type: "integer", example: 20 },
        },
      },
    },
  },
};
```

`app/Controllers/Http/SomeController.ts`

```ts
export default class SomeController {
  /**
   * @index
   * @operationId getProducts
   * @description Returns array of producs and it's relations
   * @responseBody 200 - <Product[]>.with(relations)
   * @paramUse(sortable, filterable)
   * @responseHeader 200 - @use(paginated)
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  public async index({ request, response }: HttpContextContract) {}

  /**
   * @show
   * @paramPath id - Describe the path param - @type(string) @required
   * @paramQuery foo - Describe the query param - @type(string) @required
   * @description Returns a product with it's relation on user and user relations
   * @responseBody 200 - <Product>.with(user, user.relations)
   * @responseBody 404
   */
  public async show({ request, response }: HttpContextContract) {}

  /**
   * @update
   * @responseBody 200
   * @responseBody 404 - Product could not be found
   * @requestBody <Product>
   */
  public async update({ request, response }: HttpContextContract) {}

  /**
   * @myCustomFunction
   * @summary Lorem ipsum dolor sit amet
   * @paramPath provider - The login provider to be used - @enum(google, facebook, apple)
   * @responseBody 200 - {"token": "xxxxxxx"}
   * @requestBody {"code": "xxxxxx"}
   */
  public async myCustomFunction({ request, response }: HttpContextContract) {}

  /**
   * 🆕 NEW FEATURES SHOWCASE
   * @login
   * @summary User authentication with multiple response scenarios
   * @description Authenticate user with email and password, demonstrating null value support and multiple response bodies
   * @responseBody 200 - {"user": "<User>", "token": "string", "message": "Login successful"} - Successful login
   * @responseBody 200 - {"user": null, "token": null, "message": "Invalid credentials"} - Failed authentication
   * @responseBody 200 - {"user": null, "token": null, "message": "Account not activated"} - Inactive account
   * @responseBody 429 - {"error": "Too many attempts", "retryAfter": 300}
   * @requestBody {"email": "string", "password": "string"}
   */
  public async login({ request, response }: HttpContextContract) {
    // Multiple response variations will be automatically combined using OpenAPI oneOf
    // Each response will have its own example in the documentation
  }

  /**
   * @getUserProfile
   * @summary Get user profile with nullable relations
   * @description Demonstrates null value handling in complex nested objects
   * @responseBody 200 - {"user": "<User>", "profile": {"bio": "string", "avatar": null}, "preferences": null}
   * @responseBody 404 - {"user": null, "profile": null, "preferences": null, "error": "User not found"}
   */
  public async getUserProfile({ request, response }: HttpContextContract) {
    // Null values in nested objects are now properly handled
  }
}
```

---

## What does it do?

AutoSwagger tries to extracat as much information as possible to generate swagger-docs for you.

## Paths

Automatically generates swagger path-descriptions, based on your application routes. It also detects endpoints, protected by the auth-middlware.

![paths](https://i.imgur.com/EnPw6xT.png)

### Responses and RequestBody

Generates responses and requestBody based on your simple Controller-Annotation (see Examples)

---

## Schemas

### Models

Automatically generates swagger schema-descriptions based on your models

![alt](https://i.imgur.com/FEdLplp.png)

### Interfaces

Instead of using `param: any` you can now use custom interfaces `param: UserDetails`. The interfaces files need to be located at `app/Interfaces/`

### Enums

If you use enums in your models, AutoSwagger will detect them from `app/Types/` folder and add them to the schema.
If you want to add enum on ExampleValue, you can use `.append(enumFieldExample)`

Example:

```ts
 @responseBody 200 - <Model>.with(relations).append(enumFieldExample)
```

## Extend Models

Add additional documentation to your Models properties.

### SoftDelete

Either use `compose(BaseModel, SoftDeletes)` or add a line `@swagger-softdeletes` to your Model.

## Attention

The below comments MUST be placed **1 line** above the property.

---

**@no-swagger**
Although, autoswagger detects `serializeAs: null` fields automatically, and does not show them. You can use @no-swagger for other fields.

**@enum(foo, bar)**
If a field has defined values, you can add them into an enum. This is usesfull for something like a status field.

**@format(string)**
Specify a format for that field, i.e. uuid, email, binary, etc...

**@example(foo bar)**
Use this field to provide own example values for specific fields

**@props({"minLength": 10, "foo": "bar"})**
Use this field to provide additional properties to a field, like minLength, maxLength, etc. Needs to bee valid JSON.

**@required**
Specify that the field is required

```ts
// SomeModel.js
@hasMany(() => ProductView)
// @no-swagger
public views: HasMany<typeof ProductView>


@column()
// @enum(pending, active, deleted)
public status: string

@column()
// @example(johndoe@example.com)
public email: string

@column()
// @props({"minLength": 10})
public age: number

```

---

## Production environment

> [!WARNING]
> Make sure **NODE_ENV=production** in your production environment or whatever you set in `options.productionEnv`

To make it work in production environments, additional steps are required

- Create a new command for `docs:generate` [See official documentation](https://docs.adonisjs.com/guides/ace/creating-commands)

  - This should create a new file in `commands/DocsGenerate.ts`

- Use the provided [`DocsGenerate.ts.examle`](https://github.com/rnwonder/adonisjs-autoswagger/blob/main/DocsGenerate.ts.example)/[`DocsGeneratev6.ts.example`](https://github.com/rnwonder/adonisjs-autoswagger/blob/main/DocsGeneratev6.ts.example) and put its contents into your newly created `DocsGenerate.ts`

- Modify `/start/env.ts` as follows

```ts
//...
// this is necessary to make sure that the `DocsGenerate` command will run in CI/CD pipelines without setting environment variables
const isNodeAce = process.argv.some(
  (arg) => arg.endsWith("/ace") || arg === "ace"
);

export default await Env.create(
  new URL("../", import.meta.url),
  isNodeAce
    ? {}
    : {
        // leave other settings as is
        NODE_ENV: Env.schema.enum([
          "development",
          "production",
          "test",
        ] as const),
        PORT: Env.schema.number(),
      }
);

//...
```

- Execute the following

```bash
node ace docs:generate
node ace build --production
cp swagger.yml build/
```

## Known Issues

- Interfaces with objects are not working like `interface Test {foo: {bar: string}}`
  - Solution, just extract the object as it's own interface
- Models with Union types like `status: "paid" | "not paid"` will throw error
  - Solution, just extract the Union as its own type
