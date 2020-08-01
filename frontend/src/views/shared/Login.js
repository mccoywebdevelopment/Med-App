import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchLogin } from "../../actions/auth";

class Login extends React.Component{
  constructor(props){
    super(props);
    this._updateFormData = this._updateFormData.bind(this);
    this._submit = this._submit.bind(this);
  }
  state = {
    email:"",
    password:""
  }
  _updateFormData = (e) =>{
    this.setState({ [e.target.name]: e.target.value });
  }
  _submit = (e) =>{
    e.preventDefault();
    this.props.fetchLogin();
  }

  render(){
    return (
      <div className="container-scroller" style={{ height: 'auto', minHeight: 'initial' }}>
        <div className="container-fluid page-body-wrapper full-page-wrapper" style={{ height: 'auto', minHeight: 'initial' }}>
          <div className="content-wrapper d-flex align-items-center auth  theme-one" style={{ background: 'transparent', height: 'auto', minHeight: 'initial' }}>
            <div className="row w-100">
              <div className="col-lg-4 mx-auto">
                <div className="auto-form-wrapper">
                  <form action="#">
                    <div className="form-group">
                      <label className="label">Email</label>
                      <div className="input-group">
                        <input type="text" className="form-control" name="email" placeholder="Email" value={this.state.email} onChange={this._updateFormData} />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <i className="mdi mdi-check-circle-outline" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="label">Password</label>
                      <div className="input-group">
                        <input type="password" className="form-control" placeholder="*********" name="password" value={this.state.password} onChange={this._updateFormData} />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <i className="mdi mdi-check-circle-outline" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <button className="btn btn-primary submit-btn btn-block" onClick={this._submit}>Login</button>
                    </div>
                    <div className="form-group d-flex justify-content-between">
                      {/* <div className="form-check form-check-flat mt-0">
  <label className="form-check-label">
  <input type="checkbox" className="form-check-input" defaultChecked /> Keep me signed in </label>
  </div> */}
                      <a href="#" className="text-small forgot-password text-black">Forgot Password</a>
                    </div>
                    {/* <div className="form-group">
  <button className="btn btn-block g-login">
  <img className="mr-3" src="../../../assets/images/file-icons/icon-google.svg" alt="" />Log in with Google</button>
  </div> */}
                    <div className="text-block text-center my-3">
                      <span className="text-small font-weight-semibold">Not a member?</span>
                      <a href="register.html" className="text-black text-small">Create new account</a>
                    </div>
                  </form>
                </div>
                {/* <ul className="auth-footer">
  <li>
  <a href="#">Conditions</a>
  </li>
  <li>
  <a href="#">Help</a>
  </li>
  <li>
  <a href="#">Terms</a>
  </li>
  </ul>
  <p className="footer-text text-center">copyright © 2018 Bootstrapdash. All rights reserved.</p> */}
              </div>
            </div>
          </div>
          {/* content-wrapper ends */}
        </div>
        {/* page-body-wrapper ends */}
      </div>
    );
  }
}
Login.propTypes = {
  fetchLogin: PropTypes.func.isRequired
};

export default connect(null, { fetchLogin})(Login);