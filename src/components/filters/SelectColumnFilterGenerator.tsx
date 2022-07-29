import { Assignment } from "assignment";
import { useMemo } from "react";
import { FilterProps, Renderer } from "react-table";

// A function that returns filter. Set customOptions to manually set filtered values and corresponding texts.
const SelectColumnFilterGenerator =
  (
    customOptions?: {
      value: any;
      text: string;
    }[]
  ): Renderer<FilterProps<Assignment>> =>
  ({ column: { filterValue, setFilter, id }, preFilteredRows }) => {
    const options = useMemo(() => {
      if (customOptions) return [...customOptions];
      else {
        const set = new Set(preFilteredRows.map((row) => row.values[id]));
        return Array.from(set).map((value) => ({
          value: value,
          text: String(value),
        }));
      }
    }, [id, preFilteredRows]);

    const selectedOptionId = useMemo(() => {
      const index = options.findIndex((option) => option.value === filterValue);
      return index !== -1 ? String(index) : "";
    }, [filterValue]);

    return (
      <select
        className="selectColumnFilterSelect"
        name={id}
        id={id}
        value={selectedOptionId}
        onChange={(e) => {
          if (e.target.value === "") {
            setFilter(undefined);
            return;
          }

          const selectedOption = options[Number(e.target.value)];
          setFilter(selectedOption.value);
        }}
      >
        <option value="">全て</option>
        {options.map((option, i) => (
          <option key={i} value={i}>
            {option.text}
          </option>
        ))}
      </select>
    );
  };

export default SelectColumnFilterGenerator;
