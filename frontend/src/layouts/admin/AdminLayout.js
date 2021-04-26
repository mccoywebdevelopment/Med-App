import React from 'react';

//DO NOT DELETE CSS FILES AND SCRIPTS ARE ATTATCH!!!========
import Header from "../../components/admin/partials/Header";
import Footer from "../../components/admin/partials/Footer";
//==========================================================
import "../../assets/css/myCss.css";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createMessage } from '../../actions/messages'
import { API_URI } from "../../config/variables";

import Loading from "../../components/shared/Loading/Loading";
import PopUp from "../../components/shared/PopUp/PopUp";

class AdminLayout extends React.Component {
    static propTypes = {
        message: PropTypes.object.isRequired,
        createMessage: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired,
        notifications: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
    }
    _getNumberOfNotifications = () =>{
        let read = localStorage.getItem('NUM_OF_NOTIFICATIONS_READ') || 0;
        return (this.props.notifications.data.length - read)
    }
    _isCurrentURL = (url) => {
        // alert(url);
        if (window.location.href.includes(url)) {
            return true;
        }
        return false;
    }
    render() {
        let logoutPath = API_URI + "/auth/logout/" + localStorage.getItem('JWT');
        return (
            <>
                <div className="my-side-bar">
                    <div className={"my-brand " + (this._isCurrentURL("/admin/home") ? "my-nav-selected" : "")} 
                        style={{borderLeftColor:this.props.theme.pagePrimaryColor}}>
                        <a href="/admin/dependents" className="my-nav-item">
                            <i title="Home" className="fas fa-notes-medical" style={{color:this.props.theme.pagePrimaryColor}}></i>
                        </a>
                    </div>
                    <div className={"" + (this._isCurrentURL("/admin/dependents") ? "my-nav-selected" : "")} 
                        style={{borderLeftColor:this.props.theme.pagePrimaryColor}}>
                        <a href="/admin/dependents" className="my-nav-item">
                            <i title="Medication(s)" className="fas fa-capsules" style={{color:this.props.theme.pagePrimaryColor}}></i>
                        </a>
                    </div>
                    <div className={"" + (this._isCurrentURL("/admin/groups") ? "my-nav-selected" : "")} 
                        style={{borderLeftColor:this.props.theme.pagePrimaryColor}}>
                        <a href="/admin/groups" className="my-nav-item">
                            <i title="Group(s)" className="fas fa-users" style={{color:this.props.theme.pagePrimaryColor}}></i>
                        </a>
                    </div>
                    <div className={"" + (this._isCurrentURL("/admin/users") ? "my-nav-selected" : "")} 
                        style={{borderLeftColor:this.props.theme.pagePrimaryColor}}>
                        <a href="/admin/users" className="my-nav-item">
                            <i title="User(s)" className="fas fa-user-shield" style={{color:this.props.theme.pagePrimaryColor}}></i>
                        </a>
                    </div>
                    <div className={"" + (this._isCurrentURL("/admin/notifications") ? "my-nav-selected" : "")} 
                        style={{borderLeftColor:this.props.theme.pagePrimaryColor}}>
                        <a href="/admin/notifications" className="my-nav-item">
                            <i title="notification(s)" className="fas fa-bell" style={{color:this.props.theme.pagePrimaryColor}}></i>
        {this._getNumberOfNotifications()>0?<span className="badge badge-light my-badge">{this._getNumberOfNotifications()}</span>:null}
                        </a>
                    </div>
                    <div className={"" + (this._isCurrentURL("/admin/profile") ? "my-nav-selected" : "")} 
                        style={{borderLeftColor:this.props.theme.pagePrimaryColor}}>
                        <a href="/admin/profile" className="my-nav-item">
                            <i title="My Profile" className="fas fa-cog" style={{color:this.props.theme.pagePrimaryColor}}></i>
                        </a>
                    </div>

                    <div style={{marginTop:'100px'}}> 
                        <a href={logoutPath} className="my-nav-item">
                            <i title="Log Out" className="fas fa-sign-out-alt" style={{color:this.props.theme.pagePrimaryColor}}></i>
                        </a>
                    </div>
                </div>
                <div className="my-top-nav">

                </div>
                <div className="main">
                    {this.props.message.text?
                        <div className="alert-container">
                            <div className="alert-container">
                                <div className={"alert alert-dismissible alert-" + this.props.message.alertType} role="alert">
                                    {this.props.message.text}
                                    {this.props.message.text.length>0?
                                    <button type="button" onClick={()=>{this.props.createMessage("",null)}} className="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    :null}
                                </div>
                            </div>
                        </div>
                    :null
                    }
                    <div>
                        {this.props.children}
                    </div>
                    <div style={{marginTop:'30px'}}>
                    &nbsp;
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    message: state.message,
    theme: state.theme,
    notifications: state.notifications
});

export default connect(mapStateToProps, { createMessage })(AdminLayout);