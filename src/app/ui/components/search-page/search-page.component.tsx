"use client";
import { DogDetail, useDogSearch } from "@/app/hooks/useDogSearch.hook";
import {
  SearchBar,
  SearchFilters,
  SearchSortBy,
  SortByField,
  SortDirection,
} from "../search-bar/search-bar.component";
import LoginForm from "../login-form/login-form.component";
import { LOGIN_ENDPOINT, LOGOUT_ENDPOINT } from "@/app/api/api.types";
import { useContext, useEffect, useState } from "react";
import {
  OptionDropdown,
  DropdownOption,
} from "../sortby-dropdown/sortby-dropdown.component";
import Modal from "../modal/modal.component";
import { DogGallery } from "../dog-gallery/dog-gallery.component";
import { FavoritesContext } from "@/app/context/favorites.context";
import { DogMatch } from "@/app/api/endpoints/dogs/dog-match.endpoint";
import { DogDetailCard } from "../dog-detail-card/dog-detail-card.component";

const SORT_OPTIONS: DropdownOption[] = [
  { name: "breed", value: "breed" },
  { name: "age", value: "age" },
  { name: "name", value: "name" },
];
const SORT_DIRECTION_OPTIONS: DropdownOption[] = [
  { name: "ascending", value: "asc" },
  { name: "descending", value: "desc" },
];

export function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<SearchSortBy>({
    field: "breed",
    direction: "asc",
  });
  const { dogs, total, next, search } = useDogSearch();
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchDogId, setMatchDog] = useState<string>();
  const { favorites } = useContext(FavoritesContext);
  const favoriteDogs = Object.values(favorites);
  const matchedDogDetail: DogDetail | undefined = favorites[matchDogId ?? ""];

  useEffect(() => {
    search(
      {},
      {
        field: "breed",
        direction: "asc",
      }
    );
  }, []);

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
    search(searchData, sortBy);
  };

  const handleLoadMore = () => {
    search(filters, sortBy, next);
  };

  const handleSortByChange = (optionValue: string) => {
    const updatedSortBy: SearchSortBy = {
      field: optionValue as SortByField,
      direction: "asc",
    };
    setSortBy(updatedSortBy);
    search(filters, updatedSortBy);
  };

  const handleSortDirectionChange = (optionValue: string) => {
    const updatedSortBy: SearchSortBy = {
      field: sortBy.field,
      direction: optionValue as SortDirection,
    };
    setSortBy(updatedSortBy);
    search(filters, updatedSortBy);
  };

  const openModal = () => {
    setMatchModalOpen(true);
  };
  const handleFindMatch = async () => {
    setMatchDog(undefined);
    try {
      const matchResponse = await DogMatch(favoriteDogs.map((d) => d.id));
      setMatchDog(matchResponse.match);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {}
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-col items-center justify-center bg-white shadow-md">
        <SearchBar breeds={DOG_BREEDS} onSearch={handleOnSearch} />
        {dogs.length > 0 && (
          <div className="w-full flex flex-row justify-between items-center px-6 border-b border-t">
            <p>{total} results</p>

            <button onClick={openModal}>See Favorites</button>

            {/* {Sorting} */}
            <div className="flex flew-row">
              <div className="">
                <p>Sort by</p>
                <OptionDropdown
                  value={sortBy.field}
                  options={SORT_OPTIONS}
                  onChange={handleSortByChange}
                />
              </div>
              <div>
                <p>Direction</p>
                <OptionDropdown
                  value={sortBy.direction}
                  options={SORT_DIRECTION_OPTIONS}
                  onChange={handleSortDirectionChange}
                />
              </div>
            </div>

            {/* {error && <p>Error loading dogs</p>}
          {loading && <p>Loading...</p>} */}
          </div>
        )}
      </header>

      <main className="overflow-scroll flex flex-col items-center pt-4 bg-gray-200 h-screen">
        <div className="container">
          <DogGallery dogs={dogs} />
          <div className="w-full flex justify-center p-4">
            {filters && (
              <button
                className="bg-black text-white p-4"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            )}
          </div>
        </div>
        <div className="fixed bottom-0 right-0 bg-blue-100 h-[300px] w-[300px]">
          <LoginForm onSubmit={handleSubmit} />
          <button onClick={handleLogout}>Logout</button>
        </div>
      </main>
      <Modal isOpen={matchModalOpen}>
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">Favorite Dogs</h2>
            <p className="mt-2 text-gray-600">
              Feel free to take a look at your favorites once again
            </p>
          </div>
          <button onClick={handleFindMatch}>Find match</button>
        </div>
        <div className="mt-4 flex border-t overflow-scroll">
          {!matchDogId && <DogGallery dogs={favoriteDogs} />}
          {matchedDogDetail && (
            <DogDetailCard
              dog={matchedDogDetail}
              imageSrc={matchedDogDetail.img}
              altText={`A ${matchedDogDetail.breed} called ${matchedDogDetail.name}`}
            />
          )}
        </div>
        <button
          onClick={() => setMatchModalOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Close
        </button>
      </Modal>
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
