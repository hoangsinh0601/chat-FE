import { Observable, takeUntil } from "rxjs";

type ObserverNextHandler<T> = (data: T) => void;
type ObservableRegistrar = <T>(observable$: Observable<T>, handler: ObserverNextHandler<T>) => void;

/**
 * This is a factory function that will generate a register function which
 * when used with an observable will automatically subscribes and then unsubscribes
 * when the component is destroyed.
 * @param this The component instance.
 * @param onDestroy$ The onDestroy$ signifier.
 * @returns A register function.
 */
export function observableRegistrarFactory(this: ThisType<any>, onDestroy$: Observable<void>): ObservableRegistrar {
  return <T>(observable$: Observable<T>, handler: ObserverNextHandler<T>): void => {
    observable$.pipe(takeUntil(onDestroy$)).subscribe(handler.bind(this));
  };
}
