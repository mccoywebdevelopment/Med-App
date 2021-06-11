import { toggleLoading } from '../actions/loading';
import { API_URI } from '../config/variables';
import moment from 'moment';
import 'moment-timezone';
import { store } from '../store';

let timezone = store.getState().settings.timeZone;

export function getAge(date) {
    let birthday = +new Date(date);
    date = ~~((Date.now() - birthday) / (31557600000));

    return date;
}
export function formatAMPM(date) {
    // date = new Date(date);
    // var hours = date.getHours();
    // var minutes = date.getMinutes();
    // var ampm = hours >= 12 ? 'PM' : 'AM';
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    // minutes = minutes < 10 ? '0' + minutes : minutes;
    // var strTime = hours + ':' + minutes + ' ' + ampm;
    // return strTime;
    let str = "";
    str = str + date.toString();
    console.log(str);
    console.log(moment("2021-06-11T13:31:00.000").format("hh:mm a"))
    return moment(str).tz('America/Phoenix').format("hh:mm a")
}
export function isMonth(someDate){
    if (!someDate) {
        return false;
    }
    someDate = new Date(someDate);
    let today = new Date();
    return (someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear())
}
export function isToday(someDate) {
    if (!someDate) {
        return false;
    }
    someDate = new Date(someDate);
    let today = new Date();
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}
export function formateDate(date) {
    if (date) {

        let d = new Date(date);
        d = d.getMonth() + 1 + '/' + (d.getDate()) + '/' + d.getFullYear();

        if (d.toString().includes('T')) {
            d = d.toString().split('T')[0];
        }
        return d;


    } else {
        return null;
    }
}
export function convertLocalToUTC(dateTimeLocal){
    return moment.tz(dateTimeLocal,"America/Phoenix").format();
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
export function isBetween(time, start, end) {
    let today = new Date(time);
    if (start <= today && today <= end) {
        return true
    }
    return false;
}
export function isLessThan(end) {
    let today = new Date();
    if (today <= end) {
        return true
    }
    return false;
}