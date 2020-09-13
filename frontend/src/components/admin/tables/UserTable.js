
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectItem } from '../../../actions/table';


class UserTable extends React.Component{
  static propTypes = {
    theme: PropTypes.object.isRequired
  };
  constructor(props){
    super(props);
  }
  render(){
    const list=() =>{
      return this.props.users.map((user,index)=>{

      
        return(
            <tr key={"userTable"+index}>
              <th scope="row">{index + 1}</th>
              <td>Chris McCoy</td>
              <td colSpan="2">cmmccoy1996@gmail.com</td>
              <td>Yes</td>
              <td>2/12/2019</td>
              <td>Yes</td>
              <td>3/28/2019</td>
              <td>No</td>
              <td>
                <i title="view" onClick={()=>{alert('1')}} className="fas fa-eye" 
                    style={{paddingRight: '20px',color:this.props.theme.pagePrimaryColor}}></i>
                {/* <i title="edit" className="fas fa-edit" style={{ paddingRight: '20px', color: '#2196F3' }}></i> */}
                <i title="Delete" onClick={()=>{alert('2')}} className="fas fa-trash" 
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
            <th scope="col">Name</th>
            <th scope="col" colSpan="2">Email</th>
            <th scope="col">Is Admin</th>
            <th scope="col">Date Invited</th>
            <th scope="col">Authenticated</th>
            <th scope="col">Date Authenticated</th>
            <th scope="col">Grouped</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
            {list()}
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