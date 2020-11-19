
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
_getNumberOfAdmins = (guardians) =>{
  let num = 0;
  for(var i=0;i<guardians.length;++i){
      let userID = guardians[i].user;
      let found = false;
      for(var ix=0;ix<this.props.users.length;++ix){
          if(this.props.users[ix]._id == userID 
              && this.props.users[ix].isAdmin){
                  found = true;
                  num++;
          }
          if(this.props.users[ix]._id == userID){
            found = true;
          }
      }
      if(!found){
          num++;
      }
  }
  return num;
}
  render() {
    const list = (groups) => {
      return groups.map((group, index) => {
        
        return (
          <tr key={"userTable" + index}>
            <th scope="row">{index + 1}</th>
            <td colSpan="2">{group.name}</td>
            <td>{group.dependents.length}</td>
            <td>{group.guardians.length - this._getNumberOfAdmins(group.guardians)}</td>
            <td>{this._getNumberOfAdmins(group.guardians)}</td>
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