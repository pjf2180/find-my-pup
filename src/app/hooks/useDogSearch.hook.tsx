import { useState } from "react";
import {
  SearchFilters,
  SearchSortBy,
} from "../ui/components/search-bar/search-bar.component";
import {
  fetchLocations,
  LocationSearchParams,
  SearchLocation,
  SearchResponse,
} from "./useLocationSearch.hook";
import { DOG_DETAILS, DOG_SEARCH } from "../api/api.types";
import { getLocationsByZipcode } from "../api/endpoints/locations/locations.endpoint";

export function useDogSearch() {
  const [latestResponse, setLatestResponse] = useState<DogSearchResponse>();
  const [dogs, setDogs] = useState<DogDetail[]>([]);
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const search = async (
    params: SearchFilters,
    sortBy: SearchSortBy,
    from?: number
  ) => {
    setLoading(true);
    if (from === undefined) {
      setDogs([]);
    }

    try {
      const { breeds, age, location } = params;
      const ageMin = age?.min;
      const ageMax = age?.max;
      const sort = `${sortBy.field}:${sortBy.direction}`;
      const city: string = location?.selection.city ?? "";
      const zipCodes: string[] | undefined =
        city != "" ? await getZipcodes(city) : undefined;
      const dogSearchResponse = await fetchDogIds({
        breeds,
        ageMin,
        ageMax,
        zipCodes,
        size: 10,
        sort,
        from,
      });

      const responseDogDetails: DogDetailResponse[] =
        dogSearchResponse?.resultIds.length > 0
          ? await fetchDogDetails(dogSearchResponse?.resultIds)
          : [];
      const dogLocations = await getLocationsByZipcode(
        responseDogDetails.map((x) => x.zip_code)
      );
      const dogLocationsByZipCode = dogLocations.reduce(
        (acc: { [zip: string]: SearchLocation }, current) => {
          acc[current.zip_code] = current;
          return acc;
        },
        {}
      );
      const dogDetails: DogDetail[] = responseDogDetails.map((rd) => ({
        ...rd,
        location: dogLocationsByZipCode[rd.zip_code],
      }));
      setDogs((d) => [...d, ...dogDetails]);
      setLatestResponse(dogSearchResponse);
      setError(undefined);
    } catch (error: unknown) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };
  const nextSearchParams = latestResponse?.next;
  const next = extractFromValue(nextSearchParams);
  const total = latestResponse?.total;

  return {
    dogs,
    search,
    error,
    loading,
    next,
    total,
  };
}

async function getZipcodes(city: string): Promise<string[]> {
  const locationSearchParams: LocationSearchParams = {
    city,
    size: 200, // may change to multiple requests?
  };
  const locationsResponse: SearchResponse = await fetchLocations(
    locationSearchParams
  );
  const zipCodes = locationsResponse.results.map((l) => l.zip_code);
  return zipCodes;
}

function extractFromValue(query: string | undefined): number {
  if (query === undefined) {
    return 0;
  }
  const params = new URLSearchParams(query.split("?")[1]);
  const fromValue = params.get("from");
  return fromValue ? parseInt(fromValue, 10) : 0;
}

interface DogSearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}
interface DogIdFetchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}
async function fetchDogIds(
  params: DogIdFetchParams
): Promise<DogSearchResponse> {
  const queryParams = new URLSearchParams();

  if (params.breeds)
    params.breeds.forEach((breed) => queryParams.append("breeds", breed));
  if (params.zipCodes)
    params.zipCodes.forEach((zip) => queryParams.append("zipCodes", zip));
  if (params.ageMin !== undefined)
    queryParams.append("ageMin", params.ageMin.toString());
  if (params.ageMax !== undefined)
    queryParams.append("ageMax", params.ageMax.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.from) queryParams.append("from", params.from.toString());
  if (params.sort) queryParams.append("sort", params.sort);

  const url = `${DOG_SEARCH}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch dogs:", error);
    throw error;
  }
}

export interface DogDetailResponse {
  img: string;
  name: string;
  age: number;
  breed: string;
  zip_code: string;
  id: string;
}

export type DogDetail = DogDetailResponse & { location: SearchLocation };

async function fetchDogDetails(ids: string[]): Promise<DogDetailResponse[]> {
  try {
    const response = await fetch(DOG_DETAILS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch dogs:", error);
    throw error;
  }
}
