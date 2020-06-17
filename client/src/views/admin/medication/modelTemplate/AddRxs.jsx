import React from 'react';
import { Button, FormGroup, Label, Input, Col, Row, FormFeedback } from 'reactstrap';

import AddRxsMedication from '../modelTemplate/AddRxsMedication';

export default class AddRxs extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const rxsMeds = () =>{
            return this.props.data.body.medications.map((rxsMed,key)=>{
                return(
                    <div name={"itemkjljlkj"} className="item-cover" style={{background:"#eff2f2"}}>
                        <div className="row">
                            <div className="col">
                                <h3>Rxs Medication #{key+1}</h3>
                            </div>
                            <div className="col">
                                <button type="button" style={{float:'right'}} className="close" onClick={(e)=>{this.props.deleteRxsMed(this.props.itemKey,key)}} aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                        </div>
                        <hr></hr>
                        <AddRxsMedication itemKey={this.props.itemKey} rxsMedKey={key} data={rxsMed.body}/>
                    </div>
                    
                );
            });
        }
        return(
            <Row>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="dfname">Doctor's First Name</Label>
                        <Input type="text" name="dfname" id={"dfname"} placeholder="First Name" required  value={this.props.data.body.docFname} invalid={this.props.data.body.docFnameErrorMsg.length>0} onChange={(e)=>{this.props.toggleRxsChange(e,null,true,null,null,this.props.itemKey)}}/>
                        {this.props.data.body.docFnameErrorMsg.length>0?<FormFeedback>{this.props.data.body.docFnameErrorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="dlname">Doctor's Last Name</Label>
                        <Input type="text" name="dlname" id={"dlname"} placeholder="Last Name" required value={this.props.data.body.docLname} invalid={this.props.data.body.docLnameErrorMsg.length>0} onChange={(e)=>{this.props.toggleRxsChange(e,null,null,true,null,this.props.itemKey)}}/>
                        {this.props.data.body.docLnameErrorMsg.length>0?<FormFeedback>{this.props.data.body.docLnameErrorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="dlnum">Doctor's Phone Number</Label>
                        <Input type="text" name="dlnum" id={"dlnum"} placeholder="Phone Number" required value={this.props.data.body.docNum} invalid={this.props.data.body.docNumErrorMsg.length>0} onChange={(e)=>{this.props.toggleRxsChange(e,null,null,null,true,this.props.itemKey)}}/>
                        {this.props.data.body.docNumErrorMsg.length>0?<FormFeedback>{this.props.data.body.docNumErrorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="rx">Rxs Number</Label>
                        <Input type="text" name="rx" id={"rx"} value={this.props.data.body.rxsNumber} invalid={this.props.data.body.rxsNumberErrorMsg.length>0} placeholder="Rxs Number" required onChange={(e)=>{this.props.toggleRxsChange(e,true,null,null,null,this.props.itemKey)}}/>
                        {this.props.data.body.rxsNumberErrorMsg.length>0?<FormFeedback>{this.props.data.body.rxsNumberErrorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
                <Col lg={12}>
                    {rxsMeds()}
                    <Button color="primary" onClick={(e)=>{this.props.addRxsMed(this.props.itemKey)}}>Add Medication</Button>
                </Col>
            </Row>
        );
    }
}