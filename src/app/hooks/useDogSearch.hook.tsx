import { useCallback, useEffect, useState } from "react";
import {
  SearchFilters,
  SearchSortBy,
} from "../ui/components/search-bar/search-bar.component";
import {
  fetchLocations,
  LocationSearchParams,
} from "./useLocationSearch.hook";
import { getLocationsByZipcode } from "../api/endpoints/locations/locations.endpoint";
import { DogDetail, fetchDogDetails } from "../api/endpoints/dogs/dog-details.endpoint";
import { DogSearchResponse, fetchDogIds } from "../api/endpoints/dogs/dog-search.endpoint";
import { DogDetailResponse } from "../api/types/dog.types";
import { SearchLocation, SearchResponse } from "../api/types/location.types";

export function useDogSearch(params: SearchFilters, sortBy: SearchSortBy) {
  const [latestResponse, setLatestResponse] = useState<DogSearchResponse>();
  const [dogsByPage, setDogsByPage] = useState<{
    [pageKey: string]: DogDetail[];
  }>({});
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const search = useCallback(
    async (from?: number) => {
      setLoading(true);
      if (from === undefined) {
        setDogsByPage({});
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

        const dogDetailsResponse: DogDetailResponse[] =
          dogSearchResponse?.resultIds.length > 0
            ? await fetchDogDetails(dogSearchResponse?.resultIds)
            : [];

        const dogLocations = await getLocationsByZipcode(
          dogDetailsResponse.map((x) => x.zip_code)
        );
        const dogLocationsByZipCode = dogLocations
          .filter((x) => x != null)
          .reduce((acc: { [zip: string]: SearchLocation }, current) => {
            acc[current.zip_code] = current;
            return acc;
          }, {});
        const dogDetails: DogDetail[] = dogDetailsResponse.map((d) => ({
          ...d,
          location: dogLocationsByZipCode[d.zip_code],
        }));
        setDogsByPage((d) => ({ ...d, [`from-${from}`]: dogDetails }));
        setLatestResponse(dogSearchResponse);
        setError(undefined);
      } catch (error: unknown) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    },
    [sortBy, params]
  );

  useEffect(() => {
    search();
  }, [params, sortBy, search]);

  const nextSearchParams = latestResponse?.next;
  const next = extractFromValue(nextSearchParams);
  const total = latestResponse?.total;
  const dogs = Object.values(dogsByPage).reduce((accu, currentList) => {
    return [...accu, ...currentList];
  }, []);

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
