import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchLogin, changeRedirectURL, changeCurrentURL } from "../../actions/auth";
import { resetRoot } from "../../actions/root";
import { getPaths} from '../../config/helpers';
import { emailValidator,passwordValidator } from '../../config/validators';

class Login extends React.Component{
  static propTypes = {
      auth: PropTypes.object.isRequired,
  };
  constructor(props){
    super(props);
    this._updateFormData = this._updateFormData.bind(this);
    this._submit = this._submit.bind(this);
  }
  state = {
    email:"",
    password:"",
    emailErrMsg:"",
    passwordErrMsg:""
  }
  _updateFormData = (e) =>{
    this.setState({ [e.target.name]: e.target.value });
  }
  _validation = () =>{
    let newState = this.state;
    newState.emailErrMsg = emailValidator(this.state.email,true).errorMsg;
    newState.passwordErrMsg = passwordValidator(this.state.password,true).errorMsg;
    this.setState(newState);
  }
  _submit = (e) =>{
    e.preventDefault();
    
    this._validation();
    if(this.state.passwordErrMsg.length<1 && this.state.emailErrMsg.length<1){
      let body = {
        username:this.state.email,
        password:this.state.password
      }
      this.props.fetchLogin(body,(res)=>{
        if(!this.props.auth.redirectURL && this.props.auth.currentURL){
          this.props.changeRedirectURL(this.props.auth.currentURL);
          this.props.changeCurrentURL(false);
        }else{
          this.props.changeRedirectURL(res.result.redirectURL);
        }
        let redirectURL = this.props.auth.redirectURL;
        this.props.changeRedirectURL(false);
        window.location = redirectURL;
      });
    }
  }
  componentWillUnmount =() =>{
    this.props.changeRedirectURL(null);
  }
  componentDidMount = () =>{
    // this.props.resetRoot();
    // window.localStorage.clear(); //try this to clear all local storage
    // localStorage.clear();

    if(this.props.isCreditials){
      let paths = getPaths(window);
      let newState = this.state;
      newState.email = paths[paths.length - 2];
      newState.password = paths[paths.length -1];
      this.setState(newState);
    }
    
  }
  _renderForm =() =>{
    return (
      <div className="container-scroller" style={{ height: 'auto', minHeight: 'initial' }} style={{marginTop:'100px'}}>
        <div className="container-fluid page-body-wrapper full-page-wrapper" style={{ height: 'auto', minHeight: 'initial' }}>
          <div className="content-wrapper d-flex align-items-center auth theme-one" style={{ background: 'transparent', height: 'auto', minHeight: 'initial',width:'100%',padding:'0px' }}>
            <div className="row w-100">
              <div className="col-lg-4 mx-auto">
                <div className="auto-form-wrapper">
                  <form action="#">
                    <div className="form-group" style={{marginBottom:'30px'}}>
                      <label className="label">Email</label>
                      <div className="input-group">
                        <input type="text" className="form-control" name="email" placeholder="Email" value={this.state.email} onChange={this._updateFormData} />
                        <div className="invalid-feedback" style={{display:'block'}}>
                          {this.state.emailErrMsg}
                        </div>
                      </div>
                    </div>
                    <div className="form-group" style={{marginBottom:'60px'}}>
                      <label className="label">Password</label>
                      <div className="input-group">
                        <input type="password" className="form-control" placeholder="*********" name="password" value={this.state.password} onChange={this._updateFormData} />
                        <div className="invalid-feedback" style={{display:'block'}}>
                          {this.state.passwordErrMsg}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <button className="btn btn-primary submit-btn btn-block" onClick={this._submit}>Login</button>
                    </div>
                    <div className="form-group d-flex justify-content-between">
                      <a href="/auth/forgot-password" className="text-small forgot-password text-black">Forgot Password</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render(){
    return(
      <>
      {this._renderForm()}
      </>
    );
  }
}
Login.propTypes = {
  fetchLogin: PropTypes.func.isRequired,
  changeRedirectURL: PropTypes.func.isRequired,
  changeCurrentURL: PropTypes.func.isRequired,
  resetRoot: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps,{fetchLogin,changeRedirectURL,resetRoot,changeCurrentURL})(Login);