export function getAge(date){
    let birthday = +new Date(date);
    date = ~~((Date.now() - birthday) / (31557600000));

    return date;
}
export function formateDate(date){
    let d = new Date(date);
    d = d.getMonth()+1 + '/' + (d.getDate()) + '/' + d.getFullYear();
    
    return d;
}
