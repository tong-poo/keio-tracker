import {
  AssignmentsCanvasResponse,
  Assignment,
  CoursesResponse,
} from "../types/assignment";

const queryCourseIds = `
{
  allCourses{
    _id
    term{
      endAt
    }
  }
}
`;

const generateFragment = (courseIds: number[]) => `
fragment f on Course{
  _id
  courseCode
  assignmentsConnection {
    nodes {
      _id
      name
      dueAt
      submissionsConnection {
        nodes {
          submissionStatus
        }
      }
      lockInfo{
        isLocked
      }
    }
  }
}
{
  ${courseIds.map((id) => `course${id}: course(id:${id}){...f}`).join()}
}
`;

const getCsrfToken = () =>
  decodeURIComponent(document.cookie.match(/(^| )_csrf_token=([^;]+)/)![2]);

const fetchAssignments = async () => {
  const availableCourseIds = await fetch("api/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-requested-with": "XMLHttpRequest",
      "x-csrf-token": getCsrfToken(),
    },
    body: JSON.stringify({ query: queryCourseIds }),
  })
    .then((res) => res.json())
    .then((res: CoursesResponse) => {
      const currentDate = new Date();
      const availableCourseIds = res.data.allCourses
        .filter((course) => currentDate < new Date(course.term.endAt))
        .map((course) => course._id);

      return availableCourseIds as number[];
    });

  return await fetch("api/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-requested-with": "XMLHttpRequest",
      "x-csrf-token": getCsrfToken(),
    },
    body: JSON.stringify({ query: generateFragment(availableCourseIds) }),
  })
    .then((res) => res.json())
    .then((res: AssignmentsCanvasResponse): Assignment[] =>
      Object.values(res.data)
        .map((course) => {
          const trimmedCourseCodeMatches = course.courseCode.match(
            /(?<=　| )[^ \[　]*?(?= \[|$)/
          );
          const courseName = trimmedCourseCodeMatches
            ? trimmedCourseCodeMatches[0]
            : course.courseCode;
          const courseId = Number(course._id);

          return course.assignmentsConnection.nodes.map((assignment) => ({
            id: Number(assignment._id),
            courseId: courseId,
            courseName: courseName,
            name: assignment.name,
            dueAt: assignment.dueAt
              ? new Date(assignment.dueAt)
              : new Date("2100"),
            isLocked: assignment.lockInfo.isLocked,
            isSubmitted: assignment.submissionsConnection.nodes[0]
              ? true
              : false,
          }));
        })
        .flat()
    );
};

export default fetchAssignments;
