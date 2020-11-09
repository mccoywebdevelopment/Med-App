export function getCurrentYear(){
    var year = new Date().getFullYear();
    
    return year;
}
var index = 0;
export function getNameOfCurrentMonth(index){
    var month = new Date().getMonth();
    if(index){
        month = index-1;
    }
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                        ];


    return monthNames[month];
}
export function getCurrentMonth(){
    var month = new Date().getMonth()+1;

    return month;
}
export function getCurrentDay(){
    var day = new Date().getDay();

    return day;
}
export function getFullDate(){
    var mm = getCurrentMonth();
    var yyyy = getCurrentYear();
    var dd = getCurrentDay();
    var date = mm+"-"+dd+"-"+yyyy;

    return date;
}
export function daysInMonth(month, year){
    return new Date(year, month, 0).getDate();
}
export function getFirstDayOfTheWeek(month,year){
    //0-11
    if(month<1){
        month = 11;
    }
    var FirstDay = new Date(year, month-1, 1).getDay();

    var FirstDay = FirstDay + 1;

    if(FirstDay>7){
        FirstDay = 1;
    }

    return FirstDay;
}
export function getDaysArr(numOfDays,month,year,isDisabled,events){

    var days = [];
    var eventsArr = events
    for(var i=0;i<numOfDays;++i){
        var obj = filterEvents(eventsArr,month,year,i+1,index);
        eventsArr = obj.eventsArr;
        days.push({
            events:obj.events,
            day: i+1,
            month:month,
            year:year,
            isDisabled:isDisabled,
        });
    }
    return days;
}
function getColor(event,index){
    var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
          '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

    return colorArray[index]
}
export function filterEvents(eventsArr,month,year,day,colorIndex){
    var events = [];
    var newEventsArr = eventsArr;
    var obj = {
        events:null,
        eventsArr:null
    }
    var counter = 0;
    for(var i=0;i<eventsArr.length;++i){
        if(eventsArr[i]){
            var date = new Date(eventsArr[i].event.event.timeStamp);
            var mm = date.getMonth()+1;
            var yyyy = date.getFullYear();
            var dd = date.getDate();
            if(yyyy == year && mm == month && dd == day){
                events.push(eventsArr[i]);
            }
        }


    }
    obj.events = events;
    obj.eventsArr = newEventsArr;

    return obj;
}
