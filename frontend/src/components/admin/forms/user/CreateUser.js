import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGroups } from '../../../../actions/group';
import { togglePopUp } from "../../../../actions/popUp";
import { fetchCreateUser, fetchUpdateUser, sendTokenViaEmail} from "../../../../actions/user";
import { emailValidator } from '../../../../config/validators';

import UserOverview from "./UserOverview";
import Search from '../../../../components/shared/Search/Search';
import UserOverviewReadOnly from "./UserOverviewReadOnly";

class CreateUser extends React.Component {
    static propTypes = {
        userState: PropTypes.object.isRequired,
        groupState: PropTypes.object.isRequired,
        guardianState: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this._initState();
        this._update = this._update.bind(this);
        this._updateError = this._updateError.bind(this);
        this._updateGroupValue = this._updateGroupValue.bind(this);
    }
    _initState = () => {
        this.state = {
            oldData: {
                overview: null,
            },
            overview: {
                errors: {
                    email: "",
                    isAdmin: "",
                    groups: "",
                },
                values: {
                    email: "",
                    isAdmin: false,
                    groups: []
                },
                body: null,
                isEdit: false
            }
        }
    }
    _formatSelUser = (user) => {
        let newState = this.state;

        newState.overview.values.email = user.username;
        newState.overview.values.isAdmin = user.isAdmin;
        newState.overview.values.groups = this._getGroupIDsByUserID(user._id);

        newState.oldData = {
            overview: JSON.stringify(newState.overview.values)
        }
        this.setState(newState);
    }
    _getSelValuesFromGroupInput = (selected) =>{
        return selected;
    }
    _isUpdated = () => {
        let oldDataOverview = this.state.oldData.overview;
        let overview = JSON.stringify(this.state.overview.values);

        if (oldDataOverview != overview) {
            return true;
        }
        return false;
    }
    _getGroupIDsByUserID = (id) => {
        let arr = [];
        if (this.props.groupState.data) {
            let groups = this.props.groupState.data;

            for (var i = 0; i < groups.length; ++i) {
                for (var ix = 0; ix < groups[i].guardians.length; ++ix) {
                    if (id == groups[i].guardians[ix].user) {
                        arr.push(groups[i]._id);
                    }
                }
            }
        }

        return arr;
    }
    _getUserByGuardianID = (guardianID) =>{
        let guardians = this.props.guardianState.data;
        for(var i=0;i<guardians.length;++i){
            if(guardians[i]._id == guardianID){
                return this._getUserByID(guardians[i].user);
            }
        }
        return null;
    }
    _getUserByID = (userID) =>{
        let users = this.props.userState.data;
        for(var i=0;i<users.length;++i){
            if(userID == users[i]._id){
                return users[i];
            }
        }
        return null;
    }
    _updateGroupValue = (value) => {
        let newState = this.state;
        newState.overview.values.groups = value;
        this.setState(newState);
    }
    _update = (form, inputName, value) => {
        let newState = this.state;
        newState[form].values[inputName] = value;
        this.setState(newState);
    }
    _updateError = (form, inputName, value) => {
        let newState = this.state;
        newState[form].errors[inputName] = value;
        this.setState(newState);
    }
    _overviewValidation = () => {
        let newState = this.state;
        newState.overview.errors.email = emailValidator(newState.overview.values.email, true).errorMsg;
        newState.overview.errors.groups = "";
        this.setState(newState);
    }
    _toggleIsEditOverview = () => {
        let newState = this.state;
        newState.overview.isEdit = !newState.overview.isEdit;
        this.setState(newState);
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
            username: this.state.overview.values.email,
            isAdmin: this.state.overview.values.isAdmin
        }
        return body;
    }
    _getGroupID = (userID) => {
        for (var i = 0; i < this.props.groupState.data.length; ++i) {
            for (var ix = 0; ix < this.props.groupState.data[i].guardians.length; ++ix) {
                if (userID == this.props.groupState.data[i].guardians[ix].user) {
                    return this.props.groupState.data[i]._id;
                }
            }
        }
        return null;
    }
    /*
        Make this a for loop....
    */
    _isGroupModified = () => {
        let oldGroup = JSON.parse(this.state.oldData.overview).groups;
        let group = this.state.overview.values.groups;
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
                    groupID: this._getGroupID(this.props.isUserSelected._id),
                    isSwitched: false,
                    isRemoved: true,
                    isAdd: false
                }
            }
        } else {
            return null;
        }
    }
    _getGuardianByUserID = (userID) =>{
        for(var i=0;i<this.props.guardianState.data.length;++i){
            if(this.props.guardianState.data[i].user == userID){
                return this.props.guardianState.data[i];
            }
        }
        return null;
    }
    _getGuardiansFromGroupSel = () => {
        /* make this a for loop.*/
        let oldGuardians = [];
        for (var i = 0; i < this.props.groupState.data.length; ++i) {
            if (this.props.groupState.data[i]._id == this.state.overview.values.group.value) {
                return(this.props.groupState.data[i].guardians);
            }
        }
        return oldGuardians;
    }
    _submit = () => {
        this._validation();
        if (!this._isOverviewErrors()) {
            let body = this._formatBody();
            if(this.props.isUserSelected){
                this.props.fetchUpdateUser(this.props.isUserSelected._id,body,this._isGroupModified(),
                    this._getGuardianByUserID(this.props.isUserSelected._id)._id,(res)=>{
                        this._initState();
                        this.props.updateUser(res._id);
                    });
            }else{
                this.props.fetchCreateUser(body,this.state.overview.values.groups);
            }
            this.props.togglePopUp();
        }
    }
    componentDidMount = () => {
        this.props.fetchGroups((groups) => {
            if (this.props.isUserSelected) {
                this._formatSelUser(this.props.isUserSelected);
            }
        });
    }
    _fetchGroups = (done) => {
        let newState = this.state;
        this.props.fetchGroups(() => {
            newState.fetchedGroups = true;
            this.setState(newState);
            done();
        });
    }
    _getNumOfAdmins=(guardians)=>{
        let users = [];
        for(var i=0;i<guardians.length;++i){
            let user = this._getUserByID(guardians[i].user);
            if(user){
                users.push(user);
            }
        }
        let admins = 0;
        for(var i=0;i<users.length;++i){
            if(users[i].isAdmin){
                admins++;
            }
        }
        return admins;
    }
    _formatGroupInputs = () =>{
        let tableHeader = [{value:"Name",colSpan:2},{value:"#Dependents",colSpan:1},{value:"#Users",colSpan:1},{value:"#Admins",colSpan:1}];
        let values = [];
        let tableBody = [];
        let selectedValues = this.state.overview.values.groups;
        let hiddenValues = [];
    
        for(var i=0;i<this.props.groupState.data.length;++i){
            values.push(this.props.groupState.data[i]._id);
            tableBody.push(this.props.groupState.data[i].name);
            tableBody.push(this.props.groupState.data[i].dependents.length);
            let admins = this._getNumOfAdmins(this.props.groupState.data[i].guardians);
            
            tableBody.push(this.props.groupState.data[i].guardians.length - admins);
            tableBody.push(admins);
        }
        return {
            name:"Groups",
            data:{
                values:values,
                selectedValues:selectedValues,
                hiddenValues:hiddenValues,
                tableData:[tableHeader,tableBody]
            }
        }
    }
    componentWillReceiveProps = (newProps) => {
        if (newProps.isUserSelected) {
            this._formatSelUser(newProps.isUserSelected);
        }
    }
    render() {
        let items = [this._formatGroupInputs()];
        return (
            <>
                <div className="row">
                    {this.props.isUserSelected ?
                        <div className="col-lg-12" style={{ marginBottom: '10px' }}>
                            <h4 style={{ display: 'inline' }}>User Overview</h4>
                            <i title="edit" onClick={() => { this._toggleIsEditOverview() }} className="fas fa-edit"
                                style={{ paddingLeft: '20px', color: '#8862e0' }}></i>
                                {!this.props.isUserSelected.auth.isVerified?
                            <i title="Send Invite" onClick={() => { this.props.sendTokenViaEmail(this.props.isUserSelected.username) }} className="fas fa-envelope"
                                style={{ paddingLeft: '20px', color: '#8862e0' }}></i>
                                :null}
                            <i title="delete" onClick={() => { this.props.delete(this.props.isUserSelected) }} className="fas fa-trash"
                                style={{ paddingLeft: '20px', color: '#8862e0' }}></i>
                            <i title="close" onClick={() => { this.props.goHome() }} style={{ float: 'right', color: "#8862e0" }} className="fas fa-times"></i>
                        </div>
                        : null
                    }
                    <UserOverview data={this.state.overview} update={this._update} updateError={this._updateError}
                        isUserSelected={this.props.isUserSelected} groups={this.props.groupState.data} isEdit={this.state.overview.isEdit}>
                        {!this.props.isUserSelected || this.state.overview.isEdit ?
                            <div className="col-lg-12" style={{paddingLeft:'12.5px',paddingRight:'12.5px'}}>
                                <Search color={"#8862e0"} placeholder="Search & Select Group(s)" items={items} label="Groups"
                                    updateParentState={this._updateGroupValue} dataSel={0}/>
                            </div>
                            : null}
                        <UserOverviewReadOnly user={this.props.isUserSelected} isEdit={this.state.overview.isEdit} />
                    </UserOverview>
                </div>
                <div className="row" style={{ marginTop: '30px', marginBottom: '30px' }}>
                    {!this.props.isUserSelected ?
                        <button className="btn btn-info btn-fw" onClick={() => { this._submit() }}>Submit</button>
                        : this.props.isUserSelected && this._isUpdated() ?
                            <button className="btn btn-info btn-fw" onClick={() => { this._submit() }}>Update</button>
                            : <button className="btn btn-primary" style={{ visibility: 'hidden' }}>&nbsp;</button>
                    }
                </div>
            </>
        );
    }
}

CreateUser.propTypes = {
    togglePopUp: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired,
    fetchCreateUser: PropTypes.func.isRequired,
    fetchUpdateUser: PropTypes.func.isRequired,
    sendTokenViaEmail: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    userState: state.userState,
    groupState: state.groupState,
    guardianState: state.guardianState,
    theme: state.theme
});

export default connect(mapStateToProps, { fetchGroups, togglePopUp, fetchCreateUser, fetchUpdateUser, sendTokenViaEmail })(CreateUser);