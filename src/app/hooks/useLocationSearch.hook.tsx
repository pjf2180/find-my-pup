import { useState, useCallback } from "react";
import { LOCATIONS_SEARCH } from "../api/api.types";

interface Coordinates {
  lat: number;
  lon: number;
}

interface GeoBoundingBox {
  top?: Coordinates;
  left?: Coordinates;
  bottom?: Coordinates;
  right?: Coordinates;
  bottom_left?: Coordinates;
  top_left?: Coordinates;
}

export interface SearchLocation {
  city: string;
  latitude: number;
  county: string;
  state: string;
  zip_code: string;
  longitude: number;
}

export interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: GeoBoundingBox;
  size?: number;
  from?: number;
}

export interface SearchResponse {
  results: SearchLocation[];
  total: number;
}

export const useLocationSearch = () => {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocations = useCallback(async (params: LocationSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const result: SearchResponse = await fetchLocations(params);

      await new Promise((res) => {
        setTimeout(() => {
          res(undefined);
        }, 400);
      });
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, searchLocations };
};

export async function fetchLocations(
  params: LocationSearchParams
): Promise<SearchResponse> {

  const response = await fetch(LOCATIONS_SEARCH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  const result: SearchResponse = await response.json();
  return result;
}
