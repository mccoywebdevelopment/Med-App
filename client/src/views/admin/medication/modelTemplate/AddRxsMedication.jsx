import React from 'react';
import { FormGroup, Label, Input, Col, Row, FormFeedback } from 'reactstrap';
export default class AddRxsMedication extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Row>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="mname">Medication Name</Label>
                        <Input type="text" name="mname" id={"mname"} placeholder="Medication Name" required value={this.props.data[0].value} invalid={this.props.data[0].errorMsg.length>0} onChange={(e)=>{this.props.data[0].onChange(e,this.props.itemKey,this.props.rxsMedKey,0)}}/>
                        {this.props.data[0].errorMsg.length>0?<FormFeedback>{this.props.data[0].errorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="mname">Reason</Label>
                        <Input type="text" name="mname" placeholder='Reason' id={"mname"} required value={this.props.data[1].value} invalid={this.props.data[1].errorMsg.length>0} onChange={(e)=>{this.props.data[1].onChange(e,this.props.itemKey,this.props.rxsMedKey,1)}}/>
                        {this.props.data[1].errorMsg.length>0?<FormFeedback>{this.props.data[1].errorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="mname">Dosage</Label>
                        <Input type="number" name="mname" id={"mname"} placeholder="0.00" value={this.props.data[5].value} invalid={this.props.data[5].errorMsg.length>0} onChange={(e)=>{this.props.data[5].onChange(e,this.props.itemKey,this.props.rxsMedKey,5)}}/>
                        {this.props.data[5].errorMsg.length>0?<FormFeedback>{this.props.data[5].errorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="mname">Units</Label>
                        <Input type="select" name="select" id="exampleSelect" value={this.props.data[6].value} invalid={this.props.data[6].errorMsg.length>0} onChange={(e)=>{this.props.data[6].onChange(e,this.props.itemKey,this.props.rxsMedKey,6)}}>
                            <option selected value=''>----select an option----</option>
                            <option>pill(s)</option>
                            <option>Milligram(mg)</option>
                            <option>Milliliter(mL)</option>
                        </Input>
                        {this.props.data[6].errorMsg.length>0?<FormFeedback>{this.props.data[6].errorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="mname">Date Prescribed</Label>
                        <Input type="date" name="mname" id={"mname"} required value={this.props.data[2].value} invalid={this.props.data[2].errorMsg.length>0} onChange={(e)=>{this.props.data[2].onChange(e,this.props.itemKey,this.props.rxsMedKey,2)}}/>
                        {this.props.data[2].errorMsg.length>0?<FormFeedback>{this.props.data[2].errorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="mname">Instructions (optional)</Label>
                        <Input type="text" name="text" id="exampleSelect" placeholder='Instructions' value={this.props.data[3].value} invalid={this.props.data[3].errorMsg.length>0} onChange={(e)=>{this.props.data[3].onChange(e,this.props.itemKey,this.props.rxsMedKey,3)}}/>
                        {this.props.data[3].errorMsg.length>0?<FormFeedback>{this.props.data[3].errorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="mname">End Date (optional)</Label>
                        <Input type="date" name="mname" id={"mname"}  required value={this.props.data[4].value} invalid={this.props.data[4].errorMsg.length>0} onChange={(e)=>{this.props.data[4].onChange(e,this.props.itemKey,this.props.rxsMedKey,4)}}/>
                        {this.props.data[4].errorMsg.length>0?<FormFeedback>{this.props.data[4].errorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
                <Col lg={6}>
                    <FormGroup>
                        <Label for="mname">When to Take (optional)</Label>
                        <Input type="select" name="select" id="exampleSelect" value={this.props.data[7].value} invalid={this.props.data[7].errorMsg.length>0} onChange={(e)=>{this.props.data[7].onChange(e,this.props.itemKey,this.props.rxsMedKey,7)}}>
                            <option selected value=''>----select an option----</option>
                            <option>morning</option>
                            <option>afternoon</option>
                            <option>evening</option>
                        </Input>
                        {this.props.data[7].errorMsg.length>0?<FormFeedback>{this.props.data[7].errorMsg}</FormFeedback>:null}
                    </FormGroup>
                </Col>
            </Row>
        );
    }
}