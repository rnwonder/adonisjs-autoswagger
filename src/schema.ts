import path from "path";
import util from "util";
import fs from "fs";
// @ts-expect-error moduleResolution:nodenext issue 54523
import { VineValidator } from "@vinejs/vine";
import {
  InterfaceParser,
  ModelParser,
  ValidatorParser,
  EnumParser,
  CommentParser,
  RouteParser,
} from "./parsers";
import { ExampleInterfaces } from "./example";
import { FileService } from "./file";
import { options } from "./types";
import { existsSync } from "fs";
import { extractModelName } from './helpers.js';

export class SchemaService {
  protected options: options;
  protected schemas: Record<string, any> = {};
  protected commentParser: CommentParser;
  protected modelParser: ModelParser;
  protected interfaceParser: InterfaceParser;
  protected enumParser: EnumParser;
  protected routeParser: RouteParser;
  protected validatorParser: ValidatorParser;
  protected customPaths: Record<string, any> = {};
  protected fileService: FileService;

  constructor(options: options) {
    this.options = options;
    this.modelParser = new ModelParser(this.options.snakeCase);
    this.interfaceParser = new InterfaceParser(this.options.snakeCase);
    this.validatorParser = new ValidatorParser();
    this.enumParser = new EnumParser();
    this.fileService = new FileService();
  }
  /**
   * Get all schemas
   * @returns
   */
  async getSchemas(): Promise<Record<string, any>> {
    let schemas: Record<string, any> = {
      Any: {
        description: "Any JSON object not defined as schema",
      },
    };

    schemas = {
      ...schemas,
      ...(await this.getInterfaces()),
      ...(await this.getSerializers()),
      ...(await this.getModels()),
      ...(await this.getValidators()),
      ...(await this.getEnums()),
    };

    return schemas;
  }

  /**
   * Get all validators
   * @returns
   */
  async getValidators(): Promise<Record<string, any>> {
    const validators: Record<string, any> = {};
    let p6: string = path.join(this.options.appPath, "validators");

    if (typeof this.customPaths["#validators"] !== "undefined") {
      // it's v6
      p6 = p6.replaceAll("app/validators", this.customPaths["#validators"]);
      p6 = p6.replaceAll("app\\validators", this.customPaths["#validators"]);
    }

    if (!existsSync(p6)) {
      if (this.options.debug) {
        console.log("Validators paths don't exist", p6);
      }
      return validators;
    }

    const files = await this.fileService.getFiles(p6, []);
    if (this.options.debug) {
      console.log("Found validator files", files);
    }

    try {
      for (let file of files) {
        if (/^[a-zA-Z]:/.test(file)) {
          file = "file:///" + file;
        }

        const val = await import(file);
        for (const [key, value] of Object.entries(val)) {
          if (value.constructor.name.includes("VineValidator")) {
            validators[key] = await this.validatorParser.validatorToObject(
              value as VineValidator<any, any>
            );
            validators[key].description = key + " (Validator)";
          }
        }
      }
    } catch (e) {
      console.log(
        "**You are probably using 'node ace serve --hmr', which is not supported yet. Use 'node ace serve --watch' instead.**"
      );
      console.error(e.message);
    }

    return validators;
  }

  /**
   * Get all serializers
   * @returns
   */
  async getSerializers(): Promise<Record<string, any>> {
    const serializers: Record<string, any> = {};
    let p6: string = path.join(this.options.appPath, "serializers");

    if (typeof this.customPaths["#serializers"] !== "undefined") {
      // it's v6
      p6 = p6.replaceAll("app/serializers", this.customPaths["#serializers"]);
      p6 = p6.replaceAll("app\\serializers", this.customPaths["#serializers"]);
    }

    if (!existsSync(p6)) {
      if (this.options.debug) {
        console.log("Serializers paths don't exist", p6);
      }
      return serializers;
    }

    const files = await this.fileService.getFiles(p6, []);
    if (this.options.debug) {
      console.log("Found serializer files", files);
    }

    for (let file of files) {
      if (/^[a-zA-Z]:/.test(file)) {
        file = "file:///" + file;
      }

      const val = await import(file);

      for (const [key, value] of Object.entries(val)) {
        if (key.indexOf("Serializer") > -1) {
          serializers[key] = value;
        }
      }
    }

    return serializers;
  }

