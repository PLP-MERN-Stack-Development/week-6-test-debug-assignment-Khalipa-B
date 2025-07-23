const validateBugForm = ({ title, description, priority }) => {
  if (!title || title.trim() === "") return false;
  if (!description || description.trim() === "") return false;
  if (!priority || !["low", "medium", "high"].includes(priority.toLowerCase())) return false;
  return true;
};

module.exports = validateBugForm;
