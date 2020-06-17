import React from 'react';

import Day from './Day/Day';
import DisabledDay from './DisabledDay/DisabledDay';

class Days extends React.Component{
    state = {
        zIndex:[]
    }
    constructor(props){
        super(props);
        let newState = this.state;
        for(var i=0;i<this.props.updateHandler().days.length;++i){
            newState.zIndex.push(false);
        }
        this.setState(newState);
    }
    toggleZIndex = (day,eventsLens) =>{
        let newState = this.state;
        if(eventsLens>1  && typeof(newState.zIndex[day+7])!='undefined'){
            day = day + 7;
            newState.zIndex[day] = !newState.zIndex[day];
        }
        if(eventsLens>2  && typeof(newState.zIndex[day+7])!='undefined'){
            day = day + 7;
            newState.zIndex[day] = !newState.zIndex[day];
        }
        if(eventsLens>4  && typeof(newState.zIndex[day+7])!='undefined'){
            day = day + 7;
            newState.zIndex[day] = !newState.zIndex[day];
        }
        if(eventsLens>7  && typeof(newState.zIndex[day+7])!='undefined'){
            day = day + 7;
            newState.zIndex[day] = !newState.zIndex[day];
        }
        if(eventsLens>10  && typeof(newState.zIndex[day+7])!='undefined'){
            day = day + 7;
            newState.zIndex[day] = !newState.zIndex[day];
        }
        if(eventsLens>13 && typeof(newState.zIndex[day+7])!='undefined'){
            day = day + 7;
            newState.zIndex[day] = !newState.zIndex[day];
        }
        this.setState(newState);
    }
    
    render(){
        const list = () =>{
            return this.props.updateHandler().days.map((day,key)=>{
                var htmlDay = <Day eventClickHandler={this.props.eventClickHandler} day={day.day} dayIndex={key} events={day.events} isZindex={this.state.zIndex[key]} toggleZIndex={this.toggleZIndex}/>;
                if(day.isDisabled){
                    htmlDay = <DisabledDay day={day.day} dayIndex={key} events={day.events} isZindex={this.state.zIndex[key]}/>
                }
                 return htmlDay
            });
        }
        return(
            <>   
                {list()}
            </>
        )
    }
}
export default Days;