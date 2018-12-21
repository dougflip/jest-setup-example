import { setup } from "./test-utils";

describe("Moves the entire setup to a utils file", () => {
  describe("rendering as an Admin user", () => {
    it("shows a message", setup({ userType: "Admin" }), ({ page }) => {
      expect(page.isExtraMessageVisible()).toBe(true);
    });
  });

  describe("rendering as a ReadOnly user", () => {
    it("does not show a message", setup({ userType: "ReadOnly" }), params => {
      expect(params.page.isExtraMessageVisible()).toBe(false);
    });
  });
});
