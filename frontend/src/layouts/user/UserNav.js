import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class UserNav extends React.Component {
    static propTypes = {
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
    //         <nav class="navbar fixed-bottom navbar-dark bg-primary">
    // <a class="navbar-brand" href="#">Fixed bottom</a>
    // </nav>
                <div className="navbar-bottom content-mobile content-mobile-navbar">
                    <div className={"nav-item-mobile " + (this._isCurrentURL("/user/home") ? "my-nav-selected-mobile" : "")}
                        style={{ borderLeftColor: this.props.theme.pagePrimaryColor }}>
                        <a href="/user/home" className="my-nav-item">
                            <i title="Home" className="fas fa-home"
                                style={{ color: this.props.theme.pagePrimaryColor, fontSize: '20px' }}></i>
                            {/* <p style={{ fontSize: '0.7em' }}>Home</p> */}
                        </a>
                    </div>
                    {/* <div className={"nav-item-mobile " + (this._isCurrentURL("/user/dependents") ? "my-nav-selected-mobile" : "")}
                        style={{ borderLeftColor: this.props.theme.pagePrimaryColor }}>
                        <a href="/user/dependents" className="my-nav-item">
                            <i title="Home" className="fas fa-capsules"
                                style={{ color: this.props.theme.pagePrimaryColor, fontSize: '20px' }}></i>
                        </a>
                    </div> */}
                    <div className={"nav-item-mobile " + (this._isCurrentURL("/user/scanner") ? "my-nav-selected-mobile" : "")}
                        style={{ borderLeftColor: this.props.theme.pagePrimaryColor }}>
                        <a href="/user/scanner" className="my-nav-item">
                            <i title="Home" className="fas fa-qrcode"
                                style={{ color: this.props.theme.pagePrimaryColor, fontSize: '20px' }}></i>
                            {/* <p style={{ fontSize: '0.7em' }}>Scan</p> */}
                        </a>
                    </div>
                    {/* <div className={"nav-item-mobile " + (this._isCurrentURL("/user/history") ? "my-nav-selected-mobile" : "")}
                        style={{ borderLeftColor: this.props.theme.pagePrimaryColor }}>
                        <a href="/user/dependents" className="my-nav-item">
                            <i title="Home" className="fas fa-clipboard-list"
                                style={{ color: this.props.theme.pagePrimaryColor, fontSize: '20px' }}></i>
                        </a>
                    </div> */}
                    <div className={"nav-item-mobile " + (this._isCurrentURL("/user/profile") ? "my-nav-selected-mobile" : "")}
                        style={{ borderLeftColor: this.props.theme.pagePrimaryColor }}>
                        <a href="/user/profile" className="my-nav-item">
                            <i title="Home" className="fas fa-cog"
                                style={{ color: this.props.theme.pagePrimaryColor, fontSize: '20px' }}></i>
                            {/* <p style={{ fontSize: '0.7em' }}>Profile</p> */}
                        </a>
                    </div>
                </div>

        );
    }
}
const mapStateToProps = (state) => ({
    theme: state.theme
});

export default connect(mapStateToProps, {})(UserNav);