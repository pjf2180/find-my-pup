import { DOG_DETAILS } from "../../api.types";
import { DogDetailResponse } from "../../types/dog.types";
import { SearchLocation } from "../../types/location.types";

export type DogDetail = DogDetailResponse & { location?: SearchLocation };

export async function fetchDogDetails(
  ids: string[]
): Promise<DogDetailResponse[]> {
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
