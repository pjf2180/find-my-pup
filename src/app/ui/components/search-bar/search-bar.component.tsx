"use client";
import {
  LocationSearchParams,
  SearchLocation,
  useLocationSearch,
} from "@/app/hooks/useLocationSearch.hook";
import React, { useState, ReactNode, ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { BreedFilter } from "../breed-filter/breed-filter.component";
import clsx from "clsx";

type SearchInputTypes = "breed" | "age" | "location";
interface AgeRange {
  min?: number;
  max?: number;
}
export type SortByField = "breed" | "name" | "age";
export type SortDirection = "asc" | "desc";
export interface SearchSortBy {
  field: SortByField;
  direction: SortDirection
}
export interface SearchFilters {
  breeds?: string[];
  age?: AgeRange;
  location?: {
    selection: SearchLocation;
    locationType: "state" | "city";
  };
}

export interface SearchBarProps {
  breeds: string[];
  onSearch: (filters: SearchFilters) => void;
}

const AGE_DROPDOWN_OPTIONS: AgeDropdownOptions[] = [
  { label: "Any age", selected: true },
  { label: "Puppy", value: { max: 2 }, selected: false },
  { label: "2+", value: { min: 2 }, selected: false },
  { label: "4+", value: { min: 4 }, selected: false },
];

export function SearchBar({ breeds, onSearch }: SearchBarProps) {
  const defaultAgeInputValue = "Search by age";
  const [breedInputValue, setBreedInputValue] = useState("");
  const [ageInputValue, setAgeInputValue] = useState(defaultAgeInputValue);
  const [activeInput, setActiveInput] = useState<SearchInputTypes | undefined>();
  const [suggested] = useState<SearchLocation[]>([]);
  const [locationInputValue, setLocationInputValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<SearchLocation>();
  const [breedSelections, setBreedSelections] = useState<string[]>([]);
  const { data, loading, searchLocations } = useLocationSearch();
  const [ageDropdownState, setAgeDropdownState] = useState<AgeDropdownState>({
    selectedOption: 0,
    selectedRange: {},
  });

  const handleLocationTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocationInputValue(e.target.value);
    const params: LocationSearchParams = { city: e.target.value };
    searchLocations(params);
  };

  const handleLocationSelection = (selection: SearchLocation) => {
    setLocationInputValue(`${selection.city}, ${selection.state}`);
    setSelectedLocation(selection);
  };

  const handleSearchClick = () => {
    const ageRange: AgeRange | undefined =
      AGE_DROPDOWN_OPTIONS[ageDropdownState.selectedOption].value;

    const filters: SearchFilters = {
      age: ageRange,
      breeds: breedSelections,
    };
    if (selectedLocation) {
      filters.location = {
        selection: selectedLocation,
        locationType: "city",
      };
    }
    onSearch(filters);
    setActiveInput(undefined);
  };

  const handleBreedSelection = (breed: string) => {
    setBreedSelections((x: string[]) => [...x, breed]);
  };

  const handleBreedDelete = (breed: string) => {
    setBreedSelections((x) => x?.filter((b) => b !== breed));
  };

  const handleAgeDropdownChange = (s: AgeDropdownState) => {
    setAgeDropdownState(s);
    console.log(s);
    if (s.selectedOption > -1) {
      const option = AGE_DROPDOWN_OPTIONS[s.selectedOption];
      const displayValue = option.label;
      setAgeInputValue(displayValue);
    } else if (
      s.selectedRange.min != undefined &&
      s.selectedRange.max != undefined
    ) {
      const { min, max } = s.selectedRange;
      const displayValue = `${min} to ${max} years`;
      setAgeInputValue(displayValue);
    } else {
      setAgeInputValue(defaultAgeInputValue);
    }
  };

  const handleBreedInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBreedInputValue(e.target.value);
  };

  const results: SearchLocation[] = data?.results ?? [];
  const cityResults = Object.values(
    results.reduce<Record<string, SearchLocation>>(
      (acc, current: SearchLocation) => {
        acc[current.city] = current;
        return acc;
      },
      {}
    )
  );
  const breedInputDisplayValue =
    activeInput !== "breed"
      ? breedSelections.length > 0
        ? `${breedSelections.length} breeds`
        : ""
      : breedInputValue;

  return (
    <div className="flex flex-col p-4 pb-0 gap-4">
      <div
        className={clsx(
          "flex items-center bg-white rounded-full shadow-md  w-full max-w-3xl border",
          { "bg-slate-100": activeInput != undefined }
        )}
      >
        {/* Breed*/}
        <div
          className={clsx(
            "h-full flex justify-between items-center flex-1 relative rounded-full px-8 py-4 pr-0 cursor-pointer ",
            { "bg-white": activeInput === "breed" },
            { "hover:bg-gray-200": activeInput != "breed" }
          )}
        >
          <div className=" flex flex-col">
            <span className="text-xs font-semibold text-gray-800">Breed</span>
            <input
              placeholder="Search by breed"
              className={clsx(
                "text-gray-400 text-sm cursor-pointer whitespace-nowrap outline-none bg-transparent",
                {
                  "font-bold text-gray-700":
                    (breedSelections.length > 0 && activeInput != "breed") ||
                    (activeInput === "breed" && breedInputDisplayValue !== ""),
                }
              )}
              value={breedInputDisplayValue}
              onChange={handleBreedInputChange}
              onFocus={() => setActiveInput("breed")}
            ></input>
          </div>
          {/* Divider */}
          <div className="h-6 w-px bg-gray-300" />
        </div>

        {/* Age */}
        <div
          className={clsx(
            "h-full flex justify-between items-center flex-1 relative rounded-full px-8 py-4 pr-0 cursor-pointer ",
            { "bg-white": activeInput === "age" },
            { "hover:bg-gray-200": activeInput != "age" }
          )}
        >
          <div
            className=" flex flex-col cursor-pointer"
            onClick={() => setActiveInput("age")}
          >
            <span className="text-xs font-semibold text-gray-800">Age</span>
            <span
              className={clsx("text-gray-400 text-sm", {
                "font-bold text-gray-700":
                  ageInputValue != defaultAgeInputValue,
              })}
            >
              {ageInputValue}
            </span>
          </div>
          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 mx-4" />
        </div>

        {/* Locations */}
        <div
          className={clsx(
            "h-full flex justify-between items-center flex-1 relative rounded-full px-8 py-4 pr-0 cursor-pointer ",
            { "bg-white": activeInput === "location" },
            { "hover:bg-gray-200": activeInput != "location" }
          )}
        >
          <div className="flex flex-col">
            <span className="flex text-xs font-semibold text-gray-800">
              Location
            </span>
            <span className="text-gray-500 text-sm">
              <input
                type="text"
                placeholder="Search Locations"
                className={clsx(
                  "text-gray-400 text-sm focus:outline-none bg-transparent",
                  { "font-bold text-gray-700": locationInputValue != "" }
                )}
                value={locationInputValue}
                onChange={handleLocationTextInputChange}
                onFocus={() => setActiveInput("location")}
              />
            </span>
          </div>
          <button
            className="ml-4 bg-red-500 rounded-full p-3 text-white"
            onClick={handleSearchClick}
          >
            <FaSearch />
          </button>
        </div>
      </div>
      <div className="bg-slate-200 relative">
        {activeInput === "breed" && (
          <div className="absolute top-full left-0">
            <Dropdown>
              <BreedFilter
                breadSearchText={breedInputValue}
                breeds={breeds}
                onSelectionChange={handleBreedSelection}
                onClear={() => setBreedSelections([])}
                onSelectionDelete={handleBreedDelete}
                selections={breedSelections}
              />
            </Dropdown>
          </div>
        )}
        {activeInput === "age" && (
          <div className="absolute top-full left-1/2 -translate-x-1/2">
            <Dropdown>
              <AgeDropdown
                state={ageDropdownState}
                options={AGE_DROPDOWN_OPTIONS}
                onChange={handleAgeDropdownChange}
              />
            </Dropdown>
          </div>
        )}
        {activeInput === "location" && (
          <div className="absolute top-full right-0">
            <Dropdown>
              <LocationDropdown
                isLoading={loading}
                suggested={suggested}
                results={cityResults}
                onSelection={handleLocationSelection}
              />
            </Dropdown>
          </div>
        )}
      </div>
    </div>
  );
}

