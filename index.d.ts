import { Observable } from 'rxjs';
import * as Firebase from 'firebase';
export declare enum EventType {
    CHILD_ADDED = 0,
    CHILD_REMOVED = 1,
    CHILD_CHANGED = 2,
    CHILD_MOVED = 3,
    VALUE = 4,
}
export interface RxFirebaseResponse {
    snapshot: FirebaseDataSnapshot;
    siblingKey: string;
}
export declare class RxFirebasePayload implements RxFirebaseResponse {
    snapshot: FirebaseDataSnapshot;
    siblingKey: string;
    constructor(snapshot: FirebaseDataSnapshot, siblingKey: string);
}
export declare class RxFirebase {
    ref: Firebase;
    uid: string;
    authData: FirebaseAuthData;
    query: FirebaseQuery;
    constructor(query: FirebaseQuery);
    child(path: string): RxFirebase;
    unauth(): void;
    rx_observeAuth(): Observable<FirebaseAuthData>;
    rx_observeConnectionStatus(): Observable<boolean>;
    rx_remove(): Observable<{}>;
    rx_push(data: any): Observable<{}>;
    rx_set(data: any): Observable<{}>;
    rx_update(data: any): Observable<{}>;
    rx_authWithCustomToken(customToken: string): Observable<FirebaseAuthData>;
    rx_observe(eventType: EventType): Observable<RxFirebaseResponse>;
    orderByChild(key: string): RxFirebase;
    orderByValue(): RxFirebase;
    orderByPriority(): RxFirebase;
    limitToLast(limit: number): RxFirebase;
    startAt(value: string, key?: string): RxFirebase;
    endAt(value: string, key?: string): RxFirebase;
    private convertToString(eventType);
}
