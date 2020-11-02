import React from 'react';

class WeekDaysLabel extends React.Component{
    render(){
        return(
            <>
                <span className="day-name">Sun</span>
                <span className="day-name">Mon</span>
                <span className="day-name">Tue</span>
                <span className="day-name">Wed</span>
                <span className="day-name">Thu</span>
                <span className="day-name">Fri</span>
                <span className="day-name">Sat</span>
            </>
        )
    }
}
export default WeekDaysLabel;