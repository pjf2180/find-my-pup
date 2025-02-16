import React from "react";

export type DropdownOption = {
  name: string;
  value: string;
};

type DropdownProps = {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
};

export function OptionDropdown({
  options,
  value,
  onChange,
}: DropdownProps) {
  return (
    <select
      className="p-2 border rounded-lg shadow-sm cursor-pointer focus:ring focus:ring-blue-300 text-gray-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
