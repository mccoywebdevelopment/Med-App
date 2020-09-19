import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGroups } from '../../../../actions/group';
import { togglePopUp } from "../../../../actions/popUp";
import { fetchCreateUser } from "../../../../actions/user";
import {emailValidator} from '../../../../config/validators';

import UserOverview from "./UserOverview";
import BelongsToGroup from '../dependent/BelongsToGroup';

class CreateUser extends React.Component {
    static propTypes = {
        userState: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this._initState();
        this._toggleGroupBtn = this._toggleGroupBtn.bind(this);
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
                    group: "",
                },
                values: {
                    email: "",
                    isAdmin: false,
                    group: {
                        isYes: false,
                        value: ""
                    }
                },
                body: null
            }
        }
    }
    _formatSelUser = (user) => {
        let newState = this.state;

        newState.overview.values.email = user.username;
        newState.overview.values.isAdmin = user.isAdmin;
        newState.overview.values.group = this._getGroupSeluser(user);

        newState.oldData = {
            overview: JSON.stringify(newState.overview.values)
        }
        this.setState(newState);
    }
    _isUpdated = () => {
        let oldDataOverview = this.state.oldData.overview;
        let overview = JSON.stringify(this.state.overview.values);

        if (oldDataOverview != overview) {
            return true;
        }
        return false;
    }
    _getGroupSeluser = (user) => {
        if (typeof (user.group) != 'undefined' && user.group.length > 0) {
            return {
                isYes: true,
                value: user.group
            }
        } else {
            return {
                isYes: false,
                value: ""
            }
        }
    }
    _updateGroupValue = (form, name, value) => {
        let newState = this.state;
        newState[form].values['group'][name] = value;
        this.setState(newState);
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
        newState.overview.errors.email = emailValidator(newState.overview.values.email, true).errorMsg;
        if (this.state.overview.values.group.isYes) {
            newState.overview.errors.group = this._groupValidation();
        }
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
        if (this._isOverviewErrors()){
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
            for (var ix = 0; ix < this.props.groupState.data[i].users.length; ++ix) {
                if (userID == this.props.groupState.data[i].users[ix]._id) {
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
    _getusersFromGroupSel = () => {
        let oldusers = [];
        for (var i = 0; i < this.props.groupState.data.length; ++i) {
            if (this.props.groupState.data[i]._id == this.state.overview.values.group.value) {
                oldusers = this.props.groupState.data[i].users;
            }
        }
        return oldusers;
    }
    _submit = () => {
        this._validation();
        if(!this._isOverviewErrors()){
            let body = this._formatBody();
    
            this.props.fetchCreateUser(body,this.state.overview.values.group.value);
            this.props.togglePopUp();
        }
        // if (!this._isOverviewErrors() && !this._isRxsMedErrors()) {
        //     let usersFromGroupSel = this._getusersFromGroupSel();
        //     if (this.props.isUserSelected) {
        //         //check if group is modified if so update group then call get populated users
        //         this.props.fetchUpdateuser(this.props.isUserSelected._id, this._formatBody(), this.props.groups,
        //             this._isGroupModified(), usersFromGroupSel, (res) => {
        //                 this._initState();
        //                 this.props.updateuser(res._id);

        //             });
        //     } else {
        //         this.props.fetchCreateuser(this._formatBody(), this.state.overview.values.group.value, usersFromGroupSel);
        //     }
        //     this.props.togglePopUp();
        // }
    }
    componentDidMount = () => {
        this.props.fetchGroups(() => {
            if (this.props.isUserSelected) {
                this._formatSeluser(this.props.isUserSelected);
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
    componentWillReceiveProps = (newProps) => {
        if (newProps.isUserSelected) {
            this._formatSeluser(newProps.isUserSelected);
        }
    }
    render(){
        return(
            <>
            <div className="row">
                    {this.props.isUserSelected ?
                        <div className="col-lg-12" style={{ marginBottom: '10px' }}>
                            <h4 style={{ display: 'inline' }}>user Overview</h4>
                            <i title="edit" onClick={() => { this._toggleIsEditOverview() }} className="fas fa-edit"
                                style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                            <i title="delete" onClick={() => { this.props.delete(this.props.isUserSelected) }} className="fas fa-trash"
                                style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                            <i title="close" onClick={() => { this.props.goHome() }} style={{ float: 'right' }} className="fas fa-times"></i>
                        </div>
                        : null
                    }
                    <UserOverview data={this.state.overview} update={this._update} updateError={this._updateError}
                        isUserSelected={this.props.isUserSelected} groups={this.props.groupState.data}>
                        {!this.props.isUserSelected || this.state.overview.isEdit ?
                            <BelongsToGroup toggle={this._toggleGroupBtn} update={this._updateGroupValue} form={"overview"}
                                groups={this.props.groupState.data} data={this.state.overview.values.group}
                                error={this.state.overview.errors.group} />
                            : null}
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
    fetchCreateUser: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    groupState: state.groupState,
    theme: state.theme
});

export default connect(mapStateToProps, {fetchGroups, togglePopUp, fetchCreateUser})(CreateUser);