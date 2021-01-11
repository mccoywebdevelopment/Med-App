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
import BelongsToGroup from './BelongsToGroup';

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
        this._test();
    }
    _initState = () => {
        this.state = {
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
                    group: {
                        isYes: false,
                        value: ""
                    }
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
        for (var i = 0; i < dep.rxs.length; ++i) {
            for (var ix = 0; ix < dep.rxs[i].rxsMedications.length; ++ix) {
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
                        _rxsID: dep.rxs[i]._id,
                        _rxsMedID: dep.rxs[i].rxsMedications[ix]._id,
                        name: dep.rxs[i].rxsMedications[ix].name,
                        reason: dep.rxs[i].rxsMedications[ix].reason,
                        datePrescribed: dep.rxs[i].rxsMedications[ix].datePrescribed,
                        instructions: dep.rxs[i].rxsMedications[ix].instructions || "",
                        endDate: dep.rxs[i].rxsMedications[ix].endDate || "",
                        dosageQuantity: dep.rxs[i].rxsMedications[ix].dosage.quantity,
                        dosageUnits: dep.rxs[i].rxsMedications[ix].dosage.unit,
                        doctorName: dep.rxs[i].doctorContacts.name.firstName + " " + dep.rxs[i].doctorContacts.name.lastName,
                        doctorPhone: dep.rxs[i].doctorContacts.phoneNumber,
                        rxsNumber: dep.rxs[i].rxsNumber,
                        whenToTake: dep.rxs[i].rxsMedications[ix].whenToTake.value || ""
                    },
                    body: null
                });
                index = index + 1;
            }
        }
        return list;
    }
    _getGroupSelDep = (dep) => {
        if (typeof (dep.group) != 'undefined' && dep.group.length > 0) {
            return {
                isYes: true,
                value: dep.group
            }
        } else {
            return {
                isYes: false,
                value: ""
            }
        }
    }
    _toggleExpandRxsMed = (index) => {
        let newState = this.state;
        newState.rxsMedList.list[index].isExpand = !newState.rxsMedList.list[index].isExpand;
        this.setState(newState);
    }
    _updateGroupValue = (form, name, value) => {
        let newState = this.state;
        newState[form].values['group'][name] = value;
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
        let newState = this.state;
        if (!newState.overview.values.group.isYes && this.props.groupState.data.length < 1) {
            alert("No groups");
        } else {
            newState.overview.values.group.isYes = !newState.overview.values.group.isYes;
            if (!newState.overview.values.group.isYes) {
                newState.overview.errors.group = "";
            }
        }
        if (!newState.overview.values.group.isYes) {
            newState.overview.values.group.value = "";
        }
        this.setState(newState);
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
        if (this.state.overview.values.group.isYes) {
            newState.overview.errors.group = this._groupValidation();
        }
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
                whenToTake: "Morning"
            },
            body: null
        });
        newState.rxsMedList.list.push({
            index: 1,
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
                name: "Tyfoid",
                reason: "For medical reasons",
                datePrescribed: "2020-08-04",
                instructions: "None",
                endDate: "",
                dosageQuantity: "1",
                dosageUnits: "pills",
                doctorName: "Dr. Kendle",
                doctorPhone: "48089016789",
                rxsNumber: "111",
                whenToTake: "Morning"
            },
            body: null
        });
        newState.rxsMedList.list.push({
            index: 2,
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
                name: "Selium",
                reason: "For aging dynosoum",
                datePrescribed: "2020-02-12",
                instructions: "Take yearly.",
                endDate: "",
                dosageQuantity: "8",
                dosageUnits: "pills",
                doctorName: "Dr. Morgan",
                doctorPhone: "4808901678",
                rxsNumber: "13467",
                whenToTake: "Morning"
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
            newState.rxsMedList.list[index].errors.rxsNumber = numberValidator(rxsNumber, true).errorMsg;

            //Optional fields:
            let instuctions = newState.rxsMedList.list[index].values.instructions;
            let endDate = newState.rxsMedList.list[index].values.endDate;
            let whenToTake = newState.rxsMedList.list[index].values.whenToTake;

            newState.rxsMedList.list[index].errors.instructions = nameValidator(instuctions, false).errorMsg;
            newState.rxsMedList.list[index].errors.endDate = nameValidator(endDate, false).errorMsg;
            newState.rxsMedList.list[index].errors.whenToTake = nameValidator(whenToTake, false).errorMsg;

            newState.rxsMedList.list[index].body = {
                name: name,
                rxsNumber: rxsNumber
            }

            this.setState(newState);
        }
    }
    _groupValidation = () => {
        var error = "";
        var found = false;
        for (var i = 0; i < this.props.groupState.data.length; ++i) {
            if (this.props.groupState.data[i]._id == this.state.overview.values.group.value) {
                found = true;
            }
        }
        if (!found) {
            error = "This field is required";
        }
        return error;
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
    _groupRxs = () => {
        let data = JSON.parse(JSON.stringify(this.state.rxsMedList.list));
        let arr = [];

        while (data.length > 0) {
            let items = [data[0]];
            data.splice(0, 1);
            for (var i = 0; i < data.length; ++i) {
                if (items[0].values.rxsNumber == data[i].values.rxsNumber &&
                    items[0].values.doctorPhone == data[i].values.doctorPhone &&
                    items[0].values.doctorName == data[i].values.doctorName) {
                    items.push(data[i]);
                    data.splice(i, 1);
                    i = -1;
                }
            }
            arr.push(items);
        }
        return arr;
    }
    _tookMed = (index) => {
        let med = this.state.rxsMedList.list[index].values;
        // let name = this.props.isDepSelected.name.firstName + " " + this.props.isDepSelected.name.lastName;
        this.props.togglePopUp(med.name, <TookMed medName={med.name} medID={med._rxsMedID} />);
    }
    _viewDates = (index) => {
        let med = this.state.rxsMedList.list[index].values;
        // let name = this.props.isDepSelected.name.firstName + " " + this.props.isDepSelected.name.lastName;
        this.props.togglePopUp(med.name, <RxsMedDates medName={med.name} rxsMedID={med._rxsMedID} />);
    }
    _formatRxs = (arr) => {
        let rxsArr = [];
        for (var i = 0; i < arr.length; ++i) {
            let rxs = {
                rxsNumber: arr[i][0].values.rxsNumber,
                firstName: arr[i][0].values.doctorName.split(' ')[0],
                lastName: arr[i][0].values.doctorName.split(' ')[1],
                phoneNumber: arr[i][0].values.doctorPhone,
            }
            /*
            if isDepSelected && original _rxs & _rxsMed is valid, 
            meaning if updating then we will assign
            */
            if (arr[i][0].values._rxsID) {
                rxs._id = arr[i][0].values._rxsID
            }
            let rxsMedication = [];
            for (var ix = 0; ix < arr[i].length; ++ix) {
                rxsMedication.push({
                    name: arr[i][ix].values.name,
                    quantity: arr[i][ix].values.dosageQuantity,
                    unit: arr[i][ix].values.dosageUnits,
                    reason: arr[i][ix].values.reason,
                    datePrescribed: arr[i][ix].values.datePrescribed
                });
                /* optional fiels for RxsMedication Model */
                if (arr[i][ix].values._rxsMedID) {
                    rxsMedication[rxsMedication.length - 1]._id = arr[i][ix].values._rxsMedID;
                }
                if (arr[i][ix].values.instructions) {
                    rxsMedication[rxsMedication.length - 1].instructions = arr[i][ix].values.instructions;
                }
                if (arr[i][ix].values.endDate) {
                    rxsMedication[rxsMedication.length - 1].endDate = arr[i][ix].values.endDate;
                }
                if (arr[i][ix].values.whenToTake) {
                    rxsMedication[rxsMedication.length - 1].value = arr[i][ix].values.whenToTake;
                }

            }
            rxs.rxsMedication = rxsMedication;
            rxsArr.push(rxs);
        }
        return rxsArr;
    }
    _formatBody = () => {
        let body = {
            firstName: this.state.overview.values.name.split(' ')[0],
            lastName: this.state.overview.values.name.split(' ')[1],
            dateOfBirth: this.state.overview.values.dateOfBirth,
            rxs: this._formatRxs(this._groupRxs())
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

            if (oldGroup.value.length > 0 && group.value.length > 0) {
                //Changed Group
                //delete and add
                return {
                    groupID: group.value,
                    oldGroupID: oldGroup.value,
                    isSwitched: true,
                    isRemoved: false,
                    isAdd: false
                }
            } else if (oldGroup.value.length < 1 && group.value.length > 0) {
                //add to group(new)
                //add
                return {
                    groupID: group.value,
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
                this.props.fetchCreateDependent(this._formatBody(), this.state.overview.values.group.value);
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
                                        style={{ color: '#2196F3',  paddingLeft: '20px', color: '#2196F3', cursor: 'pointer', textDecoration: 'underline' }}>Undo All Changes</a>
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
                        {!this.props.isDepSelected || this.state.overview.isEdit ?
                            <BelongsToGroup toggle={this._toggleGroupBtn} update={this._updateGroupValue} form={"overview"}
                                groups={this.props.groupState.data} data={this.state.overview.values.group}
                                error={this.state.overview.errors.group} />
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
                <div className="row" style={{ marginTop: '30px', marginBottom: '30px' }}>
                    {!this.props.isDepSelected ?
                        <button className="btn btn-primary" onClick={() => { this._submit() }}>Submit</button>
                        : this.props.isDepSelected && this._isUpdated() ?
                            <button className="btn btn-primary" onClick={() => { this._submit() }}>Update</button>
                            : <button className="btn btn-primary" style={{ visibility: 'hidden' }}>&nbsp;</button>
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