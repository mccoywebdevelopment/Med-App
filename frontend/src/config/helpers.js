import { toggleLoading } from '../actions/loading';
import { API_URI } from '../config/variables';

export function getAge(date) {
    let birthday = +new Date(date);
    date = ~~((Date.now() - birthday) / (31557600000));

    return date;
}
export function formateDate(date) {
    if(date){
        let d = new Date(date);
        d = d.getMonth() + 1 + '/' + (d.getDate()) + '/' + d.getFullYear();

        return d;
    }else{
        return null;
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
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function reduceFraction(numerator,denominator){
    if(denominator == 0){
        return[numerator,0];
    }
    var gcd = function gcd(a,b){
      return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);
    return [numerator/gcd, denominator/gcd];
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
    if (type == "POST" || type=="PATCH") {
        fetchObj.body = JSON.stringify(body);
    }
    let uri = API_URI + url;
    if(jwt){
        uri = uri + jwt;
    }
    fetch(uri, fetchObj)
        .then(res => res.json())
        .then(res => {
            if (isLoading) {
                dispatch(toggleLoading(false));
            }
            if (done && res.error) {
                done(res.error);
            } else if (done) {
                done(null, res);
            }
        });
}