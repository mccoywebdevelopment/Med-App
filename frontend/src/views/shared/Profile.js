import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Profile extends React.Component {
  state = {
    email:"",
    phoneNumber:"",
    name:"",
    isAdmin:false
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
  }
  componentDidMount = ()=>{
    let newState = this.state;
    newState.email = this.props.auth.user.username;
    newState.phoneNumber = this.props.auth.user.phoneNumber;
    newState.name = this.props.auth.user.name;
    newState.isAdmin = this.props.auth.user.isAdmin;
    this.setState(newState);
    console.log(this.state);
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
              <form>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="inputEmail4">Email</label>
                    <input type="email" class="form-control" id="inputEmail4" placeholder="Email" />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="inputPassword4">Password</label>
                    <input type="password" class="form-control" id="inputPassword4" placeholder="Password" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputAddress">Address</label>
                  <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St" />
                </div>
                <div class="form-group">
                  <label for="inputAddress2">Address 2</label>
                  <input type="text" class="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="inputCity">City</label>
                    <input type="text" class="form-control" id="inputCity" />
                  </div>
                  <div class="form-group col-md-4">
                    <label for="inputState">State</label>
                    <select id="inputState" class="form-control">
                      <option selected>Choose...</option>
                      <option>...</option>
                    </select>
                  </div>
                  <div class="form-group col-md-2">
                    <label for="inputZip">Zip</label>
                    <input type="text" class="form-control" id="inputZip" />
                  </div>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="gridCheck" />
                    <label class="form-check-label" for="gridCheck">
                      Check me out
                    </label>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary">Sign in</button>
              </form>





            </div>
          </div>
        </div>
      </div>
    );
  }
}
// Login.propTypes = {
//   fetchLogin: PropTypes.func.isRequired,
//   changeRedirectURL: PropTypes.func.isRequired,
//   resetRoot: PropTypes.func.isRequired
// };
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(Profile);