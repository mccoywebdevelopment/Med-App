
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class GroupTable extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }
  _selectItem = (group) => {
    this.props.changeGroupSel(group)
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
        let name = group.name;
        let numOfDep = group.dependents.length;
        let numOfAdmins = this._getNumberOfAdmins(group.guardians);
        let guardianLength = group.guardians.length - numOfAdmins;
        let trStyle = {
        }

        if(this.props.selected == group._id && this.props.isSmall){
          trStyle.background = '#feefd5';
        }
        
        return (
          <tr style={trStyle} key={"userTable" + index}>
            <th scope="row">{index + 1}</th>
            <td colSpan="2" onClick={() => this._selectItem(group)}>{name}</td>
            <td onClick={() => this._selectItem(group)}>{numOfDep}</td>
            <td onClick={() => this._selectItem(group)}>{guardianLength}</td>
            <td onClick={() => this._selectItem(group)}>{numOfAdmins}</td>

            {!this.props.isSmall ?
              <td>
                <i title="view" onClick={() => this._selectItem(group)} className="fas fa-eye"
                  style={{ paddingRight: '20px', color: this.props.theme.pagePrimaryColor }}></i>
                {/* <i title="edit" className="fas fa-edit" style={{ paddingRight: '20px', color: '#2196F3' }}></i> */}
                <i title="Delete" onClick={() => { this.props.delete(group) }} className="fas fa-trash"
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
            <th scope="col" colSpan="2">Name</th>
            <th scope="col" colSpan="1">#Dependents</th>
            <th scope="col" colSpan="1">#Guardians</th>
            <th scope="col" colSpan="1">#Admins</th>
            {!this.props.isSmall ? <th scope="col">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {list(this.props.groups)}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => ({
  theme: state.theme
});

export default connect(mapStateToProps, {})(GroupTable);