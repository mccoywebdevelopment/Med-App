import React from 'react';

//DO NOT DELETE CSS FILES AND SCRIPTS ARE ATTATCH!!!========
import Header from "../../components/admin/partials/Header";
import Footer from "../../components/admin/partials/Footer";
//==========================================================
import "../../assets/css/myCss.css";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createMessage } from '../../actions/messages'
import { changeColor } from '../../actions/theme';

import UserNav from './UserNav';
import Loading from "../../components/shared/Loading/Loading";
import PopUp from "../../components/shared/PopUp/PopUp";

class UserLayout extends React.Component {
    static propTypes = {
        message: PropTypes.object.isRequired,
        createMessage: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
    }
    componentDidMount = () =>{
        this.props.changeColor("#2196f3");
    }
    render() {
        return (
            <>
                
                <div className="content-mobile content-content-mobile">
                    {this.props.message.text ?
                        <div className="alert-container">
                            <div className="alert-container">
                                <div className={"alert alert-dismissible alert-" + this.props.message.alertType} role="alert">
                                    {this.props.message.text}
                                    {this.props.message.text.length > 0 ?
                                        <button type="button" onClick={() => { this.props.createMessage("", null) }} className="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        : null}
                                </div>
                            </div>
                        </div>
                        : null
                    }
                    <div className="container h-100">
                        {this.props.children}
                    </div>
                    <div style={{ marginTop: '30px' }}>
                        &nbsp;
                    </div>
                </div>
                <UserNav/>
                <PopUp/>
                <Loading/>
                <div className="content-desktop">
                    <h1>Desktop View not supported please login via phone/ipad.</h1>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    message: state.message,
    theme: state.theme
});

export default connect(mapStateToProps, { createMessage,changeColor })(UserLayout);