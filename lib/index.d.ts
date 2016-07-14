import { Observable } from 'rxjs/Rx';
import * as Firebase from 'firebase';
export interface ISnapshotWithSisterKey {
    snapshot: Firebase.database.DataSnapshot;
    siblingKey: string;
}
export declare enum EventType {
    CHILD_ADDED = 0,
    CHILD_REMOVED = 1,
    CHILD_CHANGED = 2,
    CHILD_MOVED = 3,
    VALUE = 4,
}
export declare class RxFirebaseApp {
    private _appReference;
    appReference: Firebase.app.App;
    constructor(options: any, name?: string);
    database: Firebase.database.Database;
    auth: RxFirebaseAuth;
    rootView: RxFirebaseView;
}
export declare class RxFirebaseAuth {
    private _auth;
    constructor(auth: Firebase.auth.Auth);
    createCustomToken(uid: string, additionalClaims?: any): string;
    rx_verifyIdToken(idToken: any): Observable<any>;
    rx_signInWithCustomToken(token: string): Observable<Firebase.User>;
    rx_signOut(): Observable<void>;
    rx_onAuthStateChanged(): Observable<Firebase.User>;
}
export declare class RxFirebaseView {
    query: Firebase.database.Query;
    ref: Firebase.database.Reference;
    _query: Firebase.database.Query;
    constructor(query: Firebase.database.Query);
    child(path: string): RxFirebaseView;
    rx_remove(): Observable<{}>;
    rx_push(data: any): Observable<RxFirebaseView>;
    rx_set(data: any): Observable<{}>;
    rx_update(data: any): Observable<{}>;
    rx_observe(eventType: EventType): Observable<Firebase.database.DataSnapshot>;
    rx_observeWithSiblingKey(eventType: EventType): Observable<ISnapshotWithSisterKey>;
    orderByChild(key: string): RxFirebaseView;
    orderByValue(): RxFirebaseView;
    orderByPriority(): RxFirebaseView;
    limitToLast(limit: number): RxFirebaseView;
    startAt(value: any, key?: string): RxFirebaseView;
    endAt(value: any, key?: string): RxFirebaseView;
    equalTo(value: any, key?: string): RxFirebaseView;
    private static convertToString(eventType);
}
