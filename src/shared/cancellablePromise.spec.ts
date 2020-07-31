import waitForExpect from 'wait-for-expect';

import {createCancellableCallbackPromise} from './cancellablePromise';

describe('createCancellableCallbackPromise', () => {
  it('calls callback if the promise has not been canceled', async () => {
    const mockPromise = jest.fn();
    const mockCallback = jest.fn();
    mockPromise.mockImplementation(() => Promise.resolve(true));

    const {callable} = createCancellableCallbackPromise(mockPromise, mockCallback);
    callable();

    await waitForExpect(() => {
      expect(mockPromise).toHaveBeenCalled();
    });

    expect(mockCallback).toHaveBeenCalledWith(true);
  });

  it('does not call callback if the promise has been canceled', async () => {
    const mockPromise = jest.fn();
    const mockCallback = jest.fn();
    mockPromise.mockImplementation(() => Promise.resolve(true));

    const {callable, cancelable} = createCancellableCallbackPromise(mockPromise, mockCallback);
    callable();
    cancelable();

    await waitForExpect(() => {
      expect(mockPromise).toHaveBeenCalled();
    });

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('does not call callback if the promise has been canceled before being called', async () => {
    const mockPromise = jest.fn();
    const mockCallback = jest.fn();
    mockPromise.mockImplementation(() => Promise.resolve(true));

    const {callable, cancelable} = createCancellableCallbackPromise(mockPromise, mockCallback);
    cancelable();
    callable();

    let isTimeout = false;
    setTimeout(() => {
      isTimeout = true;
    }, 1000);
    await waitForExpect(() => {
      expect(isTimeout).toStrictEqual(true);
    });

    expect(mockPromise).not.toHaveBeenCalled();
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
