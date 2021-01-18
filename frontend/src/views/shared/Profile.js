import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeColor } from "../../actions/theme";
import { fetchDeleteAccount } from "../../actions/auth";
import { fetchUpdateUser } from "../../actions/user";
import { fetchGuardians } from "../../actions/guardian";
import { firstAndLastNameValidator,phoneNumberValidator } from "../../config/validators";

class Profile extends React.Component {
  state = {
    email: "",
    phoneNumber: "",
    name: "",
    isAdmin: false,
    oldState: null,
    nameError:"",
    phoneNumberError:""
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    guardianState: PropTypes.object.isRequired,
    fetchGuardians: PropTypes.func.isRequired,
    fetchUpdateUser: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
  }
  _update = (inputName, value) => {
    let newState = this.state;
    newState[inputName] = value;
    this.setState(newState);
  }
  _toggleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      this.props.fetchDeleteAccount();
    }
  }
  _getGuardianID = (guardians,userID)=>{
    for(var i=0;i<guardians.length;++i){
      if(guardians[i].user == userID){
        return guardians[i]._id
      }
    }
    return null;
  }
  _validator = () =>{
    let newState = this.state;

    newState.nameError = firstAndLastNameValidator(newState.name,true).errorMsg;
    newState.phoneNumberError = phoneNumberValidator(newState.phoneNumber,true).errorMsg;

    this.setState(newState);
  }
  _submit = () =>{
    this._validator();

    if(!this.state.nameError.length>0 && !this.state.phoneNumberError.length>0){
      alert(true)
      if(!this.props.guardianState.fetched){
        this.props.fetchGuardians(true,(guardians)=>{
          let guardianID = this._getGuardianID(guardians,this.props.auth.user._id);
          let body = {
            phoneNumber: this.state.phoneNumber,
            firstName: this.state.name.split(' ')[0],
            lastName: this.state.name.split(' ')[1],
          }
          this.props.fetchUpdateUser(this.props.auth.user._id,body,false,guardianID);
        });
      }else{
        let guardianID = this._getGuardianID(this.props.guardianState.data,this.props.auth.user._id);
          let body = {
            phoneNumber: this.state.phoneNumber,
            firstName: this.state.name.split(' ')[0],
            lastName: this.state.name.split(' ')[1],
          }
          console.log('sdlfj')
          this.props.fetchUpdateUser(this.props.auth.user._id,body,false,guardianID,(res)=>{
            console.log(res)
          });
      }
    }
  }
  _isUpdated = () => {
    let oldData = this.state.oldState;
    let newData = {
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      name: this.state.name,
      isAdmin: this.state.isAdmin
    }

    if (JSON.stringify(oldData) == JSON.stringify(newData)) {
      return true;
    }
    return false;
  }

  componentDidMount = () => {
    if (!this.props.auth || !this.props.auth.user) {
      window.location = "/auth/login";
    }
    this.props.changeColor("#2196f3");
    let newState = this.state;
    newState.email = this.props.auth.user.username;
    newState.phoneNumber = this.props.auth.user.phoneNumber;
    newState.name = this.props.auth.user.name;
    newState.isAdmin = this.props.auth.user.isAdmin;
    newState.oldState = {
      email: newState.email,
      phoneNumber: newState.phoneNumber,
      name: newState.name,
      isAdmin: newState.isAdmin
    }
    this.setState(newState);
  }
  render() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-12">
              <h4 className="view-header">Profile</h4>
            </div>

            <div className="row card" style={{ padding: '25px' }}>
              <div className="form-row">
                <div className="form-group  col-lg-6">
                  <label htmlFor="inputAddress">Name</label>
                  <input onChange={(e) => { this._update("name", e.target.value) }} type="text" className="form-control" id="inputName" value={this.state.name} placeholder="" />
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {this.state.nameError}&nbsp;
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group  col-lg-6">
                  <label htmlFor="inputAddress">Phone Number</label>
                  <input onChange={(e) => { this._update("phoneNumber", e.target.value) }} value={this.state.phoneNumber} type="number" className="form-control" id="inputNumber" placeholder="000-000-0000" minLength="10" maxLength="10" />
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {this.state.phoneNumberError}&nbsp;
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group  col-lg-6">
                  <label htmlFor="inputAddress">Is Admin</label>
                  <input value={this.state.isAdmin} type="text" className="form-control" id="inputName" value={this.state.isAdmin} placeholder="" readOnly />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-lg-6">
                  <label htmlFor="inputEmail4">Email</label>
                  <input type="email" value={this.state.email} className="form-control" id="inputEmail" placeholder="@youremail.com" readOnly />
                </div>
              </div>
              {/* <div className="form-row">
<div className="form-group col-lg-6">
<label htmlFor="inputEmail4">Password</label>
<input type="password" className="form-control" id="inputPassword" placeholder="********" readOnly />
</div>
</div> */}

              <div className="row" style={{ marginBottom: '60px' }}>
                <div className="col-lg-3" style={{ paddingLeft: '0px' }}>
                  <button onClick={(e) => { this._toggleDelete() }} type="button" className="btn btn-outline-danger">Delete My Account</button>
                </div>
                <div className="col-lg-3" style={{ paddingRight: '0px' }}>
                  <a href="/auth/forgot-password" style={{ float: 'right' }} type="button" className="btn btn-outline-info">Change My Password</a>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-lg-6">
                  <button onClick={()=>{this._submit()}} type="button" className="btn btn-primary" style={{ visibility: this._isUpdated() ? 'hidden' : 'visible' }}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Profile.propTypes = {
  changeColor: PropTypes.func.isRequired,
  fetchDeleteAccount: PropTypes.func.isRequired,
  fetchGuardians: PropTypes.func.isRequired,
  fetchUpdateUser: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  guardianState: state.guardianState
});

export default connect(mapStateToProps, { changeColor, fetchDeleteAccount, fetchGuardians, fetchUpdateUser })(Profile);