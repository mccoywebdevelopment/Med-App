import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGuardians } from '../../../../actions/guardian';
import { fetchPopulatedDependents } from "../../../../actions/dependent";
import { togglePopUp } from "../../../../actions/popUp";
import { fetchCreateGroup } from "../../../../actions/group";
import { nameValidator } from '../../../../config/validators';
import { capitalizeFirstLetter, formateDate, getAge} from "../../../../config/helpers"

import GroupOverview from "./GroupOveriew";
import Search from "../../../shared/Search/Search";

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
            dependents:[],
            guardians:[],
            itemList:[]
        }
    }
    _formatSelGroup = (group) => {
        let newState = this.state;

        newState.overview.values.name = group.name;


        newState.oldData = {
            overview: newState.overview.values,
            dependents:group.dependents,
            guardians:group.guardians
        }

        JSON.stringify(newState.oldData);
        this.setState(newState);
    }
    _isUpdated = () => {
        let oldDataOverview = this.state.oldData.overview;
        let overview = JSON.stringify(this.state.overview.values);
        let oldDependents = this.state.oldData.dependents;
        let dependents = JSON.stringify(this.state.dependents);
        let oldGuardians = this.state.oldData.guardians;
        let guardians = JSON.stringify(this.state.guardians);

        if (oldDataOverview != overview || oldDependents != dependents || oldGuardians!=guardians) {
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
        newState.overview.isEdit = !newState.overview.isEdit;
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
        this._overviewValidation();
        if (this._isOverviewErrors()) {
            alert("Please fix the errors below:");
        }
    }
    _formatBody = () => {
        let body = {
            name:this.state.overview.values.name,
        }
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
                    groupID: this._getGroupID(this.props.isGroupSelected._id),
                    isSwitched: false,
                    isRemoved: true,
                    isAdd: false
                }
            }
        } else {
            return null;
        }
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
            if (this.props.groupState.data[i]._id == this.state.overview.values.group.value) {
                return (this.props.groupState.data[i].guardians);
            }
        }
        return oldGuardians;
    }
    _submit = () => {
        this._validation();
        if (!this._isOverviewErrors()) {
            let body = this._formatBody();
            if (this.props.isGroupSelected) {
                // this.props.fetchUpdateGroup(this.props.isGroupSelected._id,body,this._isGroupModified(),
                //     this._getGuardianByGroupID(this.props.isGroupSelected._id)._id,(res)=>{
                //         this._initState();
                //         this.props.updateGroup(res._id);
                //     });
            } else {
                this.props.fetchCreateGroup(body,this.state.dependents,this.state.guardians);
                // this.props.fetchCreateGroup(body, this.state.overview.values.group.value);
            }
            this.props.togglePopUp();
        }
    }
    componentDidMount = () => {
        this.props.fetchGuardians(true,(guards)=>{
            this.props.fetchPopulatedDependents(false,(deps)=>{
                if(this.props.isGroupSelected){
                    this._formatSelGroup(this.props.isGroupSelected);
                }
                this._formatItems();
            });
        })
    }
    _fetchGroups = (done) => {
        let newState = this.state;
        this.props.fetchGroups(() => {
            newState.fetchedGroups = true;
            this.setState(newState);
            done();
        });
    }
    _formatItems = () =>{
        let newState = this.state;
        newState.itemList = [this._formatGroupInputsGuardian(),this._formatGroupInputsDependent()];
        this.setState(newState);
    }
    _getSelectedValues = (values) =>{
        let newState = this.state;
        newState.dependents = values[1];
        newState.guardians = values[0];
        this.setState(newState);
    }
    _formatGroupInputsGuardian = () => {
        let tableHeader = [{ value: "Name", colSpan: 2 }, { value: "# of Groups", colSpan: 1 },{ value: "is Admin", colSpan: 1 },{ value: "Validation", colSpan: 1 }];
        let values = [];
        let tableBody = [];
        let selectedValues = this.state.guardians;
        let hiddenValues = [];

        for (var i = 0; i < this.props.guardianState.data.length; ++i) {
            let user = this._getUserByID(this.props.guardianState.data[i].user);
            values.push(this.props.guardianState.data[i]._id);
            let name = "-"
            if(this.props.guardianState.data[i].name.firstName.length>0){
                name = this.props.guardianState.data[i].name.firstName + " " + this.props.guardianState.data[i].name.lastName;
            }
            tableBody.push(name);
            tableBody.push(this.props.guardianState.data[i].groups.length);
            let isAdmin = "false";
            let status = "Pending";
            if(user){
                status = capitalizeFirstLetter(user.auth.status.statusValue);
                isAdmin = user.isAdmin.toString();
            }else{
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
        let tableHeader = [{ value: "Name", colSpan: 2 },{ value: "DOB", colSpan: 1 },{ value: "Age", colSpan: 1 }];
        let values = [];
        let tableBody = [];
        let selectedValues = this.state.dependents;
        let hiddenValues = [];

        for(var i=0;i<this.props.dependentState.data.length;++i){
            if(this.props.dependentState.data[i].group.length<1){
                values.push(this.props.dependentState.data[i]._id);
                tableBody.push(this.props.dependentState.data[i].name.firstName + " " + this.props.dependentState.data[i].name.lastName);
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
    _getUserByID = (userID) =>{
        for(var i=0;i<this.props.userState.data.length;++i){
            if(this.props.userState.data[i]._id == userID){
                return this.props.userState.data[i];
            }
        }
        return null;
    }
    render() {
        // let items = [];
        let groupsLabel = "Items";
        let groupTableSm = [];
        console.log(this.props);

        return (
            <>
                <div className="row">
                    {this.props.isGroupSelected ?
                        <div className="col-lg-12" style={{ marginBottom: '10px' }}>
                            <h4 style={{ display: 'inline' }}>Group Overview</h4>
                            <i title="edit" onClick={() => { this._toggleIsEditOverview() }} className="fas fa-edit"
                                style={{ paddingLeft: '20px', color: '#8862e0' }}></i>
                            <i title="delete" onClick={() => { this.props.delete(this.props.isGroupSelected) }} className="fas fa-trash"
                                style={{ paddingLeft: '20px', color: '#8862e0' }}></i>
                            <i title="close" onClick={() => { this.props.goHome() }} style={{ float: 'right', color: "#8862e0" }} className="fas fa-times"></i>
                        </div>
                        : null

                    }
                    <GroupOverview data={this.state.overview} update={this._update} updateError={this._updateError}
                        isUserSelected={this.props.isGroupSelected} groups={this.props.groupState.data} isEdit={this.state.overview.isEdit}>
                        {/* {this.props.isGroupSelected ?
                            <div className="row" style={{ marginTop: '10px', marginBottom: '10px' }}>
                                <div className="col-lg-12">
                                    <h4 style={{ display: 'inline' }}>Groupsjjh <span style={{ fontSize: '17px' }}>
                                        ({this.state.overview.values.groups.length})
                                        </span>
                                    </h4>
                                </div>
                            </div>
                            : null} */}
                        <div className="col-lg-12" style={{ paddingLeft: '12.5px', paddingRight: '12.5px' }}>
                            {this.state.itemList.length>0 && !this.props.isGroupSelected || this.state.overview.isEdit?
                                <Search isReadOnly={false} color={"#ffaf00"} placeholder="Search & Select Items" items={this.state.itemList}
                                    updateParentStateAll={this._getSelectedValues} dataSel={0} label={groupsLabel} />
                                :
                                // <GroupTableSm users={this.props.userState.data} groups={groupTableSm} />
                                null
                            }
                        </div>

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
    // fetchUpdateGroup: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
    groupState: state.groupState,
    userState: state.userState,
    dependentState: state.dependentState,
    guardianState: state.guardianState,
    theme: state.theme
});

export default connect(mapStateToProps, { fetchGuardians, fetchPopulatedDependents, togglePopUp, fetchCreateGroup, /*fetchUpdateGroup*/ })(CreateGroup);