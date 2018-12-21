import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

describe('Monkey patching "it"', () => {
  describe("using the normal 2 arg form", () => {
    let name;

    beforeEach(() => {
      name = "Nora";
    });

    it("works as expected", () => {
      expect(name).toBe("Nora");
    });
  });

  describe("using the 3 arg form with a sync setup", () => {
    const syncSetup = () => ({ name: "Nora" });

    it("provides basic params to a test", syncSetup, params => {
      expect(params.name).toBe("Nora");
    });

    it(
      "provides basic params to a test that can be destructured",
      syncSetup,
      ({ name }) => {
        expect(name).toBe("Nora");
      }
    );
  });

  describe("using the 3 arg form with an async setup", () => {
    const asyncSetup = async () => ({ name: "Nora" });

    it("provides basic params to a test", asyncSetup, ({ name }) => {
      expect(name).toBe("Nora");
    });
  });

  describe("using the 3 arg form with an async test", () => {
    const asyncSetup = async () => ({ name: "Nora" });

    it("provides basic params to a test", asyncSetup, async ({ name }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      expect(name).toBe("Nora");
    });
  });

  describe("using the 3 arg form with setup and teardown", () => {
    const config = {
      setup: () => ({ div: document.createElement("div") }),
      teardown: ({ div }) => ReactDOM.unmountComponentAtNode(div)
    };

    it("provides params to a test with teardown", config, ({ div }) => {
      ReactDOM.render(<App />, div);
    });
  });
});
