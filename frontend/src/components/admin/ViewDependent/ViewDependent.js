import React from 'react';

import MedicationTable from "../tables/MedicationTable";

export default function ViewDependent(){
    return(
        <div className="card" style={{padding:"20px"}}>
            <div className="row">
                <div className="col-lg-12">
                    <h4 style={{display:'inline'}}>Dependent Overview</h4>
                    <i title="edit" className="fas fa-edit" style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                    <i title="delete" className="fas fa-trash" style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                    <i title="close" style={{float:'right'}} className="fas fa-times"></i>
                </div>
            </div>
            <div className="row" style={{marginTop:'10px'}}>
                {DependentDetails()}
            </div>
            <div className="row" style={{marginTop:'10px'}}>
                <div className="col-lg-12">
                    <h4 style={{display:'inline'}}>Medications <span style={{fontSize:'17px'}}>(4)</span></h4>
                    <i title="add" className="fas fa-plus" style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                </div>
            </div>
            <div className="row" style={{marginTop:'10px'}}>
                <div className="col-lg-12">
                    <MedicationTable/>
                </div>
            </div>
            <div className="row" style={{marginTop:'10px'}}>
                <div className="col-lg-12">
                    <h4 style={{display:'inline'}}>Notes <span style={{fontSize:'17px'}}>(4)</span></h4>
                    <i title="add" className="fas fa-plus" style={{ paddingLeft: '20px', color: '#2196F3' }}></i>
                </div>
            </div>
            <div className="row" style={{marginTop:'10px'}}>
                <div className="col-lg-12">
                    {Notes()}
                </div>
            </div>
        </div>
    )
}

function DependentDetails(){
    return(
        <>
            <div className="col-lg-5" style={{paddingLeft:'0px'}}>
                <span>Name:</span><span style={{paddingLeft:'10px'}}>Christopher McCoy</span>
            </div>
            <div className="col-lg-3">
                <span>Age:</span><span style={{paddingLeft:'10px'}}>23</span>
            </div>
            <div className="col-lg-4">
                <span>Belongs to Group:</span><span style={{paddingLeft:'10px',color:'#19d895'}}>Yes</span>
            </div>
            <div className="col-lg-5" style={{paddingLeft:'0px',marginTop:'10px'}}>
                <span>Group Name:</span><span style={{paddingLeft:'10px'}}>Daniels House</span>
            </div>
            <div className="col-lg-5" style={{marginTop:'10px'}}>
                <span>Group ID:</span><a target="_blank" href="/groups/2342234234"><span style={{paddingLeft:'10px'}}>789988374892</span></a>
            </div>
            <div className="col-lg-12" style={{marginTop:'10px'}}>
                <span>Date Created:</span><span style={{paddingLeft:'10px'}}>7/22/2020</span>
            </div>
        </>
    );
}
function Notes(){

}

