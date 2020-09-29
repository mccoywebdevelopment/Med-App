import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGroups } from '../../../../actions/group';
import { togglePopUp } from "../../../../actions/popUp";
import { fetchCreateGroup, fetchUpdateGroup } from "../../../../actions/group";
import { emailValidator } from '../../../../config/validators';

import GroupOverview from "./GroupOverview";

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
        this._updateGroupValue = this._updateGroupValue.bind(this);
        this._toggleGroupBtn = this._toggleGroupBtn.bind(this);
    }
    _initState = () => {
        this.state = {
            oldData: {
                overview: null,
                dependentList: null,
                userList: null
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
            dependentList: [],
            userList: [],
        }
    }
    _formatSelGroup = (group) => {
        let newState = this.state;

        newState.overview.values.email = group.groupname;
        newState.overview.values.isAdmin = group.isAdmin;
        newState.overview.values.group = this._getGroupSelgroup(group);

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
    _getGroupSelgroup = (group) => {
        let group = this._getGroupIDByGroupID(group._id);
        if (group.length > 0) {
            return {
                isYes: true,
                value: group
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
        if (this._isOverviewErrors()) {
            alert("Please fix the errors below:");
        }
    }
    _formatBody = () => {
        let body = {
            groupname: this.state.overview.values.email,
            isAdmin: this.state.overview.values.isAdmin
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
    _getGuardianByGroupID = (groupID) =>{
        for(var i=0;i<this.props.guardianState.data.length;++i){
            if(this.props.guardianState.data[i].group == groupID){
                return this.props.guardianState.data[i];
            }
        }
        return null;
    }
    _getGuardiansFromGroupSel = () => {
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
            if(this.props.isGroupSelected){
                this.props.fetchUpdateGroup(this.props.isGroupSelected._id,body,this._isGroupModified(),
                    this._getGuardianByGroupID(this.props.isGroupSelected._id)._id,(res)=>{
                        this._initState();
                        this.props.updateGroup(res._id);
                    });
            }else{
                this.props.fetchCreateGroup(body,this.state.overview.values.group.value);
            }
            this.props.togglePopUp();
        }
    }
    componentDidMount = () => {
        this.props.fetchGroups((groups) => {
            if (this.props.isGroupSelected) {
                this._formatSelGroup(this.props.isGroupSelected);
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
        if (newProps.isGroupSelected) {
            this._formatSelGroup(newProps.isGroupSelected);
        }
    }
    render() {
        return (
            <>
                <div className="row">
                    {this.props.isGroupSelected ?
                        <div className="col-lg-12" style={{ marginBottom: '10px' }}>
                            <h4 style={{ display: 'inline' }}>Group Overview</h4>
                            <i title="edit" onClick={() => { this._toggleIsEditOverview() }} className="fas fa-edit"
                                style={{ paddingLeft: '20px', color: '#8862e0' }}></i>
                                {!this.props.isGroupSelected.auth.isVerified?
                            <i title="Send Invite" onClick={() => { this.props.sendTokenViaEmail(this.props.isGroupSelected.groupname) }} className="fas fa-envelope"
                                style={{ paddingLeft: '20px', color: '#8862e0' }}></i>
                                :null}
                            <i title="delete" onClick={() => { this.props.delete(this.props.isGroupSelected) }} className="fas fa-trash"
                                style={{ paddingLeft: '20px', color: '#8862e0' }}></i>
                            <i title="close" onClick={() => { this.props.goHome() }} style={{ float: 'right', color: "#8862e0" }} className="fas fa-times"></i>
                        </div>
                        : null
                    }
                    <GroupOverview data={this.state.overview} update={this._update} updateError={this._updateError}
                        isGroupSelected={this.props.isGroupSelected} groups={this.props.groupState.data} isEdit={this.state.overview.isEdit}>
                        {!this.props.isGroupSelected || this.state.overview.isEdit ?
                            <BelongsToGroup toggle={this._toggleGroupBtn} update={this._updateGroupValue} form={"overview"}
                                groups={this.props.groupState.data} data={this.state.overview.values.group}
                                error={this.state.overview.errors.group} isOffset={2} />
                            : null}
                        <GroupOverviewReadOnly group={this.props.isGroupSelected} isEdit={this.state.overview.isEdit} />
                    </GroupOverview>
                </div>
                <div className="row" style={{ marginTop: '30px', marginBottom: '30px' }}>
                    {!this.props.isGroupSelected ?
                        <button className="btn btn-info btn-fw" onClick={() => { this._submit() }}>Submit</button>
                        : this.props.isGroupSelected && this._isUpdated() ?
                            <button className="btn btn-info btn-fw" onClick={() => { this._submit() }}>Update</button>
                            : <button className="btn btn-primary" style={{ visibility: 'hidden' }}>&nbsp;</button>
                    }
                </div>
            </>
        );
    }
}

CreateGroup.propTypes = {
    togglePopUp: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired,
    fetchCreateGroup: PropTypes.func.isRequired,
    fetchUpdateGroup: PropTypes.func.isRequired,
    sendTokenViaEmail: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    groupState: state.groupState,
    groupState: state.groupState,
    guardianState: state.guardianState,
    theme: state.theme
});

export default connect(mapStateToProps, { fetchGroups, togglePopUp, fetchCreateGroup, fetchUpdateGroup, sendTokenViaEmail })(CreateGroup);