  /**
   * Get all models
   * @returns
   */
  async getModels(): Promise<Record<string, any>> {
    const models: Record<string, any> = {};
    let p: string = path.join(this.options.appPath, "Models");
    let p6: string = path.join(this.options.appPath, "models");

    if (typeof this.customPaths["#models"] !== "undefined") {
      // it's v6
      p6 = p6.replaceAll("app/models", this.customPaths["#models"]);
      p6 = p6.replaceAll("app\\models", this.customPaths["#models"]);
    }

    if (!existsSync(p) && !existsSync(p6)) {
      if (this.options.debug) {
        console.log("Model paths don't exist", p, p6);
      }
      return models;
    }
    if (existsSync(p6)) {
      p = p6;
    }
    const files = await this.fileService.getFiles(p, []);
    const readFile = util.promisify(fs.readFile);
    if (this.options.debug) {
      console.log("Found model files", files);
    }
    for (let file of files) {
      // Use the original file path with proper extension for reading
      const originalFilePath = file;
      
      // Extract clean model name without extensions
      let name = extractModelName(file);
      
      // Read from the original path with proper extension
      const data = await readFile(originalFilePath, "utf8");
      
      const parsed = this.modelParser.parseModelProperties(data);
      if (parsed.name !== "") {
        name = parsed.name;
      }
      let schema = {
        type: "object",
        properties: parsed.props,
        description: name + " (Model)",
      };
      if (parsed.required.length > 0) {
        schema["required"] = parsed.required;
      }
      if (name.toLowerCase().includes("readme.md")) continue;
      models[name] = schema;
    }
    return models;
  }

  /**
   * Get all interfaces
   * @returns
   */
  async getInterfaces(): Promise<Record<string, any>> {
    let interfaces: Record<string, any> = {
      ...ExampleInterfaces.paginationInterface(),
    };
    let p: string = path.join(this.options.appPath, "Interfaces");
    let p6: string = path.join(this.options.appPath, "interfaces");

    if (typeof this.customPaths["#interfaces"] !== "undefined") {
      // it's v6
      p6 = p6.replaceAll("app/interfaces", this.customPaths["#interfaces"]);
      p6 = p6.replaceAll("app\\interfaces", this.customPaths["#interfaces"]);
    }

    if (!existsSync(p) && !existsSync(p6)) {
      if (this.options.debug) {
        console.log("Interface paths don't exist", p, p6);
      }
      return interfaces;
    }
    if (existsSync(p6)) {
      p = p6;
    }
    const files = await this.fileService.getFiles(p, []);
    if (this.options.debug) {
      console.log("Found interfaces files", files);
    }
    const readFile = util.promisify(fs.readFile);
    for (let file of files) {
      // Use the original file path with proper extension for reading
      const originalFilePath = file;
      
      // Read from the original path with proper extension
      const data = await readFile(originalFilePath, "utf8");
      
      interfaces = {
        ...interfaces,
        ...this.interfaceParser.parseInterfaces(data),
      };
    }

    return interfaces;
  }

  /**
   * Get all enums
   * @returns
   */
  async getEnums(): Promise<Record<string, any>> {
    let enums: Record<string, any> = {};

    const enumParser = new EnumParser();

    let p: string = path.join(this.options.appPath, "Types");
    let p6: string = path.join(this.options.appPath, "types");

    if (typeof this.customPaths["#types"] !== "undefined") {
      // it's v6
      p6 = p6.replaceAll("app/types", this.customPaths["#types"]);
      p6 = p6.replaceAll("app\\types", this.customPaths["#types"]);
    }

    if (!existsSync(p) && !existsSync(p6)) {
      if (this.options.debug) {
        console.log("Enum paths don't exist", p, p6);
      }
      return enums;
    }

    if (existsSync(p6)) {
      p = p6;
    }

    const files = await this.fileService.getFiles(p, []);
    if (this.options.debug) {
      console.log("Found enum files", files);
    }

    const readFile = util.promisify(fs.readFile);
    for (let file of files) {
      // Use the original file path with proper extension for reading
      const originalFilePath = file;
      
      // Read from the original path with proper extension
      const data = await readFile(originalFilePath, "utf8");

      const parsedEnums = enumParser.parseEnums(data);
      enums = {
        ...enums,
        ...parsedEnums,
      };
    }

    return enums;
  }
}
