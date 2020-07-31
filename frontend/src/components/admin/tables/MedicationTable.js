import React from "react";

export default function MedicationTable() {
  return (
    <>
      <table class="table my-med-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Dosage</th>
            <th scope="col">Rxs#</th>
            <th scope="col">Actions<i title="expand" class="fas fa-expand" style={{ float: 'right' }}></i></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" style={{paddingBottom:'0',paddingTop:'0'}}>
              <p style={{marginBottom:'0px',paddingTop:'28px'}}>1</p>
              <p title="view rest of med" style={{color:'#2196F3',paddingTop:"5px",marginBottom:'10px'}}>More</p>
            </th>
            <td>Benzoid</td>
            <td>2 MG</td>
            <td>2342342334</td>
            <td>
              <i title="view" class="fas fa-eye" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
              <i title="edit" class="fas fa-edit" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
              <i title="Delete" class="fas fa-trash" style={{ color: '#2196F3' }}></i>
            </td>
          </tr>
          <tr>
            <th scope="row" style={{paddingBottom:'0',paddingTop:'0'}}>
              <p style={{marginBottom:'0px',paddingTop:'20px'}}>1</p>
              <p title="view rest of med" style={{color:'#2196F3',paddingTop:"10px",marginBottom:'10px'}}>More</p>
            </th>
            <td>Benzoid</td>
            <td>2 MG</td>
            <td>2342342334</td>
            <td>
              <i title="view" class="fas fa-eye" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
              <i title="edit" class="fas fa-edit" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
              <i title="Delete" class="fas fa-trash" style={{ color: '#2196F3' }}></i>
            </td>
          </tr>
        </tbody>
      </table>
      <p title="view" style={{ marginTop: '15px', marginLeft: '5px', cursor: 'pointer', color: '#2196F3',marginBottom:'0' }}>
        <i class="fas fa-plus" style={{paddingRight:'10px'}}></i> 
        2 More Medications
      </p>
    </>
  );
}