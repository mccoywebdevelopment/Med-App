import React from 'react';
import { Button, Form, FormGroup, Label, Input, Row, Col, FormText, Collapse, FormFeedback, ModalBody, ModalFooter } from 'reactstrap';
import {nameValidator,phoneNumberValidator} from "../../../../config/validator"
 

import AddRxs from './AddRxs';
import AddOTC from './AddOTC';

    export default class AddDependent extends React.Component{
        /*
        Add dependent,
        Add OTC
        Add Rxs
        Add Rxs
        */
    constructor(props){
        super(props);
        this.state = {
            items:[],
            firstName:"",
            lastName:"",
            dob:"",
            isAddDependent:this.props.isAddDependent,
            isAddRxs:this.props.isAddRxs,
    
            firstNameErrorMsg:"",
            lastNameErrorMsg:"",
            dobErrorMsg:""
        }
    }
    componentDidMount = () =>{
        if(this.props.isAddRxs){
            this.toggleAddRxs();
        }
    }
    onChangeRxs = (e,isRxsNumber,isDocFname,isDocLname,isDocNum,itemKey) =>{
        let newState = this.state;
        
        if(isRxsNumber){
            newState.items[itemKey].body.rxsNumber = e.target.value;
        }else if(isDocFname){
            newState.items[itemKey].body.docFname = e.target.value;
        }else if(isDocLname){
            newState.items[itemKey].body.docLname = e.target.value;
        }else{
            newState.items[itemKey].body.docNum = e.target.value;
        }

        this.setState(newState);
    }
    onChangeRxsMedication = (e,itemKey,medicationKey,bodyKey) =>{
        let newState = this.state;
        newState.items[itemKey].body.medications[medicationKey].body[bodyKey].value = e.target.value;

        this.setState(newState);
    }
    toggleAddRxs = () =>{
        let newState = this.state;
        let rxsMedBody = [{
            name:'name',
            value:'',
            errorMsg:'',
            isRequried:true,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'reason',
            value:'',
            errorMsg:'',
            isRequried:true,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'datePrecribed',
            value:'',
            errorMsg:'',
            isRequried:true,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'instructions',
            value:'',
            errorMsg:'',
            isRequried:false,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'endDate',
            value:'',
            errorMsg:'',
            isRequried:false,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'quantity',
            value:'',
            errorMsg:'',
            isRequried:true,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'unit',
            value:'',
            errorMsg:'',
            isRequried:true,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'whenToTake',
            value:'',
            errorMsg:'',
            isRequried:false,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        }];
        let rxsBody = {
            key:newState.items.length+1,
            rxsNumber:"",
            rxsNumberErrorMsg:'',
            docFname:"",
            docFnameErrorMsg:'',
            docLname:"",
            docLnameErrorMsg:'',
            docNum:"",
            docNumErrorMsg:'',
            medications:[{body:rxsMedBody}]
        }
        newState.items.push({isRxs:true,body:rxsBody});
        this.setState(newState);
    }
    toggleDeleteRxsMed = (itemIndex,rxsIndex) =>{
        let newState = this.state;
        newState.items[itemIndex].body.medications.splice(rxsIndex,1);
        this.setState(newState);
    }
    toggleAddRxsMed = (itemIndex,rxsIndex) =>{
        let newState = this.state;
        
        let rxsMedBody = [{
            name:'name',
            value:'',
            errorMsg:'',
            isRequried:true,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'reason',
            value:'',
            errorMsg:'',
            isRequried:true,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'datePrecribed',
            value:'',
            errorMsg:'',
            isRequried:true,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'instructions',
            value:'',
            errorMsg:'',
            isRequried:false,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'endDate',
            value:'',
            errorMsg:'',
            isRequried:false,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'quantity',
            value:'',
            errorMsg:'',
            isRequried:true,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'unit',
            value:'',
            errorMsg:'',
            isRequried:true,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        },{
            name:'whenToTake',
            value:'',
            errorMsg:'',
            isRequried:false,
            onChange:this.onChangeRxsMedication.bind(this),
            validator:nameValidator
        }];

        newState.items[itemIndex].body.medications.push({body:rxsMedBody});
        this.setState(newState);
    }
    onChangeOTC(e,isMedName,itemIndex){
        let newState = this.state;
        let item = newState.items[itemIndex];
        let found = false;
        if(isMedName){
            for(var i=0;i<item.body.length;++i){
                if(item.body[i].name == 'name'){
                    found = true;
                    item.body[i].value = e.target.value
                }
            }
            if(!found){
                alert("No item value was found that was named 'name'");
            }else{
                this.setState(newState);
            }
        }else{
            alert("No value was indicated");
        }
    }
    onChangeFname = (e) =>{
        let newState = this.state;
        var fname = e.target.value;
        newState.firstName = fname;
        this.setState(newState);
    }
    onChangeLname = (e) =>{
        let newState = this.state;
        var lname = e.target.value;
        newState.lastName = lname;
        this.setState(newState);
    }
    onChangeDOB = (e) =>{
        let newState = this.state;
        var dob = e.target.value;
        newState.dob = dob;
        this.setState(newState);
    }
    toggleDeleteItem = (key) =>{
        let newState = this.state;
        newState.items.splice(key,1);
        this.setState(newState);
    }
    toggleAddOTC = () =>{
        /*
        body = [{
            name:'name',
            value:'advil',
            validator:namevalidator
        }]
        */
        let newState = this.state;
        var body = [];
        body.push({
            name:'name',
            value:'',
            errorMsg:'',
            onChange:this.onChangeOTC.bind(this),
            validator:nameValidator
        });

        newState.items.push({
            isRxs:false,
            body:body
        });
        this.setState(newState);
    }
    rxsValidation = (itemKey) =>{
        let newState = this.state;
        let isValid = true;
        newState.items[itemKey].body.rxsNumberErrorMsg = nameValidator(newState.items[itemKey].body.rxsNumber,true).errorMsg;
        newState.items[itemKey].body.docFnameErrorMsg = nameValidator(newState.items[itemKey].body.docFname,true).errorMsg;
        newState.items[itemKey].body.docLnameErrorMsg = nameValidator(newState.items[itemKey].body.docLname,true).errorMsg;
        newState.items[itemKey].body.docNumErrorMsg = phoneNumberValidator(newState.items[itemKey].body.docNum,true).errorMsg;

        isValid = !this.rxsMedValidation(itemKey);
        
        if(newState.items[itemKey].body.rxsNumberErrorMsg.length>0 || newState.items[itemKey].body.docFnameErrorMsg.length>0 || 
            newState.items[itemKey].body.docLnameErrorMsg.length>0 || newState.items[itemKey].body.docNumErrorMsg.length>0){
                isValid = false

        }
        this.setState(newState);
        return isValid;
    }
    rxsMedValidation = (itemIndex) =>{
        let newState = this.state;
        let errorFound = false;
        for(var i=0;i<newState.items[itemIndex].body.medications.length;++i){
            for(var ix=0;ix<newState.items[itemIndex].body.medications[i].body.length;++ix){
                newState.items[itemIndex].body.medications[i].body[ix].errorMsg = 
                newState.items[itemIndex].body.medications[i].body[ix].validator(newState.items[itemIndex].body.medications[i].body[ix].value,
                newState.items[itemIndex].body.medications[i].body[ix].isRequried).errorMsg;

                if(newState.items[itemIndex].body.medications[i].body[ix].errorMsg.length>0){
                    errorFound = true;
                }
            }
        }
        this.setState(newState);
        return errorFound;
    }
    itemValidation = () =>{
        let newState = this.state;
        let items = newState.items;
        let errorFound = false;
        for(var i=0;i<items.length;++i){
            if(items[i].isRxs){
                if(!this.rxsValidation(i)){
                    errorFound = true;
                }
            }else{
                //OTC MED Validation
                // var name = items[i].body.name;
                // items[i].name
                for(var ix=0;ix<items[i].body.length;++ix){
                    let value = items[i].body[ix].value;
                    let validator = items[i].body[ix].validator;
                    let errMsg = items[i].body[ix].errorMsg;

                    errMsg = validator(value,true).errorMsg;
                    newState.items[i].body[ix].errorMsg = errMsg
                    if(errMsg.length>0){
                        errorFound = true;
                    }
                
                }
            }
        }
        this.setState(newState);
        if(errorFound){
            return false;
        }
        return true;
    }
    getBodyForRxs = (itemIndex) =>{
        //medications for current rxs
        var rxs = this.state.items[itemIndex].body;
        var medications = rxs.medications;
        // get rxs
        var obj = {
            rxsNumber:rxs.rxsNumber,
            firstName:rxs.docFname,
            lastName:rxs.docLname,
            phoneNumber:rxs.docNum,
            rxsMedication:[]
            // doctorContacts:{
            //     name:{
            //         firstName:rxs.docFname,
            //         lastName:rxs.docLname
            //     },
            //     phoneNumber:rxs.docNum
            // },
        }
        for(var i=0;i<medications.length;++i){
            obj.rxsMedication.push({
                name:medications[i].body[0].value,
                reason:medications[i].body[1].value,
                datePrescribed:medications[i].body[2].value,
                instructions:medications[i].body[3].value,
                endDate:medications[i].body[4].value,
                quantity:medications[i].body[5].value,
                unit:medications[i].body[6].value,
                value:medications[i].body[7].value
            });
        }
        return obj;
    }
    handleSave = () =>{
        let newState = this.state;

        if(!this.props.isAddRxs){
            newState.firstNameErrorMsg = nameValidator(newState.firstName,true).errorMsg;
            newState.lastNameErrorMsg = nameValidator(newState.lastName,true).errorMsg;
            newState.dobErrorMsg = nameValidator(newState.dob,true).errorMsg;
        }

        let isItemsValid = this.itemValidation();



        if(!newState.firstNameErrorMsg.length>0 && !newState.lastNameErrorMsg.length>0 && !newState.dobErrorMsg.length>0 && isItemsValid){
            var body = {
                firstName:newState.firstName,
                lastName:newState.lastName,
                dateOfBirth:newState.dob,
                medication:[],
                rxs:[]
            }
            for(var i=0;i<newState.items.length;++i){
                if(newState.items[i].isRxs){
                    body.rxs.push(this.getBodyForRxs(i));
                }else{
                    for(var ix=0;ix<newState.items[i].body.length;++ix){
                        var obj = {};
                        obj[newState.items[i].body[ix].name] = newState.items[i].body[ix].value;
                        body.medication.push(obj)
                    }
                }
            }
            if(this.props.isAddRxs){
                this.props.submitAddRxsToDep(this.props.isAddRxs,body.rxs);
                //this.props.submitAddRxsToDep(this.props.isAddRxs,body.rxs);
                //console.log(this.props);
            }else{
                this.props.submitDependent(body);
            }

        }else{
            alert('Please make the following changes highlighted in red.')
        }


        this.setState(newState);
    }
    render(){

        const list = () =>{
            var otcCount = 0;
            var rxsCount = 0;
            return this.state.items.map((item,key)=>{
                if(item.isRxs){
                    rxsCount++;
                }else{
                    otcCount++;
                }
                return(
                    <React.Fragment key={"lskjfls"+key}>

                            {item.isRxs?
                                <div name={"itemkjlj"+key} className="item-cover">
                                    <div className="row">
                                        <div className="col">
                                            <h3>Prescription #{rxsCount}</h3>
                                        </div>
                                        <div className="col">
                                            {!this.props.isAddRxs || key!=0?<button type="button" onClick={this.toggleDeleteItem.bind(null,key)} style={{float:'right'}} className="close" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button>:null}
                                        </div>
                                    </div>
                                    <hr></hr>
                                    {/* <AddRxs data={item} key={'item321'+key}/> */}
                                    <AddRxs itemKey={key} data={item} deleteRxsMed={this.toggleDeleteRxsMed.bind(this)} addRxsMed={this.toggleAddRxsMed.bind(this)} toggleRxsChange={this.onChangeRxs.bind(this)}/>
                                </div>
                            :
                                <div className="item-cover" style={{background:'#f0f1fc'}}>
                                    <div className="row">
                                        <div className="col">
                                            <h3>OTC Medication #{otcCount}</h3>
                                        </div>
                                        <div className="col">
                                            <button type="button" onClick={this.toggleDeleteItem.bind(null,key)} style={{float:'right'}} className="close" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        </div>
                                    </div>
                                    <hr></hr>
                                    <AddOTC data={item} key={'item42lkj1'+key} index={key}/>
                                </div>
                            }
                    </React.Fragment>
                );
            });
        }
        return(
            <>
            <ModalBody>
                <Form style={{width:'55em'}}>
                <Row>
                {this.state.isAddDependent?
                <>
                    <Col lg={6}>
                        <FormGroup>
                            <Label for="fname">First Name</Label>
                            <Input type="text" onChange={this.onChangeFname} name="fname" id="fname" placeholder="First Name" invalid={this.state.firstNameErrorMsg.length>0} required/>
                            {this.state.lastNameErrorMsg?<FormFeedback>{this.state.firstNameErrorMsg}</FormFeedback>:null}
                        </FormGroup>
                    </Col>
                    <Col lg={6}>
                        <FormGroup>
                            <Label for="lname">Last Name</Label>
                            <Input type="text" onChange={this.onChangeLname} name="lname" id="lname" placeholder="Last Name" invalid={this.state.lastNameErrorMsg.length>0} required/>
                            {this.state.lastNameErrorMsg?<FormFeedback>{this.state.lastNameErrorMsg}</FormFeedback>:null}
                        </FormGroup>
                    </Col>
                    <Col lg={6}>
                        <FormGroup>
                            <Label for="dob">Date of Birth</Label>
                            <Input type="date" onChange={this.onChangeDOB} name="dob" id="dob" placeholder="Date of Birth" invalid={this.state.dobErrorMsg.length>0} required/>
                            {this.state.dobErrorMsg?<FormFeedback>{this.state.dobErrorMsg}</FormFeedback>:null}
                        </FormGroup>
                    </Col>
                </>:null}
                    <Col lg={12}>
                        {list()}
                        <Button color="success" onClick={this.toggleAddRxs}>Add Prescription</Button>
                        {!this.props.isAddRxs?<Button color="info" onClick={this.toggleAddOTC}>Add Over the Counter Medication</Button>:null}
                    </Col>
                </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button className="btn-primary" color="primary" onClick={this.props.toggleTable} outline>Cancel</Button>
                <Button className="btn-primary" color="primary" onClick={this.handleSave}>Save</Button>
            </ModalFooter>
            </>
        )
    }
}
