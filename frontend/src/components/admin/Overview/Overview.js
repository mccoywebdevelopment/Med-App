import React from 'react';

export default function Overview() {
  return (
    <div className="row">
    <div className="col-md-4" style={{paddingLeft:'0px'}}>
      <div className="card" style={{minHeight:'140px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h2 className="font-weight-semibold mb-0">12</h2>
            <h5 className="font-weight-semibold mb-0">Dependents</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-user-friends" style={{fontSize:'70px',color:'#00bcd4',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-4" style={{paddingLeft:'0px'}}>
      <div className="card" style={{minHeight:'140px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h2 className="font-weight-semibold mb-0">2.1</h2>
            <h5 className="font-weight-semibold mb-0">Avg # of Meds Per Dependent</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-prescription-bottle" style={{fontSize:'70px',color:'#6a2c70',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-4" style={{paddingLeft:'0px'}}>
      <div className="card" style={{minHeight:'140px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h2 className="font-weight-semibold mb-0">16.23</h2>
            <h5 className="font-weight-semibold mb-0">Average Age of Dependent</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-child" style={{fontSize:'70px',color:'#ffa931',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    </div>

  )
}