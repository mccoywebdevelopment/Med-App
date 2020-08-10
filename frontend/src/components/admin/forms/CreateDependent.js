import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGroups } from '../../../actions/group'
import { submitNewDependent } from '../../../actions/dependent';
import { firstAndLastNameValidator, prevDateValidator } from '../../../config/validators';
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
            list:[]
        },
        otcMedList:{
            isAdd:false,
            list:[]
        },
        notes:[]
    }
    /*
        List:[{
            isEdit:false,
            errors:{
                name,
                reason,
                datePrescribed,
                instructions,
                endDate,
                dosageQuantity
                doctorName,
                doctorPhone,
                rxsNumber,
            }
        }]
    */
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
        if(index==newState.rxsMedList.list.length-1){
            newState.rxsMedList.isAdd = false;
        }
        newState.rxsMedList.list.splice(index,1);
        this.setState(newState);
        console.log(this.state);
    }
    _toggleRxsMedAdd = () =>{
        let newState = this.state;
        newState.rxsMedList.isAdd = !newState.rxsMedList.isAdd;
        if(newState.rxsMedList.isAdd){
            newState.rxsMedList.list.push({
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
                    doctorName:"",
                    doctorPhone:"",
                    rxsNumber:"",
                    whenToTake:""
                },
                body:null
            });
        }
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
        console.log(this.state);
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
    _rxsMedValidation = () =>{
        // let newState = this.state;
        // for(var i)
        if(this.state.rxsMedList.isAdd){
            // let newState = this.state;
            // newState.rxsMedList.list[]
            // this.setState(newState);
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

        if(this._isOverviewErrors()){
            alert("Please fix the errors below:");
        }
    }
    _submit = () =>{
        this._validation();
        console.log(this.state);
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
                <div className="row" style={{marginTop:'10px'}}>
                    <div className="col-lg-12">
                        <h4 style={{display:'inline'}}>OTC Medications <span style={{fontSize:'17px'}}>({this.state.otcMedList.list.length})</span></h4>
                        <i title="add" onClick={this._to} className="fas fa-plus" style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                    </div>
                </div>
                <div className="row" style={{marginTop:'10px'}}>
                    <div className="col-lg-12">
                        {/* <MedList data={this.state.medList}/> */}
                    </div>
                </div>
                <div className="row" style={{marginTop:'10px'}}>
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