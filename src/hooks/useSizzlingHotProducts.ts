import { useCallback, useEffect, useState } from "react";
import {
  fetchSizzlingHotProducts,
  SizzlingHotProductsDto
} from "../api/sizzlingHotProductsClient";
import { GRAPHQL_URL } from "../config/graphql";

export function useSizzlingHotProducts(graphqlUrl = GRAPHQL_URL) {
  const [data, setData] = useState<SizzlingHotProductsDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async ({ refresh = false }: { refresh?: boolean } = {}) => {
      setError(null);
      setLoading(!refresh);
      setRefreshing(refresh);

      try {
        setData(await fetchSizzlingHotProducts(graphqlUrl));
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unable to load data");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [graphqlUrl]
  );

  useEffect(() => {
    load();
  }, [load]);

  const refetch = useCallback(() => load({ refresh: true }), [load]);

  return {
    data,
    error,
    loading,
    refreshing,
    refetch
  };
}
