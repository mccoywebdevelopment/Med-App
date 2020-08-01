import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {createMessage} from '../../actions/messages'

class AuthLayout extends React.Component {

    static propTypes = {
        message: PropTypes.object.isRequired,
        createMessage: PropTypes.func.isRequired
    };
    constructor(props) {
        super(props);
    }
    _setMsgEmpty =() =>{
        if(this.props.message.text.length>0){
            setTimeout(()=>{
                this.props.createMessage("","");
            },5000)
        }
    }
    render() {
        this._setMsgEmpty();
        return (
            <div className="auth auth-bg-1" style={{ padding: '20px' }}>
                <div className="alert-container">
                    <div className={"alert alert-"+this.props.message.alertType} role="alert">
                        {this.props.message.text}&nbsp;
                    </div>
                </div>
                <div>
                    {this.props.children}
                </div>
                {/* <div className="footer">
                    footer
                    </div> */}
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    message: state.message,
});
  
  export default connect(mapStateToProps,{createMessage})(AuthLayout);