import React from 'react';
import Calendar from "../../components/Calendar/Calendar";
import {getAllMedEvents} from "../../api/calendar/Calendar";
import {Alert} from 'reactstrap';

class ViewCalendar extends React.Component{
    state = {
        events:[],
        madeReq:false,
        error:{
            display:false,
            msg:null
        }
    }
    getEvents = async(error) =>{
        if(error){
            let newState = this.state;
            newState.error.display = true;
            newState.error.msg = error;
            this.setState(newState);
            this.setTimerForError();
        }else{
            let newState = this.state;
            var jwt = localStorage.getItem('JWT');
            let res = await getAllMedEvents(jwt);
            if(res.error){
                await this.getEvents(res.error);
            }else{
                newState.events = res;
                newState.madeReq = true;
                this.setState(newState);
                this.forceUpdate();
            }
        }
    }
    setTimerForError = () =>{
        let newState = this.state;
        newState.error.display = false;
        setTimeout(() => {
          this.setState(newState);
        }, 7000)
      }
    componentDidMount(){
        this.getEvents();
    }
    render(){
        return(
            <>
                {this.state.error.display?<Alert color="danger">{this.state.error.msg}</Alert>:<Alert className="d-none" color="danger">{this.state.error.msg}</Alert>}
                {this.state.madeReq && !this.state.error.display?
                    <Calendar events={this.state.events} updateEvents={this.getEvents}/>
                :   null}
            </>
        )
    }
}

export default ViewCalendar;