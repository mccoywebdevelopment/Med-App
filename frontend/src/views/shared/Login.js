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
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="label">Password</label>
                      <div className="input-group">
                        <input type="password" className="form-control" placeholder="*********" name="password" value={this.state.password} onChange={this._updateFormData} />
                      </div>
                    </div>
                    <div className="form-group">
                      <button className="btn btn-primary submit-btn btn-block" onClick={this._submit}>Login</button>
                    </div>
                    <div className="form-group d-flex justify-content-between">
                      <a href="#" className="text-small forgot-password text-black">Forgot Password</a>
                    </div>
                    <div className="text-block text-center my-3">
                      <span className="text-small font-weight-semibold">Not a member?</span>
                      <a href="register.html" className="text-black text-small">Create new account</a>
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
}
Login.propTypes = {
  fetchLogin: PropTypes.func.isRequired
};

export default connect(null, { fetchLogin})(Login);