import { toggleLoading } from '../actions/loading';
import { CHANGE_CURRENT_URL, CHANGE_REDIRECT_URL} from '../actions/types';
import { API_URI } from '../config/variables';
import {store} from '../store';

let timezone = store.getState().settings.timeZone;

export function getAge(date) {
    let birthday = +new Date(date);
    date = ~~((Date.now() - birthday) / (31557600000));

    return date;
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
export function toInputDate(date){
    if(typeof(date)=='string'){
        console.log(date);
        let date1 = date.split('-');
        if(date1[2] && date1[2].length == 4){
            date = date1[2] + "-" + date1[0] + '-' + date1[1];
        }
    }

    return date;
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
export function getPaths(window){
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
            if(res.status >= 400 && (!jwt || jwt.length<1)) {
                alert(true)
                dispatch({
                    type: CHANGE_CURRENT_URL,
                    payload:String(window.location)
                  });
                  dispatch({
                    type: CHANGE_REDIRECT_URL,
                    payload:"/auth/login"
                  });
                  return false;
            }else{
                return res.json();
            }
        })
        .then(res => {
            if (isLoading) {
                dispatch(toggleLoading(false));
            }
            if (done && res && res.error) {
                done(res.error);
            } else if (done && res) {
                done(null, res);
            }else{
                done(null,null)
            }
        });
}

// let options = {
//     timeZone: 'America/New_York',
//     year: 'numeric',
//     month: 'numeric',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//   },
//   formatter = new Intl.DateTimeFormat([], options);

// console.log(formatter.format(new Date()));