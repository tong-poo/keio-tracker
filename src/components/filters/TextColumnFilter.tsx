import { Assignment } from "assignment";
import { FilterProps, Renderer } from "react-table";

const TextColumnFilter: Renderer<FilterProps<Assignment>> = ({
  column: { setFilter },
}) => {
  return (
    <input
      className="textColumnFilterInput"
      placeholder="検索"
      onChange={(e) => setFilter(e.target.value || "")}
    />
  );
};

export default TextColumnFilter;
