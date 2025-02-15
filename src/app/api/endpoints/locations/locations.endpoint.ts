import { SearchLocation } from "@/app/hooks/useLocationSearch.hook";
import { LOCATIONS } from "../../api.types";

export async function getLocationsByZipcode(
  zipcodes: string[]
): Promise<SearchLocation[]> {
  try {
    const response = await fetch(LOCATIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zipcodes),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    console.error("Could retrieve locations by zipcodes");
    throw error;
  }
}
