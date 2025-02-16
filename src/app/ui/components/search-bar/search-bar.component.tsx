"use client";
import {
  LocationSearchParams,
  SearchLocation,
  SearchResponse,
  useLocationSearch,
} from "@/app/hooks/useLocationSearch.hook";
import React, { useState, ReactNode, ChangeEvent, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { BreedFilter } from "../breed-filter/breed-filter.component";
import clsx from "clsx";
import {
  AgeFilter,
  AgeDropdownOptions,
  AgeDropdownState,
  AgeRange,
} from "../age-filter/age-filter.component";
import { LocationFilter } from "../location-filter/location-filter.component";
import { useDebouncedState } from "@/app/hooks/useDebouncedState";
import { SearchBarBase } from "../search-bar-base/search-bar-base.components";

type SearchInputTypes = "breed" | "age" | "location";

export type SortByField = "breed" | "name" | "age";
export type SortDirection = "asc" | "desc";
export interface SearchSortBy {
  field: SortByField;
  direction: SortDirection;
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

export function SearchBar({ breeds, onSearch }: SearchBarProps) {
  const defaultAgeInputValue = "Search by age";
  const [breedInputValue, setBreedInputValue] = useState("");
  const [ageInputValue, setAgeInputValue] = useState(defaultAgeInputValue);
  const [activeInput, setActiveInput] = useState<
    SearchInputTypes | undefined
  >();
  const [locationInputValue, setLocationInputValue] = useDebouncedState(
    "",
    300,
    (city: string) => {
      const params: LocationSearchParams = { city };
      searchLocations(params);
    }
  );
  const [selectedLocation, setSelectedLocation] = useState<SearchLocation>();
  const [breedSelections, setBreedSelections] = useState<string[]>([]);
  const { data, loading, searchLocations } = useLocationSearch();
  const [ageDropdownState, setAgeDropdownState] = useState<AgeDropdownState>({
    selectedOption: 0,
    selectedRange: {},
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const handleLocationTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocationInputValue(e.target.value);
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

  const handleSelectionChange = (i: number) => {
    if (i === 0) {
      setActiveInput("breed");
    }
    if (i === 1) {
      setActiveInput("age");
    }
    if (i === 2) {
      setActiveInput("location");
    }
    if (i === -1) {
      setActiveInput(undefined);
    }
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
    <div className="flex flex-col  gap-4 bg-red-200">
      <SearchBarBase
        ref={containerRef}
        activeOptionIdx={optionToIdx(activeInput)}
        onSelectionChange={handleSelectionChange}
      >
        {/* Breed*/}
        <div className={clsx("h-full flex justify-between items-center ")}>
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
              onClick={() => setActiveInput("breed")}
            ></input>
          </div>
        </div>

        {/* Age */}
        <div className={clsx("h-full flex justify-between items-center ")}>
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
        </div>

        {/* Locations */}
        <div className={clsx("h-full flex justify-between items-center ")}>
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
                onClick={() => setActiveInput("location")}
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
      </SearchBarBase>
      {/* Dropdowns */}
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
              <AgeFilter
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
              <LocationFilter
                isLoading={loading}
                suggested={
                  locationInputValue == "" ? SUGGESTED_LOCATIONS.results : []
                }
                results={locationInputValue !== "" ? cityResults : []}
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
    <div className="rounded-[32px] w-[600px] h-[500px] px-6 shadow-lg bg-white">
      {children}
    </div>
  );
}

function optionToIdx(i: SearchInputTypes | undefined): number {
  if (i === "breed") {
    return 0;
  }
  if (i === "age") {
    return 1;
  }
  if (i === "location") {
    return 2
  }
  return -1;
}

const SUGGESTED_LOCATIONS: SearchResponse = {
  results: [
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
      city: "Rosario",
      latitude: 18.113284,
      county: "San German",
      state: "PR",
      zip_code: "00636",
      longitude: -67.039706,
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

const AGE_DROPDOWN_OPTIONS: AgeDropdownOptions[] = [
  { label: "Any age", selected: true },
  { label: "Puppy", value: { max: 2 }, selected: false },
  { label: "2+", value: { min: 2 }, selected: false },
  { label: "4+", value: { min: 4 }, selected: false },
];
