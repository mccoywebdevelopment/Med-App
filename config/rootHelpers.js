let TIME_ZONE = process.env.TIME_ZONE || require('./configVars').TIME_ZONE;
function getCurrentTime(date){
    var here = new Date();
    if(date){
        here = new Date(date);
    }
    // var there = changeTimezone(here,TIME_ZONE);
    return here;
}

module.exports = { getCurrentTime }