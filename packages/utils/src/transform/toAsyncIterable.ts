import { type Observable, Subject } from "rxjs";

/**
 * Converts an RxJS Observable into an async iterable.
 *
 * This function returns an async iterable that, when iterated over, will yield
 * each value emitted by the Observable. The iteration will complete when the
 * Observable completes.
 *
 * @param observable The Observable to convert to an async iterable.
 *
 * @returns An async iterable that yields the values emitted by the Observable.
 */
export function toAsyncIterable<T>(observable: Observable<T>): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator]() {
      const subject = new Subject<T>();
      observable.subscribe({
        next: (value) => subject.next(value),
        error: (err) => subject.error(err),
        complete: () => subject.complete(),
      });

      return (async function* () {
        const values: T[] = [];
        const subscription = subject.subscribe({
          next: (value) => values.push(value),
          error(err) {
            throw err;
          },
        });

        try {
          while (true) {
            if (values.length > 0) {
              const value = values.shift();

              if (value !== undefined) yield value;
            } else if (subscription.closed) break;
            else await new Promise((resolve) => setTimeout(resolve, 10));
          }
        } finally {
          subscription.unsubscribe();
        }
      })();
    },
  };
}
