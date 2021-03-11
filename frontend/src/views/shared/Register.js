import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchLogin } from "../../actions/auth";
import { changeRedirectURL, fetchRegister} from "../../actions/auth";
import { resetRoot } from "../../actions/root";
import { Redirect } from 'react-router-dom';
import { passwordValidator, firstAndLastNameValidator,phoneNumberValidator } from '../../config/validators';
import zxcvbn from 'zxcvbn';

import PassStrength from "./PassStrength";

class Register extends React.Component{
  static propTypes = {
      auth: PropTypes.object.isRequired,
  };
  constructor(props){
    super(props);
    this._updateFormData = this._updateFormData.bind(this);
    this._submit = this._submit.bind(this);
    let paths = window.location.pathname.split('/');

    this.state = {
        email:paths[3],
        token:paths[4],
        password:"",
        passwordErrMsg:"",
        name:"",
        nameErrMsg:"",
        phoneNumber:"",
        phoneNumberErrMsg:"",

        passwordScore:0,
    }
  }
  _updateFormData = (e) =>{
    if(e.target.name == 'password'){
        let newState = this.state;
        newState.passwordScore = this._getPasswordScore(e.target.value);
        this.setState(newState);
    }
    this.setState({ [e.target.name]: e.target.value });
  }
  _getPasswordScore =(password)=>{
    return zxcvbn(password).score;
  }
  _validation = () =>{
    let newState = this.state;
    newState.passwordErrMsg = passwordValidator(this.state.password,true).errorMsg;
    newState.nameErrMsg = firstAndLastNameValidator(this.state.name,true).errorMsg;
    newState.phoneNumberErrMsg = phoneNumberValidator(this.state.phoneNumber,true).errorMsg;
    this.setState(newState);
  }
  _submit = (e) =>{
    e.preventDefault();
    
    this._validation();
    if(this.state.passwordErrMsg.length<1 && this.state.nameErrMsg.length<1 && this.state.phoneNumberErrMsg.length<1){
      let name = this.state.name.split(' ');
      let body = {
        firstName:name[0],
        lastName:name[1],
        phoneNumber:this.state.phoneNumber,
        password:this.state.password
      }
      this.props.fetchRegister(this.state.email,this.state.token,body);
    }
  }
  componentWillUnmount =() =>{
    this.props.changeRedirectURL(null);
  }
  componentDidMount = () =>{
    // localStorage.clear();
    // this.props.resetRoot();
  }
  _renderForm =() =>{
    return (
      <div className="container-scroller" style={{ height: 'auto', minHeight: 'initial' }} style={{marginTop:'50px'}}>
        <div className="container-fluid page-body-wrapper full-page-wrapper" style={{ height: 'auto', minHeight: 'initial' }}>
          <div className="content-wrapper d-flex align-items-center auth  theme-one" 
            style={{ background: 'transparent', height: 'auto', minHeight: 'initial' }}>
            <div className="row w-100">
              <div className="col-lg-4 mx-auto">
                <div className="auto-form-wrapper">
                  <form action="#">
                    <div className="form-group" style={{marginBottom:'30px'}}>
                      <label className="label">Name</label>
                      <div className="input-group">
                        <input type="text" className="form-control" placeholder="First & Last Name" value={this.state.name} 
                            name="name" onChange={this._updateFormData} />
                        <div className="invalid-feedback" style={{display:'block'}}>
                          {this.state.nameErrMsg}
                        </div>
                      </div>
                    </div>
                    <div className="form-group" style={{marginBottom:'30px'}}>
                        <label className="label">Phone Number</label>
                        <div className="input-group">
                            <input type="tel" className="form-control" name="phoneNumber" placeholder="000-000-0000" minLength="10" maxLength="10"
                                value={this.state.phoneNumber} onChange={this._updateFormData} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.state.phoneNumberErrMsg}&nbsp;
                            </div>
                        </div>
                    </div>
                    <div className="form-group" style={{marginBottom:'30px'}}>
                      <label className="label">Email</label>
                      <div className="input-group">
                        <input type="text" className="form-control" name="email" placeholder="Email" value={this.state.email} disabled/>
                        <div className="invalid-feedback" style={{display:'block'}}>
                          {this.state.emailErrMsg}
                        </div>
                      </div>
                    </div>
                    <div className="form-group" style={{marginBottom:'20px'}}>
                      <label className="label">Password
                      </label>
                      <div className="input-group">
                        <input type="password" className="form-control" placeholder="*********" name="password" 
                            value={this.state.password} onChange={this._updateFormData} />
                        <div className="invalid-feedback" style={{display:'block'}}>
                          {this.state.passwordErrMsg}
                        </div>
                      </div>
                    </div>
                    <PassStrength passwordScore={this.state.passwordScore}/>
                    <div className="form-group" style={{marginTop:'15px'}}>
                      <button className="btn btn-primary submit-btn btn-block" onClick={this._submit}>Activate My Account</button>
                    </div>
                    {/* <div className="form-group d-flex justify-content-between">
                      <a href="#" className="text-small forgot-password text-black">Forgot Password</a>
                    </div>
                    <div className="text-block text-center my-3">
                      <p style={{marginBottom:'0px'}} className="text-small font-weight-semibold">Not a member?</p>
                      <a href="register.html" className="text-black text-small">Create new account</a>
                    </div> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  _renderRedirect =()=>{
    const redirectURL = this.props.auth.redirectURL;
    return(
      <Redirect push to={redirectURL}/>
    )
  }
  render(){
    return(
    <>
      {/* {this.props.auth.redirectURL?
        this._renderRedirect()
        :
        this._renderForm()
      } */}
      {this._renderForm()}
    </>
    );
  }
}
Register.propTypes = {
  fetchRegister: PropTypes.func.isRequired,
  changeRedirectURL: PropTypes.func.isRequired,
  resetRoot: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps,{fetchRegister,changeRedirectURL,resetRoot})(Register);