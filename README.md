
# Angular 2+ : Typescript component for Destroy Subscribers

Installation
--------------------------------------

Install it from npm:

```bash
npm install ngx-destroy-subscribers
```

Usage
--------------------------------------


### Integration

Decorator regular usage in Angular:

```html
import { DestroySubscribers } from "ngx-destroy-subscribers";
import { Unsubscribable } from 'rxjs';

@Component({
  ...
})
@DestroySubscribers()
export class TestComponent implements OnInit, OnDestroy {

  @CombineSubscriptions()
  private subscriber: Unsubscribable;

  ngOnInit() {
    this.subscriber = of('true')
      .subscribe(value => console.log(value));
    
    this.subscriber = of('false')
      .subscribe(value => console.log(value));
  }

  /*
  The ngOnDestroy() method must be declared, even if it's empty because of AOT compilation;
  Otherwise, the Decorator would throw an Error.
  */
  ngOnDestroy() {
   console.log(`for unsubscribing ${this.constructor.name}`);
  }
}
```
- `subscriber` - represents the name by default for each subscription that conforms to an Unsubscribable Interface.
Each time when you assign the Subscription to the "subscribe" variable - it's auto pushed to the array of Subscriptions under the hood.
In case you want to unsubscribe from all subscriptions at a time manually before the Component Destroys, you can call an unsubscribe() method on the "subscriber" variable.

- `@CombineSubscriptions` - implement this Decorator in case you want to change the default variable's name("subscriber") of a subscription, otherwise don't apply it.

Advanced Decorator usage in Angular:

```html
import { DestroySubscribers } from "ngx-destroy-subscribers";
import { Unsubscribable } from 'rxjs';

@Component({
  ...
})
@DestroySubscribers({
  destroyFunc: 'ngAfterViewInit'
})
export class TestComponent implements OnInit, AfterViewInit {

  @CombineSubscriptions()
  private customSubscriber: Unsubscribable;

  ngOnInit() {
    this.customSubscriber = of('true')
      .subscribe(value => console.log(value));
    
    this.customSubscriber = of('false')
      .subscribe(value => console.log(value));
  }

  /*
  The method passed to the DestroySubscribers Decorator must be declared, even if it's empty because of AOT compilation;
  Otherwise, the Decorator would throw an Error.
  */
  ngAfterViewInit() {
   console.log(`for unsubscribing ${this.constructor.name}`);
  }
}
```
- `{destroyFunc: '...' }` - add this parameter to the DestroySubscribers Decorator with the name of a hook for auto unsubscribing in case you want to change the default one - "ngOnDestroy" lifecycle hook, otherwise don't apply it.

Decorator usage in other JS framework/library, e.g. React:

```html
import { DestroySubscribers } from "ngx-destroy-subscribers";
import { Unsubscribable } from 'rxjs';

@DestroySubscribers({
  destroyFunc: 'componentWillUnmount',
})
class TestComponent extends React.Component {

  @CombineSubscriptions()
  private subscriber: Unsubscribable;

  componentDidMount() {
    this.subscriber = of('true')
      .subscribe(value => console.log(value));
    
    this.subscriber = of('false')
      .subscribe(value => console.log(value));
  }

  /*
  The method passed to the DestroySubscribers Decorator must be declared, even if it's empty.
  Otherwise, the Decorator would throw an Error.
  */
  componentWillUnmount() {
   console.log(`for unsubscribing ${this.constructor.name}`);
  }
}
```
