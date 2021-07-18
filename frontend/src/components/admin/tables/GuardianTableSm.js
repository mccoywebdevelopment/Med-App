import React from 'react';
import { formatPhoneNumber } from '../../../config/helpers'

export default class GuardianTableSm extends React.Component {
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
        let url = "";
        if(!user){
          url = "/admin/profile";
        }else{
          url = "/admin/users/" + user._id;
        }
        if(guardian.name && guardian.name.firstName){
            name = guardian.name.firstName + " " + (guardian.name.lastName || "");
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
            <td colSpan="2"><a href={url}>{name}</a></td>
            <td>{isAdmin.toString()}</td>
            <td colSpan="2">{formatPhoneNumber(phoneNumber)}</td>
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
            <th scope="col" colSpan="2">Phone Number #</th>
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
