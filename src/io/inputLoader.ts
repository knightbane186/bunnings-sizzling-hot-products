import fs from "node:fs";
import path from "node:path";
import { Order, Product } from "../domain/types";

export interface InputData {
  products: Product[];
  orders: Order[];
}

export function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function loadInputs(inputDirectory: string): InputData {
  return {
    products: readJsonFile<Product[]>(path.join(inputDirectory, "products.json")),
    orders: readJsonFile<Order[]>(path.join(inputDirectory, "orders.json"))
  };
}

export function defaultInputDirectory(): string {
  return path.resolve(__dirname, "..", "..", "..", "inputs");
}
