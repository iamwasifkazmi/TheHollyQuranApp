type IdleGlobals = typeof globalThis & {
  requestIdleCallback?: (
    callback: () => void,
    options?: {timeout?: number},
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const idleGlobals = globalThis as IdleGlobals;

/** Schedules work when the JS thread is idle (RN-recommended replacement for InteractionManager). */
export function scheduleIdleTask(
  callback: () => void,
  options?: {timeout?: number},
): () => void {
  let cancelled = false;
  const run = () => {
    if (!cancelled) {
      callback();
    }
  };

  if (typeof idleGlobals.requestIdleCallback === 'function') {
    const handle = idleGlobals.requestIdleCallback(run, {
      timeout: options?.timeout ?? 500,
    });
    return () => {
      cancelled = true;
      idleGlobals.cancelIdleCallback?.(handle);
    };
  }

  const timeoutId = setTimeout(run, 0);
  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
  };
}
