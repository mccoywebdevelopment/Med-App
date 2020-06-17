import React from 'react';

import TodayBtn from './options/TodayBtn';
import NextBtn from './options/NextBtn';
import PrevBtn from './options/PrevBtn';

import {Row,Col} from 'reactstrap';

class CalendarHead extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <div className="calendar-header">
                    <Row>
                        <Col size={3}>
                            <PrevBtn prevHandler={this.props.prevHandler}/>
                        </Col>
                        <Col size={6}>
                            <h1>{this.props.month}</h1>
                            <p>{this.props.year}</p>
                            <TodayBtn todayHandler={this.props.todayHandler}/>
                        </Col>
                        <Col size={3}>
                            <NextBtn nextHandler={this.props.nextHandler}/>
                        </Col>
                    </Row>
                    {/* <h1>{this.props.month}</h1>
                    <p>{this.props.year}</p>
                    <TodayBtn todayHandler={this.props.todayHandler}/>
                    <PrevBtn prevHandler={this.props.prevHandler}/>
                    <NextBtn nextHandler={this.props.nextHandler}/> */}
                </div>
            </>
        )
    }
}
export default CalendarHead;