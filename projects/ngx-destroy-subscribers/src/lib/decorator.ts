import { Unsubscribable } from 'rxjs/index';

export function DestroySubscribers(
  params?: {
    addSubscribersFunc: string,
    removeSubscribersFunc: string,
    initFunc: string,
    destroyFunc: string,
  }
) {
  return function (target: any) {
    params = {
      addSubscribersFunc: 'addSubscribers',
      removeSubscribersFunc: 'removeSubscribers',
      initFunc: 'ngOnInit',
      destroyFunc: 'ngOnDestroy',
      ...params
    };

    target.prototype[params.initFunc] = ngOnInitDecorator(target.prototype[params.initFunc]);
    target.prototype[params.destroyFunc] = ngOnDestroyDecorator(target.prototype[params.destroyFunc]);

    function ngOnDestroyDecorator(f) {
      return function () {
        const superData = f ? f.apply(this, arguments) : null;

        if (typeof this[params.removeSubscribersFunc] === 'function') {
          this[params.removeSubscribersFunc]();
        }

        for (const subscriberKey of Object.keys(this.subscribers)) {
          const subscriber: Unsubscribable = this.subscribers[subscriberKey];
          if (subscriber && typeof subscriber.unsubscribe === 'function') {
            subscriber.unsubscribe();
          }
        }

        return superData;
      };
    }

    function ngOnInitDecorator(f) {
      return function () {
        const superData = f ? f.apply(this, arguments) : null;


        if (typeof this[params.addSubscribersFunc] === 'function') {
          this[params.addSubscribersFunc]();
        }


        return superData;
      };
    }

    return target;
  };
}
