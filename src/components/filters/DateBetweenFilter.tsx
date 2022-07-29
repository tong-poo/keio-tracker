import { Assignment } from "assignment";
import DatePicker from "react-datepicker";
import { FilterProps, Renderer } from "react-table";
import { formatDate } from "../../utils";

// Select Date range using date picker
const DateBetweenFilter: Renderer<FilterProps<Assignment>> = ({
  column: { setFilter, filterValue },
}) => {
  return (
    <>
      <DatePicker
        selected={filterValue[0]}
        onChange={(date) => {
          if (date) date.setHours(0, 0, 0, 0);
          setFilter([date, filterValue[1]]);
        }}
        isClearable={true}
        customInput={
          <div className="datepicker from">
            <span>
              {filterValue[0] ? formatDate(filterValue[0]) : "日付選択"}
            </span>
          </div>
        }
      />
      <DatePicker
        selected={filterValue[1]}
        onChange={(date: Date) => {
          if (date) date.setHours(23, 59, 59, 999);
          setFilter([filterValue[0], date]);
        }}
        isClearable={true}
        customInput={
          <div className="datepicker to">
            <span>
              ~ {filterValue[1] ? formatDate(filterValue[1]) : "日付選択"}
            </span>
          </div>
        }
      />
    </>
  );
};

export default DateBetweenFilter;
