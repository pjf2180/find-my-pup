import { DOG_MATCH } from "../../api.types";

export async function DogMatch(dogIds: string[]) {
  try {
    const response = await fetch(DOG_MATCH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dogIds),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    console.error("Could not match dogs");
    throw error;
  }
}
