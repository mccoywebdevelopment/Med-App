import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUsers, fetchDeleteUser } from "../../actions/user";
import { getPath } from '../../config/helpers';
import { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';

import UserTable from '../../components/admin/tables/UserTable';
import CreateUser from '../../components/admin/forms/user/CreateUser';

class UserDetails extends React.Component{
    state = {
        user:null,
        isRedirect:false,
        goHome:false
    }
    static propTypes = {
        userState: PropTypes.object.isRequired,
        groupState: PropTypes.object.isRequired
    };
    constructor(props){
        super(props);
        this._setUser = this._setUser.bind(this);
        this._toggleRedirect = this._toggleRedirect.bind(this);
        this._toggleHome = this._toggleHome.bind(this);
        this._deleteUser = this._deleteUser.bind(this);

        let id = getPath(window,"end");
        if(!this.props.userState.fetched){
            this.props.fetchUsers(()=>{});
        }
        this._setUser(this._findDepByID(id));
    }
    _findDepByID = (id) =>{
        for(var i=0;i<this.props.userState.data.length;++i){
            if(this.props.userState.data[i]._id == id){
                return this.props.userState.data[i];
            }
        }
        return null;
    }
    _setUser = (user) =>{
        let newState = this.state;
        newState.user = user;
        this.setState(newState);
    }
    _toggleRedirect = (user) =>{
        if(!user){
            let newState = this.state;
            newState.isRedirect = false;
            this.setState(newState);
        }else if(user._id != this.state.user._id){
            let newState = this.state;
            newState.isRedirect = user._id;
            this.setState(newState);
        }
    }
    _updateUser = (id) =>{
        this._setUser(this._findDepByID(id));
    }
    _redirectURL = () =>{
        return (
            <Redirect push to={'/admin/users/'+this.state.isRedirect} />
        );
    }
    _goHome = () =>{
        return (
            <Redirect push to={'/admin/users/'} />
        );
    }
    _getID = () =>{
        if(this.state.user){
            return this.state.user._id
        }
        return "";
    }
    _toggleHome = () =>{
        let newState = this.state;
        newState.goHome = true;
        this.setState(newState);
    }
    _deleteUser = (user) =>{
        if(window.confirm("Are you sure you want to delete "+user.username+" profile and all their data?")){
            let isRedirect = false;
            let isHome = false;
            if(this.props.userState.data.length<2){
                isHome = true;
            }else{
                for(var i=0;i<this.props.userState.data.length;++i){
                    if(this.props.userState.data[i]._id != user._id){
                        isRedirect = this.props.userState.data[i];
                        break;
                    }
                }
            }
            this.props.fetchDeleteUser(user._id);
            if(isHome){
                this._toggleHome();
            }else{
                this._toggleRedirect(isRedirect);
            }
        }
    }
    componentDidUpdate = () =>{
        let id = getPath(window,"end");
        if(id != this.state.user._id && !this.state.goHome){
            this._setUser(this._findDepByID(id));
            this._toggleRedirect(false);
        }else if(id != this.state.user._id){
            this._setUser(this._findDepByID(id));
        }
    }
    componentDidMount =()=>{
        let id = getPath(window,"end");
        if(!this.props.userState.fetched){
            this.props.fetchUsers(()=>{});
        }
        this._setUser(this._findDepByID(id));

        this.backListener = browserHistory.listen(location => {
            if (location.action === "POP") {
                id = getPath(window,"end");
                this._setUser(this._findDepByID(id));
            }
        });
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
                <div className="col-lg-6" style={{paddingLeft:'0px'}}>
                    {this.props.userState.data?
                    <UserTable selected={this._getID()} changeUserSel={this._toggleRedirect} 
                        users={this.props.userState.data} isSmall={true}/>
                    :null}
                </div>
                <div className="col-lg-6 my-overview" style={{padding:'none'}} style={{paddingRight:'0px'}}>
                    <div className="card" style={{padding:"20px"}}>
                        <CreateUser updateUser={this._updateUser} isUserSelected={this.state.user} 
                            goHome={this._toggleHome} delete={this._deleteUser}/>
                    </div>
                </div>
            </div>
            }
            </>
        )
    }
}
UserDetails.propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    fetchDeleteUser: PropTypes.func.isRequired
}
const mapStateToProps = (state) => ({
    userState: state.userState,
    groupState: state.groupState
});
export default connect(mapStateToProps,{fetchUsers,fetchDeleteUser})(UserDetails);