import { toggleLoading } from '../actions/loading';
import { API_URI } from '../config/variables';

export function getAge(date) {
    let birthday = +new Date(date);
    date = ~~((Date.now() - birthday) / (31557600000));

    return date;
}
export function formateDate(date) {
    let d = new Date(date);
    d = d.getMonth() + 1 + '/' + (d.getDate()) + '/' + d.getFullYear();

    return d;
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
    if (type == "POST") {
        fetchObj.body = JSON.stringify(body);
    } else if (type == "PATCH") {
        fetchObj.body = {
            updatedFields: JSON.stringify(body)
        }
    }
    let uri = API_URI + url;
    if(jwt){
        uri = uri + jwt;
    }
    console.log(jwt)
    console.log(uri)
    fetch(uri, fetchObj)
        .then(res => res.json())
        .then(res => {
            if (isLoading) {
                dispatch(toggleLoading(false));
            }
            if (res.error) {
                done(res.error);
            } else if (done) {
                done(null, res);
            }
        });
}