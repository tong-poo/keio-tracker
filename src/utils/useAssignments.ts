import { useEffect, useState } from "react";
import { Assignment } from "../types/assignment";
import fetchAssignments from "./fetchAssignments";

const useAssignments = () => {
  const [assignments, setAssignments] = useState(
    undefined as undefined | Assignment[]
  );
  const [error, setError] = useState(undefined as undefined | string);
  useEffect(() => {
    fetchAssignments()
      .then(setAssignments)
      .catch((e) => {
        console.error(e);
        setError(String(e));
      });
  }, []);

  return [assignments, error] as const;
};

export default useAssignments;
