import React from 'react';
import { FETCH_DEPENDENTS } from '../../../actions/types';

export default function Overview(props) {
  return (
    <div className="row">
    <div className="col-md-4" style={{paddingLeft:'0px'}}>
      <div className="card" style={{minHeight:'128px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h4 className="font-weight-semibold mb-0">{props.dependentsLength}</h4>
            <h5 className="font-weight-semibold mb-0">Dependents</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-user-friends" style={{fontSize:'40px',color:'#2196f3',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-4" style={{paddingLeft:'0px'}}>
      <div className="card" style={{minHeight:'128px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h4 className="font-weight-semibold mb-0">{props.averageMed.toFixed(2)}</h4>
            <h5 className="font-weight-semibold mb-0">Avg # of Meds Per Dependent</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-prescription-bottle" style={{fontSize:'40px',color:'#2196f3',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-4" style={{paddingLeft:'0px',paddingRight:'0px'}}>
      <div className="card" style={{minHeight:'128px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h4 className="font-weight-semibold mb-0">{props.averageAge.toFixed(2)}</h4>
            <h5 className="font-weight-semibold mb-0">Average Age of Dependent</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-child" style={{fontSize:'40px',color:'#2196f3',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    </div>

  )
}