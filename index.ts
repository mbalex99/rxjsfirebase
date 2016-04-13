import {Observable, Subscriber} from 'rxjs/Rx'
import * as Firebase from 'firebase'

export interface ISnapshotWithSisterKey {
    snapshot: FirebaseDataSnapshot,
    siblingKey: string
}

export enum EventType {
	CHILD_ADDED, CHILD_REMOVED, CHILD_CHANGED, CHILD_MOVED, VALUE
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
		this.query = query;
	}
	
	child(path: string): RxFirebase {
		return new RxFirebase(this.ref.child(path));
	}
    
    unauth() {
        this.ref.unauth();
    }
	
	rx_observeAuth(): Observable<FirebaseAuthData> {
		var self = this;
        return new Observable<FirebaseAuthData>((subscriber : Subscriber<FirebaseAuthData> ) => {
            var listener = (authData : FirebaseAuthData) => {
				subscriber.next(authData);
			}
			self.ref.onAuth(listener);
			return () => {
				self.ref.offAuth(listener);
			}
        })
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
    
    rx_push(data: any): Observable<RxFirebase>{
        let self = this;
        return new Observable<RxFirebase>((subscriber: Subscriber<RxFirebase>) => {
            var newRef = self.ref.push(data, (err) => {
                if(err != null){
					subscriber.error(err);
				}else{
					subscriber.next(new RxFirebase(newRef));
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
        return new Observable<FirebaseAuthData>((subscriber: Subscriber<FirebaseAuthData>) => {
            self.ref.authWithCustomToken(customToken, (err : Error, authData: FirebaseAuthData) => {
                if(err){
                    subscriber.error(err);
                }else{
                    subscriber.next(authData);
                    subscriber.complete();
                }
            })
        })
    }
    
	rx_observe(eventType: EventType) : Observable<FirebaseDataSnapshot> {
		var self = this;
		return new Observable<FirebaseDataSnapshot>((subscriber : Subscriber<FirebaseDataSnapshot>) => {
			var callback = (snapshot: FirebaseDataSnapshot, siblingKey: string) => {
				subscriber.next(snapshot)
			}
			self.query.on(self.convertToString(eventType), callback, err => {
				subscriber.error(err);
			})
			return () => {
				self.query.off(self.convertToString(eventType), callback);		
			}
		});
	}
    
    
    
    rx_observeWithSiblingKey(eventType: EventType): Observable<ISnapshotWithSisterKey> {
        var self = this;
        return new Observable<ISnapshotWithSisterKey>((subscriber: Subscriber<ISnapshotWithSisterKey>) => {
            var callback = (snapshot: FirebaseDataSnapshot, siblingKey: string) => {
                var payload : ISnapshotWithSisterKey = {
                    snapshot: snapshot,
                    siblingKey: siblingKey
                }
				subscriber.next(payload)
			}
			self.query.on(self.convertToString(eventType), callback, err => {
				subscriber.error(err);
			})
			return () => {
				self.query.off(self.convertToString(eventType), callback);		
			}
        })
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
    
    startAt(value: any, key?: string): RxFirebase {
        let newQuery = this.query.startAt(value, key)
        return new RxFirebase(newQuery);
    }
    
    endAt(value: any, key?: string): RxFirebase {
        let newQuery = this.query.endAt(value, key)
        return new RxFirebase(newQuery);
    }
    
    equalTo(value: any, key?: string){
        let newQuery = this.query.equalTo(value, key)
        return new RxFirebase(newQuery);
    }
    
	private convertToString(eventType: EventType) : string {
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
