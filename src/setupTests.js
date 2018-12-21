/**
 * A little enzyme setup
 */
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

/**
 * Wraps the existing `it`, `it.only`, and `it.skip` functions.
 * Allows passing 3 args in which case the 2nd arg is one of 2 things:
 * 1. Function
 *    In this case, the return value of the function is fed to your test
 * 2. Object
 *    Must be of the form `{ setup, teardown }`
 *    Where setup is a function and behaves identical to case 1 above.
 *    Where teardown is a function that receives the result of setup and cleans up.
 *
 * ```
 * const setup = () => ({ userName: 'jest' })
 * it('example test', setup, params => {
 *    expect(params.userName).toEqual('jest');
 * });
 * ```
 *
 * The driving purpose is to remove the need for `let` variables that are re-assigned throughout
 * the test file. Using normal functions allows us to compose multiple setup functions as needed
 * and still receive the data in our test as local params.
 */

/**
 * Save references to the original methods we want to patch.
 * We'll end up replacing the `global` versions with our own, but in some cases we'll forward
 * calls back to the original implementation.
 */
const baseIt = global.it;
const baseOnly = global.it.only;
const baseSkip = global.it.skip;

/**
 * Very simple implementation of calling a test with a setup and teardown configuration.
 * Basically, run the setup, feed the setup result to the test, and then feed the setup result to
 * the teardown function.
 */
const itWithSetupAndTearDown = async (
  jestFn,
  title,
  testFn,
  setup,
  teardown
) => {
  // TODO: This doesn't seem to work with async/await
  // even though the other version does?
  // need to think through that a little more.
  const params = setup();
  jestFn(title, () => {
    testFn(params);
    teardown(params);
  });
};

/**
 * This is the implementation of the it wrapper.
 * It takes a reference to the original "it" function that the test file is calling.
 * If there are NOT 3 args, we simply forward to the original function.
 * If there are 3 args, then we check to see which type of setup you provided and call accordingly.
 */
const itWithOptions = jestFn => async (...args) => {
  if (args.length !== 3) {
    return jestFn(...args);
  }

  const [title, setup, testFn] = args;

  // Very simple check to see if your config is the setup and teardown variety.
  if (setup.setup && setup.teardown) {
    return itWithSetupAndTearDown(
      jestFn,
      title,
      testFn,
      setup.setup,
      setup.teardown
    );
  }

  return jestFn(title, async () => testFn(await setup()));
};

/**
 * Replace the `global` it methods with our new wrapped version.
 * Pass a reference to the specific `it` method to preserve only and skip functionality.
 */
it = itWithOptions(baseIt);
it.only = itWithOptions(baseOnly);
it.skip = itWithOptions(baseSkip);
