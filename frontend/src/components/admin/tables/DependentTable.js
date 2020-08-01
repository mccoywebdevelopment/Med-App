import React from 'react';

export default function DependentTable() {
  /* Add a function to redirect when user clicks table row!!!*/
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Age</th>
          <th scope="col">DOB</th>
          <th scope="col"># Medication(s)</th>
          <th scope="col">Last Med Taken</th>
          <th scope="col">Grouped</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
          <tr>
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
          </tr>
      </tbody>
    </table>
  );
}