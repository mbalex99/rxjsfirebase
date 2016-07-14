"use strict";
var Rx_1 = require('rxjs/Rx');
var Firebase = require('firebase');
(function (EventType) {
    EventType[EventType["CHILD_ADDED"] = 0] = "CHILD_ADDED";
    EventType[EventType["CHILD_REMOVED"] = 1] = "CHILD_REMOVED";
    EventType[EventType["CHILD_CHANGED"] = 2] = "CHILD_CHANGED";
    EventType[EventType["CHILD_MOVED"] = 3] = "CHILD_MOVED";
    EventType[EventType["VALUE"] = 4] = "VALUE";
})(exports.EventType || (exports.EventType = {}));
var EventType = exports.EventType;
var RxFirebaseApp = (function () {
    function RxFirebaseApp(options, name) {
        if (name === void 0) { name = "rxfirebase"; }
        this._appReference = Firebase.initializeApp(options, name);
    }
    Object.defineProperty(RxFirebaseApp.prototype, "appReference", {
        get: function () {
            return this._appReference;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxFirebaseApp.prototype, "database", {
        get: function () {
            return this._appReference.database();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxFirebaseApp.prototype, "auth", {
        get: function () {
            return new RxFirebaseAuth(this._appReference.auth());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxFirebaseApp.prototype, "rootView", {
        get: function () {
            return new RxFirebaseView(this._appReference.database().ref());
        },
        enumerable: true,
        configurable: true
    });
    return RxFirebaseApp;
}());
exports.RxFirebaseApp = RxFirebaseApp;
var RxFirebaseAuth = (function () {
    function RxFirebaseAuth(auth) {
        this._auth = auth;
    }
    RxFirebaseAuth.prototype.createCustomToken = function (uid, additionalClaims) {
        return this._auth.createCustomToken(uid, additionalClaims);
    };
    RxFirebaseAuth.prototype.rx_signInWithCustomToken = function (token) {
        return Rx_1.Observable.fromPromise(this._auth.signInWithCustomToken(token));
    };
    RxFirebaseAuth.prototype.rx_signOut = function () {
        return Rx_1.Observable.fromPromise(this._auth.signOut());
    };
    RxFirebaseAuth.prototype.rx_onAuthStateChanged = function () {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            var listenerReference = self._auth.onAuthStateChanged(function (user) {
                subscriber.next(user);
            }, function (err) {
                subscriber.error(err);
            }, function () {
                subscriber.complete();
            });
            return function () {
                listenerReference(); // unsubscriber
            };
        });
    };
    return RxFirebaseAuth;
}());
exports.RxFirebaseAuth = RxFirebaseAuth;
var RxFirebaseView = (function () {
    function RxFirebaseView(query) {
        this._query = query;
    }
    Object.defineProperty(RxFirebaseView.prototype, "query", {
        get: function () {
            return this._query;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxFirebaseView.prototype, "ref", {
        get: function () {
            return this.query.ref;
        },
        enumerable: true,
        configurable: true
    });
    RxFirebaseView.prototype.child = function (path) {
        return new RxFirebaseView(this.query.ref.child(path));
    };
    RxFirebaseView.prototype.rx_remove = function () {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            self.ref.remove(function (err) {
                if (err != null) {
                    subscriber.error(err);
                }
                else {
                    subscriber.next({});
                    subscriber.complete();
                }
            });
            return function () { };
        });
    };
    RxFirebaseView.prototype.rx_push = function (data) {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            var newRef = self.ref.push(data, function (err) {
                if (err != null) {
                    subscriber.error(err);
                }
                else {
                    subscriber.next(new RxFirebaseView(newRef));
                    subscriber.complete();
                }
            });
            return function () {
            };
        });
    };
    RxFirebaseView.prototype.rx_set = function (data) {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            self.query.ref.set(data, function (err) {
                if (err != null) {
                    subscriber.error(err);
                }
                else {
                    subscriber.next({});
                    subscriber.complete();
                }
            });
            return function () {
            };
        });
    };
    RxFirebaseView.prototype.rx_update = function (data) {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            self.ref.update(data, function (err) {
                if (err != null) {
                    subscriber.error(err);
                }
                else {
                    subscriber.next({});
                    subscriber.complete();
                }
            });
            return function () {
            };
        });
    };
    RxFirebaseView.prototype.rx_observe = function (eventType) {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            var callback = function (snapshot, siblingKey) {
                subscriber.next(snapshot);
            };
            self.query.on(RxFirebaseView.convertToString(eventType), callback, function (err) {
                subscriber.error(err);
            });
            return function () {
                self.query.off(RxFirebaseView.convertToString(eventType), callback);
            };
        });
    };
    RxFirebaseView.prototype.rx_observeWithSiblingKey = function (eventType) {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            var callback = function (snapshot, siblingKey) {
                var payload = {
                    snapshot: snapshot,
                    siblingKey: siblingKey
                };
                subscriber.next(payload);
            };
            self.query.on(RxFirebaseView.convertToString(eventType), callback, function (err) {
                subscriber.error(err);
            });
            return function () {
                self.query.off(RxFirebaseView.convertToString(eventType), callback);
            };
        });
    };
    RxFirebaseView.prototype.orderByChild = function (key) {
        var newQuery = this.query.orderByChild(key);
        return new RxFirebaseView(newQuery);
    };
    RxFirebaseView.prototype.orderByValue = function () {
        var newQuery = this.query.orderByValue();
        return new RxFirebaseView(newQuery);
    };
    RxFirebaseView.prototype.orderByPriority = function () {
        var newQuery = this.query.orderByPriority();
        return new RxFirebaseView(newQuery);
    };
    RxFirebaseView.prototype.limitToLast = function (limit) {
        var newQuery = this.query.limitToLast(limit);
        return new RxFirebaseView(newQuery);
    };
    RxFirebaseView.prototype.startAt = function (value, key) {
        var newQuery = this.query.startAt(value, key);
        return new RxFirebaseView(newQuery);
    };
    RxFirebaseView.prototype.endAt = function (value, key) {
        var newQuery = this.query.endAt(value, key);
        return new RxFirebaseView(newQuery);
    };
    RxFirebaseView.prototype.equalTo = function (value, key) {
        var newQuery = this.query.equalTo(value, key);
        return new RxFirebaseView(newQuery);
    };
    RxFirebaseView.convertToString = function (eventType) {
        switch (eventType) {
            case EventType.CHILD_ADDED:
                return "child_added";
            case EventType.CHILD_CHANGED:
                return "child_changed";
            case EventType.CHILD_MOVED:
                return "child_moved";
            case EventType.CHILD_REMOVED:
                return "child_removed";
            case EventType.VALUE:
                return "value";
            default:
                break;
        }
    };
    return RxFirebaseView;
}());
exports.RxFirebaseView = RxFirebaseView;
