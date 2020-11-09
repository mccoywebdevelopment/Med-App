import React from 'react';

import WeekDaysLabel from './WeekDaysLabel/WeekDaysLabel';
import Days from './Days/Days';
class CalendarBody extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount = () =>{

    }
    render(){
        return(
            <>
                <div className="calendar">
                    <WeekDaysLabel/>
                    <Days {...this.props}/>
                </div>
            </>
        )
    }
}
export default CalendarBody;