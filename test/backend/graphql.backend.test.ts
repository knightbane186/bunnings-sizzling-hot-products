import { describe, expect, test } from "@jest/globals";
import path from "node:path";
import { executeSizzlingHotProductsQuery } from "../../src/graphql/schema";

describe("GraphQL API", () => {
  test("Given the sizzlingHotProducts query, When it runs, Then it returns daily and period winners", async () => {
    const result = await executeSizzlingHotProductsQuery({
      inputDirectory: path.resolve(__dirname, "..", "..", "inputs"),
      today: "23/04/2026",
      query: `{
        sizzlingHotProducts {
          daily {
            date
            productId
            productName
            salesCount
          }
          period {
            startDate
            endDate
            productId
            productName
            salesCount
          }
        }
      }`
    });

    expect(result.errors).toBeUndefined();
    expect(JSON.parse(JSON.stringify(result.data))).toEqual({
      sizzlingHotProducts: {
        daily: [
          {
            date: "21/04/2026",
            productId: "P1",
            productName: "Ezy Storage 37L Flexi Laundry Basket - White",
            salesCount: 3
          },
          {
            date: "22/04/2026",
            productId: "P1",
            productName: "Ezy Storage 37L Flexi Laundry Basket - White",
            salesCount: 2
          },
          {
            date: "23/04/2026",
            productId: "P6",
            productName: "Arlec 160W Crystalline Solar Foldable Charging Kit",
            salesCount: 1
          }
        ],
        period: {
          startDate: "21/04/2026",
          endDate: "23/04/2026",
          productId: "P1",
          productName: "Ezy Storage 37L Flexi Laundry Basket - White",
          salesCount: 6
        }
      }
    });
  });
});
