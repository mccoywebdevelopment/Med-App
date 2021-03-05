import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGuardians } from '../../../../actions/guardian';
import { fetchUsers } from '../../../../actions/user';
import { fetchPopulatedDependents } from "../../../../actions/dependent";
import { togglePopUp } from "../../../../actions/popUp";
import { fetchCreateGroup, fetchUpdateGroup } from "../../../../actions/group";
import { nameValidator } from '../../../../config/validators';
import { capitalizeFirstLetter, formateDate, getAge } from "../../../../config/helpers"

import GroupOverview from "./GroupOveriew";
import Search from "../../../shared/Search/Search";
import GuardianTableSm from "../../tables/GuardianTableSm";
import DependentTableSm from "../../tables/DependentTableSm";

class CreateGroup extends React.Component {
    static propTypes = {
        groupState: PropTypes.object.isRequired,
        guardianState: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this._initState();
        this._toggleGroupBtn = this._toggleGroupBtn.bind(this);
        this._update = this._update.bind(this);
        this._updateError = this._updateError.bind(this);
        this._toggleGroupBtn = this._toggleGroupBtn.bind(this);
        this._formatItems = this._formatItems.bind(this);
    }
    _initState = () => {
        this.state = {
            oldData: {
                overview: null,
            },
            overview: {
                errors: {
                    name: ""
                },
                values: {
                    name: ""
                },
                body: null,
                isEdit: false
            },
            isLoaded:false,
            dependents: [],
            guardians: [],
            itemList: []
        }
    }
    _formatSelGroup = (group) => {
        let newState = this.state;

        newState.overview.values.name = group.name;
        newState.guardians = group.guardians.map(guardian => guardian._id);
        newState.dependents = group.dependents.map(dependent => dependent._id);
        newState.oldData = {
            overview: newState.overview.values,
            dependents: group.dependents.map(dependent => dependent._id),
            guardians: group.guardians.map(guardian => guardian._id)
        }

        newState.oldData = JSON.stringify(newState.oldData)
        this.setState(newState);
    }
    _isUpdated = () => {
        let oldData = this.state.oldData;
        let newData = JSON.stringify({
            overview:this.state.overview.values,
            dependents:this.state.dependents,
            guardians:this.state.guardians
        });
        if(oldData != newData){
            return true;
        }

        return false;
    }
    _getGroupIDByGroupID = (id) => {
        if (this.props.groupState.data) {
            let groups = this.props.groupState.data;

            for (var i = 0; i < groups.length; ++i) {
                for (var ix = 0; ix < groups[i].guardians.length; ++ix) {
                    if (id == groups[i].guardians[ix].group) {
                        return groups[i]._id
                    }
                }
            }
        }

        return "";
    }
    _update = (form, inputName, value) => {
        let newState = this.state;
        newState[form].values[inputName] = value;
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
        newState.overview.errors.name = nameValidator(newState.overview.values.name, true).errorMsg;
        this.setState(newState);
    }
    _toggleIsEditOverview = () => {
        let newState = this.state;

        if(newState.overview.isEdit == true){
            if(window.confirm("Are you sure you want to proceed without saving changes?")){
                this._formatSelGroup(this.props.isGroupSelected);
                newState.overview.isEdit = !newState.overview.isEdit;
            }
        }else{
            newState.overview.isEdit = !newState.overview.isEdit;
        }
        this.setState(newState);
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
    _isOverviewErrors = () => {
        for (var errProp in this.state.overview.errors) {
            if (this.state.overview.errors[errProp].length > 0) {
                return true;
            }
        }
        return false;
    }
    _validation = () => {
        let isErrors = this._isOverviewErrors();

        if(isErrors){
            alert("Please fix the errors below:");
        }
        return !isErrors;
    }
    _formatBody = () => {
        let body = {
        }
        if(this.props.isGroupSelected){
            body = this._isGroupModified();
        }else{
            if(this.state.dependents.length>0){
                body.dependentIDs = this.state.dependents;
            }
            if(this.state.guardians.length>0){
                body.guardianIDs = this.state.guardians;
            }
        }
        body.name = this.state.overview.values.name;
        return body;
    }
    _getGroupID = (groupID) => {
        for (var i = 0; i < this.props.groupState.data.length; ++i) {
            for (var ix = 0; ix < this.props.groupState.data[i].guardians.length; ++ix) {
                if (groupID == this.props.groupState.data[i].guardians[ix].group) {
                    return this.props.groupState.data[i]._id;
                }
            }
        }
        return null;
    }
    _isGroupModified = () => {
        let oldDependents = JSON.parse(this.state.oldData).dependents;
        let oldGuardians = JSON.parse(this.state.oldData).guardians;
        let newDependents = this.state.dependents;
        let newGuardians = this.state.guardians;

        let removeDependentIDs = [];
        let dependentIDs = [];
        let removeGuardianIDs =[];
        let guardianIDs =[];

        /* how remove works:
            loop through old
                if not found in cur arr
            remove that element

            how add works:
            loop through new
                if not found in old arr
            add that element
        */

        if (JSON.stringify(oldDependents) != JSON.stringify(newDependents)) {
            removeDependentIDs = [];
            dependentIDs = [];

            for(var i=0;i<oldDependents.length;++i){
                let found = false;
                for(var ix=0;ix<newDependents.length;++ix){
                    if(oldDependents[i].toString() == newDependents[ix].toString()){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    removeDependentIDs.push(oldDependents[i]);
                }
            }
            for(var i=0;i<newDependents.length;++i){
                let found = false;
                for(var ix=0;ix<oldDependents.length;++ix){
                    if(oldDependents[ix].toString() == newDependents[i].toString()){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    dependentIDs.push(newDependents[i]);
                }
            }

        }
        if (JSON.stringify(oldGuardians) != JSON.stringify(newGuardians)) {
            removeGuardianIDs = [];
            guardianIDs = [];

            for(var i=0;i<oldGuardians.length;++i){
                let found = false;
                for(var ix=0;ix<newGuardians.length;++ix){
                    if(oldGuardians[i] == newGuardians[ix]){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    removeGuardianIDs.push(oldGuardians[i]);
                }
            }
            for(var i=0;i<newGuardians.length;++i){
                let found = false;
                for(var ix=0;ix<oldGuardians.length;++ix){
                    if(oldGuardians[ix].toString() == newGuardians[i].toString()){
                        found = true;
                    }
                }
                if(!found){
                    guardianIDs.push(newGuardians[i]);
                }
            }

        }

        let body = {};
        if(dependentIDs.length>0){
            body.dependentIDs = dependentIDs;
        }
        if(removeDependentIDs.length>0){
            body.removeDependentIDs = removeDependentIDs;
        }
        if(guardianIDs.length>0){
            body.guardianIDs = guardianIDs;
        }
        if(removeGuardianIDs.length>0){
            body.removeGuardianIDs = removeGuardianIDs;
        }
        return body;
    }
    _getGuardianByGroupID = (groupID) => {
        for (var i = 0; i < this.props.guardianState.data.length; ++i) {
            if (this.props.guardianState.data[i].group == groupID) {
                return this.props.guardianState.data[i];
            }
        }
        return null;
    }
    _getGuardiansFromGroupSel = () => {
        let oldGuardians = [];
        for (var i = 0; i < this.props.groupState.data.length; ++i) {
            if (this.props.groupState.data[i]._id == this.props.isGroupSelected._id) {
                return (this.props.groupState.data[i].guardians);
            }
        }
        return oldGuardians;
    }
    _getDependentsFromGroupSel = () => {
        let oldGuardians = [];
        for (var i = 0; i < this.props.groupState.data.length; ++i) {
            if (this.props.groupState.data[i]._id == this.props.isGroupSelected._id) {
                return (this.props.groupState.data[i].dependents);
            }
        }
        return oldGuardians;
    }
    _submit = () => {
        if (this._validation()) {
            let body = this._formatBody();
            if (this.props.isGroupSelected) {
                alert('update')
                this.props.fetchUpdateGroup(this.props.isGroupSelected._id,this._formatBody(),(res)=>{
                    // this._initState();
                    // this.props.updateGroup(res._id);
                    // this._formatItems();
                    this._initState();
                    this.props.updateGroup(res._id,()=>{
                        this._fetchData();
                    });
                });
            } else {
                this.props.fetchCreateGroup(body, this.state.dependents, this.state.guardians);
            }
            this.props.togglePopUp();
        }
    }
    _fetchData = () =>{
         if (this.props.isGroupSelected) {
            this._formatSelGroup(this.props.isGroupSelected);
        }
        this._formatItems();
        this.setState({...this.state,isLoaded:true});
    }
    // _fetchData = () =>{
    //     this.props.fetchGuardians(false, (guards) => {
    //         this.props.fetchPopulatedDependents(false, (deps) => {
    //             this.props.fetchUsers(true,()=>{
    //                 if (this.props.isGroupSelected) {
    //                     this._formatSelGroup(this.props.isGroupSelected);
    //                 }
    //                 this._formatItems();
    //                 this.setState({...this.state,isLoaded:true});
    //             });
    //         });
    //     })
    // }
    componentDidMount = () => {
        this._fetchData();
    }
    _fetchGroups = (done) => {
        let newState = this.state;
        this.props.fetchGroups(() => {
            newState.fetchedGroups = true;
            this.setState(newState);
            done();
        });
    }
    _formatItems = () => {
        let newState = this.state;
        newState.itemList = [this._formatGroupInputsGuardian(), this._formatGroupInputsDependent()];
        this.setState(newState);
    }
    _getSelectedValues = (values) => {
        let newState = this.state;
        newState.dependents = values[1];
        newState.guardians = values[0];
        this.setState(newState);
    }
    _formatGroupInputsGuardian = () => {
        let tableHeader = [{ value: "Name", colSpan: 2 }, { value: "# of Groups", colSpan: 1 }, 
            { value: "is Admin", colSpan: 1 }, { value: "Validation", colSpan: 1 }];
        let values = [];
        let tableBody = [];
        let selectedValues = this.state.guardians;
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
    _formatGroupInputsDependent = () => {
        let tableHeader = [{ value: "Name", colSpan: 2 }, { value: "DOB", colSpan: 1 }, { value: "Age", colSpan: 1 }];
        let values = [];
        let tableBody = [];
        let selectedValues = this.state.dependents;
        let hiddenValues = [];
        console.log(selectedValues);
        for (var i = 0; i < this.props.dependentState.data.length; ++i) {
            if ((this.props.isGroupSelected && this.props.dependentState.data[i].group.toString() == this.props.isGroupSelected._id.toString()) ||
                     (this.props.dependentState.data[i].group.length < 1)) {
                values.push(this.props.dependentState.data[i]._id);

                if(this.props.dependentState.data[i].group.length<1 && selectedValues.indexOf(this.props.dependentState.data[i]._id) == -1 ){
                tableBody.push(this.props.dependentState.data[i].name.firstName + " " +
                this.props.dependentState.data[i].name.lastName+"    <span style='color:red;float:right;'>Deactive</span>");
                }else{
                    tableBody.push(this.props.dependentState.data[i].name.firstName + " " +
                    this.props.dependentState.data[i].name.lastName);
                }
                tableBody.push(formateDate(this.props.dependentState.data[i].dateOfBirth));
                tableBody.push(getAge(this.props.dependentState.data[i].dateOfBirth));
            }
        }

        return {
            name: "Dependents",
            data: {
                values: values,
                selectedValues: selectedValues,
                hiddenValues: hiddenValues,
                tableData: [tableHeader, tableBody]
            }
        }
    }
    componentWillReceiveProps = (newProps) => {
        if (newProps.isGroupSelected) {
            this._formatSelGroup(newProps.isGroupSelected);
        }
    }
    _getGuardiansFromGroupSel = () =>{
        let groups = this.props.groupState.data;
        for(var i=0;i<groups.length;++i){
            if(this.props.isGroupSelected && this.props.isGroupSelected._id == groups[i]._id){
                return groups[i].guardians;
            }
        }
        return [];
    }
    _getUserByID = (userID) => {
        for (var i = 0; i < this.props.userState.data.length; ++i) {
            if (this.props.userState.data[i]._id == userID) {
                return this.props.userState.data[i];
            }
        }
        return null;
    }
    render() {
        let groupsLabel = "Items";

        return (
            <>
                <div className="row">
                    {this.props.isGroupSelected ?
                        <div className="col-lg-12" style={{ marginBottom: '10px' }}>
                            <h4 style={{ display: 'inline' }}>Group Overview</h4>
                            <i title="edit" onClick={() => { this._toggleIsEditOverview() }} className="fas fa-edit"
                                style={{ paddingLeft: '20px', color: '#fcb031' }}></i>
                            <i title="delete" onClick={() => { this.props.delete(this.props.isGroupSelected) }} className="fas fa-trash"
                                style={{ paddingLeft: '20px', color: '#fcb031' }}></i>
                            <i title="close" onClick={() => { this.props.goHome() }} style={{ float: 'right', color: "#fcb031" }} className="fas fa-times"></i>
                        </div>
                        : null

                    }
                    <GroupOverview data={this.state.overview} update={this._update} updateError={this._updateError}
                        isUserSelected={this.props.isGroupSelected} groups={this.props.groupState.data} isEdit={this.state.overview.isEdit}>
                        {this.props.isGroupSelected && !this.state.overview.isEdit?
                            <div className="row" style={{ marginTop: '10px', marginBottom: '10px' }}>
                                <div className="col-lg-12">
                                    <h4 style={{ display: 'inline' }}>Guardians <span style={{ fontSize: '17px' }}>
                                        ({this._getGuardiansFromGroupSel().length})                            
                                            </span>
                                    </h4>
                                </div>
                            </div>
                            : null}
                        <div className="col-lg-12" style={{ paddingLeft: '12.5px', paddingRight: '12.5px' }}>
                            {this.state.itemList.length > 0 && this.state.itemList[0] && (!this.props.isGroupSelected || this.state.overview.isEdit) ?
                                <Search isReadOnly={false} color={"#ffaf00"} placeholder="Search & Select Items" items={this.state.itemList}
                                    updateParentStateAll={this._getSelectedValues} dataSel={0} label={groupsLabel} />
                                :this.state.isLoaded?
                                    <GuardianTableSm guardians={this._getGuardiansFromGroupSel()} users={this.props.userState.data}/>
                                :null
                                
                            }
                        </div>
                        {this.props.isGroupSelected && !this.state.overview.isEdit?
                            <div className="row" style={{ marginTop: '10px', marginBottom: '10px' }}>
                                <div className="col-lg-12">
                                    <h4 style={{ display: 'inline' }}>Dependents <span style={{ fontSize: '17px' }}>
                                        ({this._getDependentsFromGroupSel().length})                            
                                            </span>
                                    </h4>
                                </div>
                                <div className="col-lg-12" style={{ paddingLeft: '12.5px', paddingRight: '12.5px' }}>
                                    <DependentTableSm dependents={this._getDependentsFromGroupSel()} populatedDeps={this.props.dependentState.data}/>
                                </div>
                            </div>
                            
                            : null}

                    </GroupOverview>

                </div>
                <div className="row" style={{ marginTop: '30px', marginBottom: '30px' }}>
                    {!this.props.isGroupSelected ?
                        <button className="btn btn-warning btn-fw" onClick={() => { this._submit() }}>Submit</button>
                        : this.props.isGroupSelected && this._isUpdated() ?
                            <button className="btn btn-warning btn-fw" onClick={() => { this._submit() }}>Update</button>
                        : <button className="btn btn-primary" style={{ visibility: 'hidden' }}>&nbsp;</button>
                    }
                </div>
            </>
        );
    }
}

CreateGroup.propTypes = {
    togglePopUp: PropTypes.func.isRequired,
    fetchGuardians: PropTypes.func.isRequired,
    fetchPopulatedDependents: PropTypes.func.isRequired,
    fetchCreateGroup: PropTypes.func.isRequired,
    fetchUpdateGroup: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    groupState: state.groupState,
    userState: state.userState,
    dependentState: state.dependentState,
    guardianState: state.guardianState,
    theme: state.theme
});

export default connect(mapStateToProps, { fetchGuardians, fetchUsers, fetchPopulatedDependents, togglePopUp,
         fetchCreateGroup, fetchUpdateGroup})(CreateGroup);