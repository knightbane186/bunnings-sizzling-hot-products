import {
  CompletedOrder,
  Order,
  OrderEntry,
  Product,
  ProductSalesTotal,
  SizzlingHotDailyResult,
  SizzlingHotPeriodResult,
  SizzlingHotProductsInput,
  SizzlingHotProductsResult
} from "../domain/types";
import {
  compareDates,
  getInclusiveDateRange,
  getLastNDays,
  isDateInRange
} from "../domain/date";

function createProductCatalog(products: Product[]): Map<string, string> {
  return new Map(products.map((product) => [product.id, product.name]));
}

function getCancelledOrderIds(orders: Order[]): Set<string> {
  return new Set(
    orders.filter((order) => order.status === "cancelled").map((order) => order.orderId)
  );
}

export function getActiveCompletedOrders(orders: Order[]): CompletedOrder[] {
  const cancelledOrderIds = getCancelledOrderIds(orders);

  return orders.filter(
    (order): order is CompletedOrder =>
      order.status === "completed" && !cancelledOrderIds.has(order.orderId)
  );
}

function getUniqueProductIds(
  entries: OrderEntry[],
  productCatalog: Map<string, string>
): string[] {
  const productIds = new Set<string>();

  for (const entry of entries) {
    if (entry.quantity > 0 && productCatalog.has(entry.id)) {
      productIds.add(entry.id);
    }
  }

  return [...productIds];
}

/**
 * Totals qualified product sales for a date range after applying cancellations,
 * same-order deduplication, and same-customer same-day deduplication.
 */
export function getProductTotals({
  products,
  orders,
  startDate,
  endDate
}: {
  products: Product[];
  orders: Order[];
  startDate: string;
  endDate: string;
}): ProductSalesTotal[] {
  const productCatalog = createProductCatalog(products);
  const countedCustomerDayProducts = new Set<string>();
  const totals = new Map<string, number>();

  for (const order of getActiveCompletedOrders(orders)) {
    if (!isDateInRange(order.date, startDate, endDate)) {
      continue;
    }

    for (const productId of getUniqueProductIds(order.entries, productCatalog)) {
      const saleKey = `${order.date}:${order.customerId}:${productId}`;

      if (countedCustomerDayProducts.has(saleKey)) {
        continue;
      }

      countedCustomerDayProducts.add(saleKey);
      totals.set(productId, (totals.get(productId) ?? 0) + 1);
    }
  }

  return [...totals.entries()]
    .map(([productId, salesCount]) => ({
      productId,
      productName: productCatalog.get(productId) ?? productId,
      salesCount
    }))
    .sort((a, b) => {
      if (b.salesCount !== a.salesCount) {
        return b.salesCount - a.salesCount;
      }

      return a.productName.localeCompare(b.productName);
    });
}

/**
 * Picks the highest-selling product for a period, using product name as the tie-breaker.
 */
export function getTopProductForPeriod({
  products,
  orders,
  startDate,
  endDate
}: {
  products: Product[];
  orders: Order[];
  startDate: string;
  endDate: string;
}): SizzlingHotPeriodResult {
  const totals = getProductTotals({ products, orders, startDate, endDate });
  const topProduct = totals[0];

  return {
    startDate,
    endDate,
    productId: topProduct?.productId ?? null,
    productName: topProduct?.productName ?? null,
    salesCount: topProduct?.salesCount ?? 0,
    totals
  };
}

/**
 * Calculates the top product for each calendar day in the requested range.
 */
export function getDailyTopProducts({
  products,
  orders,
  startDate,
  endDate
}: {
  products: Product[];
  orders: Order[];
  startDate: string;
  endDate: string;
}): SizzlingHotDailyResult[] {
  return getInclusiveDateRange(startDate, endDate).map((date) => {
    const periodResult = getTopProductForPeriod({
      products,
      orders,
      startDate: date,
      endDate: date
    });

    return {
      date,
      productId: periodResult.productId,
      productName: periodResult.productName,
      salesCount: periodResult.salesCount,
      totals: periodResult.totals
    };
  });
}

/**
 * Returns all daily winners plus the 3-day sizzling hot product for the fixed challenge date.
 */
export function getSizzlingHotProducts({
  products,
  orders,
  today = "23/04/2026"
}: SizzlingHotProductsInput): SizzlingHotProductsResult {
  const sortedDates = [
    ...new Set(orders.filter((order) => order.date).map((order) => order.date))
  ].sort(compareDates);
  const firstDate = sortedDates[0] ?? today;
  const lastThreeDays = getLastNDays(today, 3);

  return {
    today,
    daily: getDailyTopProducts({
      products,
      orders,
      startDate: firstDate,
      endDate: today
    }),
    period: getTopProductForPeriod({
      products,
      orders,
      startDate: lastThreeDays.startDate,
      endDate: lastThreeDays.endDate
    })
  };
}
