"use strict";
var Rx_1 = require('rxjs/Rx');
(function (EventType) {
    EventType[EventType["CHILD_ADDED"] = 0] = "CHILD_ADDED";
    EventType[EventType["CHILD_REMOVED"] = 1] = "CHILD_REMOVED";
    EventType[EventType["CHILD_CHANGED"] = 2] = "CHILD_CHANGED";
    EventType[EventType["CHILD_MOVED"] = 3] = "CHILD_MOVED";
    EventType[EventType["VALUE"] = 4] = "VALUE";
})(exports.EventType || (exports.EventType = {}));
var EventType = exports.EventType;
var RxFirebase = (function () {
    function RxFirebase(query) {
        this.query = query;
    }
    Object.defineProperty(RxFirebase.prototype, "ref", {
        get: function () {
            return this.query.ref();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxFirebase.prototype, "uid", {
        get: function () {
            return this.ref.getAuth().uid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxFirebase.prototype, "authData", {
        get: function () {
            return this.ref.getAuth();
        },
        enumerable: true,
        configurable: true
    });
    RxFirebase.prototype.child = function (path) {
        return new RxFirebase(this.ref.child(path));
    };
    RxFirebase.prototype.unauth = function () {
        this.ref.unauth();
    };
    RxFirebase.prototype.rx_observeAuth = function () {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            var listener = function (authData) {
                subscriber.next(authData);
            };
            self.ref.onAuth(listener);
            return function () {
                self.ref.offAuth(listener);
            };
        });
    };
    RxFirebase.prototype.rx_remove = function () {
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
    RxFirebase.prototype.rx_push = function (data) {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            var newRef = self.ref.push(data, function (err) {
                if (err != null) {
                    subscriber.error(err);
                }
                else {
                    subscriber.next(new RxFirebase(newRef));
                    subscriber.complete();
                }
            });
            return function () {
            };
        });
    };
    RxFirebase.prototype.rx_set = function (data) {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            self.ref.set(data, function (err) {
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
    RxFirebase.prototype.rx_update = function (data) {
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
    RxFirebase.prototype.rx_authWithCustomToken = function (customToken) {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            self.ref.authWithCustomToken(customToken, function (err, authData) {
                if (err) {
                    subscriber.error(err);
                }
                else {
                    subscriber.next(authData);
                    subscriber.complete();
                }
            });
        });
    };
    RxFirebase.prototype.rx_observe = function (eventType) {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            var callback = function (snapshot, siblingKey) {
                subscriber.next(snapshot);
            };
            self.query.on(self.convertToString(eventType), callback, function (err) {
                subscriber.error(err);
            });
            return function () {
                self.query.off(self.convertToString(eventType), callback);
            };
        });
    };
    RxFirebase.prototype.rx_observeWithSiblingKey = function (eventType) {
        var self = this;
        return new Rx_1.Observable(function (subscriber) {
            var callback = function (snapshot, siblingKey) {
                var payload = {
                    snapshot: snapshot,
                    siblingKey: siblingKey
                };
                subscriber.next(payload);
            };
            self.query.on(self.convertToString(eventType), callback, function (err) {
                subscriber.error(err);
            });
            return function () {
                self.query.off(self.convertToString(eventType), callback);
            };
        });
    };
    RxFirebase.prototype.orderByChild = function (key) {
        var newQuery = this.query.orderByChild(key);
        return new RxFirebase(newQuery);
    };
    RxFirebase.prototype.orderByValue = function () {
        var newQuery = this.query.orderByValue();
        return new RxFirebase(newQuery);
    };
    RxFirebase.prototype.orderByPriority = function () {
        var newQuery = this.query.orderByPriority();
        return new RxFirebase(newQuery);
    };
    RxFirebase.prototype.limitToLast = function (limit) {
        var newQuery = this.query.limitToLast(limit);
        return new RxFirebase(newQuery);
    };
    RxFirebase.prototype.startAt = function (value, key) {
        var newQuery = this.query.startAt(value, key);
        return new RxFirebase(newQuery);
    };
    RxFirebase.prototype.endAt = function (value, key) {
        var newQuery = this.query.endAt(value, key);
        return new RxFirebase(newQuery);
    };
    RxFirebase.prototype.equalTo = function (value, key) {
        var newQuery = this.query.equalTo(value, key);
        return new RxFirebase(newQuery);
    };
    RxFirebase.prototype.convertToString = function (eventType) {
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
    return RxFirebase;
}());
exports.RxFirebase = RxFirebase;
