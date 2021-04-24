import React from 'react';

export default function Overview(props) {
  return (
    <div className="row">
    <div className="col-md-4" style={{paddingLeft:'0px'}}>
      <div className="card" style={{minHeight:'128px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h4 className="font-weight-semibold mb-0">{props.today}</h4>
            <h5 className="font-weight-semibold mb-0"># of Notifications Today</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i class="fas fa-exclamation-circle" style={{fontSize:'40px',color:'#2196f3',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-4" style={{paddingLeft:'0px'}}>
      <div className="card" style={{minHeight:'128px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h4 className="font-weight-semibold mb-0">{props.month}</h4>
            <h5 className="font-weight-semibold mb-0"># of Notifications This Month</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-calendar-times" style={{fontSize:'40px',color:'#2196f3',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-4" style={{paddingLeft:'0px',paddingRight:'0px'}}>
      <div className="card" style={{minHeight:'128px'}}>
        <div className="card-body row">
          <div className="col-lg-6">
            <h4 className="font-weight-semibold mb-0">{props.total}</h4>
            <h5 className="font-weight-semibold mb-0"># of Total Notifications</h5>
          </div>
          <div className="col-lg-6" style={{textAlign:'center'}}>
            <i className="fas fa-history" style={{fontSize:'40px',color:'#2196f3',float:'right'}}></i>
          </div>
        </div>
      </div>
    </div>
    </div>

  )
}