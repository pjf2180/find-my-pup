"use client";
import { useDogSearch } from "@/app/hooks/useDogSearch.hook";
import {
  SearchBar,
  SearchFilters,
  SearchSortBy,
  SortByField,
  SortDirection,
} from "../search-bar/search-bar.component";
import { useContext, useState } from "react";
import {
  OptionDropdown,
  DropdownOption,
} from "../sortby-dropdown/sortby-dropdown.component";
import Modal from "../modal/modal.component";
import { DogGallery } from "../dog-gallery/dog-gallery.component";
import { FavoritesContext } from "@/app/context/favorites.context";
import { DogMatch } from "@/app/api/endpoints/dogs/dog-match.endpoint";
import { DogDetailCard } from "../dog-detail-card/dog-detail-card.component";
import SearchSkeleton from "../search-skeleton/search-skeleton.component";
import { DogDetail } from "@/app/api/endpoints/dogs/dog-details.endpoint";
import { logout } from "@/app/api/endpoints/auth/logout";
import { useRouter } from "next/navigation";

const SORT_OPTIONS: DropdownOption[] = [
  { name: "Breed", value: "breed" },
  { name: "Age", value: "age" },
  { name: "Name", value: "name" },
];
const SORT_DIRECTION_OPTIONS: DropdownOption[] = [
  { name: "Ascending", value: "asc" },
  { name: "Descending", value: "desc" },
];

export function SearchPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<SearchSortBy>({
    field: "breed",
    direction: "asc",
  });
  const { dogs, total, next, search, loading } = useDogSearch(filters, sortBy);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchDogId, setMatchDog] = useState<string>();
  const [loadingMatch, setLoadingMatch] = useState(false);
  const { favorites } = useContext(FavoritesContext);
  const favoriteDogs = Object.values(favorites);
  const matchedDogDetail: DogDetail | undefined = favorites[matchDogId ?? ""];

  const handleOnSearch = (searchData: SearchFilters) => {
    console.log("Breeds: ", searchData.breeds);
    console.log("Age: ", searchData.age);
    console.log("Location: ", searchData.location);
    setFilters(searchData);
  };

  const handleLoadMore = () => {
    search(next);
  };

  const handleSortByChange = (optionValue: string) => {
    const updatedSortBy: SearchSortBy = {
      field: optionValue as SortByField,
      direction: "asc",
    };
    setSortBy(updatedSortBy);
  };

  const handleSortDirectionChange = (optionValue: string) => {
    const updatedSortBy: SearchSortBy = {
      field: sortBy.field,
      direction: optionValue as SortDirection,
    };
    setSortBy(updatedSortBy);
  };

  const openModal = () => {
    setMatchModalOpen(true);
  };
  const handleFindMatch = async () => {
    setMatchDog(undefined);
    setLoadingMatch(true);
    try {
      const matchResponse = await DogMatch(favoriteDogs.map((d) => d.id));
      setMatchDog(matchResponse.match);
    } catch {
    } finally {
      setLoadingMatch(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 w-full z-10 flex flex-col items-center justify-center bg-[rgba(19,10,33)] shadow-md">
        <SearchBar
          isLoading={loading}
          breeds={DOG_BREEDS}
          onSearch={handleOnSearch}
        />
        {loading && <SearchSkeleton />}
        {dogs.length > 0 && !loading && (
          <div className="w-full flex flex-row justify-between items-center py-5 px-5 text-[rgba(247,162,50)] border-[rgba(247,162,50)]">
            {/* {Sorting} */}
            <div className="flex flew-row">
              <div className="mr-4 cursor-pointer">
                <p className="font-semibold pb-2">Sort By</p>
                <OptionDropdown
                  value={sortBy.field}
                  options={SORT_OPTIONS}
                  onChange={handleSortByChange}
                />
              </div>
              <div>
                <p className="font-semibold pb-2">Direction</p>
                <OptionDropdown
                  value={sortBy.direction}
                  options={SORT_DIRECTION_OPTIONS}
                  onChange={handleSortDirectionChange}
                />
              </div>
            </div>

            <p>Found {total?.toLocaleString()} dogs</p>

            <button
              className="bg-[rgba(204,54,169)] hover:bg-[rgba(247,162,50)] hover:text-white font-bold rounded-md px-4 py-2"
              onClick={openModal}
            >
              Find your match
            </button>
          </div>
        )}
      </header>

      <main className="flex flex-col items-center pt-4 min-h-screen">
        <DogGallery isLoading={loading} dogs={dogs} />
        <div className="w-full flex justify-center p-4">
          {!loading && !!next && (
            <button
              className="bg-black text-white p-4"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          )}
        </div>
      </main>

      <Modal isOpen={matchModalOpen} onClose={() => setMatchModalOpen(false)}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between  items-center drop-shadow-2xl bg-[rgba(19,10,33)] p-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Favorite Dogs</h2>
              <p className="mt-2 text-white">
                Feel free to take a look at your favorites once again
              </p>
            </div>
            <button
              className="bg-[rgba(204,54,169)] text-[rgba(247,162,50)] font-bold px-4 py-2 rounded-md"
              onClick={handleFindMatch}
            >
              Find match
            </button>
          </div>

          {!matchDogId && !loadingMatch && (
            <div className="flex p-4 overflow-hidden overflow-y-scroll">
              <DogGallery isLoading={loading} dogs={favoriteDogs} />
            </div>
          )}
          {loadingMatch && (
            <div className="flex flex-col items-center font-bold">
              <p className="text-5xl whitespace-normal m-6">
                Finding your match...
              </p>
            </div>
          )}

          {matchedDogDetail && (
            <div className="flex flex-col items-center font-bold">
              <p className="text-5xl whitespace-normal m-6">
                Here is your match!
              </p>
              <DogDetailCard
                dog={matchedDogDetail}
                imageSrc={matchedDogDetail.img}
                altText={`A ${matchedDogDetail.breed} called ${matchedDogDetail.name}`}
              />
            </div>
          )}
        </div>
      </Modal>
      <button
        className="fixed z-50 top-1 right-1 bg-[#2d1c48] text-white rounded-md p-3"
        onClick={async () => {
          try {
            await logout();
            router.replace("/login")
          } catch {}
        }}
      >
        Logout
      </button>
    </>
  );
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
