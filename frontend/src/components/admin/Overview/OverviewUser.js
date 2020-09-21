import React from 'react';

export default function OverviewUser(props) {
  return (
    <div className="row">
    <div className="col-md-4" style={{paddingLeft:'0px'}}>
      <div className="card" style={{minHeight:'140px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h2 className="font-weight-semibold mb-0">{props.dependentsLength}</h2>
            <h5 className="font-weight-semibold mb-0">Users</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-user-friends" style={{fontSize:'70px',color:'#8862E0',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-4" style={{paddingLeft:'0px'}}>
      <div className="card" style={{minHeight:'140px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h2 className="font-weight-semibold mb-0">{props.pendingUsers}</h2>
            <h5 className="font-weight-semibold mb-0">Pending Users</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-lock" style={{fontSize:'70px',color:'#8862E0',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-4" style={{paddingLeft:'0px',paddingRight:'0px'}}>
      <div className="card" style={{minHeight:'140px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h2 className="font-weight-semibold mb-0">{props.admins}</h2>
            <h5 className="font-weight-semibold mb-0">Admins</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-user-md" style={{fontSize:'70px',color:'#8862E0',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    </div>

  )
}