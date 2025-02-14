import { SearchLocation } from "@/app/hooks/useLocationSearch.hook";

export interface LocationDropdownProps {
  suggested: SearchLocation[];
  results: SearchLocation[];
  isLoading: boolean;
  onSelection: (selection: SearchLocation) => void;
}
export function LocationFilter({
  suggested,
  results,
  isLoading,
  onSelection,
}: LocationDropdownProps) {
  const renderItem = (i: SearchLocation) => {
    return (
      <div
        key={i.zip_code}
        className="flex flex-row p-4 items-center cursor-pointer rounded-md hover:bg-slate-50"
        onClick={() => onSelection(i)}
      >
        <div className="mr-6 bg-blue-200 h-20 w-20 rounded-md"></div>
        <div className="flex-col ">
          <p className="font-semibold">
            {i.city}, {i.state}
          </p>
          <p className=" text-sm text-gray-400">10 miles away</p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-scroll ">
      {isLoading && <p>Loading...</p>}

      {!isLoading && suggested.length > 0 && (
        <>
          <p className="text-sm font-light text-gray-400">
            Suggested destinations
          </p>
          {suggested.map((x) => renderItem(x))}
        </>
      )}
      {!isLoading && results.length > 0 && (
        <>
          <p className="text-sm font-light text-gray-400 pt-6 px-4">
            Search Results
          </p>
          {results.map((x) => renderItem(x))}
        </>
      )}
    </div>
  );
}
