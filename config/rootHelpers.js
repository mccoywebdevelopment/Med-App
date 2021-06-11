let TIME_ZONE = process.env.TIME_ZONE || require('./configVars').TIME_ZONE;
function getCurrentTime(date){
    var here = new Date();
    if(date){
        here = new Date(date);
    }
    // var there = changeTimezone(here,TIME_ZONE);
    return here;
}
function changeTimezone(date, ianatz) {

    // suppose the date is 12:00 UTC
    var invdate = new Date(date.toLocaleString('en-US', {
        timeZone: ianatz
    }));

    // then invdate will be 07:00 in Toronto
    // and the diff is 5 hours
    var diff = date - invdate;

    // so 12:00 in Toronto is 17:00 UTC
    return new Date(date - diff); // needs to substract
}

module.exports = { getCurrentTime }