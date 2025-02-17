import { DOG_SEARCH } from "../../api.types";
export interface DogSearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}
export interface DogIdFetchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}
export async function fetchDogIds(
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
