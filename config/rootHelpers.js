let TIME_ZONE = process.env.TIME_ZONE || require('./configVars').TIME_ZONE;
const moment = require('moment-timezone');

function getCurrentTime(date){
    if(date){
        return moment(date).tz(TIME_ZONE)
    }else{
        return moment().tz(TIME_ZONE)
    }
}

module.exports = { getCurrentTime }