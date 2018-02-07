
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
@DestroySubscribers({
  addSubscribersFunc: 'addSubscribers',
  removeSubscribersFunc: 'removeSubscribers',
  initFunc: 'ngOnInit',
  destroyFunc: 'ngOnDestroy',
})
export class TestComponent {
  public subscribers: any = {};
  
  addSubscribers() {
    this.subscribers.testSubscriber = Observable.of('true')
    .subscribe(response => {
      console.log(response);
    })
  }
}
```

- `subscribers` - The object which stores all subscribers
- `addSubscribersFunc` - The function where subscriptions on streams happen (by default - addSubscribers)
- `removeSubscribersFunc` - The function where subscribers are removed automatically (by default - removeSubscribers)
- `initFunc` - The function that is called when constructor is applied (by default - ngOnInit)
- `destroyFunc` - The function that is called when destructor is applied (by default - ngOnDestroy)

