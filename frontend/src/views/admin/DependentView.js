import React from 'react';

import DependentTable from "../../components/admin/tables/DependentTable";
import DependentTableSm from "../../components/admin/tables/DependentTableSm";
import Overview from "../../components/admin/Overview/Overview";
import ViewDependent from "../../components/admin/ViewDependent/ViewDependent";

export default function DependentView() {
    /*
        Height for the table when user selects Dependent will be the max height of the 
        ViewDependent.
    */
    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-12">
                            <h4 className="view-header">Dependents</h4>
                        </div>
                        <div className="col-lg-12" style={{ marginBottom: "30px"}}>
                            <Overview />
                        </div>
                        <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                            <button type="button" class="btn btn-primary btn-fw">Create</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12" style={{height:'1000px'}}>
                            <DependentTable />
                            {/* <DependentTableSm/> */}
                        </div>
                    </div>
                </div>
                {/* <div className="col-lg-6">
                    <ViewDependent/>
                </div> */}
            </div>
        </>
    );
}