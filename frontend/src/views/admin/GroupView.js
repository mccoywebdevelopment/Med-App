import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { togglePopUp } from '../../actions/popUp';
import { fetchGroups } from "../../actions/group";
import { fetchGuardians } from "../../actions/guardian";
import { changeColor } from "../../actions/theme";

// import CardData from "../../components/shared/CardData/CardData";
import OverviewGroup from "../../components/admin/Overview/OverviewGroup";
import CreateUser from "../../components/admin/forms/user/CreateUser";
import CardData from '../../components/shared/CardData/CardData';
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
    _getNumberOfAdmins = () =>{
        let num = 0;
        for(var i=0;i<this.props.userState.data.length;++i){
            if(this.props.userState.data[i].isAdmin){
                num++;
            }
        }
        return num;
    }
    _toggleRedirect = (dep) =>{
        let newState = this.state;
        window.location = "/admin/users/" + dep._id
        this.setState(newState);
    }
    _getNumberUnAuthUsers = () =>{
        let num = 0;
        for(var i=0;i<this.props.userState.data.length;++i){
            if(!this.props.userState.data[i].auth.isVerified){
                num++;
            }
        }
        return num;
    }
    componentDidMount = () =>{
        this.props.changeColor("#ffaf00");
        this.props.fetchGroups(true);
    }
    render() {
        const list = () =>{
            return this.props.groupState.data.map((item,key)=>{
                return(
                        <div key={"item"+key} className="col-lg-4" style={{marginTop:"20px"}}>
                            <CardData index={key} labels={["Dependents","Users","Admins"]}
                                data={[item.dependents.length,item.guardians.length,0]}
                                colors={['#2196f3','#FCB031',"#8862E0"]}
                                title={item.name} href="test"
                                details={item.dependents.length + " Dependents, "+item.guardians.length+" Guardians, 0 Admins"}/>
                        </div>
                )
            });
        }
        return (
            <>
                <div className="row">
                    <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h4 className="view-header">Groups</h4>
                                </div>
                                <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                    <OverviewGroup dependentsLength={this.props.userState.data.length}
                                     admins={this._getNumberOfAdmins()} pendingUsers={this._getNumberUnAuthUsers()}/>
                                </div>
                                <div className="col-lg-12" style={{ marginBottom: "30px"}}>
                                    <button type="button"
                                    onClick={()=>{this.props.togglePopUp("Add User",<CreateUser/>,"90%")}} 
                                    className="btn btn-warning btn-fw">Add</button>
                                </div>
                            </div>
                        <div className="row">
                            <div className="col-lg-12">
                                {this.props.groupState.data.length>0?
                                <>
                                <div className="row" style={{marginBottom:'30px'}}>
                                    {list()}
                                </div>
                                </>
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
    fetchGuardians: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    userState: state.userState,
    groupState: state.groupState,
    guardianState: state.guardianState
});

export default connect(mapStateToProps, {changeColor, togglePopUp,
         fetchGroups, fetchGuardians, fetchGroups})(UserView);