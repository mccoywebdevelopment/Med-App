
import React from 'react';

export default class DependentTable extends React.Component{
  /* Add a function to redirect when user clicks table row!!!*/
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
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{dep.name.firstName + " " + dep.name.lastName}</td>
              <td>{age}</td>
              <td>{dateOfBirth}</td>
              <td>{rxsMeds}</td>
              {/* <td>Ventrent</td> */}
              <td style={group.style}>{group.text}</td>
              <td>
                <i title="view" className="fas fa-eye" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
                <i title="edit" className="fas fa-edit" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
                <i title="Delete" className="fas fa-trash" style={{ color: '#2196F3' }}></i>
              </td>
            </tr>
        );
      });
    }
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
            <th scope="col">DOB</th>
            <th scope="col"># Medication(s)</th>
            {/* <th scope="col">Last Med Taken</th> */}
            <th scope="col">Grouped</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
            {list()}
            {/* <tr>
              <th scope="row">1</th>
              <td>Christopher McCoy</td>
              <td>23</td>
              <td>12/17/1996</td>
              <td>2</td>
              <td>Ventrent</td>
              <td>Yes</td>
              <td>
                <i title="view" className="fas fa-eye" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
                <i title="edit" className="fas fa-edit" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
                <i title="Delete" className="fas fa-trash" style={{ color: '#2196F3' }}></i>
              </td>
            </tr> */}
        </tbody>
      </table>
    );
  }
}