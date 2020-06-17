import React from 'react';
import Event from '../Event/Event';
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
        if(this.state.hovered){
            dayStyle.overflow = "visible";
        }
        return(
            <>
              {!this.props.isZindex?
                <div className="day" style={dayStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                    {this.props.day}
                    <Event eventClickHandler={this.props.eventClickHandler} events={this.props.events} toggleOverFlow = {this.toggleOverFlow} day={this.props.dayIndex} toggleZIndex={this.props.toggleZIndex}/>
                </div>
                :
                <div className="day" style={{zIndex:-1}} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                    
                </div>
                }
            </>
        )
    }
}
export default Day;