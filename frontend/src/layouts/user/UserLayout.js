import React from 'react';

//DO NOT DELETE CSS FILES AND SCRIPTS ARE ATTATCH!!!========
import Header from "../../components/admin/partials/Header";
import Footer from "../../components/admin/partials/Footer";
//==========================================================
import "../../assets/css/myCss.css";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createMessage } from '../../actions/messages'

class UserLayout extends React.Component {
    static propTypes = {
        message: PropTypes.object.isRequired,
        createMessage: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
    }
    _isCurrentURL = (url) => {
        // alert(url);
        if (window.location.href.includes(url)) {
            return true;
        }
        return false;
    }
    render() {
        return (
            <>
                <div className="my-side-bar content-desktop">
                    <div className={"my-brand " + (this._isCurrentURL("/admin/home") ? "my-nav-selected" : "")}
                        style={{ borderLeftColor: this.props.theme.pagePrimaryColor }}>
                        <a href="/user/dependents" className="my-nav-item">
                            <i title="Home" className="fas fa-notes-medical" style={{ color: this.props.theme.pagePrimaryColor }}></i>
                        </a>
                    </div>
                    <div className={"" + (this._isCurrentURL("/user/dependents") ? "my-nav-selected" : "")}
                        style={{ borderLeftColor: this.props.theme.pagePrimaryColor }}>
                        <a href="/admin/dependents" className="my-nav-item">
                            <i title="Medication(s)" className="fas fa-capsules" style={{ color: this.props.theme.pagePrimaryColor }}></i>
                        </a>
                    </div>
                    <div className={"" + (this._isCurrentURL("/admin/profile") ? "my-nav-selected" : "")}
                        style={{ borderLeftColor: this.props.theme.pagePrimaryColor }}>
                        <a href="/admin/profile" className="my-nav-item">
                            <i title="My Profile" className="fas fa-cog" style={{ color: this.props.theme.pagePrimaryColor }}></i>
                        </a>
                    </div>
                </div>
                <div className="my-top-nav content-desktop">
                </div>
                <div className="navbar-bottom content-mobile content-mobile-navbar">
                    <div className={"nav-item-mobile " + (this._isCurrentURL("/user/home") ? "my-nav-selected-mobile" : "")}
                        style={{ borderLeftColor: this.props.theme.pagePrimaryColor }}>
                        <a href="/user/home" className="my-nav-item">
                            <i title="Home" className="fas fa-home"
                                style={{ color: this.props.theme.pagePrimaryColor, fontSize: '24px' }}></i>
                            <p style={{ fontSize: '0.7em' }}>Home</p>
                        </a>
                    </div>
                    <div className={"nav-item-mobile " + (this._isCurrentURL("/user/dependents") ? "my-nav-selected-mobile" : "")}
                        style={{ borderLeftColor: this.props.theme.pagePrimaryColor }}>
                        <a href="/user/dependents" className="my-nav-item">
                            <i title="Home" className="fas fa-capsules"
                                style={{ color: this.props.theme.pagePrimaryColor, fontSize: '24px' }}></i>
                            <p style={{ fontSize: '0.7em' }}>RXS</p>
                        </a>
                    </div>
                    <div className={"nav-item-mobile " + (this._isCurrentURL("/user/profile") ? "my-nav-selected-mobile" : "")}
                        style={{ borderLeftColor: this.props.theme.pagePrimaryColor }}>
                        <a href="/user/profile" className="my-nav-item">
                            <i title="Home" className="fas fa-cog"
                                style={{ color: this.props.theme.pagePrimaryColor, fontSize: '24px' }}></i>
                            <p style={{ fontSize: '0.7em' }}>Profile</p>
                        </a>
                    </div>
                </div>

                <div className="main">
                    {this.props.message.text ?
                        <div className="alert-container">
                            <div className="alert-container">
                                <div className={"alert alert-dismissible alert-" + this.props.message.alertType} role="alert">
                                    {this.props.message.text}
                                    {this.props.message.text.length > 0 ?
                                        <button type="button" onClick={() => { this.props.createMessage("", null) }} class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        : null}
                                </div>
                            </div>
                        </div>
                        : null
                    }
                    <div>
                        {/* {this.props.children} */}
                    </div>
                    <div style={{ marginTop: '30px' }}>
                        &nbsp;
</div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    message: state.message,
    theme: state.theme
});

export default connect(mapStateToProps, { createMessage })(UserLayout);