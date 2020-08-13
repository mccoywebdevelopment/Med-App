import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGroups } from '../../../actions/group'
import { submitNewDependent } from '../../../actions/dependent';
import { firstAndLastNameValidator, prevDateValidator, nameValidator, numberValidator, phoneNumberValidator } from '../../../config/validators';
import BelongsToGroup from './BelongsToGroup';

import DepOverview from './DepOverview';
import MedList from './MedList';

class CreateDependent extends React.Component {
    static propTypes = {
        dependents: PropTypes.object.isRequired,
        groups: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this._update = this._update.bind(this);
        this._updateError = this._updateError.bind(this);
        this._updateGroupValue = this._updateGroupValue.bind(this);
        this._toggleGroupBtn = this._toggleGroupBtn.bind(this);
        this._updateRxsMedValues = this._updateRxsMedValues.bind(this);
        this._toggleRxsMedDelete = this._toggleRxsMedDelete.bind(this);
        this._toggleRxsMedAdd = this._toggleRxsMedAdd.bind(this);
        this._test()
    }
    state = {
        overview:{
            errors:{
                name:"",
                dateOfBirth:"",
                group:"",
            },
            values:{
                name:"",
                dateOfBirth:"",
                group:{
                    isYes:false,
                    value:""
                }
            },
            body:null
        },
        rxsMedList:{
            isAdd:false,
            indexSelected:0,
            list:[]
        },
        otcMedList:{
            isAdd:false,
            list:[]
        },
        notes:[]
    }
    _updateGroupValue = (form,name,value)=>{
        let newState = this.state;
        newState[form].values['group'][name] = value;
        this.setState(newState);
    }
    _update(form,inputName,value){
        let newState = this.state;
        newState[form].values[inputName] = value;
        this.setState(newState);
    }
    _updateRxsMedValues = (index,name,value) =>{
        let newState = this.state;
        newState.rxsMedList.list[index].values[name] = value;
        this.setState(newState);
    }
    _toggleRxsMedDelete = (index) =>{
        let newState = this.state;
        //Last element don't show form
        if(index==newState.rxsMedList.list.length-1){
            newState.rxsMedList.isAdd = false;
        }
        newState.rxsMedList.list.splice(index,1);
        this.setState(newState);
    }
    _toggleRxsMedAdd = () =>{
        let newState = this.state;
        this._rxsMedValidation();
        if(!this._isRxsMedErrors() || !this.state.rxsMedList.isAdd){
            let index = newState.rxsMedList.list.length;
            newState.rxsMedList.list.push({
                index:index,
                isEdit:false,
                errors:{
                    name:"",
                    reason:"",
                    datePrescribed:"",
                    instructions:"",
                    endDate:"",
                    dosageQuantity:"",
                    dosageUnits:"",
                    doctorName:"",
                    doctorPhone:"",
                    rxsNumber:"",
                    whenToTake:""
                },
                values:{
                    name:"",
                    reason:"",
                    datePrescribed:"",
                    instructions:"",
                    endDate:"",
                    dosageQuantity:"",
                    dosageUnits:"",
                    doctorName:"",
                    doctorPhone:"",
                    rxsNumber:"",
                    whenToTake:""
                },
                body:null
            });
        }else if(this._isRxsMedErrors()){
            alert("Please fix the errors below:");
        }
        
        //index selected will always be the last one!!!!
        newState.rxsMedList.indexSelected = newState.rxsMedList.list.length - 1;
        newState.rxsMedList.isAdd = true;
        this.setState(newState);
        console.log(this.state);
    }
    _toggleGroupBtn = () =>{
        let newState = this.state;
        if(!newState.overview.values.group.isYes && this.props.groups.all.length<1){
            alert("No groups");
        }else{
            newState.overview.values.group.isYes = !newState.overview.values.group.isYes;
            if(!newState.overview.values.group.isYes){
                newState.overview.errors.group = "";
            }
        }
        if(!newState.overview.values.group.isYes){
            newState.overview.values.group.value = "";
        }
        this.setState(newState);
    }
    _updateError = (form,inputName,value) =>{
        let newState = this.state;
        newState[form].errors[inputName] = value;
        this.setState(newState);
    }
    _overviewValidation = () =>{
        let newState = this.state;
        newState.overview.errors.name = firstAndLastNameValidator(newState.overview.values.name,true).errorMsg;
        newState.overview.errors.dateOfBirth = prevDateValidator(newState.overview.values.dateOfBirth,true).errorMsg;
        if(this.state.overview.values.group.isYes){
            newState.overview.errors.group = this._groupValidation();
        }
        this.setState(newState);
    }
    _test = () =>{
        let newState = this.state;
        newState.rxsMedList.list.push({
            index:0,
            isEdit:false,
            errors:{
                name:"",
                reason:"",
                datePrescribed:"",
                instructions:"",
                endDate:"",
                dosageQuantity:"",
                dosageUnits:"",
                doctorName:"",
                doctorPhone:"",
                rxsNumber:"",
                whenToTake:""
            },
            values:{
                name:"a",
                reason:"",
                datePrescribed:"",
                instructions:"",
                endDate:"",
                dosageQuantity:"",
                dosageUnits:"",
                doctorName:"",
                doctorPhone:"",
                rxsNumber:"",
                whenToTake:""
            },
            body:null
        });
        newState.rxsMedList.list.push({
            index:1,
            isEdit:false,
            errors:{
                name:"",
                reason:"",
                datePrescribed:"",
                instructions:"",
                endDate:"",
                dosageQuantity:"",
                dosageUnits:"",
                doctorName:"",
                doctorPhone:"",
                rxsNumber:"",
                whenToTake:""
            },
            values:{
                name:"a",
                reason:"",
                datePrescribed:"",
                instructions:"",
                endDate:"",
                dosageQuantity:"",
                dosageUnits:"",
                doctorName:"",
                doctorPhone:"",
                rxsNumber:"",
                whenToTake:""
            },
            body:null
        });
        newState.rxsMedList.list.push({
            index:2,
            isEdit:false,
            errors:{
                name:"",
                reason:"",
                datePrescribed:"",
                instructions:"",
                endDate:"",
                dosageQuantity:"",
                dosageUnits:"",
                doctorName:"",
                doctorPhone:"",
                rxsNumber:"",
                whenToTake:""
            },
            values:{
                name:"a",
                reason:"",
                datePrescribed:"",
                instructions:"",
                endDate:"",
                dosageQuantity:"",
                dosageUnits:"",
                doctorName:"",
                doctorPhone:"",
                rxsNumber:"",
                whenToTake:""
            },
            body:null
        });
        newState.rxsMedList.list.push({
            index:3,
            isEdit:false,
            errors:{
                name:"",
                reason:"",
                datePrescribed:"",
                instructions:"",
                endDate:"",
                dosageQuantity:"",
                dosageUnits:"",
                doctorName:"",
                doctorPhone:"",
                rxsNumber:"",
                whenToTake:""
            },
            values:{
                name:"kkkkk",
                reason:"",
                datePrescribed:"",
                instructions:"",
                endDate:"",
                dosageQuantity:"",
                dosageUnits:"",
                doctorName:"",
                doctorPhone:"",
                rxsNumber:"",
                whenToTake:""
            },
            body:null
        });
        newState.rxsMedList.indexSelected = newState.rxsMedList.list.length - 1;
        this.setState(newState);
    }
    _rxsMedValidation = () =>{
        if(this.state.rxsMedList.isAdd && this.state.rxsMedList.list.length>0){
            let newState = this.state;
            let index = newState.rxsMedList.list.length-1;

            //Required fields:
            let name = newState.rxsMedList.list[index].values.name;
            let reason = newState.rxsMedList.list[index].values.reason;
            let datePrescribed = newState.rxsMedList.list[index].values.datePrescribed;
            let dosageQuantity = newState.rxsMedList.list[index].values.dosageQuantity;
            let dosageUnits = newState.rxsMedList.list[index].values.dosageUnits;
            let doctorName = newState.rxsMedList.list[index].values.doctorName;
            let doctorPhone = newState.rxsMedList.list[index].values.doctorPhone;
            let rxsNumber = newState.rxsMedList.list[index].values.rxsNumber;

            newState.rxsMedList.list[index].errors.name = nameValidator(name,true).errorMsg;
            newState.rxsMedList.list[index].errors.reason = nameValidator(reason,true).errorMsg;
            newState.rxsMedList.list[index].errors.datePrescribed = prevDateValidator(datePrescribed,true).errorMsg;
            newState.rxsMedList.list[index].errors.dosageQuantity = numberValidator(dosageQuantity,true).errorMsg;
            newState.rxsMedList.list[index].errors.dosageUnits = nameValidator(dosageUnits,true).errorMsg;
            newState.rxsMedList.list[index].errors.doctorName = firstAndLastNameValidator(doctorName,true).errorMsg;
            newState.rxsMedList.list[index].errors.doctorPhone = phoneNumberValidator(doctorPhone,true).errorMsg;
            newState.rxsMedList.list[index].errors.rxsNumber = numberValidator(rxsNumber,true).errorMsg;

            //Optional fields:
            let instuctions = newState.rxsMedList.list[index].values.instructions;
            let endDate = newState.rxsMedList.list[index].values.endDate;
            let whenToTake = newState.rxsMedList.list[index].values.whenToTake;

            newState.rxsMedList.list[index].errors.instructions = nameValidator(instuctions,false).errorMsg;
            newState.rxsMedList.list[index].errors.endDate = nameValidator(endDate,false).errorMsg;
            newState.rxsMedList.list[index].errors.whenToTake = nameValidator(whenToTake,false).errorMsg;

            newState.rxsMedList.list[index].body = {
                name:name,
                rxsNumber:rxsNumber
            }

            this.setState(newState);
        }
    }
    _groupValidation = () =>{
        var error = "";
        var found = false;
        for(var i=0;i<this.props.groups.all.length;++i){
            if(this.props.groups.all[i]._id == this.state.overview.values.group.value){
                found = true;
            }
        }
        if(!found){
            error = "This field is required";
        }
        return error;
    }
    _isRxsMedErrors = () =>{
        if(this.state.rxsMedList.isAdd && this.state.rxsMedList.list.length>0){
            for(var errProp in this.state.rxsMedList.list[this.state.rxsMedList.list.length-1].errors){
                if(this.state.rxsMedList.list[this.state.rxsMedList.list.length-1].errors[errProp].length>0){
                    return true;
                }
            }
        }
        return false;
    }
    _isOverviewErrors = () =>{
        for(var errProp in this.state.overview.errors){
            if(this.state.overview.errors[errProp].length>0){
                return true;
            }
        }
        return false;
    }
    _validation = () =>{
        this._overviewValidation();
        this._rxsMedValidation();
        if(this._isOverviewErrors() || this._isRxsMedErrors()){
            alert("Please fix the errors below:");
        }
    }
    _submit = () =>{
        this._validation();
    }
    componentDidMount = () =>{
        this.props.fetchGroups();
    }
    render() {
        return (
            <>
                <div className="row" style={{marginTop:'10px'}}>
                    {this.props.groups.all?
                        <DepOverview data={this.state.overview} update={this._update} updateError={this._updateError}>
                            <BelongsToGroup toggle={this._toggleGroupBtn} update={this._updateGroupValue} form={"overview"} 
                                groups={this.props.groups} data={this.state.overview.values.group} error={this.state.overview.errors.group}/>
                        </DepOverview>
                    :null}
                </div>
                <div className="row" style={{marginTop:'10px'}}>
                    <div className="col-lg-12">
                        <h4 style={{display:'inline'}}>RXS Medications <span style={{fontSize:'17px'}}>({this.state.rxsMedList.list.length})</span></h4>
                        <i title="add" className="fas fa-plus" onClick={this._toggleRxsMedAdd} style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                        {this.state.rxsMedList.isAdd?
                            <i title="delete empty med" className="fas fa-trash" 
                                onClick={()=>{this._toggleRxsMedDelete(this.state.rxsMedList.list.length-1)}} 
                                style={{ color: '#2196F3',float:'right' }}></i>
                        :null}
                    </div>
                </div>
                <div className="row" style={{marginTop:'10px'}}>
                    <MedList data={this.state.rxsMedList} update={this._updateRxsMedValues}/>
                </div>
                <div className="row" style={{marginTop:'30px'}}>
                    <div className="col-lg-12">
                        <h4 style={{display:'inline'}}>OTC Medications <span style={{fontSize:'17px'}}>({this.state.otcMedList.list.length})</span></h4>
                        <i title="add" onClick={this._to} className="fas fa-plus" style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                    </div>
                </div>
                <div className="row" style={{marginTop:'30px'}}>
                    <div className="col-lg-12">
                        <h4 style={{display:'inline'}}>Notes <span style={{fontSize:'17px'}}>({this.state.notes.length})</span></h4>
                        <i title="add" className="fas fa-plus" style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                    </div>
                </div>
                <div className="row" style={{marginTop:'10px'}}>
                    <div className="col-lg-12">
                    </div>
                </div>
                <div className="row" style={{marginTop:'30px',marginBottom:'30px'}}>
                    <button className="btn btn-primary" onClick={()=>{this._submit()}}>Submit</button>
                </div>
            </>

        );
    }
}

CreateDependent.propTypes = {
    submitNewDependent: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    dependents: state.dependents,
    groups: state.groups
});

export default connect(mapStateToProps, { submitNewDependent, fetchGroups })(CreateDependent);