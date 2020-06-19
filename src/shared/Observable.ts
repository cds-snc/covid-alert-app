class Subscription<T> {
  private observer: (value: T) => void;
  private active: boolean;
  constructor(cb: (_value: T) => void) {
    this.active = true;
    this.observer = cb;
  }

  receive(value: T) {
    if (this.active) {
      this.observer(value);
    }
  }

  deactivate() {
    this.active = false;
  }
}
class ObserverPropagationError extends Error {
  constructor(currentValue: any, newValue: any) {
    super();
    this.message = `Observer: Error while trying propagating value ${newValue}, haven't finished propagation cycle for ${currentValue}`;
  }
}

type SubscriptionCleanup = () => void;
type CycleEndAction = () => void;

class Subscriptions<T> {
  subscriptions: Subscription<T>[] = [];
  state: {type: 'idle'} | {type: 'propagation'; cycleEndActions: CycleEndAction[]; value: T} = {
    type: 'idle',
  };

  add(cb: (value: T) => void): SubscriptionCleanup {
    const sub = new Subscription(cb);
    this.addSubscription(sub);
    return () => this.deactivateSubscription(sub);
  }

  propagate(value: T) {
    if (this.state.type === 'propagation') {
      throw new ObserverPropagationError(this.state.value, value);
    }

    this.state = {type: 'propagation', cycleEndActions: [], value};
    // don't use foreach here, it won't include synchronously appended items.
    for (const sub of this.subscriptions) {
      sub.receive(value);
    }
    const completePropagationActions = this.state.cycleEndActions;
    this.state = {type: 'idle'};
    completePropagationActions.forEach(action => action());
  }

  private deactivateSubscription(sub: Subscription<T>) {
    if (this.state.type === 'idle') {
      this.removeSubscription(sub);
    } else {
      sub.deactivate();
      this.state.cycleEndActions.push(() => this.removeSubscription(sub));
    }
  }

  private addSubscription(sub: Subscription<T>) {
    if (this.state.type === 'idle') {
      this.subscriptions.push(sub);
    } else {
      // it is okay to store insertion in the same list as deletion
      // since we always push back, insertion will always precede deletion.
      this.state.cycleEndActions.push(() => this.subscriptions.push(sub));
    }
  }

  private removeSubscription(sub: Subscription<T>) {
    if (this.state.type !== 'idle') return;
    const index = this.subscriptions.indexOf(sub);
    if (index > -1) {
      this.subscriptions.splice(index, 1);
    }
  }
}

export class Observable<T> {
  value: T;
  subscriptions: Subscriptions<T> = new Subscriptions();

  constructor(defaultValue: T) {
    this.value = defaultValue;
  }

  get(): T {
    return this.value;
  }

  set(value: T): void {
    this.value = value;
    this.subscriptions.propagate(value);
  }

  observe(cb: (value: T) => void): () => void {
    return this.subscriptions.add(cb);
  }
}
