import { Assignment } from "../types/assignment";
import { formatDateTime } from "../utils";
import DateBetweenFilter from "./filters/DateBetweenFilter";
import TextColumnFilter from "./filters/TextColumnFilter";
import SelectColumnFilterGenerator from "./filters/SelectColumnFilterGenerator";
import { Fragment, useState, useEffect } from "react";
import { Column, useTable, useFilters, useSortBy } from "react-table";
import Arrow from "./Arrow";

const columns: Column<Assignment>[] = [
  {
    Header: "科目",
    accessor: "courseName",
    Filter: SelectColumnFilterGenerator(),
    Cell: ({ value }) => <span title={value}>{value}</span>,
  },
  {
    Header: "課題",
    accessor: "name",
    Filter: TextColumnFilter,
    filter: "includes",
    Cell: ({ value }) => <span title={value}>{value}</span>,
  },
  {
    Header: "期限",
    accessor: "dueAt",
    id: "dueAt",
    Cell: ({ value }) => {
      if (Number(value) === Number(new Date("2100"))) return null;
      const text = formatDateTime(value);
      return <span title={text}>{text}</span>;
    },
    sortType: "datetime",
    Filter: DateBetweenFilter,
    filter: (rows, columnIds, filterValue: Date[]) => {
      const start = filterValue[0];
      const end = filterValue[1];
      return rows.filter(
        (row) =>
          (!start || start < row.values.dueAt) &&
          (!end || end > row.values.dueAt)
      );
    },
  },
  {
    Header: "ロック状況",
    id: "isLocked",
    accessor: "isLocked",
    Cell: ({ value }) => (value ? "ロック" : "アンロック"),
    Filter: SelectColumnFilterGenerator([
      { value: true, text: "ロック" },
      { value: false, text: "アンロック" },
    ]),
    filter: "equals",
  },
  {
    Header: "提出状況",
    id: "isSubmitted",
    accessor: "isSubmitted",
    Cell: ({ value }) => (value ? "提出済" : "未提出"),
    Filter: SelectColumnFilterGenerator([
      { value: true, text: "提出済" },
      { value: false, text: "未提出" },
    ]),
    filter: "equals",
  },
  {
    id: "hideButton",
    accessor: "" as any,
    Filter: () => <span>⟳</span>,
    Cell: "✕",
  },
];

type Props = {
  assignments: Assignment[];
};

const AssignmentsTable = ({ assignments }: Props) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<Assignment>(
      {
        columns,
        data: assignments,
        initialState: {
          sortBy: [
            {
              id: "dueAt",
              desc: false,
            },
          ],
          filters: [
            {
              id: "isSubmitted",
              value: false,
            },
            {
              id: "isLocked",
              value: false,
            },
            {
              id: "dueAt",
              value: (function () {
                const from = new Date();
                from.setHours(0);
                from.setMinutes(0);
                from.setSeconds(0);

                const to = null;

                return [from, to];
              })(),
            },
          ],
        },
        disableSortRemove: true,
      },
      useFilters,
      useSortBy
    );

  const [hiddenAssignmentIds, setHiddenAssignmentIds] = useState(
    [] as number[]
  );

  useEffect(() => {
    const savedData = localStorage.getItem("hiddenAssignmentIds");
    if (!savedData) return;

    const ids = JSON.parse(savedData) as number[];
    setHiddenAssignmentIds(ids);
  }, []);

  return (
    <table {...getTableProps()} className="assignmentsTable">
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <Fragment key={i}>
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={j}
                >
                  <span>{column.render("Header")}</span>
                  <Arrow
                    hidden={!column.isSorted}
                    direction={column.isSortedDesc ? "desc" : "asc"}
                  />
                </th>
              ))}
            </tr>
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <th
                  key={j}
                  onClick={
                    column.id == "hideButton"
                      ? () => {
                          localStorage.removeItem("hiddenAssignmentIds");
                          setHiddenAssignmentIds([]);
                        }
                      : undefined
                  }
                >
                  {column.canFilter && column.render("Filter")}
                </th>
              ))}
            </tr>
          </Fragment>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.length == 0 && (
          <tr className="noData">
            <td colSpan={headerGroups[0].headers.length}>
              該当する課題はありません
            </td>
          </tr>
        )}

        {rows.map((row, i) => {
          prepareRow(row);

          if (hiddenAssignmentIds.includes(row.original.id)) return null;

          const deadlineDelta =
            row.original.dueAt.getTime() - new Date().getTime();
          const isHighlighted =
            deadlineDelta > 0 && deadlineDelta < 1 * 24 * 60 * 60 * 1000;

          return (
            <tr
              {...row.getRowProps()}
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  `courses/${row.original.courseId}/assignments/${row.original.id}`
                );
              }}
              key={i}
              className={isHighlighted ? "highlighted" : undefined}
            >
              {row.cells.map((cell, j) => (
                <td
                  {...cell.getCellProps()}
                  onClick={(e) => {
                    if (cell.column.id == "courseName") {
                      e.stopPropagation();
                      window.open(`courses/${row.original.courseId}`);
                    } else if (cell.column.id == "hideButton") {
                      e.stopPropagation();
                      setHiddenAssignmentIds((ids) => {
                        const newIds = [...ids, row.original.id];
                        localStorage.setItem(
                          "hiddenAssignmentIds",
                          JSON.stringify(newIds)
                        );
                        return newIds;
                      });
                    }
                  }}
                  key={j}
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AssignmentsTable;
