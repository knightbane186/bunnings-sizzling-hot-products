import fs from "node:fs";
import path from "node:path";
import { Order, Product } from "../../core/domain/types";

export interface InputData {
  products: Product[];
  orders: Order[];
}

const inputCache = new Map<string, InputData>();

export function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

/**
 * Reads the challenge input files and stores them in the process cache.
 */
export function readInputsFromDisk(inputDirectory: string): InputData {
  const inputs = {
    products: readJsonFile<Product[]>(path.join(inputDirectory, "products.json")),
    orders: readJsonFile<Order[]>(path.join(inputDirectory, "orders.json"))
  };

  inputCache.set(inputDirectory, inputs);
  return inputs;
}

/**
 * Returns cached input data after the first read to avoid repeated filesystem work.
 */
export function loadInputs(inputDirectory: string): InputData {
  return inputCache.get(inputDirectory) ?? readInputsFromDisk(inputDirectory);
}

export function clearInputCache(): void {
  inputCache.clear();
}

export function defaultInputDirectory(): string {
  return path.resolve(process.cwd(), "inputs");
}
