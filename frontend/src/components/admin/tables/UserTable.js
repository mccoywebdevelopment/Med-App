
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { capitalizeFirstLetter, formateDate } from "../../../config/helpers";
import { sendTokenViaEmail } from "../../../actions/user"


class UserTable extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }
  _selectItem = (user) => {
    this.props.changeUserSel(user)
  }
  _sendTokenViaEmail = (user) =>{
    if(window.confirm('Are you sure you want to send user another email?')){
      this.props.sendTokenViaEmail(user.username);
    }
  }
  render() {
    const list = (users) => {
      return users.map((user, index) => {
        let name = "-"
        if (user.guardian && user.guardian.name) {
          name = user.guardian.name.firstName + " " + user.guardian.name.lastName;
        }
        let isAdmin = "No";
        let isAdminStyles = {
          color: "inherit"
        };
        if (user.isAdmin) {
          isAdmin = "Yes";
          isAdminStyles.color = "#8862E0";
        }
        let status = user.auth.status.statusValue;
        let statusStyles = {
          color: "#F0AD4E"
        }
        if (user.auth.status.statusValue != "pending") {
          status = user.auth.status.statusValue;
          statusStyles.color = "#56B98B";
        }
        let dateInvited = formateDate(user.dateCreated);
        let dateAuthenticated = "-";
        if (user.auth.dateAuthenticated) {
          dateAuthenticated = formateDate(user.auth.dateAuthenticated);
        }
        let grouped = "No";
        let groupedStyles = {
          color: 'inherit'
        }
        if (user.guardian && user.guardian.groups.length > 0) {
          grouped = "Yes";
          if (!user.isAdmin) {
            groupedStyles.color = "#56B98B";
          }
        } else if (!user.isAdmin) {
          groupedStyles.color = "red";
        }
        let trStyle = {
        }
        if(this.props.selected == user._id && this.props.isSmall){
          trStyle.background = '#dbcff5';
        }
        return (
          <tr style={trStyle} key={"userTable" + index}>
            <th scope="row">{index + 1}</th>
            <td onClick={() => this._selectItem(user)} colSpan="2">{user.username}</td>
            {!this.props.isSmall ? <td onClick={() => this._selectItem(user)}>{name}</td> : null}
            <td onClick={() => this._selectItem(user)} style={isAdminStyles}>{isAdmin}</td>
            {!this.props.isSmall ? <td onClick={() => this._selectItem(user)}>{dateInvited}</td> : null}
            <td onClick={() => this._selectItem(user)} style={statusStyles}>{capitalizeFirstLetter(status)}</td>
            {/* <td>{dateAuthenticated}</td> */}
            <td onClick={() => this._selectItem(user)} style={groupedStyles}>{grouped}</td>
            {!this.props.isSmall ?
              <td>
                <i title="view" onClick={() => this._selectItem(user)} className="fas fa-eye"
                  style={{ paddingRight: '20px', color: this.props.theme.pagePrimaryColor }}></i>
                  {!user.auth.isVerified?
                    <i title="Send Invite" onClick={() => { this._sendTokenViaEmail(user) }} className="fas fa-envelope"
                      style={{ paddingRight: '20px',color: this.props.theme.pagePrimaryColor }}></i>
                  :null}
                {/* <i title="edit" className="fas fa-edit" style={{ paddingRight: '20px', color: '#2196F3' }}></i> */}
                <i title="Delete" onClick={() => { this.props.delete(user) }} className="fas fa-trash"
                  style={{ color: this.props.theme.pagePrimaryColor }}></i>
              </td>
              : null}
          </tr>
        );
      });
    }
    return (
      <table className="table dependentTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" colSpan="2">Email</th>
            {!this.props.isSmall ? <th scope="col">Name</th> : null}
            <th scope="col">Admin</th>
            {!this.props.isSmall ? <th scope="col">Date Invited</th> : null}
            <th scope="col">Validated</th>
            {/* <th scope="col">Date Authenticated</th> */}
            <th scope="col">Grouped</th>
            {!this.props.isSmall ? <th scope="col">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {list(this.props.users)}
        </tbody>
      </table>
    );
  }
}

UserTable.propTypes = {
  sendTokenViaEmail: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
  theme: state.theme
});

export default connect(mapStateToProps, { sendTokenViaEmail })(UserTable);