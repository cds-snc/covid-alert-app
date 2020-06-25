type Cancellable = () => void;

type Callback<T> = (result: T) => void;

export function createCancellableCallbackPromise<T>(
  nonExceptionCallback: () => Promise<T>,
  callback: Callback<T>,
): {cancelable: Cancellable; callable: () => void} {
  let isCancelled = false;
  const callable = () => {
    (async () => {
      try {
        if (isCancelled) {
          return;
        }
        const result = await nonExceptionCallback();
        if (isCancelled) {
          return;
        }
        callback(result);
      } catch {
        // Noop
      }
    })();
  };
  return {
    callable,
    cancelable: () => {
      isCancelled = true;
    },
  };
}
