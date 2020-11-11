import React from 'react';
import Event from '../Event/Event';

import {getCurrentMonth,getCurrentYear,getCurrentDay} from "../../../helpers";
class Day extends React.Component{
    state = {
        hovered:false
    }
    constructor(props){
        super(props);
    }
    toggleOverFlow = () =>{
        this.setState({hovered: !this.state.hovered});
    }
    render(){
        var dayStyle = {
            overflow:"hidden"
        }
        var spanStyle={};
        let today = new Date();
        let currentDay = String(today.getDate()).padStart(2, '0');

        if(this.props.currentView.month == getCurrentMonth() &&
            this.props.currentView.year == getCurrentYear() &&
            this.props.day == currentDay){
                spanStyle = {
                    background:'#35ACF7',
                    height:'25px',
                    width:'25px',
                    color:'white',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '1em',
                    borderRadius: '50%',
                    verticalAlign: 'middle'
                }
        }
        if(this.state.hovered){
            dayStyle.overflow = "visible";
        }
        return(
            <>
              {!this.props.isZindex?
                <div className="day" style={dayStyle} onMouseEnter={this.toggleHover} 
                    onMouseLeave={this.toggleHover}>
                    <span style={spanStyle}>{this.props.day}</span>
                    <Event eventClickHandler={this.props.eventClickHandler} 
                        events={this.props.events} toggleOverFlow = {this.toggleOverFlow} 
                        day={this.props.dayIndex} toggleZIndex={this.props.toggleZIndex}/>
                </div>
                :
                <div className="day" style={{zIndex:-1}} onMouseEnter={this.toggleHover} 
                    onMouseLeave={this.toggleHover}>
                    
                </div>
                }
            </>
        )
    }
}
export default Day;