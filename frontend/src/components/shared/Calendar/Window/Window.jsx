import React from 'react';
import {Row,Col,Button} from 'reactstrap';
// import {deleteMedEventById} from '../../../api/calendar/Event'

import EditWindow from './EditWindow/EditWindow';

class Window extends React.Component{
    state = {
        isEdit:false,
        medicationSelected:null,
        dateSelected:null,
        isAwaySelected:null,
        notesSelected:null
    }
    fillState = (medication,date,isAway,notes) =>{
        let newState = this.state;
        newState.medicationSelected = medication;
        newState.dateSelected = date;
        newState.isAwaySelected = isAway;
        newState.notesSelected = notes;
        this.setState(newState);
    }
    
    constructor(props){
        super(props);
        this.fillState(this.props.event.rxsMedication,this.props.event.event.event.timeStamp,this.props.event.event.isAway,
            this.props.event.event.notes);

    }
    toggleEdit = () =>{
        let newState = this.state;
        newState.isEdit = !newState.isEdit;
        this.setState(newState);
    }
    deleteHandler = async()=>{
        var id = this.props.event.event._id;
        var jwt = localStorage.getItem("JWT");
        // deleteMedEventById(id,jwt,(res)=>{
        //     if(res.error){
        //         var error = res.error;
        //         if(typeof(res.error)=='object'){
        //             error = JSON.stringify(error);
        //         }
        //         this.props.updateEvents();
        //         this.props.closeWindow();
        //     }else{
        //         this.props.updateEvents();
        //         this.props.closeWindow();
        //     }
        // });
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
        const medicationName = this.props.event.rxsMedication.name;

        var date = new Date(this.props.event.event.event.timeStamp);
        var mm = date.getMonth()+1;
        var yyyy = date.getFullYear();
        var dd = date.getDate();
        const dateGiven = mm+"/"+dd+"/"+yyyy;


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
        return(
            <>  {this.state.isEdit?
                    <EditWindow {...this.props} toggleEdit={this.toggleEdit}/>
                :

                <Row>
                    <Col lg="10">
                        <h3>{name}</h3>
                    </Col>
                    <Col lg="2">
                        <i className="fas fa-times" style={exitStyle}/>
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
                        <p style={{fontSize:'15px'}}>Date Given:   {dateGiven}</p>
                    </Col>
                    <Col lg="12">
                        <p style={{fontSize:'15px'}}>Is Away:   {isAway}</p>
                    </Col>
                    <Col lg="12">
                        <p style={{fontSize:'15px'}}>Notes:   <span style={{fontSize:'13px'}}>{notes}</span></p>
                    </Col>
                    <Col lg="6">
                        <Button onClick={this.toggleEdit} style={{width:'100%',marginBottom:'20px',background:"#f6c23e"}}>Edit</Button>
                    </Col>
                    <Col lg="6">
                        <Button onClick={this.deleteHandler} style={{width:'100%',marginBottom:'20px',background:"#FF0000"}}>Delete</Button>
                    </Col>
                </Row>}
            </>
        )
    }
}

export default Window;