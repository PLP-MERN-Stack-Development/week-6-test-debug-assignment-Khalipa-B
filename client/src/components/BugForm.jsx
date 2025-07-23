import { useState } from "react";
import { createBug } from "../api/bugService";

export default function BugForm({ onBugAdded }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createBug({ title, description: desc });
    onBugAdded(res.data);
    setTitle("");
    setDesc("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Title" />
      <input id="description" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
      <button type="submit">Add Bug</button>
    </form>
  );
}
