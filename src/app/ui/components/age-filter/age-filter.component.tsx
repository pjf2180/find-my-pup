import { useState } from "react";

export interface AgeRange {
  min?: number;
  max?: number;
}

export type AgeDropdownOptions = {
  label: string;
  value?: AgeRange;
  selected: boolean;
};

export interface AgeDropdownState {
  selectedOption: number;
  selectedRange: { min?: number; max?: number };
}

export interface AgeDropdownProps {
  options: AgeDropdownOptions[];
  state: AgeDropdownState;
  onChange: (dropdownState: AgeDropdownState) => void;
}

export function AgeFilter({ options, state, onChange }: AgeDropdownProps) {
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
