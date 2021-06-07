import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGroups } from '../../../../actions/group';
import { togglePopUp } from "../../../../actions/popUp"
import { fetchCreateDependent, fetchPopulatedDependents, fetchUpdateDependent } from '../../../../actions/dependent';
import {
    firstAndLastNameValidator, prevDateValidator, nameValidator,
    numberValidator, phoneNumberValidator
} from '../../../../config/validators';
import BelongsToGroupV2 from './BelongsToGroupV2';
import { toInputDate } from "../../../../config/helpers";

import DepOverview from './DepOverview';
import MedList from './MedList';
import TookMed from '../../../user/forms/TookMed';
import RxsMedDates from '../../../shared/tables/RxsMedDates';

class CreateDependent extends React.Component {
    static propTypes = {
        groupState: PropTypes.object.isRequired,
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
        this._tookMed = this._tookMed.bind(this);
        this._viewDates = this._viewDates.bind(this);
        this._initState();
        // this._test();
    }
    _getInitObj = () => {
        return ({
            oldData: {
                overview: null,
                rxsMedList: null
            },
            fetchedGroups: false,
            overview: {
                errors: {
                    name: "",
                    dateOfBirth: "",
                    group: "",
                },
                values: {
                    name: "",
                    dateOfBirth: "",
                    group: ""
                },
                body: null,
                isEdit: false,
            },
            rxsMedList: {
                isAdd: false,
                indexSelected: 0,
                list: [],
                body: null
            },
            otcMedList: {
                isAdd: false,
                list: []
            },
            notes: []
        });
    }
    _initState = () => {
        if (!this.state) {
            this.state = this._getInitObj();
        } else {
            this.setState(this._getInitObj());
        }
    }
    _formatSelDep = (dep) => {
        let newState = this.state;

        newState.overview.values.name = dep.name.firstName + " " + dep.name.lastName;
        newState.overview.values.dateOfBirth = dep.dateOfBirth;
        newState.overview.values.group = this._getGroupSelDep(dep);

        newState.rxsMedList.list = this._getRxsSelDep(dep);

        newState.oldData = {
            overview: JSON.stringify(newState.overview.values),
            rxsMedList: JSON.stringify(this._getRxsValues(newState.rxsMedList))
        }

        this.setState(newState);
    }
    _getRxsValues = (rxsMedList) => {
        let data = [];
        for (var i = 0; i < rxsMedList.list.length; ++i) {
            data.push(rxsMedList.list[i].values);
        }
        return data;
    }
    _toggleUndo = (med) => {
        let newState = this.state;
        newState.rxsMedList.isAdd = !newState;
        this.setState(newState);
        if (this.props.isDepSelected && this._isOldData(med._id)) {
            this._toggleRxsMedDelete(this.state.rxsMedList.list.length - 1, true);
        } else if (!this.props.isDepSelected) {
            this._toggleRxsMedDelete(this.state.rxsMedList.list.length - 1, true);
        }

        if (this.props.isDepSelected) {
            this._initState();
            this._formatSelDep(this.props.isDepSelected);
        }
    }
    _isOldData = (id) => {
        let oldMedList = JSON.parse(this.state.oldData.rxsMedList);
        for (var i = 0; i < oldMedList.length; ++i) {
            if (oldMedList._id == id) {
                return true;
            }
        }
        return false;
    }
    _isUpdated = () => {
        let oldDataOverview = this.state.oldData.overview;
        let oldDataRxs = this.state.oldData.rxsMedList;
        let overview = JSON.stringify(this.state.overview.values);
        let rxs = JSON.stringify(this._getRxsValues(this.state.rxsMedList));
        //Need to add isGrouped updated!!!!!!!!!!!!!!!!

        if (oldDataOverview != overview || oldDataRxs != rxs) {
            return true;
        }
        return false;
    }
    _getRxsSelDep = (dep) => {
        let list = [];
        let index = 0;
        for (var i = 0; i < dep.rxsMedications.length; ++i) {
            list.push({
                index: index,
                errors: {
                    name: "",
                    reason: "",
                    datePrescribed: "",
                    instructions: "",
                    endDate: "",
                    dosageQuantity: "",
                    dosageUnits: "",
                    doctorName: "",
                    doctorPhone: "",
                    rxsNumber: "",
                    whenToTake: ""
                },
                values: {
                    _rxsMedID: dep.rxsMedications[i]._id,
                    name: dep.rxsMedications[i].name,
                    reason: dep.rxsMedications[i].reason,
                    datePrescribed: dep.rxsMedications[i].datePrescribed,
                    instructions: dep.rxsMedications[i].instructions || "",
                    endDate: dep.rxsMedications[i].endDate || "",
                    dosageQuantity: dep.rxsMedications[i].dosage.quantity,
                    dosageUnits: dep.rxsMedications[i].dosage.unit,
                    doctorName: dep.rxsMedications[i].doctorContacts.name.firstName + " " + dep.rxsMedications[i].doctorContacts.name.lastName,
                    doctorPhone: dep.rxsMedications[i].doctorContacts.phoneNumber,
                    rxsNumber: dep.rxsMedications[i].rxsNumber || "",
                    whenToTake: dep.rxsMedications[i].whenToTake || ""
                },
                body: null
            });
            index = index + 1;
        }
        return list;
    }
    _getGroupSelDep = (dep) => {
        if (typeof (dep.group) != 'undefined' && dep.group.length > 0) {
            return dep.group
        }else{
            return "";
        }
    }
    _toggleExpandRxsMed = (index) => {
        let newState = this.state;
        newState.rxsMedList.list[index].isExpand = !newState.rxsMedList.list[index].isExpand;
        this.setState(newState);
    }
    _updateGroupValue = (value) => {
        let newState = this.state;
        newState.overview.values.group = value;
        this.setState(newState);
    }
    _toggleEditRxsMed = (index) => {
        this._rxsMedValidation();
        if ((this.state.rxsMedList.isAdd && !this._isRxsMedErrors()) || (!this.state.rxsMedList.isAdd)) {
            let newState = this.state;
            let newList = [];
            let item = newState.rxsMedList.list[index];
            let indexCounter = 0;

            for (var i = 0; i < newState.rxsMedList.list.length; ++i) {
                var curEle = newState.rxsMedList.list[i];
                if (item != curEle) {
                    curEle.index = indexCounter;
                    newList.push(curEle);
                    indexCounter++;
                }
            }

            item.index = newList.length;
            newList.push(item);
            newState.rxsMedList.list = newList;
            newState.rxsMedList.isAdd = true;
            newState.rxsMedList.indexSelected = newState.rxsMedList.list.length - 1;
            this.setState(newState);
        }
    }
    _update = (form, inputName, value) => {
        let newState = this.state;
        newState[form].values[inputName] = value;
        this.setState(newState);
    }
    _updateRxsMedValues = (index, name, value) => {
        let newState = this.state;
        newState.rxsMedList.list[index].values[name] = value;
        this.setState(newState);
    }
    _toggleRxsMedDelete = (index, notWindow) => {
        if (notWindow) {
            this._deleteListByIndex(index);
        } else if (window.confirm("Are you sure you want to delete " + this.state.rxsMedList.list[index].values.name + " medication?")) {
            this._deleteListByIndex(index);
        }
    }
    _deleteListByIndex = (index) => {
        let newState = this.state;
        //Last element don't show form
        if (index == newState.rxsMedList.list.length - 1) {
            newState.rxsMedList.isAdd = false;
        }
        newState.rxsMedList.list.splice(index, 1);
        for (var i = 0; i < newState.rxsMedList.list.length; ++i) {
            if (newState.rxsMedList.list[i].index == newState.rxsMedList.indexSelected) {
                newState.rxsMedList.indexSelected = i;
            }
            newState.rxsMedList.list[i].index = i;
        }
        this.setState(newState);
    }
    _toggleRxsMedAdd = () => {
        let newState = this.state;
        this._rxsMedValidation();
        if (!this._isRxsMedErrors() || !this.state.rxsMedList.isAdd) {
            let index = newState.rxsMedList.list.length;
            newState.rxsMedList.list.push({
                index: index,
                isExpand: false,
                errors: {
                    name: "",
                    reason: "",
                    datePrescribed: "",
                    instructions: "",
                    endDate: "",
                    dosageQuantity: "",
                    dosageUnits: "",
                    doctorName: "",
                    doctorPhone: "",
                    rxsNumber: "",
                    whenToTake: ""
                },
                values: {
                    name: "",
                    reason: "",
                    datePrescribed: "",
                    instructions: "",
                    endDate: "",
                    dosageQuantity: "",
                    dosageUnits: "",
                    doctorName: "",
                    doctorPhone: "",
                    rxsNumber: "",
                    whenToTake: ""
                }
            });
        } else if (this._isRxsMedErrors()) {
            alert("Please fix the errors below:");
        }

        //index selected will always be the last one!!!!
        newState.rxsMedList.indexSelected = newState.rxsMedList.list.length - 1;
        newState.rxsMedList.isAdd = true;
        this.setState(newState);
    }
    _toggleGroupBtn = () => {
        if (this.props.groupState.data.length < 1) {
            alert("No groups");
        }
    }
    _updateError = (form, inputName, value) => {
        let newState = this.state;
        newState[form].errors[inputName] = value;
        this.setState(newState);
    }
    _overviewValidation = () => {
        let newState = this.state;
        newState.overview.errors.name = firstAndLastNameValidator(newState.overview.values.name, true).errorMsg;
        newState.overview.errors.dateOfBirth = prevDateValidator(newState.overview.values.dateOfBirth, true).errorMsg;
        newState.overview.errors.group = this._groupValidation();
        this.setState(newState);
    }
    _toggleIsEditOverview = () => {
        let newState = this.state;

        if (newState.overview.isEdit == true) {
            if (window.confirm("Are you sure you want to proceed without saving changes?")) {
                this._formatSelDep(this.props.isDepSelected);
                newState.overview.isEdit = !newState.overview.isEdit;
            }
        } else {
            newState.overview.isEdit = !newState.overview.isEdit;
        }
        this.setState(newState);
    }
    _test = () => {
        let newState = this.state;
        newState.rxsMedList.list.push({
            index: 0,
            errors: {
                name: "",
                reason: "",
                datePrescribed: "",
                instructions: "",
                endDate: "",
                dosageQuantity: "",
                dosageUnits: "",
                doctorName: "",
                doctorPhone: "",
                rxsNumber: "",
                whenToTake: ""
            },
            values: {
                name: "Benzoid",
                reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                datePrescribed: "2020-07-24",
                instructions: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                endDate: "2020-09-12",
                dosageQuantity: "2",
                dosageUnits: "pills",
                doctorName: "Dr. Kendle",
                doctorPhone: "4808901678",
                rxsNumber: "111",
                whenToTake: ["morning"]
            },
            body: null
        });
        newState.rxsMedList.indexSelected = newState.rxsMedList.list.length - 1;
        this.setState(newState);
    }
    _rxsMedValidation = () => {
        if (this.state.rxsMedList.isAdd && this.state.rxsMedList.list.length > 0) {
            let newState = this.state;
            let index = newState.rxsMedList.list.length - 1;

            //Required fields:
            let name = newState.rxsMedList.list[index].values.name;
            let reason = newState.rxsMedList.list[index].values.reason;
            let datePrescribed = newState.rxsMedList.list[index].values.datePrescribed;
            let dosageQuantity = newState.rxsMedList.list[index].values.dosageQuantity;
            let dosageUnits = newState.rxsMedList.list[index].values.dosageUnits;
            let doctorName = newState.rxsMedList.list[index].values.doctorName;
            let doctorPhone = newState.rxsMedList.list[index].values.doctorPhone;
            let rxsNumber = newState.rxsMedList.list[index].values.rxsNumber;

            newState.rxsMedList.list[index].errors.name = nameValidator(name, true).errorMsg;
            newState.rxsMedList.list[index].errors.reason = nameValidator(reason, true).errorMsg;
            newState.rxsMedList.list[index].errors.datePrescribed = prevDateValidator(datePrescribed, true).errorMsg;
            newState.rxsMedList.list[index].errors.dosageQuantity = numberValidator(dosageQuantity, true).errorMsg;
            newState.rxsMedList.list[index].errors.dosageUnits = nameValidator(dosageUnits, true).errorMsg;
            newState.rxsMedList.list[index].errors.doctorName = firstAndLastNameValidator(doctorName, true).errorMsg;
            newState.rxsMedList.list[index].errors.doctorPhone = phoneNumberValidator(doctorPhone, true).errorMsg;
            newState.rxsMedList.list[index].errors.rxsNumber = numberValidator(rxsNumber, false).errorMsg;

            //Optional fields:
            let instuctions = newState.rxsMedList.list[index].values.instructions;
            let endDate = newState.rxsMedList.list[index].values.endDate;
            let whenToTake = newState.rxsMedList.list[index].values.whenToTake;

            newState.rxsMedList.list[index].errors.instructions = nameValidator(instuctions, false).errorMsg;
            newState.rxsMedList.list[index].errors.endDate = nameValidator(endDate, false).errorMsg;
            newState.rxsMedList.list[index].errors.whenToTake = nameValidator(whenToTake, true).errorMsg;

            newState.rxsMedList.list[index].body = {
                name: name,
                rxsNumber: rxsNumber
            }

            this.setState(newState);
        }
    }
    _findGroupByID = (id) =>{
        for (var i = 0; i < this.props.groupState.data.length; ++i) {
            if (this.props.groupState.data[i]._id == id) {
                return this.props.groupState.data[i];
            }
        }
        return false;
    }
    _groupValidation = () => {
        var error = "";
        var found = false;
        if(this._findGroupByID(this.state.overview.values.group)){
            return "";
        }else{
            let newState = this.state;
            newState.overview.values.group = "";
            this.setState(newState);
            return "";
        }
    }
    _isRxsMedErrors = () => {
        if (this.state.rxsMedList.isAdd && this.state.rxsMedList.list.length > 0) {
            for (var errProp in this.state.rxsMedList.list[this.state.rxsMedList.list.length - 1].errors) {
                if (this.state.rxsMedList.list[this.state.rxsMedList.list.length - 1].errors[errProp].length > 0) {
                    return true;
                }
            }
        }
        return false;
    }
    _isOverviewErrors = () => {
        for (var errProp in this.state.overview.errors) {
            if (this.state.overview.errors[errProp].length > 0) {
                return true;
            }
        }
        return false;
    }
    _validation = () => {
        this._overviewValidation();
        this._rxsMedValidation();
        if (this._isOverviewErrors() || this._isRxsMedErrors()) {
            alert("Please fix the errors below:");
        }
    }
    _tookMed = (index) => {
        let med = this.state.rxsMedList.list[index].values;
        // let name = this.props.isDepSelected.name.firstName + " " + this.props.isDepSelected.name.lastName;
        this.props.togglePopUp(med.name, <TookMed medName={med.name} medID={med._rxsMedID} data={med} />);
    }
    _viewDates = (index) => {
        let med = this.state.rxsMedList.list[index].values;
        // let name = this.props.isDepSelected.name.firstName + " " + this.props.isDepSelected.name.lastName;
        this.props.togglePopUp(med.name, <RxsMedDates medName={med.name} rxsMedID={med._rxsMedID} data={med} />);
    }
    _formatRxsMedication = () => {
        let arr = this.state.rxsMedList.list;
        let rxsMedication = [];
        for (var i = 0; i < arr.length; ++i) {
                rxsMedication.push({
                    name: arr[i].values.name,
                    rxsNumber: arr[i].values.rxsNumber,
                    quantity: arr[i].values.dosageQuantity,
                    unit: arr[i].values.dosageUnits,
                    reason: arr[i].values.reason,
                    datePrescribed: toInputDate(arr[i].values.datePrescribed),
                    doctorPhoneNumber: arr[i].values.doctorPhone,
                    doctorFirstName: arr[i].values.doctorName.split(" ")[0],
                    doctorLastName: arr[i].values.doctorName.split(" ")[1],
                });
                /* optional fields for RxsMedication Model */
                if (arr[i].values._rxsMedID) {
                    rxsMedication[rxsMedication.length - 1]._id = arr[i].values._rxsMedID;
                }
                if (arr[i].values.instructions) {
                    rxsMedication[rxsMedication.length - 1].instructions = arr[i].values.instructions;
                }
                if (arr[i].values.endDate) {
                    rxsMedication[rxsMedication.length - 1].endDate = toInputDate(arr[i].values.endDate);
                }
                if (arr[i].values.whenToTake) {
                    rxsMedication[rxsMedication.length - 1].whenToTake = arr[i].values.whenToTake;
                }

            }
        
            return rxsMedication;
    }
    _formatBody = () => {
        let body = {
            firstName: this.state.overview.values.name.split(' ')[0],
            lastName: this.state.overview.values.name.split(' ')[1],
            dateOfBirth: this.state.overview.values.dateOfBirth,
            rxsMedications: this._formatRxsMedication()
        }
        return body;
    }
    _getGroupID = (depID) => {
        for (var i = 0; i < this.props.groupState.data.length; ++i) {
            for (var ix = 0; ix < this.props.groupState.data[i].dependents.length; ++ix) {
                if (depID == this.props.groupState.data[i].dependents[ix]._id) {
                    return this.props.groupState.data[i]._id;
                }
            }
        }
        return null;
    }
    _isGroupModified = () => {
        let oldGroup = JSON.parse(this.state.oldData.overview).group;
        let group = this.state.overview.values.group;
        if (JSON.stringify(oldGroup) != JSON.stringify(group)) {

            if (oldGroup.length > 0 && group.length > 0) {
                //Changed Group
                //delete and add
                return {
                    groupID: group,
                    oldGroupID: oldGroup,
                    isSwitched: true,
                    isRemoved: false,
                    isAdd: false
                }
            } else if (oldGroup.length < 1 && group.length > 0) {
                //add to group(new)
                //add
                return {
                    groupID: group,
                    isSwitched: false,
                    isRemoved: false,
                    isAdd: true
                }
            } else {
                // was removed from group
                // delete
                return {
                    groupID: this._getGroupID(this.props.isDepSelected._id),
                    isSwitched: false,
                    isRemoved: true,
                    isAdd: false
                }
            }
        } else {
            return null;
        }
    }
    _submit = () => {
        this._validation();
        if (!this._isOverviewErrors() && !this._isRxsMedErrors()) {
            if (this.props.isDepSelected) {
                //check if group is modified if so update group then call get populated dependents

                this.props.fetchUpdateDependent(this.props.isDepSelected.name.firstName + " " + this.props.isDepSelected.name.lastName, this.props.isDepSelected._id,
                    this._formatBody(), this._isGroupModified(), (res) => {
                        this._initState();
                        this.props.updateDep(res._id);
                    });

            } else {
                this.props.fetchCreateDependent(this._formatBody(), this.state.overview.values.group);
            }
            this.props.togglePopUp();
        }
    }
    componentDidMount = () => {
        if (this.props.isDepSelected) {
            this._formatSelDep(this.props.isDepSelected);
        }
    }
    componentWillReceiveProps = (newProps) => {
        if (newProps.isDepSelected != this.props.isDepSelected) {
            this._initState();
            this._formatSelDep(newProps.isDepSelected);
        }
    }
    render() {
        return (
            <>
                <div className="row">
                    {this.props.isDepSelected ?
                        <div className="col-lg-12" style={{ marginBottom: '10px' }}>
                            <h4 style={{ display: 'inline' }}>Dependent Overview</h4>
                            <>
                                {!this.props.isUser ?
                                    <>
                                        <i title="edit" onClick={() => { this._toggleIsEditOverview() }} className="fas fa-edit"
                                            style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                                        <i title="delete" onClick={() => { this.props.delete(this.props.isDepSelected) }} className="fas fa-trash"
                                            style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                                        {this._isUpdated() ?
                                            <a title="Undo changes"
                                                onClick={() => { this._toggleUndo(this.state.rxsMedList.list.length - 1) }}
                                                style={{ color: '#2196F3', paddingLeft: '20px', color: '#2196F3', cursor: 'pointer', textDecoration: 'underline' }}>Undo All Changes</a>
                                            : null}
                                    </>
                                    : null}
                            </>
                            <i title="close" onClick={() => { this.props.goHome() }} style={{ float: 'right' }} className="fas fa-times"></i>
                        </div>
                        : null
                    }
                    <DepOverview isUser={this.props.isUser} data={this.state.overview} update={this._update} updateError={this._updateError}
                        isDepSelected={this.props.isDepSelected} groups={this.props.groupState.data}>
                        {!this.props.isDepSelected || this.state.overview.isEdit  ?
                            <BelongsToGroupV2 group={this.state.overview.values.group} update={this._updateGroupValue} error={this.state.overview.errors.group}/>
                            : null}
                    </DepOverview>
                </div>
                <div className="row" style={{ marginTop: '10px' }}>
                    <div className="col-lg-12">
                        <h4 style={{ display: 'inline' }}>RXS Medications <span style={{ fontSize: '17px' }}>
                            ({this.state.rxsMedList.list.length})
                            </span></h4>
                        {!this.props.isUser ?
                            <i title="add" className="fas fa-plus" onClick={this._toggleRxsMedAdd}
                                style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                            : null}
                        {this.state.rxsMedList.isAdd ?
                            <>
                                <i title="delete empty med" className="fas fa-trash"
                                    onClick={() => { this._toggleRxsMedDelete(this.state.rxsMedList.list.length - 1) }}
                                    style={{ color: '#2196F3', float: 'right', paddingLeft: '20px', cursor: 'pointer' }}></i>
                            </>
                            : null}
                    </div>
                </div>
                <div className="row" style={{ marginTop: '10px' }}>
                    <MedList data={this.state.rxsMedList} update={this._updateRxsMedValues} delete={this._toggleRxsMedDelete}
                        edit={this._toggleEditRxsMed} tookMed={this._tookMed} viewDates={this._viewDates} toggleExpandMed={this._toggleExpandRxsMed}
                        isUser={this.props.isUser} isCreate={!this.props.isDepSelected} />
                </div>

                <div className="row" style={{ marginTop: '30px', marginBottom: '30px' }}>
                    {!this.props.isDepSelected ?
                        <button className="btn btn-primary" onClick={() => { this._submit() }} style={{height:'fit-content'}}>Submit</button>
                        : this.props.isDepSelected && this._isUpdated() ?
                            <button className="btn btn-primary" onClick={() => { this._submit() }} style={{height:'fit-content'}}>Update</button>
                            : <button className="btn btn-primary" style={{ visibility: 'hidden',height:'fit-content' }}>&nbsp;</button>
                    }
                </div>
            </>

        );
    }
}

CreateDependent.propTypes = {
    fetchCreateDependent: PropTypes.func.isRequired,
    fetchUpdateDependent: PropTypes.func.isRequired,
    fetchPopulatedDependents: PropTypes.func.isRequired,
    togglePopUp: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    groupState: state.groupState
});

export default connect(mapStateToProps, { fetchCreateDependent, fetchGroups, togglePopUp, fetchPopulatedDependents, fetchUpdateDependent })(CreateDependent);