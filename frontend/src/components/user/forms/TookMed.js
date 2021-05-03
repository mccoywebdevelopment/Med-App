import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchCreateMedEvent, fetchUpdateMedEvent } from '../../../actions/event';
import { fetchGuardians } from '../../../actions/guardian';
import { fetchUsers } from '../../../actions/user';
import { togglePopUp } from '../../../actions/popUp';
import { capitalizeFirstLetter } from '../../../config/helpers';

import RxsMedDates from "../../shared/tables/RxsMedDates";
import Search from "../../shared/Search/Search";
import WhenToTake from "../../shared/Misc/WhenToTake";

class TookMed extends React.Component {
    state = {
        itemList:[],
        isLoaded: false,
        values: {
            isAway: false,
            notes: "",
            guardian:"",
            dateTaken: ""
        },
        errors: {
            dateTaken: "",
            guardian:""
        },
        body: null
    }
    constructor(props) {
        super(props);
    }
    _isValid = () => {
        let newState = this.state;
        let valid = true;;
        if (this.state.values.dateTaken.length < 1) {
            newState.errors.dateTaken = "This field is required";
            valid = false;
        }else {
            newState.errors.dateTaken = "";
        }

        if (this.state.values.guardian.length < 1) {
            newState.errors.guardian = "This field is required";
            valid = false;
        }else {
            newState.errors.guardian = "";
        }


        this.setState(newState);
        if (!valid) {
            alert("Please fix the errors below:");
        }
        return valid;
    }
    _update = (key, value) => {
        let newState = this.state;
        newState.values[key] = value;
        this.setState(newState);
    }
    _getBody = () => {
        return {
            isAway: this.state.values.isAway,
            notes: this.state.values.notes,
            dateTaken: this.state.values.dateTaken,
            guardianID: this.state.values.guardian
        }
    }
    _getSelectedValues = (values) => {
        let newState = this.state;
        newState.values.guardian= values[0][0];
        this.setState(newState);
    }
    _submit = () => {
        if (this._isValid()) {
            if (this.props.isEdit) {
                this.props.fetchUpdateMedEvent(this._getBody(), this.props.eventID, true, (res) => {
                    this._back(true);
                });
            } else {
                this.props.fetchCreateMedEvent(this._getBody(), this.props.medID, true, (res) => {
                    this._back(true);
                });
            }
            this.props.togglePopUp();
        }
    }
    _back = (disableWindow) => {
        if (!disableWindow && window.confirm("Are you sure you want to go back all changes made will not be saved.")) {
            this.props.togglePopUp(this.props.medName, <RxsMedDates rxsMedID={this.props.medID} medName={this.props.medName} data={this.props.data} />);
        } else if (disableWindow) {
            this.props.togglePopUp(this.props.medName, <RxsMedDates rxsMedID={this.props.medID} medName={this.props.medName} data={this.props.data}/>);
        }
    }
    _formateDateIsEdit = (date) => {
        let dates = date.split('/');
        let yyyy = dates[2];
        let mm = dates[0];
        let dd = dates[1];
        return (yyyy + "-" + mm + "-" + dd);
    }
    _isUpdated = () => {
        if (JSON.stringify(this.state.values) != JSON.stringify(this.state.oldValues)) {
            return true;
        } else {
            return false;
        }
    }
    _getUserByID = (userID) => {
        for (var i = 0; i < this.props.userState.data.length; ++i) {
            if (this.props.userState.data[i]._id == userID) {
                return this.props.userState.data[i];
            }
        }
        return null;
    }
    _formatGroupInputsGuardian = () => {
        let tableHeader = [{ value: "Name", colSpan: 2 }, { value: "# of Groups", colSpan: 1 },
        { value: "is Admin", colSpan: 1 }, { value: "Validation", colSpan: 1 }];
        let values = [];
        let tableBody = [];
        let selectedValues = [];
        let hiddenValues = [];

        for (var i = 0; i < this.props.guardianState.data.length; ++i) {
            let user = this._getUserByID(this.props.guardianState.data[i].user);
            values.push(this.props.guardianState.data[i]._id);
            let name = "-"
            if (this.props.guardianState.data[i].name) {
                name = this.props.guardianState.data[i].name.firstName + " "
                    + this.props.guardianState.data[i].name.lastName;
            }
            tableBody.push(name);
            tableBody.push(this.props.guardianState.data[i].groups.length);
            let isAdmin = "false";
            let status = "Pending";
            if (user) {
                status = capitalizeFirstLetter(user.auth.status.statusValue);
                isAdmin = user.isAdmin.toString();
            } else {
                /*master admin*/
                status = "Approved";
                isAdmin = "true"

            }
            tableBody.push(isAdmin);
            tableBody.push(status);

        }
        return {
            name: "Guardians",
            data: {
                values: values,
                selectedValues: selectedValues,
                hiddenValues: hiddenValues,
                tableData: [tableHeader, tableBody]
            }
        }
    }
    componentDidMount = () => {
        if (this.props.isEdit) {
            let newState = this.state;
            newState.values.isAway = this.props.isEdit.isAway;
            newState.values.dateTaken = this._formateDateIsEdit(this.props.isEdit.dateTaken);
            newState.values.notes = this.props.isEdit.notes;
            newState.oldValues = JSON.parse(JSON.stringify(newState.values));
            this.setState(newState);
        }
        this.props.fetchGuardians(true, (guardians) => {
            if(guardians.length<1){
                alert("There are no guardians that can log this medication. Please create a guardian then add it to dependent's group.");
                this._back(true);
            }else{
                this.props.fetchUsers(true, (users) => {
                    let newState = this.state;
                    newState.isLoaded = true;
                    newState.itemList = [this._formatGroupInputsGuardian()];
                    this.setState(newState);
                });
            }
        });

    }
    render() {
        return (
            <>
            <div style={{padding:'1em',marginBottom:'2em'}}>
                    <WhenToTake data={this.props.data.whenToTake}/>
                </div>  
                <div className="row">
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label className="label">Date Taken</label>
                            <div className="input-group">
                                <input type="datetime-local" className="form-control" name="dateOfBirth" placeholder="mm/dd/yyyy"
                                    value={this.state.values.dateTaken}
                                    onChange={(e) => { this._update("dateTaken", e.target.value) }} />
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                    {this.state.errors.dateTaken}&nbsp;
</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group" style={{ marginBottom: '0px' }}>
                            <label className="label">Is away?</label>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6" style={{ paddingLeft: '0px' }}>
                                <div className="form-radio">
                                    <label className="form-check-label">
                                        <input readOnly={true} type="radio" className="form-check-input"
                                            name="membershipRadios" id="membershipRadios1" value="Yes"
                                            onClick={() => { this._update("isAway", true) }}
                                            checked={this.state.values.isAway} aria-describedby="passwordHelpBlock" />
Yes
<i className="input-helper"></i>
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-radio">
                                    <label className="form-check-label">
                                        <input readOnly={true} type="radio" className="form-check-input" name="membershipRadios"
                                            id="membershipRadios2" value="no" onClick={() => { this._update("isAway", false) }}
                                            checked={!this.state.values.isAway} />
No <i className="input-helper"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label className="label">Notes (optional)</label>
                            <div className="input-group">
                                <textarea type="text" className="form-control" name="name" placeholder="Take two..."
                                    value={this.state.values.notes} onChange={(e) => { this._update("notes", e.target.value) }} />
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                    {/*this.props.data.errors.instructions*/}&nbsp;
</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        {this.state.isLoaded ?
                        <>
                            <Search isSingleSelect={true} isReadOnly={false} color={"#ffaf00"} placeholder="Search & Select Items" items={this.state.itemList}
                                updateParentStateAll={this._getSelectedValues} dataSel={0} label={"Guardian(s)"} updateParentStateAll={this._getSelectedValues}/>
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.state.errors.guardian}&nbsp;</div>
                                </>
                            : null}
                    </div>
                </div>
                <div className="row" style={{ marginTop: '30px', marginBottom: '30px' }}>
                    <>
                        {this.props.isEdit ?
                            <button className="btn btn-primary" style={{ marginRight: '30px' }} onClick={() => { this._back() }}>Back</button>
                            : <button className="btn btn-primary" onClick={() => { this._submit() }}>Submit</button>}
                        {this.props.isEdit && this._isUpdated() ?
                            <button className="btn btn-primary" onClick={() => { this._submit() }}>Update</button>
                            : null
                        }
                    </>
                </div>
            </>
        );
    }
}

TookMed.propTypes = {
    fetchCreateMedEvent: PropTypes.func.isRequired,
    fetchUpdateMedEvent: PropTypes.func.isRequired,
    togglePopUp: PropTypes.func.isRequired,
    guardianState: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    guardianState: state.guardianState,
    userState: state.userState
});

export default connect(mapStateToProps, { fetchCreateMedEvent, fetchUsers, togglePopUp, fetchUpdateMedEvent, fetchGuardians })(TookMed);