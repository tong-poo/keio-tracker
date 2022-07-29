import AssignmentsTable from "./components/AssignmentsTable";
import useAssignments from "./utils/useAssignments";

const App = () => {
  const [assignments, error] = useAssignments();

  return (
    <>
      <div className="medium ic-Dashboard-header__layout">
        <h1 className="ic-Dashboard-header__title">
          <span>課題一覧 (赤い課題は24時間以内に提出)</span>
        </h1>
      </div>
      {error ? (
        <div>エラー: {error}</div>
      ) : !assignments ? (
        <div>読み込み中...</div>
      ) : (
        <AssignmentsTable assignments={assignments} />
      )}
    </>
  );
};

export default App;
