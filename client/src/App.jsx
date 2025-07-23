import { useEffect, useState } from "react";
import BugForm from "./components/BugForm";
import BugList from "./components/BugList";
import { getBugs } from "./api/bugService";

function App() {
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getBugs();
      setBugs(res.data);
    };
    fetchData();
  }, []);

  const addBug = (bug) => setBugs([...bugs, bug]);

  return (
    <div>
      <h1>Bug Tracker</h1>
      <BugForm onBugAdded={addBug} />
      <BugList bugs={bugs} />
    </div>
  );
}

export default App;
