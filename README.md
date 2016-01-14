#RXJS 5 (beta currently) wrapper around Firebase's API

**This project was built with TypeScript**

To create an instance

```javascript
    import {RxFirebase, EventType} from 'rxjsfirebase'
    import * as Firebase from 'firebase'
    
    var rootref = new Firebase("MY_FIREBASE_URL");
    var rx_rootRef = new RxFirebase(firebase);
```
 
I tried to port almost all the methods to be Observable friendly. 

In the regular firebase you'll have this method:

```javascript
    rootref.set(myValue, function(err, firebase){
        if(err){ console.log(err)}
        else{ console.log(firebase)}
    })
```  

But this one will wrap that callback into an Observable

```javascript
    rx_rootref.rx_set(myValue)
        .subscribe((firebase) => {
            console.log(firebase)
        }, (err) => {
            console.log(err)
        })
```  