import { createComponent, createAppPage, teardown } from "./test-utils";

describe("A classic test with moderately involved setup", () => {
  let component;
  let page;

  function setup(user) {
    component = createComponent({
      showExtraMessage: user.userType === "Admin"
    });
    page = createAppPage(component);
  }

  afterEach(() => {
    if (component) {
      teardown(component);
    }
  });

  describe("rendering as an Admin user", () => {
    beforeEach(() => setup({ userType: "Admin" }));

    it("shows additional message", () => {
      expect(page.isExtraMessageVisible()).toBe(true);
    });
  });

  describe("rendering as a ReadOnly user", () => {
    beforeEach(() => setup({ userType: "ReadOnly" }));

    it("does not show an additional message", () => {
      expect(page.isExtraMessageVisible()).toBe(false);
    });
  });
});
