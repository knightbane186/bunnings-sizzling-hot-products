export interface DailySizzlingHotProductDto {
  date: string;
  productId: string | null;
  productName: string | null;
  salesCount: number;
}

export interface PeriodSizzlingHotProductDto {
  startDate: string;
  endDate: string;
  productId: string | null;
  productName: string | null;
  salesCount: number;
}

export interface SizzlingHotProductsDto {
  daily: DailySizzlingHotProductDto[];
  period: PeriodSizzlingHotProductDto;
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

const SIZZLING_HOT_PRODUCTS_QUERY = `{
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
}`;

export async function fetchSizzlingHotProducts(
  graphqlUrl: string
): Promise<SizzlingHotProductsDto> {
  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: SIZZLING_HOT_PRODUCTS_QUERY })
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`);
  }

  const body = (await response.json()) as GraphqlResponse<{
    sizzlingHotProducts: SizzlingHotProductsDto;
  }>;

  if (body.errors?.length) {
    throw new Error(body.errors.map((error) => error.message).join(", "));
  }

  if (!body.data) {
    throw new Error("GraphQL response did not include data.");
  }

  return body.data.sizzlingHotProducts;
}
