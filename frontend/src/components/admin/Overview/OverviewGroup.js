import React from 'react';

export default function OverviewUser(props) {
  return (
    <div className="row">
    <div className="col-md-4" style={{paddingLeft:'0px'}}>
      <div className="card" style={{minHeight:'128px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h4 className="font-weight-semibold mb-0">{props.groupLength}</h4>
            <h5 className="font-weight-semibold mb-0">Groups</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-users" style={{fontSize:'40px',color:'#ffaf00',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-4" style={{paddingLeft:'0px'}}>
      <div className="card" style={{minHeight:'128px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h4 className="font-weight-semibold mb-0">{props.avgUserToDependent}</h4>
  <h5 className="font-weight-semibold mb-0">Avg Guardians to Dependents</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-people-arrows" style={{fontSize:'40px',color:'#ffaf00',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-4" style={{paddingLeft:'0px',paddingRight:'0px'}}>
      <div className="card" style={{minHeight:'128px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h4 className="font-weight-semibold mb-0">{props.groupsWithoutGuardians}</h4>
  <h5 className="font-weight-semibold mb-0">Groups With No Recorders</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-user-times" style={{fontSize:'40px',color:'#ffaf00',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    </div>

  )
}