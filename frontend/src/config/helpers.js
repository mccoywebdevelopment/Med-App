import { toggleLoading } from '../actions/loading';
import { API_URI, TIME_ZONE } from '../config/variables';
import moment from 'moment';
import 'moment-timezone';

export function getCurrentTime(date) {
    if (date) {
        return moment(date).tz(TIME_ZONE)
    } else {
        return moment().tz(TIME_ZONE)
    }
}

export function getAge(date) {
    if (date) {
        let birthday = +new Date(date);
        date = ~~((Date.now() - birthday) / (31557600000));

        return date;
    } else {
        return "";
    }
}
export function formatAMPM(date) {
    if (date) {
        date = new Date(date);
        let str = "";
        str = str + date.toISOString();
        return moment(str).tz(TIME_ZONE).format("hh:mm a")
    } else {
        return ""
    }
}
export function getTime(date) {

    if (date) {
        date = new Date(date);
        let str = "";
        str = str + date.toISOString();
        date = moment(str).tz('America/Phoenix').format("HH:mm")
        return date
    } else {
        return ""
    }
}
export function isMonth(someDate) {
    if (!someDate) {
        return false;
    }
    someDate = new Date(someDate);
    let today = new Date();
    return (someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear())
}
export function formateDate(date) {
    if (date) {
        date = new Date(date);
        let d = date.toISOString();
        if (d.includes('T')) {
            d = d.split('T')[0];
        }
        d = d.split('-');
        let mm = d[1];
        let dd = d[2];
        let yyyy = d[0];

        return (mm + "/" + dd + "/" + yyyy);
    } else {
        return null;
    }
}
export function convertLocalToUTC(dateTimeLocal) {
    return moment.tz(dateTimeLocal, "America/Phoenix").format();
}

export function convertToDateInput(date) {
    if (date) {
        let d = new Date(date);
        d = d.toISOString();
        if (d.includes('T')) {
            d = d.split('T')[0];
        }
        d = d.split('-');
        let mm = d[1];
        let dd = d[2];
        let yyyy = d[0];
        let str = yyyy + "-" + mm + "-" + dd
        return (str)
    } else {
        return "";
    }
}

export function getPath(window, index) {
    let arr = window.location.pathname.split('/');
    if (!index) {
        return arr;
    } else if (index == "end") {
        return arr[arr.length - 1];
    } else {
        return arr[index];
    }
}
export function getPaths(window) {
    return window.location.pathname.split('/');
}
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function reduceFraction(numerator, denominator) {
    if (denominator == 0) {
        return [numerator, 0];
    }
    var gcd = function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
    };
    gcd = gcd(numerator, denominator);
    return [numerator / gcd, denominator / gcd];
}

export function FETCH(type, url, body, jwt, dispatch, isLoading, done) {
    if (isLoading) {
        dispatch(toggleLoading(true));
    }
    let fetchObj = {
        method: type,
        headers: {
            'content-type': 'application/json'
        }
    }
    if (body && type == "POST" || type == "PATCH") {
        fetchObj.body = JSON.stringify(body);
    }
    let uri = API_URI + url;
    if (jwt) {
        uri = uri + jwt;
    }
    fetch(uri, fetchObj)
        .then(res => {
            return res.json();
        })
        .then(res => {
            if (isLoading) {
                dispatch(toggleLoading(false));
            }
            if (done && res && res.error) {
                done(res.error);
            } else if (done && res) {
                done(null, res);
            } else {
                done(null, null)
            }
        });
}
export function formatDateHome(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
export function convertDateHandler(date) {
    if (date) {
        date = new Date(date);
    } else {
        date = new Date();
    }
    let str = "";
    str = str + date.toISOString();
    return moment(str).tz('America/Phoenix').format()
}
export function getBodyForRxsMedEvent(wasAdministered, notes, reason, dateTaken, guardianID) {
    let reasonbod = "";
    let body = {};
    if (!wasAdministered) {
        reasonbod = reason;
    }
    if (guardianID) {
        body.guardianID = guardianID;
    }
    if (dateTaken) {
        body.dateTaken = dateTaken;
    }
    body.notes = notes;
    body.wasAdministered = wasAdministered
    body.reason = reasonbod;
    return body;
}

export function isLessThan(end) {
    let today = getCurrentTime();
    end = getCurrentTime(end)
    if (today <= end) {
        return true
    }
    return false;
}
export function isGreatorThan(end) {
    let today = getCurrentTime();
    end = getCurrentTime(end)
    if (today >= end) {
        return true
    }
    return false;
}
export function isToday(someDate) {
    if (!someDate) {
        return false;
    }
    someDate = getCurrentTime(someDate);
    let today = getCurrentTime();
    let bool = someDate.isSame(today, "day");
    return bool
}
export function isBetween(time, start, end) {

    let today = new Date(time);
    end = new Date(end);
    start = new Date(start);

    console.log(today);
    console.log(start);
    console.log(end);

    if (start <= today && today <= end) {
        return true
    }
    return false;
}