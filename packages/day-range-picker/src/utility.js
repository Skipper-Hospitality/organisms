// const hasEventListeners = !!window.addEventListener;

export const extend = function (to, from, overwrite) {
    let prop, hasProp;
    for (prop in from) {
        hasProp = to[prop] !== undefined;
        if (
            hasProp &&
            typeof from[prop] === "object" &&
            from[prop] !== null &&
            from[prop].nodeName === undefined
        ) {
            if (isDate(from[prop])) {
                if (overwrite) {
                    to[prop] = new Date(from[prop].getTime());
                }
            } else if (Array.isArray(from[prop])) {
                if (overwrite) {
                    to[prop] = from[prop].slice(0);
                }
            } else {
                to[prop] = extend({}, from[prop], overwrite);
            }
        } else if (overwrite || !hasProp) {
            to[prop] = from[prop];
        }
    }
    return to;
};

export const isDate = function (obj) {
    return (
        /Date/.test(Object.prototype.toString.call(obj)) &&
        !isNaN(obj.getTime())
    );
};

export const isLeapYear = function (year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const isHidden = (el) => {
    return el.offsetParent === null;
};

export const inBetween = function (start, end, date) {
    return end.getTime() > date.getTime() && date.getTime() > start.getTime();
};

export const addEvent = function (el, e, callback, capture) {
    if (!!window.addEventListener) {
        el.addEventListener(e, callback, !!capture);
    } else {
        el.attachEvent("on" + e, callback);
    }
};

export const removeEvent = function (el, e, callback, capture) {
    if (!!window.addEventListener) {
        el.removeEventListener(e, callback, !!capture);
    } else {
        el.detachEvent("on" + e, callback);
    }
};

export const addClass = function (el, cn) {
    if (!hasClass(el, cn)) {
        el.className = el.className === "" ? cn : el.className + " " + cn;
    }
};

export const removeClass = function (el, cn) {
    el.className = trim(
        (" " + el.className + " ").replace(" " + cn + " ", " ")
    );
};

export const hasClass = function (el, cn) {
    return (" " + el.className + " ").indexOf(" " + cn + " ") !== -1;
};

export const trim = function (str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
};

export const getDaysInMonth = function (year, month) {
    return [
        31,
        isLeapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ][month];
};

export const setToStartOfDay = function (date) {
    if (isDate(date)) date.setHours(0, 0, 0, 0);
};

export const compareDates = function (a, b) {
    return a.getTime() === b.getTime();
};
