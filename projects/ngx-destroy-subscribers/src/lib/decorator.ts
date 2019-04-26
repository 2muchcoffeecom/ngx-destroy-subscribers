import { Unsubscribable } from 'rxjs';
import 'reflect-metadata';

export interface InstanceSubscriptionWithInstance {
  instance: any;
  subscription: Unsubscribable;
}

export function DestroySubscribers(params?) {

  return function (target) {
    params = {
      destroyFunc: 'ngOnDestroy',
      ...params
    };
    const unsubscribableLike: {subscriptions: InstanceSubscriptionWithInstance[], unsubscribe: () => void} = {
      subscriptions: [],
      unsubscribe,
    };
    const subscriber: string = Reflect.getMetadata('subscription:name', target.prototype, 'subscriber');

    Object.defineProperty(target.prototype, subscriber || 'subscriber', {
      get: function () {
        return { unsubscribe: unsubscribe.bind(this) }
      },
      set: function (subscription) {
        unsubscribableLike.subscriptions.push({ subscription, instance: this})
      },
    });

    if (typeof target.prototype[params.destroyFunc] !== 'function') {
      throw new Error(`${target.prototype.constructor.name} must implement ${params.destroyFunc}() lifecycle hook`);
    }

    target.prototype[params.destroyFunc] = ngOnDestroyDecorator(target.prototype[params.destroyFunc]);

    function ngOnDestroyDecorator(f) {
      return function () {
        unsubscribe.call(this);
        return f.apply(this, arguments);
      };
    }

    function unsubscribe() {
      const subscriptionsWithInstances = unsubscribableLike.subscriptions;
      const escapedSubscriptions = subscriptionsWithInstances.filter(
        (sub) => sub && typeof sub.subscription.unsubscribe === 'function'
      );
      const currentSubscriptions = escapedSubscriptions.filter((sub) => sub.instance === this);
      do {
        const {subscription} = currentSubscriptions.shift();
        subscription.unsubscribe()
      } while (currentSubscriptions.length);
    }

    return target;
  };
}

export function CombineSubscriptions(params?) {
  return function (target, propertyKey: string | symbol) {
    Reflect.defineMetadata('subscription:name', propertyKey, target, 'subscriber');
  };
}