function Dropdown({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[32px] w-[600px] h-[500px] px-6  bg-white">
      {children}
    </div>
  );
}

type AgeDropdownOptions = {
  label: string;
  value?: AgeRange;
  selected: boolean;
};

interface AgeDropdownState {
  selectedOption: number;
  selectedRange: { min?: number; max?: number };
}

export interface AgeDropdownProps {
  options: AgeDropdownOptions[];
  state: AgeDropdownState;
  onChange: (dropdownState: AgeDropdownState) => void;
}

export function AgeDropdown({ options, state, onChange }: AgeDropdownProps) {
  const minAge = state.selectedRange?.min;
  const maxAge = state.selectedRange?.max;

  const [error, setError] = useState<string | null>(null);
  //const [selectedOptionIdx, setSelectedOptionIdx] = useState<number>(-1);
  const selectedOptionIdx = state.selectedOption;
  const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;

    const validForm = formValid(value, maxAge);
    if (validForm) {
      onChange({
        ...state,
        selectedRange: { min: value, max: maxAge as number },
      });
    }
  };

  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
    const validForm = formValid(minAge, value);
    if (validForm) {
      onChange({
        ...state,
        selectedRange: { min: minAge as number, max: value as number },
      });
    }
  };

  const handleOptionClick = (idx: number) => {
    const newState: AgeDropdownState = {
      ...state,
      selectedOption: idx,
    };
    onChange(newState);
  };

  const formValid = (min: number | undefined, max: number | undefined) => {
    if (min !== undefined && max !== undefined && min >= max) {
      setError("Minimum age must be less than maximum age");
      return false;
    } else {
      setError(null);
      console.log(min, max);

      return true;
    }
  };

  return (
    <div className="flex flex-col gap-2 pt-6">
      <div className="flex gap-2 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            className={`px-4 py-2 border rounded-full text-sm font-normal whitespace-nowrap 
            ${
              index == selectedOptionIdx
                ? "border-black bg-gray-100"
                : "border-gray-300 bg-white text-gray-700"
            }
          `}
            onClick={() => handleOptionClick(index)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="font-bold mb-4">Custom range</p>

      <div className="flex flex-col">
        <label className="text-sm font-semibold">Min Age</label>
        <input
          type="number"
          value={minAge ?? ""}
          onChange={handleMinAgeChange}
          className="border p-1 rounded"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-semibold">Max Age</label>
        <input
          type="number"
          value={maxAge ?? ""}
          onChange={handleMaxAgeChange}
          className="border p-1 rounded"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button>Next</button>
    </div>
  );
}

export interface LocationDropdownProps {
  suggested: SearchLocation[];
  results: SearchLocation[];
  isLoading: boolean;
  onSelection: (selection: SearchLocation) => void;
}
export function LocationDropdown({
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
