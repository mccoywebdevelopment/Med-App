import React from 'react';

import {Container,Row,Col,Card} from 'reactstrap';
import {getCurrentMonth, getCurrentYear,
    getNameOfCurrentMonth,daysInMonth, getDaysArr, getFirstDayOfTheWeek} from "./helpers";

import CalendarHead from "./Head/CalendarHead";
import CalendarBody from "./Body/CalendarBody";
import Window from "./Window/Window";

import './calendar.css';

class Calendar extends React.Component{
    state = {
        currentView:{},
        nextMonth:{},
        prevMonth:{},
        days:[],
        window:null
    }
    updateHandler = () =>{
        return this.state;
    }
    mySetState = (specState,month,yearParam) =>{
        let newState = this.state;
        var year = yearParam;
        if(!year){
            if(newState[specState].year){
                year = newState[specState].year;
            }else{
                year = getCurrentYear();
            }
        }
        if(month>12){
            month = 1;
            year = year + 1;
        }else if(month<1){
            year = year - 1;
            month = 12;
        }
        var isDisabled = false;
        if(specState == "prevMonth" || specState =="nextMonth"){
            isDisabled = true;
        }
        var monthName = getNameOfCurrentMonth(month);
        var numOfDays = daysInMonth(month,year);
        var firstDayOfTheMonth = getFirstDayOfTheWeek(month,year);
        var days = getDaysArr(numOfDays,month,year,isDisabled,this.props.events);

        newState[specState].month = month;
        newState[specState].monthName = monthName;
        newState[specState].year = year;
        newState[specState].numOfDays = numOfDays;
        newState[specState].firstDayOfTheMonth = firstDayOfTheMonth;
        newState[specState].days = days;
        newState.loaded = true;

        this.setState(newState);

        if(specState == "currentView"){
            this.mySetState("prevMonth",month-1);
            this.mySetState("nextMonth",month+1);
        }
        if(typeof(this.state.nextMonth.days)!='undefined' && this.state.nextMonth.days.length>0){
            this.formatDays();
        }

    }
    formatDays = () =>{
        let newState = this.state;
        var days = [];
        var counter = 0;
        for(var i=1;i<newState.currentView.firstDayOfTheMonth;++i){
            var index = newState.currentView.firstDayOfTheMonth - i;
            days.push(newState.prevMonth.days[newState.prevMonth.days.length-index]);
            counter++;
        }
        for(var i=0;i<newState.currentView.days.length;++i){
            days.push(newState.currentView.days[i]);
            counter++;
        }
        for(var i=0;counter<42;++i){
            days.push(newState.nextMonth.days[i]);
            counter++;
        }
        newState.days = days;
        this.setState(newState);
    }
    nextHandler = () =>{
        var month = this.state.currentView.month+1;
        this.mySetState("currentView",month)
        this.updateHandler();
    }
    prevHandler = () =>{
        var month = this.state.currentView.month-1;
        this.mySetState("currentView",month)
        this.updateHandler();
    }
    todayHandler = () =>{
        this.mySetState("currentView",getCurrentMonth(),getCurrentYear());
        this.updateHandler();
    }
    eventClickHandler = (event) =>{
        this.setState({window:event});

    }
    closeWindowHandler = () =>{
        this.setState({window:null});
    }
    updateEvents = async() =>
    {
        await this.props.updateEvents();
        this.mySetState("currentView",getCurrentMonth(),getCurrentYear());
    }
    constructor(props){
        super(props);
    }
    componentDidMount = () =>{
        this.mySetState("currentView",getCurrentMonth(),getCurrentYear());
    }
    render(){
        var containerStyle = null;
        if(this.state.window){
            containerStyle = {
                marginLeft:'0px',
                paddingLeft:'0px',
                paddingRight:'0px'
            }
        }
        const Calendar = () =>{
            return(
                <div className="calendar-container">
                    <CalendarHead month={this.state.currentView.monthName} year={this.state.currentView.year} 
                    nextHandler={this.nextHandler} prevHandler={this.prevHandler} todayHandler={this.todayHandler}/>
                    <CalendarBody eventClickHandler={this.eventClickHandler} updateHandler={this.updateHandler}/>
                </div>
            )
        }
        return(
            <>  
            <Container style={containerStyle}>
                    {this.state.loaded && !this.state.window?
                        Calendar()
                    :this.state.loaded?
                        <Row>
                            <Col lg="9">
                                {Calendar()}
                            </Col>
                            <Col lg="3" style={{paddingLeft:'0px',paddingRight:'0px'}}>
                                <Card style={{padding:'20px'}}>
                                    <Window closeWindow={this.closeWindowHandler} event={this.state.window} updateEvents={this.updateEvents}/>
                                </Card>
                            </Col>
                        </Row>
                    :null}
                </Container>
            </>

        )
    }
}

export default Calendar;