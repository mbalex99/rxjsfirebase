#RXJS 5 (beta currently at Beta 2) wrapper around Firebase's API.


**This project was built with TypeScript**
To create an instance, you'll simply have to supply a native Firebase object to the constructor

```javascript
    import {RxFirebase, EventType} from 'rxjsfirebase'
    import * as Firebase from 'firebase'
    
    var rootref = new Firebase("MY_FIREBASE_URL");
    var rx_rootRef = new RxFirebase(firebase);
```
 
I tried to port almost all the methods to be Observable friendly. 

#Returning Child Paths and Queries

Getting a child path is exactly the same as the original objects. You can always call

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

`ref`

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

    rx_rootref.rx_observe(EventType.CHILD_ADDED)
        .subscribe((snapshot) => {
            console.log("Completed observing snapshot: ", snapshot.val())
        }, (err) => {
            console.log(err)
        })
``` 


#Observing Values Once

To keep respectful to RxJS, we simply just fire a `take(1)` to observe the value once. 

```javascript
    rx_rootref.rx_observe(EventType.CHILD_ADDED).take(1)
        .subscribe((snapshot) => {
            console.log("Completed observing snapshot just once: ", snapshot.val())
        }, (err) => {
            console.log(err)
        })
``` 

#Observing Values with a Sister Key

This is actually a separate method: `rx_observeWithSiblingKey` and it returns an object with the keys `snapshot` and `siblingKey`
Remember the sibling key might be `null`
```javascript
    rx_rootref.rx_observeWithSiblingKey(EventType.CHILD_ADDED)
        .subscribe(snapshotWithKey => {
            console.log("snapshot", snapshotWithKey.snapshot)
            console.log("siblingKey (might be null!)", snapshotWithKey.siblingKey)
        })
``` 

#Observing Auth Values

This will return the authData. This does not throw an error if you are not authenticated. 

```javascript
    rx_rootRef.rx_observeAuth().subscribe(authData => {
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
    rx_rootref.rx_set(myValue)
        .subscribe(() => {
            console.log("Completed setting the value at this ref")
        }, (err) => {
            console.log(err)
        })
``` 

#Updating Values  

But this one will wrap that callback into an `Observable<{}>`

```javascript
    rx_rootref.rx_update(valuesToUpdate)
        .subscribe(() => {
            console.log("Completed updating values at this ref")
        }, (err) => {
            console.log(err)
        })
``` 

#Push Values  

But this one will wrap that callback into an `Observable<RxFirebase>`
The RxFirebase instance is the location of the new ref that was pushed

```javascript
    rx_rootref.rx_push(myValue)
        .subscribe(newFirebaseRef => {
            console.log("Completed pushing and it's located at this ref", newFirebaseRef)
        }, (err) => {
            console.log(err)
        })
``` 