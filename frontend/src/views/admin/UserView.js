import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { togglePopUp } from '../../actions/popUp';
import { fetchUsers, fetchDeleteUser } from "../../actions/user";
import { fetchGroups } from "../../actions/group";
import { fetchGuardians } from "../../actions/guardian";
import { changeColor } from "../../actions/theme";

import UserTable from "../../components/admin/tables/UserTable";
import OverviewUser from "../../components/admin/Overview/OverviewUser";
import CreateUser from "../../components/admin/forms/user/CreateUser";
/*
    Need to update table/this.state after I add a new user like I did in dependents view.
*/

class UserView extends React.Component {
    static propTypes = {
        userState: PropTypes.object.isRequired,
        groupState: PropTypes.object.isRequired,
        guardianState: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this._deleteUser = this._deleteUser.bind(this);
    }
    _deleteUser = (user) =>{
        if(window.confirm("Are you sure you want to delete "+user.username+" profile and all their data?")){
            this.props.fetchDeleteUser(user._id);
        }
    }
    // _cobmineGuardian = (users,guardians) =>{
    //     if(!users){
    //         return []
    //     }else if(!guardians){
    //         return users
    //     }
    //     let data = users;
    //     for(var i=0;i<guardians.length;++i){
    //         for(var ix=0;ix<users.length;++ix){
    //             if(guardians[i].user == users[ix]._id){
    //                 data[ix].guardian = guardians[i];
    //             }
    //         }
    //     }
    //     return data;
    // }
    componentDidMount = () =>{
        this.props.changeColor("#8862e0");
        this.props.fetchUsers(true);
    }
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h4 className="view-header">Users</h4>
                                </div>
                                <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                    <OverviewUser dependentsLength={this.props.userState.data.length}
                                     averageMed={2} averageAge={2}/>
                                </div>
                                <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                    <button type="button" 
                                    onClick={()=>{this.props.togglePopUp("Add User",<CreateUser/>,"90%")}} 
                                    className="btn btn-info btn-fw">Add</button>
                                </div>
                            </div>
                        <div className="row">
                            <div className="col-lg-12">
                                {this.props.userState.data.length>0?
                                <UserTable users={this.props.userState.data}
                                 delete={this._deleteUser}/>
                                 :null}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
UserView.propTypes = {
    togglePopUp: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    fetchDeleteUser: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired,
    changeColor: PropTypes.func.isRequired,
    fetchGuardians: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    userState: state.userState,
    groupState: state.groupState,
    guardianState: state.guardianState
});

export default connect(mapStateToProps, {changeColor, togglePopUp,
         fetchUsers, fetchDeleteUser, fetchGuardians, fetchGroups})(UserView);