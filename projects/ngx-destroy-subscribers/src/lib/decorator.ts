import { Unsubscribable } from 'rxjs';
import 'reflect-metadata';

export function DestroySubscribers<TFunction extends Function>(target: TFunction) {
  
  const unsubscribableLike: {subscriptions: Unsubscribable[], unsubscribe: () => void} = {
    subscriptions: [],
    unsubscribe,
  };
  const subscriber: string = Reflect.getMetadata('subscription:name', target.prototype, 'subscriber');
  
  Object.defineProperty(target.prototype, subscriber ? subscriber : 'subscriber', {
    get: () => unsubscribableLike,
    set: subscription => unsubscribableLike.subscriptions.push(subscription),
  });
  
  if (typeof target.prototype.ngOnDestroy !== 'function') {
    throw new Error(`${target.prototype.constructor.name} must implement ngOnDestroy() lifecycle hook`);
  }
  
  target.prototype.ngOnDestroy = ngOnDestroyDecorator(target.prototype.ngOnDestroy);
  
  function ngOnDestroyDecorator(f) {
    return function () {
      unsubscribe();
      return f.apply(this, arguments);
    };
  }

  function unsubscribe() {
    do {
      const sub: Unsubscribable = unsubscribableLike.subscriptions.shift();
      sub.unsubscribe();
    } while (unsubscribableLike.subscriptions.length);
  }

  return target;
}

export function CombineSubscriptions(target: Object, propertyKey: string | symbol) {
  Reflect.defineMetadata('subscription:name', propertyKey, target, 'subscriber');
}
