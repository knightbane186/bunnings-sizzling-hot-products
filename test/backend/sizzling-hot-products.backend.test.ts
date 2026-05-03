import { describe, expect, test } from "@jest/globals";
import path from "node:path";
import { Order, Product } from "../../src/domain/types";
import { loadInputs } from "../../src/io/inputLoader";
import {
  getProductTotals,
  getSizzlingHotProducts,
  getTopProductForPeriod
} from "../../src/services/sizzlingHotProductsService";

const inputs = loadInputs(path.resolve(__dirname, "..", "..", "inputs"));

describe("Sizzling hot products service", () => {
  test("Given the sample inputs, When products are calculated, Then the README outcomes are returned", () => {
    const results = getSizzlingHotProducts({
      products: inputs.products,
      orders: inputs.orders,
      today: "23/04/2026"
    });

    expect(
      results.daily.map((result) => [result.date, result.productName])
    ).toEqual([
      ["21/04/2026", "Ezy Storage 37L Flexi Laundry Basket - White"],
      ["22/04/2026", "Ezy Storage 37L Flexi Laundry Basket - White"],
      ["23/04/2026", "Arlec 160W Crystalline Solar Foldable Charging Kit"]
    ]);

    expect([
      results.period.startDate,
      results.period.endDate,
      results.period.productName
    ]).toEqual([
      "21/04/2026",
      "23/04/2026",
      "Ezy Storage 37L Flexi Laundry Basket - White"
    ]);
  });

  test("Given duplicate product entries in one order, When totals are calculated, Then the product counts once", () => {
    const products: Product[] = [{ id: "P1", name: "Hammer" }];
    const orders: Order[] = [
      {
        orderId: "O1",
        customerId: "C1",
        entries: [
          { id: "P1", quantity: 5 },
          { id: "P1", quantity: 2 }
        ],
        date: "21/04/2026",
        status: "completed"
      }
    ];

    expect(
      getProductTotals({
        products,
        orders,
        startDate: "21/04/2026",
        endDate: "21/04/2026"
      })
    ).toEqual([{ productId: "P1", productName: "Hammer", salesCount: 1 }]);
  });

  test("Given same customer and product on the same day, When totals are calculated, Then duplicate orders count once", () => {
    const products: Product[] = [{ id: "P1", name: "Hammer" }];
    const orders: Order[] = [
      {
        orderId: "O1",
        customerId: "C1",
        entries: [{ id: "P1", quantity: 1 }],
        date: "21/04/2026",
        status: "completed"
      },
      {
        orderId: "O2",
        customerId: "C1",
        entries: [{ id: "P1", quantity: 1 }],
        date: "21/04/2026",
        status: "completed"
      }
    ];

    const result = getTopProductForPeriod({
      products,
      orders,
      startDate: "21/04/2026",
      endDate: "21/04/2026"
    });

    expect(result.salesCount).toBe(1);
  });

  test("Given different customers buy the same product, When totals are calculated, Then each customer counts", () => {
    const products: Product[] = [{ id: "P1", name: "Hammer" }];
    const orders: Order[] = [
      {
        orderId: "O1",
        customerId: "C1",
        entries: [{ id: "P1", quantity: 1 }],
        date: "21/04/2026",
        status: "completed"
      },
      {
        orderId: "O2",
        customerId: "C2",
        entries: [{ id: "P1", quantity: 1 }],
        date: "21/04/2026",
        status: "completed"
      }
    ];

    const result = getTopProductForPeriod({
      products,
      orders,
      startDate: "21/04/2026",
      endDate: "21/04/2026"
    });

    expect(result.salesCount).toBe(2);
  });

  test("Given the same customer buys the same product on different days, When period totals are calculated, Then each day counts", () => {
    const products: Product[] = [{ id: "P1", name: "Hammer" }];
    const orders: Order[] = [
      {
        orderId: "O1",
        customerId: "C1",
        entries: [{ id: "P1", quantity: 1 }],
        date: "21/04/2026",
        status: "completed"
      },
      {
        orderId: "O2",
        customerId: "C1",
        entries: [{ id: "P1", quantity: 1 }],
        date: "22/04/2026",
        status: "completed"
      }
    ];

    const result = getTopProductForPeriod({
      products,
      orders,
      startDate: "21/04/2026",
      endDate: "22/04/2026"
    });

    expect(result.salesCount).toBe(2);
  });

  test("Given a cancellation, When totals are calculated, Then the original completed sale is reversed", () => {
    const products: Product[] = [{ id: "P1", name: "Hammer" }];
    const orders: Order[] = [
      {
        orderId: "O1",
        customerId: "C1",
        entries: [{ id: "P1", quantity: 1 }],
        date: "21/04/2026",
        status: "completed"
      },
      {
        orderId: "O1",
        date: "22/04/2026",
        status: "cancelled"
      }
    ];

    const result = getTopProductForPeriod({
      products,
      orders,
      startDate: "21/04/2026",
      endDate: "21/04/2026"
    });

    expect(result.productName).toBeNull();
    expect(result.salesCount).toBe(0);
  });

  test("Given tied products, When a winner is selected, Then product name alphabetical order breaks the tie", () => {
    const products: Product[] = [
      { id: "P1", name: "Hammer" },
      { id: "P2", name: "BBQ" }
    ];
    const orders: Order[] = [
      {
        orderId: "O1",
        customerId: "C1",
        entries: [{ id: "P1", quantity: 1 }],
        date: "21/04/2026",
        status: "completed"
      },
      {
        orderId: "O2",
        customerId: "C2",
        entries: [{ id: "P2", quantity: 1 }],
        date: "21/04/2026",
        status: "completed"
      }
    ];

    const result = getTopProductForPeriod({
      products,
      orders,
      startDate: "21/04/2026",
      endDate: "21/04/2026"
    });

    expect(result.productName).toBe("BBQ");
  });
});
