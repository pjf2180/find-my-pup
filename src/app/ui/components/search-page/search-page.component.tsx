"use client";
import { useDogSearch } from "@/app/hooks/useDogSearch.hook";
import {
  SearchBar,
  SearchFilters,
  SearchSortBy,
} from "../search-bar/search-bar.component";
import LoginForm from "../login-form/login-form.component";
import { LOGIN_ENDPOINT, LOGOUT_ENDPOINT } from "@/app/api/api.types";
import { useState } from "react";

export function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>();
  const [sortBy] = useState<SearchSortBy>({
    field: "breed",
    direction: "desc",
  });

  const { dogs, loading, total, next, loadMore } = useDogSearch();

  const handleSubmit = async (credentials: {
    username: string;
    password: string;
  }) => {
    console.log("Credentials: ", credentials);
    await login(credentials.password, credentials.username);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleOnSearch = (searchData: SearchFilters) => {
    console.log("Breeds: ", searchData.breeds);
    console.log("Age: ", searchData.age);
    console.log("Location: ", searchData.location);
    setFilters(searchData);
    loadMore(searchData, sortBy);
  };

  const handleLoadMore = () => {
    loadMore(filters!, sortBy, next);
  };

  return (
    <>
      <header className="sticky top-0 flex justify-center bg-amber-50">
        <SearchBar breeds={DOG_BREEDS} onSearch={handleOnSearch} />
      </header>
      <main className="overflow-scroll bg-green-100">
        {loading && <p>Loading...</p>}
        <p>{total} results</p>
        <div className="flex flex-col gap-2">
          {dogs?.map((dog) => (
            <div key={dog.id} className="border rounded-md p-2">
              <p className="font-bold">{dog.name}</p>
              <p>{dog.breed}</p>
            </div>
          ))}
        </div>
        <div>
          {filters && (
            <button
              className="bg-black text-white p-4"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          )}
        </div>
      </main>
      <div className="fixed bottom-0 right-0 bg-blue-100 h-[300px] w-[300px]">
        <LoginForm onSubmit={handleSubmit} />
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
}

async function login(name: string, email: string): Promise<Response> {
  try {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, email }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

async function logout(): Promise<Response> {
  try {
    const response = await fetch(LOGOUT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

const DOG_BREEDS = [
  "Affenpinscher",
  "Afghan Hound",
  "African Hunting Dog",
  "Airedale",
  "American Staffordshire Terrier",
  "Appenzeller",
  "Australian Terrier",
  "Basenji",
  "Basset",
  "Beagle",
  "Bedlington Terrier",
  "Bernese Mountain Dog",
  "Black-and-tan Coonhound",
  "Blenheim Spaniel",
  "Bloodhound",
  "Bluetick",
  "Border Collie",
  "Border Terrier",
  "Borzoi",
  "Boston Bull",
  "Bouvier Des Flandres",
  "Boxer",
  "Brabancon Griffon",
  "Briard",
  "Brittany Spaniel",
  "Bull Mastiff",
  "Cairn",
  "Cardigan",
  "Chesapeake Bay Retriever",
  "Chihuahua",
  "Chow",
  "Clumber",
  "Cocker Spaniel",
  "Collie",
  "Curly-coated Retriever",
  "Dandie Dinmont",
  "Dhole",
  "Dingo",
  "Doberman",
  "English Foxhound",
  "English Setter",
  "English Springer",
  "EntleBucher",
  "Eskimo Dog",
  "Flat-coated Retriever",
  "French Bulldog",
  "German Shepherd",
  "German Short-haired Pointer",
  "Giant Schnauzer",
  "Golden Retriever",
  "Gordon Setter",
  "Great Dane",
  "Great Pyrenees",
  "Greater Swiss Mountain Dog",
  "Groenendael",
  "Ibizan Hound",
  "Irish Setter",
  "Irish Terrier",
  "Irish Water Spaniel",
  "Irish Wolfhound",
  "Italian Greyhound",
  "Japanese Spaniel",
  "Keeshond",
  "Kelpie",
  "Kerry Blue Terrier",
  "Komondor",
  "Kuvasz",
  "Labrador Retriever",
  "Lakeland Terrier",
  "Leonberg",
  "Lhasa",
  "Malamute",
  "Malinois",
  "Maltese Dog",
  "Mexican Hairless",
  "Miniature Pinscher",
  "Miniature Poodle",
  "Miniature Schnauzer",
  "Newfoundland",
  "Norfolk Terrier",
  "Norwegian Elkhound",
  "Norwich Terrier",
  "Old English Sheepdog",
  "Otterhound",
  "Papillon",
  "Pekinese",
  "Pembroke",
  "Pomeranian",
  "Pug",
  "Redbone",
  "Rhodesian Ridgeback",
  "Rottweiler",
  "Saint Bernard",
  "Saluki",
  "Samoyed",
  "Schipperke",
  "Scotch Terrier",
  "Scottish Deerhound",
  "Sealyham Terrier",
  "Shetland Sheepdog",
  "Shih-Tzu",
  "Siberian Husky",
  "Silky Terrier",
  "Soft-coated Wheaten Terrier",
  "Staffordshire Bullterrier",
  "Standard Poodle",
  "Standard Schnauzer",
  "Sussex Spaniel",
  "Tibetan Mastiff",
  "Tibetan Terrier",
  "Toy Poodle",
  "Toy Terrier",
  "Vizsla",
  "Walker Hound",
  "Weimaraner",
  "Welsh Springer Spaniel",
  "West Highland White Terrier",
  "Whippet",
  "Wire-haired Fox Terrier",
  "Yorkshire Terrier",
];
