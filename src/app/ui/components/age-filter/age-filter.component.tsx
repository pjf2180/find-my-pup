
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

  const selectedOptionIdx = state.selectedOption;

  const handleOptionClick = (idx: number) => {
    const newState: AgeDropdownState = {
      ...state,
      selectedOption: idx,
    };
    onChange(newState);
  };

  return (
    <div className="flex flex-col gap-2 pt-6">
      <p className="font-bold mb-4">Select age</p>

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
    </div>
  );
}
