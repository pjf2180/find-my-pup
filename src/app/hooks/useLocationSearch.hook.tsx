import { useState, useCallback } from "react";
//import { LOCATIONS_SEARCH } from "../api/api.types";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: LocationSearchParams
): Promise<SearchResponse> {

  return SEARCH_RESPONSE;
  // const response = await fetch(LOCATIONS_SEARCH, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(params),
  //   credentials: "include",
  // });
  // if (!response.ok) {
  //   throw new Error(`Error ${response.status}: ${response.statusText}`);
  // }
  // const result: SearchResponse = await response.json();
  // return result;
}

const SEARCH_RESPONSE: SearchResponse = {
  results: [
    {
      city: "Holtsville",
      latitude: 40.922326,
      county: "Suffolk",
      state: "NY",
      zip_code: "00501",
      longitude: -72.637078,
    },
    {
      city: "Holtsville",
      latitude: 40.922326,
      county: "Suffolk",
      state: "NY",
      zip_code: "00544",
      longitude: -72.637078,
    },
    {
      city: "Adjuntas",
      latitude: 18.165273,
      county: "Adjuntas",
      state: "PR",
      zip_code: "00601",
      longitude: -66.722583,
    },
    {
      city: "Aguada",
      latitude: 18.393103,
      county: "Aguada",
      state: "PR",
      zip_code: "00602",
      longitude: -67.180953,
    },
    {
      city: "Aguadilla",
      latitude: 18.455913,
      county: "Aguadilla",
      state: "PR",
      zip_code: "00603",
      longitude: -67.14578,
    },
    {
      city: "Aguadilla",
      latitude: 18.49352,
      county: "Aguadilla",
      state: "PR",
      zip_code: "00604",
      longitude: -67.135883,
    },
    {
      city: "Aguadilla",
      latitude: 18.465162,
      county: "Aguadilla",
      state: "PR",
      zip_code: "00605",
      longitude: -67.141486,
    },
    {
      city: "Maricao",
      latitude: 18.172947,
      county: "Maricao",
      state: "PR",
      zip_code: "00606",
      longitude: -66.944111,
    },
    {
      city: "Anasco",
      latitude: 18.288685,
      county: "Anasco",
      state: "PR",
      zip_code: "00610",
      longitude: -67.139696,
    },
    {
      city: "Angeles",
      latitude: 18.279531,
      county: "Utuado",
      state: "PR",
      zip_code: "00611",
      longitude: -66.80217,
    },
    {
      city: "Arecibo",
      latitude: 18.450674,
      county: "Arecibo",
      state: "PR",
      zip_code: "00612",
      longitude: -66.698262,
    },
    {
      city: "Arecibo",
      latitude: 18.458093,
      county: "Arecibo",
      state: "PR",
      zip_code: "00613",
      longitude: -66.732732,
    },
    {
      city: "Arecibo",
      latitude: 18.429675,
      county: "Arecibo",
      state: "PR",
      zip_code: "00614",
      longitude: -66.674506,
    },
    {
      city: "Bajadero",
      latitude: 18.444792,
      county: "Arecibo",
      state: "PR",
      zip_code: "00616",
      longitude: -66.640678,
    },
    {
      city: "Barceloneta",
      latitude: 18.447092,
      county: "Barceloneta",
      state: "PR",
      zip_code: "00617",
      longitude: -66.544255,
    },
    {
      city: "Boqueron",
      latitude: 17.998531,
      county: "Cabo Rojo",
      state: "PR",
      zip_code: "00622",
      longitude: -67.187318,
    },
    {
      city: "Cabo Rojo",
      latitude: 18.062201,
      county: "Cabo Rojo",
      state: "PR",
      zip_code: "00623",
      longitude: -67.149541,
    },
    {
      city: "Penuelas",
      latitude: 18.023535,
      county: "Penuelas",
      state: "PR",
      zip_code: "00624",
      longitude: -66.726156,
    },
    {
      city: "Camuy",
      latitude: 18.477891,
      county: "Camuy",
      state: "PR",
      zip_code: "00627",
      longitude: -66.85477,
    },
    {
      city: "Castaner",
      latitude: 18.269187,
      county: "Lares",
      state: "PR",
      zip_code: "00631",
      longitude: -66.864993,
    },
    {
      city: "Rosario",
      latitude: 18.113284,
      county: "San German",
      state: "PR",
      zip_code: "00636",
      longitude: -67.039706,
    },
    {
      city: "Sabana Grande",
      latitude: 18.087322,
      county: "Sabana Grande",
      state: "PR",
      zip_code: "00637",
      longitude: -66.934911,
    },
    {
      city: "Ciales",
      latitude: 18.33616,
      county: "Ciales",
      state: "PR",
      zip_code: "00638",
      longitude: -66.472087,
    },
    {
      city: "Utuado",
      latitude: 18.250027,
      county: "Utuado",
      state: "PR",
      zip_code: "00641",
      longitude: -66.698957,
    },
    {
      city: "Dorado",
      latitude: 18.43606,
      county: "Dorado",
      state: "PR",
      zip_code: "00646",
      longitude: -66.281954,
    },
  ],
  total: 10000,
};
