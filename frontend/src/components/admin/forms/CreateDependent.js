import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGroups } from '../../../actions/group'
import { submitNewDependent } from '../../../actions/dependent';
import { firstAndLastNameValidator, prevDateValidator } from '../../../config/validators';
import BelongsToGroup from './BelongsToGroup';

import DepOverview from './DepOverview';

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
        }
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
    _toggleGroupBtn = () =>{
        let newState = this.state;
        if(!newState.overview.values.group.isYes && this.props.groups.all.length<1){
            alert("No groups");
        }else{
            newState.overview.values.group.isYes = !newState.overview.values.group.isYes;
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
    }
    componentDidMount = () =>{
        this.props.fetchGroups();
        console.log(this.state);
        console.log(this.props.groups);
    }
    render() {
        return (
            <>
                <div className="row">
                    {this.props.groups.all?
                        <DepOverview data={this.state.overview} update={this._update} updateError={this._updateError}>
                            <BelongsToGroup toggle={this._toggleGroupBtn} update={this._updateGroupValue} form={"overview"} 
                                groups={this.props.groups} data={this.state.overview.values.group} error={this.state.overview.errors.group}/>
                        </DepOverview>
                    :null}
                </div>
                <div className="row">
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