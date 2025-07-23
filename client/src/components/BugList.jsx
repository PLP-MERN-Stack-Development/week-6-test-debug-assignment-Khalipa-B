export default function BugList({ bugs }) {
  return (
    <ul>
      {bugs.map((bug) => (
        <li key={bug._id}>{bug.title} - {bug.description}</li>
      ))}
    </ul>
  );
}
