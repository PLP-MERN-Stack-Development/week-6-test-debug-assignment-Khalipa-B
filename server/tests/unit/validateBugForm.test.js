const validateBugForm = require("../../src/utils/validateBugForm");

describe("Bug Form Validation", () => {
  const validForm = {
    title: "Bug in login flow",
    description: "User gets stuck on spinner",
    priority: "High",
    status: "Open",
  };

  test("valid form returns true", () => {
    expect(validateBugForm(validForm)).toBe(true);
  });

  test("missing title returns false", () => {
    const form = { ...validForm, title: "" };
    expect(validateBugForm(form)).toBe(false);
  });

  test("missing description returns false", () => {
    const form = { ...validForm, description: "" };
    expect(validateBugForm(form)).toBe(false);
  });

  test("invalid priority returns false", () => {
    const form = { ...validForm, priority: "urgent" };
    expect(validateBugForm(form)).toBe(false);
  });

  test("invalid status returns false", () => {
    const form = { ...validForm, status: "done" };
    expect(validateBugForm(form)).toBe(false);
  });

  test("title with only spaces returns false", () => {
    const form = { ...validForm, title: "   " };
    expect(validateBugForm(form)).toBe(false);
  });

  test("priority is case-insensitive", () => {
    const form = { ...validForm, priority: "critical" };
    expect(validateBugForm(form)).toBe(true);
  });

  test("status is case-insensitive", () => {
    const form = { ...validForm, status: "Closed" };
    expect(validateBugForm(form)).toBe(true);
  });
});
