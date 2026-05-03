import { buildSchema, graphql } from "graphql";
import { loadInputs } from "../io/inputLoader";
import { getSizzlingHotProducts } from "../services/sizzlingHotProductsService";

export const schema = buildSchema(`
  type DailySizzlingHotProduct {
    date: String!
    productId: String
    productName: String
    salesCount: Int!
  }

  type PeriodSizzlingHotProduct {
    startDate: String!
    endDate: String!
    productId: String
    productName: String
    salesCount: Int!
  }

  type SizzlingHotProducts {
    daily: [DailySizzlingHotProduct!]!
    period: PeriodSizzlingHotProduct!
  }

  type Query {
    sizzlingHotProducts: SizzlingHotProducts!
  }
`);

export function createRootValue(options: {
  inputDirectory: string;
  today?: string;
}) {
  return {
    sizzlingHotProducts: () => {
      const inputs = loadInputs(options.inputDirectory);
      const result = getSizzlingHotProducts({
        products: inputs.products,
        orders: inputs.orders,
        today: options.today
      });

      return {
        daily: result.daily.map((dailyResult) => ({
          date: dailyResult.date,
          productId: dailyResult.productId,
          productName: dailyResult.productName,
          salesCount: dailyResult.salesCount
        })),
        period: {
          startDate: result.period.startDate,
          endDate: result.period.endDate,
          productId: result.period.productId,
          productName: result.period.productName,
          salesCount: result.period.salesCount
        }
      };
    }
  };
}

export function executeSizzlingHotProductsQuery({
  query,
  inputDirectory,
  today
}: {
  query: string;
  inputDirectory: string;
  today?: string;
}) {
  return graphql({
    schema,
    source: query,
    rootValue: createRootValue({ inputDirectory, today })
  });
}
