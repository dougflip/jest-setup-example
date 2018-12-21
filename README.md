Jest Setup Example
===================

This project experiments with an alternative to `beforeEach` when testing.
This wraps `it`, `it.only`, and `it.skip` to allow for 3 arguments:

1. The title of your test
2. An object or function that provide data to your test (more on that later)
3. The test itself that receives data as its argument

```javascript
it('accepts a setup function', generateMockUser, ({ user }) => {
  // test your mock user here just like normal
});
```

## Background

For me, `beforeEach` works fine for setup code that is very side effect oriented.
These are "fire and forget" functions such as stubbing out the network or resetting a mock.
I think `beforeEach` starts to break down when we want to _produce data_ that our tests will consume.
The pattern I've seen most results in a laundry list of `let` declarations that are (re)assigned as
part of the `beforeEach` callback.

```javascript
let testUserId;

beforeEach(() => {
  testUserId = 123;
});
```

With only a few items this isn't so bad, but as a test file starts to grow this can become hard
to follow and maintain.

## Proposal

What would be nice is to have a function produce data that is fed to our test.
This has a few benefits:

1. We can use standard function composition to deal with complex setups.
2. There's no longer a need for `let` variables since data is given to your test as local variables
3. Setup functions can easily be moved out of a test because they don't interact with local scope
4. We can also define a teardown function associated to the setup to bundle them together.

This repo is a Proof of Concept to see what testing in this manner would look like.

## Test Examples

There are a few examples:

- [./src/basics.test.js](./src/basics.test.js) gives an overview of using this approach
- [./src/enzymeExamplePureSetup.test.js](./src/enzymeExamplePureSetup.test.js)
  gives a more involved example using enzyme
- [./src/enzymeExamplePureSetupExternal.test.js](./src/enzymeExamplePureSetupExternal.test.js)
  shows how easy it is to move all of the setup outside of the test (if you wanted to do that).
- [./src/enzymeExampleClassic.test.js](./src/enzymeExampleClassic.test.js)
  shows the same example using `beforeEach` for comparison purposes.
  Obviously, there would be numerous ways to structure the example, but I tried to model it after
  patterns I have seen often in actual code.

You can run the tests via `yarn test`.

## Implementation

The actual implementation is in [./src/setupTests.js](./src/setupTests.js) and relies on wrapping
the existing jest methods. I actually think this could work to some extent, but the intention of
this repo is just to prove out the testing pattern as a whole. If the pattern seems viable then I
think it would be awesome to see if Jest would consider supporting this first class in the code.
