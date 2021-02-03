import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchGroups, fetchDeleteGroup } from "../../actions/group";
import { changeColor } from "../../actions/theme";
import { fetchUsers } from "../../actions/user";
import { getPath } from '../../config/helpers';
import { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';

import GroupTable from '../../components/admin/tables/GroupTable';
import CreateGroup from '../../components/admin/forms/group/CreateGroup';

class GroupDetails extends React.Component{
    state = {
        group:null,
        isRedirect:false,
        goHome:false
    }
    static propTypes = {
        userState: PropTypes.object.isRequired,
        groupState: PropTypes.object.isRequired
    };
    constructor(props){
        super(props);
        this._setGroup = this._setGroup.bind(this);
        this._toggleRedirect = this._toggleRedirect.bind(this);
        this._toggleHome = this._toggleHome.bind(this);
        this._deleteGroup = this._deleteGroup.bind(this);
    }
    _findByID = (id) =>{
        for(var i=0;i<this.props.groupState.data.length;++i){
            if(this.props.groupState.data[i]._id == id){
                return this.props.groupState.data[i];
            }
        }
        return null;
    }
    _setGroup = (group) =>{
        let newState = this.state;
        newState.group = group;
        this.setState(newState);
    }
    _toggleRedirect = (group) =>{
        if(!group){
            let newState = this.state;
            newState.isRedirect = false;
            this.setState(newState);
        }else if(group._id != this.state.group._id){
            let newState = this.state;
            newState.isRedirect = group._id;
            this.setState(newState);
        }
    }
    _updateGroup = (id) =>{
        this._setGroup(this._findByID(id));
    }
    _redirectURL = () =>{
        return (
            <Redirect push to={'/admin/groups/'+this.state.isRedirect} />
        );
    }
    _goHome = () =>{
        return (
            <Redirect push to={'/admin/groups/'} />
        );
    }
    _getID = () =>{
        if(this.state.group){
            return this.state.group._id
        }
        return "";
    }
    _toggleHome = () =>{
        let newState = this.state;
        newState.goHome = true;
        this.setState(newState);
    }
    _deleteGroup = (group) =>{
        if(window.confirm("Are you sure you want to delete "+group.groupname+" profile and all their data?")){
            let isRedirect = false;
            let isHome = false;
            if(this.props.groupState.data.length<2){
                isHome = true;
            }else{
                for(var i=0;i<this.props.groupState.data.length;++i){
                    if(this.props.groupState.data[i]._id != group._id){
                        isRedirect = this.props.groupState.data[i];
                        break;
                    }
                }
            }
            this.props.fetchDeleteGroup(group._id);
            if(isHome){
                this._toggleHome();
            }else{
                this._toggleRedirect(isRedirect);
            }
        }
    }
    componentDidUpdate = () =>{
        let id = getPath(window,"end");
        if(id != this.state.group._id && !this.state.goHome){
            this._setGroup(this._findByID(id));
            this._toggleRedirect(false);
        }else if(id != this.state.group._id){
            this._setGroup(this._findByID(id));
        }
    }
    componentDidMount =()=>{
        let id = getPath(window,"end");
        if(!this.props.groupState.fetched){
            this.props.fetchGroups(()=>{});
        }
        this._setGroup(this._findByID(id));

        this.backListener = browserHistory.listen(location => {
            if (location.action === "POP") {
                id = getPath(window,"end");
                this._setGroup(this._findByID(id));
            }
        });

        this.props.changeColor("#ffaf00");
    }
    render(){
        return(
            <>
            {this.state.isRedirect?
                <>
                    {this._redirectURL()}
                </>
            :this.state.goHome?
                <>
                    {this._goHome()}
                </>
            :
            <div className="row">
                {this.props.groupState.data?
                <>
                <div className="col-lg-6" style={{paddingLeft:'0px'}}>
                    <GroupTable selected={this._getID()} changeGroupSel={this._toggleRedirect} 
                        groups={this.props.groupState.data} isSmall={true} users={this.props.userState.data}/>
                </div>
                <div className="col-lg-6 my-overview" style={{padding:'none'}} style={{paddingRight:'0px'}}>
                    <div className="card" style={{padding:"20px"}}>
                        <CreateGroup updateGroup={this._updateGroup} groups={this.props.groupState.data} isGroupSelected={this.state.group} 
                            goHome={this._toggleHome} delete={this._deleteGroup}/>
                    </div>
                </div>
                </>
                :null}
            </div>
            }
            </>
        )
    }
}
GroupDetails.propTypes = {
    fetchGroups: PropTypes.func.isRequired,
    fetchDeleteGroup: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    changeColor: PropTypes.func.isRequired,
}
const mapStateToProps = (state) => ({
    userState: state.userState,
    groupState: state.groupState
});
export default connect(mapStateToProps,{fetchGroups,fetchDeleteGroup,fetchUsers,changeColor})(GroupDetails);