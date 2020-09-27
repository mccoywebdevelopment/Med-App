import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchResetPassword } from "../../actions/auth";
import { changeRedirectURL } from "../../actions/auth";
import { resetRoot } from "../../actions/root";
import { Redirect } from 'react-router-dom';
import { getPath } from '../../config/helpers'
import { passwordValidator } from '../../config/validators';

class ResetPassword extends React.Component{
  static propTypes = {
      auth: PropTypes.object.isRequired,
  };
  constructor(props){
    super(props);
    this._updateFormData = this._updateFormData.bind(this);
    this._submit = this._submit.bind(this);
    let paths = getPath(window);
    this.state = {
      email:paths[3],
      token:paths[4],
      password:"",
      passwordErrMsg:""
    }
    console.log(this.state)
  }

  _updateFormData = (e) =>{
    this.setState({ [e.target.name]: e.target.value });
  }
  _validation = () =>{
    let newState = this.state;
    newState.passwordErrMsg = passwordValidator(this.state.password,true).errorMsg;
    this.setState(newState);
  }
  _submit = (e) =>{
    e.preventDefault();
    
    this._validation();
    if(this.state.passwordErrMsg.length<1){
      let body = {
        email:this.state.email,
        password:this.state.password
      }
      this.props.fetchResetPassword(body,this.state.token);
    }
  }
  componentDidMount = () =>{
    localStorage.clear();
    this.props.resetRoot();
  }
  componentWillUnmount =() =>{
    this.props.changeRedirectURL(null);
  }
  _renderForm =() =>{
    return (
      <div className="container-scroller" style={{ height: 'auto', minHeight: 'initial' }} style={{marginTop:'100px'}}>
        <div className="container-fluid page-body-wrapper full-page-wrapper" style={{ height: 'auto', minHeight: 'initial' }}>
          <div className="content-wrapper d-flex align-items-center auth  theme-one" style={{ background: 'transparent', height: 'auto', minHeight: 'initial' }}>
            <div className="row w-100">
              <div className="col-lg-4 mx-auto">
                <div className="auto-form-wrapper">
                  <form action="#">
                    <div className="form-group" style={{marginBottom:'30px'}}>
                      <label className="label">Email</label>
                      <div className="input-group">
                        <input type="text" className="form-control" name="email" placeholder="Email" value={this.state.email} onChange={this._updateFormData} disabled/>
                        <div className="invalid-feedback" style={{display:'block'}}>
                          {this.state.emailErrMsg}
                        </div>
                      </div>
                    </div>
                    <div className="form-group" style={{marginBottom:'60px'}}>
                      <label className="label">New Password</label>
                      <div className="input-group">
                        <input type="password" className="form-control" placeholder="*********" name="password" value={this.state.password} onChange={this._updateFormData} />
                        <div className="invalid-feedback" style={{display:'block'}}>
                          {this.state.passwordErrMsg}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <button className="btn btn-primary submit-btn btn-block" onClick={this._submit}>Reset Password</button>
                    </div>
                    <div className="form-group d-flex justify-content-between">
                      <a href="/auth/login" className="text-small forgot-password text-black">Remember password? Login</a>
                    </div>
                    {/* <div className="text-block text-center my-3">
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
      {this.props.auth.redirectURL?
        this._renderRedirect()
        :
        this._renderForm()
      }
    </>
    );
  }
}
ResetPassword.propTypes = {
  fetchResetPassword: PropTypes.func.isRequired,
  changeRedirectURL: PropTypes.func.isRequired,
  resetRoot: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps,{fetchResetPassword,changeRedirectURL,resetRoot})(ResetPassword);