import React from 'react';
import {Row,Col,Button,Input,Label} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {updateEvent} from "../../../../api/calendar/Calendar"
class EditWindow extends React.Component{
    state = {
        dateGiven:null,
        isAway:null,
        notes:null
    }
    constructor(props){
        super(props);
        let newState = this.state;

        var date = new Date(this.props.event.event.event.timeStamp);
        var mm = date.getMonth()+1;
        var yyyy = date.getFullYear();
        var dd = date.getDate();
        var dateGiven = yyyy+"-"+mm+"-"+dd;
        newState.dateGiven = dateGiven;

        newState.isAway = this.props.event.event.isAway.toString();
        newState.notes = this.props.event.event.notes;
        this.setState(newState);
    }
    dateChangeHandler = (e) =>{
        let newState = this.state;
        newState.dateGiven = e.target.value
        this.setState(newState)
    }
    isAwayHandler = (e) =>{
        let newState = this.state;
        newState.isAway = e.target.value
        this.setState(newState)
    }
    noteHandler = (e) =>{
        let newState = this.state;
        newState.notes = e.target.value;
        this.setState(newState);
    }
    submitHandler = async() =>{
        var dtstr = this.state.dateGiven;
        var date = new Date(dtstr);
        date.setDate(date.getDate()+1);
        var obj = {
            isAway:this.state.isAway,
            notes:this.state.notes,
            event:{
                timeStamp:date
            }
        }
        var id = this.props.event.event._id;
        var jwt = localStorage.getItem("JWT");
        await updateEvent(obj,jwt,id,(res)=>{
            if(res.error){
                var error = res.error;
                if(typeof(res.error)=='object'){
                    error = JSON.stringify(error);
                }
                this.props.updateEvents();
                this.props.closeWindow();
            }else{
                this.props.updateEvents();
                this.props.closeWindow();
            }
        });
    }
    render(){
        const name = this.props.event.dependent.name.firstName + " " + 
        this.props.event.dependent.name.lastName;

        var dob = this.props.event.dependent.dateOfBirth;
        var year = dob.substr(0,4);
        var day = dob.substr(5,2);
        var month = dob.substr(8,2);
        dob = day+"-"+month+"-"+year;

        const isAway = this.props.event.event.isAway.toString();
        var otherOption = true;
        if(isAway == "true"){
            otherOption = false;
        }
        const medicationName = this.props.event.rxsMedication.name;

        var date = new Date(this.props.event.event.event.timeStamp);
        var mm = date.getMonth()+1;
        var yyyy = date.getFullYear();
        var dd = date.getDate();
        var dateGiven = yyyy+"-"+mm+"-"+dd;

        var notes = null;

        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        if(typeof(this.props.event.event.notes)!='undefined'){
        notes = this.props.event.event.notes;
        }

        const exitStyle = {
        cursor:'pointer',
        fontSize:'20px',
        color:'#ff0000'
        }
        return(<>
                <Row>
                    <Col lg="10">
                        <h3>{name}</h3>
                    </Col>
                    <Col lg="2">
                        <FontAwesomeIcon onClick={this.props.closeWindow} style={exitStyle} icon={faTimes} />
                    </Col>
                    <Col lg="12" style={{marginLeft:'3px',marginTop:'-10px'}}>
                        <h6>(DOB:   {dob})</h6>
                    </Col>
                    <Col lg="12">
                        <hr style={{marginBottom:'10px',marginTop:'0'}}/>
                        <p style={{fontSize:'15px'}}>Event:   Given medication</p>
                    </Col>
                    <Col lg="12">
                        <p style={{fontSize:'15px'}}>Medication Name:   {medicationName}</p>
                    </Col>
                    <Col lg="12">
                        <p style={{fontSize:'15px'}}>Time Submitted:   {strTime}</p>
                    </Col>
                    {typeof(this.props.event.event.createdBy)!='undefined' && typeof(this.props.event.event.createdBy.name)!='undefined'?
                        <Col lg="12">
                            <p style={{fontSize:'15px'}}>Given By:   {this.props.event.event.createdBy.name.firstName+" "+this.props.event.event.createdBy.name.lastName}</p>
                        </Col>
                    :null}
                    <Col lg="12">
                        <Label>Date Given:</Label>
                        <Input onChange = {this.dateChangeHandler} type="date" style={{color:'black'}} name="email" value={this.state.dateGiven}/>
                        {/* <p style={{fontSize:'15px'}}>Date Given:   {dateGiven}</p> */}
                    </Col>
                    <Col lg="12">
                        {/* <p style={{fontSize:'15px'}}>Is Away:   {isAway}</p> */}
                        <Label>Is Away:</Label>
                        <Input type="select" onChange={this.isAwayHandler}>
                            <option value={isAway}>{this.state.isAway}</option>
                            <option value={otherOption}>{otherOption.toString()}</option>
                        </Input>
                    </Col>
                    <Col lg="12" style={{marginTop:'10px'}}>
                        {/* <p style={{fontSize:'15px',marginTop:'10px'}}>Notes:   <span style={{fontSize:'13px'}}>{notes}</span></p> */}
                        <Label>Notes:</Label>
                        <Input type="text" onChange={this.noteHandler} style={{color:'black'}} name="email" value={this.state.notes}/>
                    </Col>
                    <Col lg="6" style={{marginTop:'10px'}}>
                        <Button onClick={this.submitHandler} style={{width:'100%',marginBottom:'20px',background:"#2DCE89"}}>Submit</Button>
                    </Col>
                    <Col lg="6" style={{marginTop:'10px'}}>
                        <Button onClick={this.props.toggleEdit} style={{width:'100%',marginBottom:'20px',background:"#FF0000"}}>Undo</Button>
                    </Col>
                </Row>
        </>)
    }

}
export default EditWindow;