
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectItem } from '../../../actions/table';


class DependentTable extends React.Component{
  static propTypes = {
    table: PropTypes.object.isRequired
  };
  constructor(props){
    super(props);
    console.log(props);
  }
  _selectItem = (dep) =>{
    if(typeof(this.props.toggleRedirect)!='undefined'){
      this.props.toggleRedirect(dep);
    }else{
      this.props.changeDepSel(dep)
    }
  }
  render(){
    const list=() =>{
      return this.props.dependents.map((dep,index)=>{
        let dateOfBirth = dep.dateOfBirth.split('-');
        let mm = dateOfBirth[1];
        let yyyy = dateOfBirth[0];
        let dd = dateOfBirth[2];
        dateOfBirth = mm + "-" + dd + "-" + yyyy;

        let birthday = +new Date(dateOfBirth);
        let age = ~~((Date.now() - birthday) / (31557600000));

        let rxsMeds = 0;
        for(var i=0;i<dep.rxs.length;++i){
          rxsMeds = rxsMeds + dep.rxs[i].rxsMedications.length;
        }

        let group = {
          text:"No",
          style:{
            color:"red"
          }
        }
        let trStyle = {
        }
        if(dep.groups.length>0){
          group.text = "Yes";
          group.style.color = "#19d895";
        }
        if(this.props.selected == dep._id && this.props.isSmall){
          trStyle.background = '#bfe1fb';
        }
      
        return(
          <>
            <tr style={trStyle}>
              <th scope="row" onClick={()=>{this._selectItem(dep._id)}}>{index + 1}</th>
              <td onClick={()=>this._selectItem(dep)}>{dep.name.firstName + " " + dep.name.lastName}</td>
              {!this.props.isSmall?<td>{age}</td>:null}
              <td onClick={()=>this._selectItem(dep)}>{dateOfBirth}</td>
              <td onClick={()=>this._selectItem(dep)}>{rxsMeds}</td>
              {/* <td>Ventrent</td> */}
              <td style={group.style} onClick={()=>this._selectItem(dep._id)}>{group.text}</td>
              {!this.props.isSmall?
              <td>
                <i title="view" className="fas fa-eye" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
                <i title="edit" className="fas fa-edit" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
                <i title="Delete" onClick={()=>{this.props.delete(dep)}} className="fas fa-trash" style={{ color: '#2196F3' }}></i>
              </td>
              :null}
            </tr>
            </>
        );
      });
    }
    return (
      <table className="table dependentTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            {!this.props.isSmall?<th scope="col">Age</th>:null}
            <th scope="col">DOB</th>
            <th scope="col"># Medication(s)</th>
            {/* <th scope="col">Last Med Taken</th> */}
            <th scope="col">Grouped</th>
            {!this.props.isSmall?<th scope="col">Actions</th>:null}
          </tr>
        </thead>
        <tbody>
            {list()}
        </tbody>
      </table>
    );
  }
}

DependentTable.propTypes = {
  selectItem: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
  table: state.table
});

export default connect(mapStateToProps, {selectItem})(DependentTable);