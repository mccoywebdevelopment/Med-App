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
    render() {
        return (
            <div className="auth auth-bg-1" style={{ padding: '20px' }}>
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