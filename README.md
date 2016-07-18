#Firebase version 3 + RXJS 5 (beta currently at Beta 6) wrapper around Firebase's API.

Works great with Angular2! Install using npm, you don't need typings since it's already packaged with the project.

`npm install rxjsfirebase --save`

**Works on ES5 but also with ES6 and TypeScript**
To create an instance, you'll simply have to supply a native Firebase object to the constructor

```javascript
    import {RxFirebaseApp, RxFirebaseAuth, RxFirebaseView, EventType} from 'rxjsfirebase'

    var config = config = {
        apiKey: '<your-api-key>',
        authDomain: '<your-auth-domain>',
        databaseURL: '<your-database-url>',
        storageBucket: '<your-storage-bucket>'
    }

    var applicationInstance = new RxFirebaseApp(config);
    // or you can give the instance a name:
    var applicationInstance = new RxFirebaseApp(config, "myAppInstanceName");
```

#Note

I made an opinionated effort to name data-endpoints as **RxFirebaseView**.
The RxFirebaseView is essentially a `ref` or `query` in the old Firebase documentation.
The logic is that it's some sort of database-path location that you can observe. 
It has all the methods that you love like

`child(mySubPath)`

`orderByChild(childPath)`

`orderByKey(key)`

`orderByValue(val)`

`orderByPriority()`

`startAt`

`endAt`

`equalTo`

`limitToFirst`

`limitToLast`

`limit`



#Observing Values

You'll need to import the modules `EventType` enum.
The enum as these values:

`EventType.CHILD_ADDED`

`EventType.CHILD_REMOVED`

`EventType.CHILD_MOVED`

`EventType.CHILD_REMOVED`

`EventType.VALUE`

```javascript
    import {EventType} from 'rxjsfirebase'

    viewReference.rx_observe(EventType.CHILD_ADDED)
        .subscribe((snapshot) => {
            console.log("Completed observing snapshot: ", snapshot.val())
        }, (err) => {
            console.log(err)
        })
``` 


#Observing Values Once

To keep the API respectful to RxJS, we simply just fire a `take(1)` to observe the value once. 

```javascript
    viewReference.rx_observe(EventType.CHILD_ADDED).take(1)
        .subscribe((snapshot) => {
            console.log("Completed observing snapshot just once: ", snapshot.val())
        }, (err) => {
            console.log(err)
        })
``` 

#Observing Values with a Sister Key

This is actually a separate method: `rx_observeWithSiblingKey` and it returns an object with the keys `snapshot` and `siblingKey`
** Remember the sibling key might be `null` ** 

```javascript
    viewReference.rx_observeWithSiblingKey(EventType.CHILD_ADDED)
        .subscribe(snapshotWithKey => {
            console.log("snapshot", snapshotWithKey.snapshot)
            console.log("siblingKey (might be null!)", snapshotWithKey.siblingKey)
        })
``` 

#Observing Auth Values

This will return the authData. This does not throw an error if you are not authenticated. 

```javascript
    applicationInstance.auth.rx_observeAuth().subscribe(authData => {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        } else {
            console.log("User is logged out");
        }
    })
```

#Setting Values  

But this one will wrap that callback into an Observable

```javascript
    viewReference.rx_set(myValue)
        .subscribe(() => {
            console.log("Completed setting the value at this ref")
        }, (err) => {
            console.log(err)
        })
``` 

#Updating Values  

But this one will wrap that callback into an `Observable<{}>`

```javascript
    viewReference.rx_update(valuesToUpdate)
        .subscribe(() => {
            console.log("Completed updating values at this ref")
        }, (err) => {
            console.log(err)
        })
``` 

#Push Values  

But this one will wrap that callback into an `Observable<RxFirebaseView>`
The RxFirebase instance is the location of the new ref that was pushed

```javascript
    viewReference.rx_push(myValue)
        .subscribe(newFirebaseRef => {
            console.log("Completed pushing and it's located at this ref", newFirebaseRef)
        }, (err) => {
            console.log(err)
        })
``` 