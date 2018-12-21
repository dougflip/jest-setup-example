import React from "react";
import { mount } from "enzyme";

import App from "./App";

/**
 * A _really_ basic page object to model the App component
 */
export function createAppPage(wrapper) {
  return {
    isExtraMessageVisible: () => wrapper.find(".extra-message").exists()
  };
}

export function createComponent(props) {
  return mount(<App {...props} />);
}

export function teardown(component) {
  component.unmount();
}

/**
 * Just to show this as an option...
 * Extracts the setup and teardown completely from the test.
 */
export const setup = user => ({
  setup: () => {
    const component = createComponent({
      showExtraMessage: user.userType === "Admin"
    });
    const page = createAppPage(component);

    return { page, component };
  },
  teardown: ({ component }) => teardown(component)
});
