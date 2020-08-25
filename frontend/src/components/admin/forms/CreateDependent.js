import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGroups } from '../../../actions/group';
import { togglePopUp } from "../../../actions/popUp"
import { fetchCreateDependent, fetchPopulatedDependents } from '../../../actions/dependent';
import { firstAndLastNameValidator, prevDateValidator, nameValidator,
         numberValidator, phoneNumberValidator } from '../../../config/validators';
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
        this._toggleEditRxsMed = this._toggleEditRxsMed.bind(this);
        this._toggleExpandRxsMed = this._toggleExpandRxsMed.bind(this);

        this._test()
        alert(JSON.stringify(this.props.isDepSelected))
    }
    state = {
        isEdit:false,
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
            list:[],
            body:null
        },
        otcMedList:{
            isAdd:false,
            list:[]
        },
        notes:[]
    }
    _toggleExpandRxsMed = (index) =>{
        let newState = this.state;
        newState.rxsMedList.list[index].isExpand = !newState.rxsMedList.list[index].isExpand;
        this.setState(newState);
    }
    _updateGroupValue = (form,name,value)=>{
        let newState = this.state;
        newState[form].values['group'][name] = value;
        this.setState(newState);
    }
    _toggleEditRxsMed = (index) =>{
        this._rxsMedValidation();
        if((this.state.rxsMedList.isAdd && !this._isRxsMedErrors()) || (!this.state.rxsMedList.isAdd)){
            let newState = this.state;
            let newList = [];
            let item = newState.rxsMedList.list[index];
            let indexCounter = 0;

            for(var i=0;i<newState.rxsMedList.list.length;++i){
                var curEle = newState.rxsMedList.list[i];
                if(item!=curEle){
                    curEle.index = indexCounter;
                    newList.push(curEle);
                    indexCounter++;
                }
            }

            item.index = newList.length;
            newList.push(item);
            newState.rxsMedList.list = newList;
            newState.rxsMedList.isAdd = true;
            newState.rxsMedList.indexSelected = newState.rxsMedList.list.length-1;
            this.setState(newState);
        }
    }
    _update=(form,inputName,value)=>{
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
        if(window.confirm("Are you sure you want to delete "+this.state.rxsMedList.list[index].values.name+" medication?")){
            let newState = this.state;
            //Last element don't show form
            if(index==newState.rxsMedList.list.length-1){
                newState.rxsMedList.isAdd = false;
            }
            newState.rxsMedList.list.splice(index,1);
            for(var i=0;i<newState.rxsMedList.list.length;++i){
                if(newState.rxsMedList.list[i].index == newState.rxsMedList.indexSelected){
                    newState.rxsMedList.indexSelected = i;
                }
                newState.rxsMedList.list[i].index = i;
            }
            this.setState(newState);
        }
    }
    _toggleRxsMedAdd = () =>{
        let newState = this.state;
        this._rxsMedValidation();
        if(!this._isRxsMedErrors() || !this.state.rxsMedList.isAdd){
            let index = newState.rxsMedList.list.length;
            newState.rxsMedList.list.push({
                index:index,
                isExpand:false,
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
                }
            });
        }else if(this._isRxsMedErrors()){
            alert("Please fix the errors below:");
        }
        
        //index selected will always be the last one!!!!
        newState.rxsMedList.indexSelected = newState.rxsMedList.list.length - 1;
        newState.rxsMedList.isAdd = true;
        this.setState(newState);
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
                name:"Benzoid",
                reason:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                datePrescribed:"2020-07-24",
                instructions:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                endDate:"2020-09-12",
                dosageQuantity:"2",
                dosageUnits:"pills",
                doctorName:"Dr. Kendle",
                doctorPhone:"4808901678",
                rxsNumber:"111",
                whenToTake:"Morning"
            },
            body:null
        });
        newState.rxsMedList.list.push({
            index:1,
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
                name:"Tyfoid",
                reason:"For medical reasons",
                datePrescribed:"2020-08-04",
                instructions:"None",
                endDate:"",
                dosageQuantity:"1",
                dosageUnits:"pills",
                doctorName:"Dr. Kendle",
                doctorPhone:"48089016789",
                rxsNumber:"111",
                whenToTake:"Morning"
            },
            body:null
        });
        newState.rxsMedList.list.push({
            index:2,
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
                name:"Selium",
                reason:"For aging dynosoum",
                datePrescribed:"2020-02-12",
                instructions:"Take yearly.",
                endDate:"",
                dosageQuantity:"8",
                dosageUnits:"pills",
                doctorName:"Dr. Morgan",
                doctorPhone:"4808901678",
                rxsNumber:"13467",
                whenToTake:"Morning"
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
    _groupRxs = () =>{
        let data = JSON.parse(JSON.stringify(this.state.rxsMedList.list));
        let arr = [];
        
        while(data.length>0){
          let items = [data[0]];
          data.splice(0,1);
          for(var i=0;i<data.length;++i){
            if(items[0].values.rxsNumber == data[i].values.rxsNumber && 
               items[0].values.doctorPhone == data[i].values.doctorPhone &&
               items[0].values.doctorName == data[i].values.doctorName){
              items.push(data[i]);
              data.splice(i,1);
              i=-1;
            }
          }
          arr.push(items);
        }
        return arr;
    }

    _formatRxs=(arr) =>{
        let rxsArr = [];
        for(var i=0;i<arr.length;++i){
            let rxs = {
                rxsNumber:arr[i][0].values.rxsNumber,
                firstName:arr[i][0].values.doctorName.split(' ')[0],
                lastName:arr[i][0].values.doctorName.split(' ')[1],
                phoneNumber:arr[i][0].values.doctorPhone,
            }
            let rxsMedication = [];
            for(var ix=0;ix<arr[i].length;++ix){
                rxsMedication.push({
                    name:arr[i][ix].values.name,
                    quantity:arr[i][ix].values.dosageQuantity,
                    unit:arr[i][ix].values.dosageUnits,
                    reason:arr[i][ix].values.reason,
                    datePrescribed:arr[i][ix].values.datePrescribed
                })
            }
            rxs.rxsMedication = rxsMedication;
            rxsArr.push(rxs);
        }
        return rxsArr;
    }
    _formatBody = () =>{
        let body = {
            firstName: this.state.overview.values.name.split(' ')[0],
            lastName: this.state.overview.values.name.split(' ')[1],
            dateOfBirth: this.state.overview.values.dateOfBirth,
            rxs:this._formatRxs(this._groupRxs())
        }
        return body;
    }
    _submit = () =>{
        this._validation();
        if(!this._isOverviewErrors() && !this._isRxsMedErrors()){
            let oldDependents = null;
            for(var i=0;i<this.props.groups.length;++i){
                if(this.props.groups[i]._id == this.state.overview.values.group.value){
                    oldDependents = this.props.groups[i].dependents;
                }
            }
            this.props.fetchCreateDependent(this._formatBody(),this.state.overview.values.group.value,oldDependents);
            this.props.togglePopUp();
        }
    }
    componentDidMount = () =>{
        this.props.fetchGroups();
    }
    render() {
        return (
            <>
                <div className="row">
                    {this.props.isDepSelected?
                        <div className="col-lg-12">
                            <h4 style={{display:'inline'}}>Dependent Overview</h4>
                            <i title="edit" className="fas fa-edit" style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                            <i title="delete" className="fas fa-trash" style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                            <i title="close" style={{float:'right'}} className="fas fa-times"></i>
                        </div>
                        :null
                    }
                    {this.props.isDepSelected && !this.state.isEdit?
                        <h1>{this.props.isDepSelected.name.firstName}</h1>
                    :
                        <DepOverview data={this.state.overview} update={this._update} updateError={this._updateError}>
                            <BelongsToGroup toggle={this._toggleGroupBtn} update={this._updateGroupValue} form={"overview"} 
                            groups={this.props.groups} data={this.state.overview.values.group} error={this.state.overview.errors.group}/>
                        </DepOverview>
                    }

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
                    <MedList data={this.state.rxsMedList} update={this._updateRxsMedValues} delete={this._toggleRxsMedDelete}
                     edit={this._toggleEditRxsMed} toggleExpandMed={this._toggleExpandRxsMed}/>
                </div>
                {/* <div className="row" style={{marginTop:'30px'}}>
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
                </div> */}
                <div className="row" style={{marginTop:'30px',marginBottom:'30px'}}>
                    <button className="btn btn-primary" onClick={()=>{this._submit()}}>Submit</button>
                </div>
            </>

        );
    }
}

CreateDependent.propTypes = {
    fetchCreateDependent: PropTypes.func.isRequired,
    fetchPopulatedDependents: PropTypes.func.isRequired,
    togglePopUp: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    groups: state.groups
});

export default connect(mapStateToProps, { fetchCreateDependent, fetchGroups, togglePopUp, fetchPopulatedDependents })(CreateDependent);