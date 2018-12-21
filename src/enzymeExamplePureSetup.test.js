import { createComponent, createAppPage, teardown } from "./test-utils";

describe("A new test with moderately involved setup", () => {
  const setup = user => ({
    setup: () => {
      const component = createComponent({
        showExtraMessage: user.userType === "Admin"
      });
      const page = createAppPage(component);

      return { page, component };
    },
    teardown: ({ component }) => teardown(component)
  });

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
