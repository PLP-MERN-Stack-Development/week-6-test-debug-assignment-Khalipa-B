const validateBugForm = require("../utils/validateBugForm");

test("valid input returns true", () => {
  expect(validateBugForm({ title: "Bug", description: "Bug desc", priority: "medium" })).toBe(true);
});

test("missing title returns false", () => {
  expect(validateBugForm({ title: "", description: "Bug desc", priority: "low" })).toBe(false);
});
