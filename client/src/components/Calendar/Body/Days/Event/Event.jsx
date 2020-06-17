import React from 'react';
import ReactDOM from 'react-dom'

import Expand from './Expand/Expand';
import UnExpand from './UnExpand/UnExpand';
import FadeEvent from './FadeEvent/FadeEvent';

class Event extends React.Component{
    state = {
        expand:false
    }
    constructor(props){
        super(props);
    }
    expandHandler = (day) =>{
        this.props.toggleZIndex(day,this.props.events.length)
        let newState = this.state;
        newState.expand = !newState.expand;
        this.setState(newState);
        this.props.toggleOverFlow();
    }
    render(){
        //eventClickHandler={this.props.eventClickHandler}
        const ExpandedElements = () =>{
            return this.props.events.map((event,eventKey)=>{
                var eventObj = event;
                var depName = eventObj.dependent.name.firstName+" "+eventObj.dependent.name.lastName;
                var medName = eventObj.rxsMedication.name;
                return(
                    <div onClick={this.props.eventClickHandler.bind(this,event)} className="my-task-container" style={{background:'#fcfcfc'}}>
                            <div className="my-task-title">
                            {depName}
                        </div>
                        <div className="my-task-detail">
                            {medName}
                        </div>
                    </div>
                )
            });
        }
        const EventsHolder = () =>{
            var eventObj = this.props.events[0];
            if(typeof(this.props.events[0])!='undefined' && this.props.events[0]){
                var depName = eventObj.dependent.name.firstName+" "+eventObj.dependent.name.lastName;
                var medName = eventObj.rxsMedication.name;
                var expand = null;
                if(this.props.events.length>1){
                    expand = <Expand expandHandler={this.expandHandler} day={this.props.day} length={this.props.events.length}/>
                }
                return(
                    <>
                        <div onClick={this.props.eventClickHandler.bind(this,eventObj)} className="my-task-container">
                                <div className="my-task-title">
                                {depName}
                            </div>
                            <div className="my-task-detail">
                                {medName}
                            </div>
                        </div>
                        {expand}
                    </>
                )
            }else{
                return null;
            }
        }
        return(
            <>
                {!this.state.expand?
                    EventsHolder()
                :
                    <>
                        {ExpandedElements()}
                        {<UnExpand expandHandler={this.expandHandler} day={this.props.day} length={this.props.events.length}/>}
                    </>

                }

            </>
        )
    }
}
export default Event;