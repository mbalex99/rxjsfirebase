import {Observable, Subscriber} from 'rxjs/Rx'
import * as Firebase from 'firebase'

export interface ISnapshotWithSisterKey {
    snapshot: Firebase.database.DataSnapshot,
    siblingKey: string
}

export enum EventType {
	CHILD_ADDED, CHILD_REMOVED, CHILD_CHANGED, CHILD_MOVED, VALUE
}

export class RxFirebaseApp {
	
	private _appReference : Firebase.app.App
	get appReference(): Firebase.app.App {
		return this._appReference;
	}
	
	constructor(options: any, name: string = "rxfirebase"){
		this._appReference = Firebase.initializeApp(options, name)
	}
	public get database() : Firebase.database.Database {
		return this._appReference.database()
	}
	public get auth(): RxFirebaseAuth {
		return new RxFirebaseAuth(this._appReference.auth())
	}
	
	public get rootView(): RxFirebaseView {
		return new RxFirebaseView(this._appReference.database().ref())
	}
}

export class RxFirebaseAuth {
	private _auth : Firebase.auth.Auth;
	public constructor(auth: Firebase.auth.Auth){
		this._auth = auth;
	}

	public createCustomToken(uid: string, additionalClaims: any = {}) : string {
		return (<any>this._auth).createCustomToken(uid, additionalClaims);
	}

	public rx_verifyIdToken(idToken) : Observable<any> {
		return Observable.fromPromise((<any>this._auth).verifyIdToken(idToken))
	}

	public rx_signInWithCustomToken(token: string) : Observable<Firebase.User>{
		return Observable.fromPromise<Firebase.User>(this._auth.signInWithCustomToken(token))
	}

	public rx_signOut() : Observable<void>{
		return Observable.fromPromise(this._auth.signOut())
	}
	public rx_onAuthStateChanged() : Observable<Firebase.User> {
		var self = this;
		return new Observable<Firebase.User>((subscriber: Subscriber<Firebase.User>) => {
			var listenerReference = self._auth.onAuthStateChanged((user: Firebase.User) => {
				subscriber.next(user);
			}, err => {
				subscriber.error(err);
			}, () => {
				subscriber.complete();	
			});
			return () => {
				listenerReference(); // unsubscriber
			}
		});
	}

}


export class RxFirebaseView {

	public get query(): Firebase.database.Query {
		return this._query;
	}

	public get ref(): Firebase.database.Reference {
		return this.query.ref;
	}

	_query: Firebase.database.Query
	public constructor(query: Firebase.database.Query)
    {
		this._query = query;
	}
	
	child(path: string): RxFirebaseView {
		return new RxFirebaseView(this.query.ref.child(path));
	}

	rx_remove(): Observable<{}> {
		let self = this;
		return new Observable((subscriber : Subscriber<{}>) => {
			self.ref.remove((err) => {
				if(err != null){
					subscriber.error(err);
				}else{
					subscriber.next({});
					subscriber.complete();
				}
			})
			return () => {}
		})
	}
    
    rx_push(data: any): Observable<RxFirebaseView>{
        let self = this;
        return new Observable<RxFirebaseView>((subscriber: Subscriber<RxFirebaseView>) => {
            var newRef = self.ref.push(data, (err) => {
                if(err != null){
					subscriber.error(err);
				}else{
					subscriber.next(new RxFirebaseView(newRef));
					subscriber.complete();
				}
            })
            return () => {
				
			}
        })
    }
    
    rx_set(data: any): Observable<{}>{
        let self = this;
		return new Observable((subscriber: Subscriber<{}>) => {
			self.query.ref.set(data, (err) => {
				if(err != null){
					subscriber.error(err);
				}else{
					subscriber.next({});
					subscriber.complete();
				}
			})
			return () => {
				
			}
		});
    }
	
	rx_update(data: any): Observable<{}> {
		let self = this;
		return new Observable((subscriber: Subscriber<{}>) => {
			self.ref.update(data, (err) => {
				if(err != null){
					subscriber.error(err);
				}else{
					subscriber.next({});
					subscriber.complete();
				}
			})
			return () => {
				
			}
		});
	}
    
	rx_observe(eventType: EventType) : Observable<Firebase.database.DataSnapshot> {
		var self = this;
		return new Observable<Firebase.database.DataSnapshot>((subscriber : Subscriber<Firebase.database.DataSnapshot>) => {
			var callback = (snapshot: Firebase.database.DataSnapshot, siblingKey: string) => {
				subscriber.next(snapshot)
			}
			self.query.on(RxFirebaseView.convertToString(eventType), callback, (err: Firebase.FirebaseError)  => {
				subscriber.error(err);
			})
			return () => {
				self.query.off(RxFirebaseView.convertToString(eventType), callback);		
			}
		});
	}
    
    
    
    rx_observeWithSiblingKey(eventType: EventType): Observable<ISnapshotWithSisterKey> {
        var self = this;
        return new Observable<ISnapshotWithSisterKey>((subscriber: Subscriber<ISnapshotWithSisterKey>) => {
            var callback = (snapshot: Firebase.database.DataSnapshot, siblingKey: string) => {
                var payload : ISnapshotWithSisterKey = {
                    snapshot: snapshot,
                    siblingKey: siblingKey
                }
				subscriber.next(payload)
			}
			self.query.on(RxFirebaseView.convertToString(eventType), callback, (err: Firebase.FirebaseError) => {
				subscriber.error(err);
			})
			return () => {
				self.query.off(RxFirebaseView.convertToString(eventType), callback);		
			}
        })
    }
    
    
    orderByChild(key: string) : RxFirebaseView {
        let newQuery = this.query.orderByChild(key);
        return new RxFirebaseView(newQuery);
    }
    
    orderByValue(): RxFirebaseView {
        let newQuery = this.query.orderByValue()
        return new RxFirebaseView(newQuery);
    }
    
    orderByPriority(): RxFirebaseView {
        let newQuery = this.query.orderByPriority();
        return new RxFirebaseView(newQuery)
    }
    
    limitToLast(limit: number): RxFirebaseView {
        let newQuery = this.query.limitToLast(limit);
        return new RxFirebaseView(newQuery);
    }
    
    startAt(value: any, key?: string): RxFirebaseView {
        let newQuery = this.query.startAt(value, key)
        return new RxFirebaseView(newQuery);
    }
    
    endAt(value: any, key?: string): RxFirebaseView {
        let newQuery = this.query.endAt(value, key)
        return new RxFirebaseView(newQuery);
    }
    
    equalTo(value: any, key?: string){
        let newQuery = this.query.equalTo(value, key)
        return new RxFirebaseView(newQuery);
    }
    
	private static convertToString(eventType: EventType) : string {
		switch (eventType) {
			case EventType.CHILD_ADDED:
				return "child_added"
			case EventType.CHILD_CHANGED:
				return "child_changed"
			case EventType.CHILD_MOVED:
				return "child_moved"
			case EventType.CHILD_REMOVED:
				return "child_removed"
			case EventType.VALUE:
				return "value"
			default:
				break;
		}
	}
}
