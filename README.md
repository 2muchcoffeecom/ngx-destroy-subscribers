
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

Decorator integration

```html
import {DestroySubscribers} from "ngx-destroy-subscribers";

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
  This method must be declared, even if it's empty because of AOT compilation;
  Otherwise, the Decorator would throw an Error.
  */
  ngOnDestroy() {
   console.log('for unsubscribing');
  }
}
```

- `subscriber` - The name by default for each subscription in case you don't apply the CombineSubscriptions Decorator. It conforms to an Unsubscribable Interface.
- `@CombineSubscriptions` - Implement this Decorator in case you want to change the variable's name of a subscription, otherwise don't apply it.
