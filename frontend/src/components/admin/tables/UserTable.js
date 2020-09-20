
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {capitalizeFirstLetter,formateDate} from "../../../config/helpers";
import { selectItem } from '../../../actions/table';


class UserTable extends React.Component{
  static propTypes = {
    theme: PropTypes.object.isRequired
  };
  constructor(props){
    super(props);
  }
  render(){
    const list=(users) =>{
      return users.map((user,index)=>{
        console.log(user)

        let name = "-"
        if(user.guardian && user.guardian.name){
          console.log(true)
          name = user.guardian.name.firstName + " " + user.guardian.name.lastName;
        }
        let isAdmin = "No";
        let isAdminStyles = {
          color:"inherit"
        };
        if(user.isAdmin){
          isAdmin = "Yes";
          isAdminStyles.color = "#8862E0";
        }
        let status = user.auth.status.statusValue;
        let statusStyles = {
          color:"#F0AD4E"
        }
        if(user.auth.status.statusValue != "pending"){
          status = user.auth.status.statusValue;
          statusStyles.color = "#56B98B";
        }
        let dateInvited = formateDate(user.dateCreated);
        let dateAuthenticated = "-";
        if(user.auth.dateAuthenticated){
          dateAuthenticated = formateDate(user.auth.dateAuthenticated);
        }
        let grouped = "No";
        let groupedStyles = {
          color:'inherit'
        }
        if(user.guardian && user.guardian.group.length>0){
          grouped = "Yes";
          if(!user.isAdmin){
            groupedStyles.color = "#56B98B";
          }
        }else if(!user.isAdmin){
          groupedStyles.color = "red";
        }
        console.log(grouped);
        return(
            <tr key={"userTable"+index}>
              <th scope="row">{index + 1}</th>
              <td colSpan="2">{user.username}</td>
              <td>{name}</td>
              <td style={isAdminStyles}>{isAdmin}</td>
              <td>{dateInvited}</td>
              <td style={statusStyles}>{capitalizeFirstLetter(status)}</td>
              <td>{dateAuthenticated}</td>
              <td style={groupedStyles}>{grouped}</td>
              <td>
                <i title="view" onClick={()=>{alert('1')}} className="fas fa-eye" 
                    style={{paddingRight: '20px',color:this.props.theme.pagePrimaryColor}}></i>
                {/* <i title="edit" className="fas fa-edit" style={{ paddingRight: '20px', color: '#2196F3' }}></i> */}
                <i title="Delete" onClick={()=>{this.props.delete(user)}} className="fas fa-trash" 
                    style={{color:this.props.theme.pagePrimaryColor }}></i>
              </td>
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
            <th scope="col">Name</th>
            <th scope="col">Is Admin</th>
            <th scope="col">Date Invited</th>
            <th scope="col">Authenticated</th>
            <th scope="col">Date Authenticated</th>
            <th scope="col">Grouped</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
            {list(this.props.users)}
        </tbody>
      </table>
    );
  }
}

// UserTable.propTypes = {
//   selectItem: PropTypes.func.isRequired
// };
const mapStateToProps = (state) => ({
  theme: state.theme
});

export default connect(mapStateToProps, {})(UserTable);