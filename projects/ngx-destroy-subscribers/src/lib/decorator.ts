import { Unsubscribable } from 'rxjs';
import 'reflect-metadata';

export function DestroySubscribers<TFunction extends Function>(target: TFunction) {
  
  const subscriptions: Array<Unsubscribable> = [];
  const subscriber: string = Reflect.getMetadata('subscription:name', target.prototype, 'subscriber');
  
  Object.defineProperty(target.prototype, subscriber ? subscriber : 'subscriber', {
    get: () => subscriptions,
    set: subscription => subscriptions.push(subscription),
  });
  
  if (typeof target.prototype.ngOnDestroy !== 'function') {
    throw new Error(`${target.prototype.constructor.name} must implement ngOnDestroy() lifecycle hook`);
  }
  
  target.prototype.ngOnDestroy = ngOnDestroyDecorator(target.prototype.ngOnDestroy);
  
  function ngOnDestroyDecorator(f) {
    return function () {
      do {
        const sub: Unsubscribable = subscriptions.shift();
        sub.unsubscribe();
      } while (subscriptions.length);
      
      return f.apply(this, arguments);
    };
  }
  return target;
}

export function CombineSubscriptions(target: Object, propertyKey: string | symbol) {
  Reflect.defineMetadata('subscription:name', propertyKey, target, 'subscriber');
}
