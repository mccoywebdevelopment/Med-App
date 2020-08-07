import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGroups } from '../../../actions/group';
import { updateFormOverview } from '../../../actions/dependent';
import { firstAndLastNameValidator, prevDateValidator } from '../../../config/validators';
import SearchBox from './SearchBox'

export default class BelongsToGroup extends React.Component {
    state = {
        groupValue:"",
        groupSelect:"",
        belongsToGroup:null,
        groups:null
    }
    constructor(props){
        super(props);
        this._setGroupInput = this._setGroupInput.bind(this);
        this._toggleBelongsToGroupOption = this._toggleBelongsToGroupOption.bind(this);
        this._groupValidator = this._groupValidator.bind(this);
    }
    _setGroupInput = (value,select,id) =>{
        let newState = this.state;
        if(value){
            newState.groupValue = value;
        }
        if(select){
            newState.groupSelect = select;
        }
        if(id){
            newState.belongsToGroup = id;
        }
        id = id || "";
        alert("set")
        this.props.update(this.props.form,this.props.inputName,id);
        this.setState(newState);
    }
    _toggleBelongsToGroupOption = () => {
        let newState = this.state;
        if (newState.belongsToGroup) {
            newState.belongsToGroup = false;
        }else if(this.props.groups.length<1){
            alert("WARNING: There is no groups that are availible.");
            newState.belongsToGroup = false;
        }else{
            newState.belongsToGroup = true;
            
        }
        this.setState(newState);
    }
    _groupValidator = () =>{
        if(this.state.groupSelect == this.state.groupValue && this.state.groupValue.length>0){
            this.props.updateError(this.props.form,this.props.inputName,"");
        }else{
            this.props.updateError(this.props.form,this.props.inputName,"This field is required.");
        }
    }
    _getSearchBoxData = () => {
        let data = [];
        for (var i = 0; i < this.props.groups.length; ++i) {
            data.push({ key: this.props.groups[i]._id, value: this.props.groups[i].name });
        }
        return data;
    }
    render() {
        return (
            <>
                <div className="col-lg-4">
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                        <label className="label">Belongs to Group</label>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4" style={{ paddingLeft: '0px' }}>
                            <div className="form-radio">
                                <label className="form-check-label">
                                    <input readOnly={true} type="radio" className="form-check-input"
                                        name="membershipRadios" id="membershipRadios1" value="Yes"
                                        onClick={() => { this._toggleBelongsToGroupOption() }}
                                        checked={this.state.belongsToGroup} aria-describedby="passwordHelpBlock" />
                                        Yes
                                        <i className="input-helper"></i>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="form-radio">
                                <label className="form-check-label">
                                    <input readOnly={true} type="radio" className="form-check-input" name="membershipRadios"
                                        id="membershipRadios2" value="no" onClick={() => { this._toggleBelongsToGroupOption() }}
                                        checked={!this.state.belongsToGroup || (this.state.didFetchGroups && this.props.groups.length < 1)} />
                                        No <i className="input-helper"></i>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"col-lg-4 my-search-box " + (!this.state.belongsToGroup || (this.state.didFetchGroups && this.props.groups.length < 1) ? 'my-hidden' : '')}>
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                        <label className="label">Group Name</label>
                    </div>
                    <SearchBox _setGroupInput={this._setGroupInput} data={this._getSearchBoxData()} placeholder={"Enter Group Name"} />
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                        {this.state.groupError}&nbsp;
                    </div>
                </div>
            </>
        );
    }
}


