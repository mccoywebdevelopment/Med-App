
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAge, formateDate} from "../../../config/helpers"

class DependentTableSm extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }
  _getLenOfMeds = (dep) =>{
    let len = 0;
    for(var i=0;i<this.props.populatedDeps.length;++i){
      if(this.props.populatedDeps[i]._id == dep._id){
        for(var ix=0;ix<this.props.populatedDeps[i].rxs.length;++ix){
          len = len + this.props.populatedDeps[i].rxs[ix].rxsMedications.length;
        }
      }
    }
    return len;
  }
  render() {
    const list = (dependents) => {
      return dependents.map((dependent, index) => {
        let name = dependent.name.firstName + " " + dependent.name.lastName;
        let age = getAge(dependent.dateOfBirth);
        let dateOfBirth = formateDate(dependent.dateOfBirth);
        let medLen = this._getLenOfMeds(dependent);
        return (
          <tr key={"userTable" + index}>
            <th scope="row">{index + 1}</th>
            <td colSpan="2">{name}</td>
            <td>{age}</td>
            <td>{medLen}</td>
            {/* <td>{dateOfBirth}</td> */}
          </tr>
        );
      });
    }
    return (
      <>
      {this.props.dependents.length>0?
      <table className="table my-search-table my-med-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" colSpan="2">Name</th>
            <th scope="col">Age</th>
            <th scope="col" colSpan="2">#Medications</th>
            {/* <th scope="col">Date of Birth</th> */}
          </tr>
        </thead>
        <tbody>
          {list(this.props.dependents)}
        </tbody>
      </table>
      :null}
      </>
    );
  }
}

export default connect(null, {})(DependentTableSm);