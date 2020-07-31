import React from 'react';
 /* Add a function to redirect when user clicks table row!!!*/
export default function DependentTableSm() {
  return (
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Age</th>
          <th scope="col">DOB<i title="Add" class="fas fa-user-plus" style={{float:'right'}}></i></th>
        </tr>
      </thead>
      <tbody>

        <tr>
          <th scope="row">1</th>
          <td>Christopher McCoy</td>
          <td>23</td>
          <td>12/17/1996</td>
        </tr>

      </tbody>
    </table>
  );
}