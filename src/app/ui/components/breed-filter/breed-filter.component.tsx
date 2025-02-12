import { useRef, MouseEvent } from "react";

export interface BreedFilterProps {
  breadSearchText: string;
  breeds: string[];
  selections: string[];
  onSelectionChange: (selections: string) => void;
  onSelectionDelete: (selection: string) => void;
  onClear: () => void;
}
export function BreedFilter({
  breeds,
  selections,
  breadSearchText,
  onClear,
  onSelectionChange,
  onSelectionDelete,
}: BreedFilterProps) {
  const notSelectedOptions = breeds.filter((option: string) => {
    return !selections.includes(option);
  });

  const filteredOptions = notSelectedOptions.filter((o: string) =>
    o.toLowerCase().includes(breadSearchText.toLowerCase())
  );

  const selectionsContainerRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (
    e: MouseEvent<HTMLOptionElement>,
    selectedLabel: string
  ) => {
    e.stopPropagation();
    onSelectionChange(selectedLabel);
    setTimeout(() => {
      const container = selectionsContainerRef.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth", // Enables smooth scrolling
        });
      }
    }, 0);
  };
  const handleOptionDelete = (option: string) => {
    onSelectionDelete(option);
  };
  return (
    <div className="flex flex-col  h-full pt-6">
      <div className="flex flex-row justify-between text-sm mb-4">
        <div className="flex flex-row font-semibold">
          <span className="w-[25px] inline-block ">{selections.length}</span>{" "}
          <p>Selected Items</p>
        </div>
        <button onClick={() => onClear()}>Clear All</button>
      </div>

      <div className="flex flex-row min-h-0 " style={{ flex: "1 1 0" }}>
        <div className="flex-1 border-t border-r overflow-scroll">
          {filteredOptions.map((notSelectedOptionId: string) => {
            return (
              <option
                key={notSelectedOptionId}
                className="hover:bg-blue-100 p-1 text-sm"
                style={{ cursor: "pointer" }}
                value={notSelectedOptionId}
                onClick={(e) => handleOptionClick(e, notSelectedOptionId)}
              >
                {notSelectedOptionId}
              </option>
            );
          })}
        </div>
        <div
          ref={selectionsContainerRef}
          className="flex-1 flex pl-2 gap-2 pt-2 content-start flex-wrap border-t overflow-scroll "
        >
          {selections.map((o: string) => {
            return (
              <button
                key={o}
                className={`px-4 py-2 border rounded-full text-sm font-normal whitespace-nowrap hover:bg-red-200 
            `}
                onClick={() => handleOptionDelete(o)}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
