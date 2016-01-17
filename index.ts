import {Observable, Subscriber} from 'rxjs'
import * as Firebase from 'firebase'

export enum EventType {
	CHILD_ADDED, CHILD_REMOVED, CHILD_CHANGED, CHILD_MOVED, VALUE
}

export interface RxFirebaseResponse {
    snapshot: FirebaseDataSnapshot
	siblingKey: string
}

export class RxFirebasePayload implements RxFirebaseResponse {
	snapshot: FirebaseDataSnapshot
	siblingKey: string
	constructor(snapshot: FirebaseDataSnapshot, siblingKey: string){
		this.snapshot = snapshot;
		this.siblingKey = siblingKey;
	}
}

export class RxFirebase {
	
	get ref(): Firebase { 
		return this.query.ref()
	}
    
    get uid(): string {
        return this.ref.getAuth().uid
    }
    
    get authData(): FirebaseAuthData {
        return this.ref.getAuth()
    }
    
	query: FirebaseQuery
	constructor(query: FirebaseQuery)
    {
		this.query = query
	}
	
	child(path: string): RxFirebase {
		return new RxFirebase(this.ref.child(path));
	}
    
    unauth() {
        this.ref.unauth();
    }
	
	rx_observeAuth(): Observable<FirebaseAuthData> {
		var self = this;
		return new Observable((subscriber: Subscriber<FirebaseAuthData>) => {
			var listener = (authData : FirebaseAuthData) => {
				subscriber.next(authData);
			}
			self.ref.onAuth(listener);
			return () => {
				self.ref.offAuth(listener);
			}
		});
	}
    
    rx_observeConnectionStatus(): Observable<boolean> {
        var self = this
        var rootRef = new RxFirebase(self.ref.root());
        return rootRef.child('.info').child('connected').rx_observe(EventType.VALUE).map(payload => {
            return payload.snapshot.val() != null;
        });
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
    
    rx_set(data: any): Observable<{}>{
        let self = this;
		return new Observable((subscriber: Subscriber<{}>) => {
			self.ref.set(data, (err) => {
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
	
    rx_authWithCustomToken(customToken: string) : Observable<FirebaseAuthData>{
        var self = this;
        return new Observable((subscriber: Subscriber<FirebaseAuthData>) => {
            self.ref.authWithCustomToken(customToken, (err, authData) => {
                if(err){
                    subscriber.error(err);
                }else{
                    subscriber.next(authData);
                    subscriber.complete();
                }
            })
        })
    }
    
	rx_observe(eventType: EventType) : Observable<RxFirebaseResponse> {
		var self = this;
        
        
		return new Observable((subscriber : Subscriber<RxFirebaseResponse>) => {
			var callback = (snapshot: FirebaseDataSnapshot, siblingKey: string) => {
				subscriber.next(new RxFirebasePayload(snapshot, siblingKey))
			}
			self.query.on(self.convertToString(eventType), callback, err => {
				subscriber.error(err);
			})
			return () => {
				self.query.off(self.convertToString(eventType), callback);		
			}
		});
	}
    
    
    orderByChild(key: string) : RxFirebase {
        let newQuery = this.query.orderByChild(key);
        return new RxFirebase(newQuery);
    }
    
    orderByValue(): RxFirebase {
        let newQuery = this.query.orderByValue()
        return new RxFirebase(newQuery);
    }
    
    orderByPriority(): RxFirebase {
        let newQuery = this.query.orderByPriority();
        return new RxFirebase(newQuery)
    }
    
    limitToLast(limit: number): RxFirebase {
        let newQuery = this.query.limitToLast(limit);
        return new RxFirebase(newQuery);
    }
    
    startAt(value: string, key?: string): RxFirebase {
        let newQuery = this.query.startAt(value, key)
        return new RxFirebase(newQuery);
    }
    
    endAt(value: string, key?: string): RxFirebase {
        let newQuery = this.query.endAt(value, key)
        return new RxFirebase(newQuery);
    }
    
	private convertToString(eventType: EventType) : string {
		switch (eventType) {
			case EventType.CHILD_ADDED:
				return "child_added"
				break;
			case EventType.CHILD_CHANGED:
				return "child_changed"
				break
			case EventType.CHILD_MOVED:
				return "child_moved"
				break
			case EventType.CHILD_REMOVED:
				return "child_removed"
				break
			case EventType.VALUE:
				return "value"
				break
			default:
				break;
		}
	}
}