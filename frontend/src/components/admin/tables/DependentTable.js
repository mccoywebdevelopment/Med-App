
import React from 'react';
import { Redirect } from 'react-router-dom';

export default class DependentTable extends React.Component{
  /* Add a function to redirect when user clicks table row!!!*/
  state = {
    redirect:false
  }
  constructor(props){
    super(props);
  }
  _redirect =(depID)=>{
    let newState = this.state;
    newState.redirect = depID;
    this.setState(newState);
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
        if(dep.groups.length>0){
          group.text = "Yes";
          group.style.color = "#19d895";
        }
      
        return(
            <tr onClick={()=>{this._redirect(dep._id)}}>
              <th scope="row">{index + 1}</th>
              <td>{dep.name.firstName + " " + dep.name.lastName}</td>
              {!this.props.isSmall?<td>{age}</td>:null}
              <td>{dateOfBirth}</td>
              <td>{rxsMeds}</td>
              {/* <td>Ventrent</td> */}
              <td style={group.style}>{group.text}</td>
              {!this.props.isSmall?
              <td>
                <i title="view" className="fas fa-eye" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
                <i title="edit" className="fas fa-edit" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
                <i title="Delete" onClick={()=>{this.props.delete(dep)}} className="fas fa-trash" style={{ color: '#2196F3' }}></i>
              </td>
              :null}
            </tr>
        );
      });
    }
    return (
      <>
      {!this.state.redirect?
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
      :<Redirect push to={window.location.pathname+"/"+this.state.redirect}/>
      }
      </>
    );
  }
}