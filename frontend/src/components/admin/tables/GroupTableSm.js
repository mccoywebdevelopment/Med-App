
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
  _getUserByID = (userID) => {
    let users = this.props.users;
    for (var i = 0; i < users.length; ++i) {
        if (userID == users[i]._id) {
            return users[i];
        }
    }
    return null;
}
  _getNumOfAdmins = (guardians) => {
    let users = [];
    for (var i = 0; i < guardians.length; ++i) {
        let user = this._getUserByID(guardians[i].user);
        if (user) {
            users.push(user);
        }
    }
    let admins = 0;
    for (var i = 0; i < users.length; ++i) {
        if (users[i].isAdmin) {
            admins++;
        }
    }
    return admins;
}
  render() {
    const list = (groups) => {
      return groups.map((group, index) => {
        
        return (
          <tr key={"userTable" + index}>
            <th scope="row">{index + 1}</th>
            <td colSpan="2">{group.name}</td>
            <td>{group.dependents.length}</td>
            <td>{group.guardians.length - this._getNumOfAdmins(group.guardians)}</td>
            <td>{this._getNumOfAdmins(group.guardians)}</td>
          </tr>
        );
      });
    }
    return (
      <>
      {this.props.groups.length>0?
      <table className="table my-search-table my-med-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" colSpan="2">Name</th>
            <th scope="col">#Dependents</th>
            <th scope="col">#Guardians</th>
            <th scope="col">#Admins</th>
          </tr>
        </thead>
        <tbody>
          {list(this.props.groups)}
        </tbody>
      </table>
      :null}
      </>
    );
  }
}

export default connect(null, {})(GroupTableSm);