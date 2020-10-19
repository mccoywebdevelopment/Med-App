import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { togglePopUp } from '../../actions/popUp';
import { fetchGroups, fetchDeleteGroup } from "../../actions/group";
import { fetchGuardians } from "../../actions/guardian";
import { changeColor } from "../../actions/theme";
import { reduceFraction } from "../../config/helpers";

import OverviewGroup from "../../components/admin/Overview/OverviewGroup";
import CreateGroup from "../../components/admin/forms/group/CreateGroup";
import GroupTable from "../../components/admin/tables/GroupTable";

class UserView extends React.Component {
    static propTypes = {
        userState: PropTypes.object.isRequired,
        groupState: PropTypes.object.isRequired,
        guardianState: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this._deleteGroup = this._deleteGroup.bind(this);
    }
    _getNumberOfAdmins = (guardians) =>{
        let num = 0;
        for(var i=0;i<guardians.length;++i){
            let userID = guardians[i].user;
            let found = false;
            for(var ix=0;ix<this.props.userState.data.length;++ix){
                if(this.props.userState.data[ix]._id == userID 
                    && this.props.userState.data[ix].isAdmin){
                        num++;
                        found = true;
                }
            }
            if(!found){
                num++;
            }
        }
        return num;
    }
    _deleteGroup = (group) =>{
        if(window.confirm("Are you sure you want to delete "+group.name+" ?")){
            this.props.fetchDeleteGroup(group._id);
        }
    }
    _getGroupsWithoutGuardians = () =>{
        let groups = this.props.groupState.data;
        let length = 0;
        for(var i=0;i<groups.length;++i){
            if(groups[i].guardians.length==0){
                length++;
            }
        }
        return length;
    }
    _getAvgUserToDependent = () =>{
        let groups = this.props.groupState.data;
        let depLen = 0;
        let guardLen = 0;
        for(var i=0;i<groups.length;++i){
            depLen = depLen + groups[i].dependents.length;
            guardLen = guardLen + groups[i].guardians.length;
        }
        let fract = reduceFraction(guardLen,depLen);

        return (fract[0].toFixed(1) + " : " + fract[1].toFixed(1));
    }
    _toggleRedirect = (dep) =>{
        let newState = this.state;
        window.location = "/admin/users/" + dep._id
        this.setState(newState);
    }
    componentDidMount = () =>{
        this.props.changeColor("#ffaf00");
        this.props.fetchGroups(true);
    }
    render() {
        // const list = () =>{
        //     return this.props.groupState.data.map((item,key)=>{
        //         let adminLen = this._getNumberOfAdmins(item.guardians)
        //         let guardianLength = item.guardians.length - adminLen;
        //         let paddingRight = "";
        //         if((key + 1) % 4 == 0){
        //             paddingRight = '0px';
        //         }
        //         return(
        //                 <div key={"item"+key} className="col-lg-3" style={{marginBottom:"20px",paddingLeft:'0px',paddingRight:paddingRight}}>
        //                     <CardData index={key} labels={["Dependents","Users","Admins"]}
        //                         data={[item.dependents.length,guardianLength,adminLen]}
        //                         colors={['#2196f3','#FCB031',"#8862E0"]}
        //                         title={item.name} href="test"
        //                         details={item.dependents.length + " Dependents, \n"+guardianLength+" Guardians, "+adminLen+" Admins"}/>
        //                 </div>
        //         )
        //     });
        // }
        return (
            <>
                <div className="row">
                    <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h4 className="view-header">Groups</h4>
                                </div>
                                <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                    <OverviewGroup groupLength={this.props.groupState.data.length}
                                     avgUserToDependent={this._getAvgUserToDependent()} groupsWithoutGuardians={this._getGroupsWithoutGuardians()}/>
                                </div>
                                <div className="col-lg-12" style={{ marginBottom: "30px"}}>
                                    <button type="button"
                                    onClick={()=>{this.props.togglePopUp("Add Group",<CreateGroup/>,"90%")}} 
                                    className="btn btn-warning btn-fw">Add</button>
                                </div>
                            </div>
                        <div className="row">
                            <div className="col-lg-12">
                                {this.props.groupState.data.length>0?
                                    <GroupTable users={this.props.userState.data} groups={this.props.groupState.data}
                                    delete={this._deleteGroup} changeUserSel={this._toggleRedirect}/>
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
    fetchGroups: PropTypes.func.isRequired,
    changeColor: PropTypes.func.isRequired,
    fetchGuardians: PropTypes.func.isRequired,
    fetchDeleteGroup: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    userState: state.userState,
    groupState: state.groupState,
    guardianState: state.guardianState
});

export default connect(mapStateToProps, {changeColor, togglePopUp,
         fetchGroups, fetchGuardians, fetchGroups, fetchDeleteGroup})(UserView);