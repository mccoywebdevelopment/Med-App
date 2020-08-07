import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGroups } from '../../../actions/group';
import { updateFormOverview } from '../../../actions/dependent';
import { firstAndLastNameValidator, prevDateValidator } from '../../../config/validators';
import SearchBox from './SearchBox'

import BelongsToGroup from './BelongsToGroup';

export default class DepOverview extends React.Component {
    constructor(props){
        super(props);
    }
    // _groupValidator = () => {
    //     let newState = this.state;
    //     if (this.state.groupSelect == this.state.groupValue && this.state.groupValue.length > 0) {
    //         newState.groupError = false;
    //     } else if (this.state.groupValue.length > 1 || this.state.belongsToGroup) {
    //         newState.groupError = "This field is required.";
    //     } else {
    //         newState.groupError = "";
    //     }
    //     this.setState(newState);
    // }
    // _validation = () => {
    //     let newState = this.state;
    //     newState.nameError = firstAndLastNameValidator(this.state.name, true).errorMsg;
    //     newState.dateOfBirthError = prevDateValidator(this.state.dateOfBirth, true).errorMsg;

    //     this._groupValidator();

    //     this.setState(newState);
    // }
    // _getSearchBoxData = () => {
    //     let data = [];
    //     for (var i = 0; i < this.props.groups.length; ++i) {
    //         data.push({ key: this.props.groups[i]._id, value: this.props.groups[i].name });
    //     }
    //     return data;
    // }
    render() {
        return (
            <>
                <div className="col-lg-4">
                    <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label className="label">Name</label>
                        <div className="input-group">
                            <input type="text" className="form-control" name="name" placeholder="First & Last Name"
                                value={this.props.data.values.name} onChange={(e)=>{this.props.update("overview","name",e.target.value)}} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.name}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label className="label">Date of Bith</label>
                        <div className="input-group">
                            <input type="date" className="form-control" name="dateOfBirth" placeholder="mm/dd/yyyy"
                                value={this.props.data.dateOfBirth} onChange={(e)=>{this.props.update("overview","dateOfBirth",e.target.value)}} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.dateOfBirth}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <BelongsToGroup update={this.props.update} form={"overview"} inputName={"group"} groups={this.props.groups} updaterError={this.props.updaterError}/>
            </>
        );
    }
}


