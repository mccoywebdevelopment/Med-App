
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class GroupTableSm extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }
  _getUserByGuardian = (users,guardian) =>{
      let userID = guardian.user;

      for(var i=0;i<users.length;++i){
        if(users[i]._id == userID){
            return users[i];
        }
      }
      return null;
  }
  render() {
    const list = (guardians) => {
      return guardians.map((guardian, index) => {
        let isAdmin = true;
        let user = this._getUserByGuardian(this.props.users,guardian);
        let phoneNumber = "-";
        let name = "-"
        if(guardian.name && guardian.name.firstName){
            name = guardian.name.firstName + " " + guardian.name.lastName;
        }
        if(user){
            isAdmin = user.isAdmin;
        }
        if(guardian.phoneNumber){
            phoneNumber = guardian.phoneNumber;
        }
        return (
          <tr key={"userTable" + index}>
            <th scope="row">{index + 1}</th>
            <td colSpan="2">{name}</td>
            <td>{isAdmin.toString()}</td>
            <td colSpan="2">{phoneNumber}</td>
          </tr>
        );
      });
    }
    return (
      <>
      {this.props.guardians.length>0?
      <table className="table my-search-table my-med-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" colSpan="2">Name</th>
            <th scope="col">is Admin</th>
            <th scope="col" colSpan="2">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {list(this.props.guardians)}
        </tbody>
      </table>
      :null}
      </>
    );
  }
}

export default connect(null, {})(GroupTableSm);