import React from 'react';
import { FormGroup, Label, Input, Col, Row, FormFeedback } from 'reactstrap';
export default class AddOTC extends React.Component{
    constructor(props){
        super(props);
    }
    render(){

        return(
            <Row>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="mname">Medication Name</Label>
                        <Input type="text" name="mname" id={"mname"} value={this.props.data.body[0].value} onChange={(e)=>{this.props.data.body[0].onChange(e,true,this.props.index)}} placeholder="Medication Name" required invalid={this.props.data.body[0].errorMsg.length>0}/>
                        {this.props.data.body[0].errorMsg?<FormFeedback>{this.props.data.body[0].errorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
            </Row>
        );
    }
}