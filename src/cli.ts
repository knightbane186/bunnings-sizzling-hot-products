#!/usr/bin/env node

import path from "node:path";
import {
  SizzlingHotPeriodResult,
  SizzlingHotProductsResult
} from "./domain/types";
import { defaultInputDirectory, loadInputs } from "./io/inputLoader";
import { getSizzlingHotProducts } from "./services/sizzlingHotProductsService";

interface CliOptions {
  json: boolean;
  today: string;
  inputs: string;
}

export function parseArgs(argv: string[]): CliOptions {
  return argv.reduce<CliOptions>(
    (options, arg) => {
      if (arg === "--json") {
        return { ...options, json: true };
      }

      if (arg.startsWith("--today=")) {
        return { ...options, today: arg.slice("--today=".length) };
      }

      if (arg.startsWith("--inputs=")) {
        return { ...options, inputs: path.resolve(arg.slice("--inputs=".length)) };
      }

      return options;
    },
    {
      json: false,
      today: "23/04/2026",
      inputs: defaultInputDirectory()
    }
  );
}

function formatPeriod(result: SizzlingHotPeriodResult): string {
  if (result.startDate === result.endDate) {
    return result.startDate;
  }

  return `${result.startDate} - ${result.endDate}`;
}

function formatProduct(productName: string | null): string {
  return productName ?? "No sales";
}

export function toRows(
  results: SizzlingHotProductsResult
): { period: string; product: string }[] {
  return [
    ...results.daily.map((result) => ({
      period: result.date,
      product: formatProduct(result.productName)
    })),
    {
      period: formatPeriod(results.period),
      product: formatProduct(results.period.productName)
    }
  ];
}

function printTable(results: SizzlingHotProductsResult): void {
  const rows = toRows(results);
  const periodWidth = Math.max(
    "Date or Period".length,
    ...rows.map((row) => row.period.length)
  );
  const productWidth = Math.max(
    "Top Sizzling Hot Product".length,
    ...rows.map((row) => row.product.length)
  );
  const divider = `+-${"-".repeat(periodWidth)}-+-${"-".repeat(productWidth)}-+`;

  console.log(divider);
  console.log(
    `| ${"Date or Period".padEnd(periodWidth)} | ${"Top Sizzling Hot Product".padEnd(productWidth)} |`
  );
  console.log(divider);

  for (const row of rows) {
    console.log(
      `| ${row.period.padEnd(periodWidth)} | ${row.product.padEnd(productWidth)} |`
    );
  }

  console.log(divider);
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const inputs = loadInputs(options.inputs);
  const results = getSizzlingHotProducts({
    products: inputs.products,
    orders: inputs.orders,
    today: options.today
  });

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  printTable(results);
}

if (require.main === module) {
  main();
}
