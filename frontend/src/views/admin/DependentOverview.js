import React from 'react';

import DependentTableSm from "../../components/admin/tables/DependentTableSm";
import ViewDependent from "../../components/admin/ViewDependent/ViewDependent";

export default class DependentOverview extends React.Component{
    render(){
        return(
            <>
                <div className="col-lg-6">
                    <DependentTableSm />
                </div>
                <div className="col-lg-6">
                    <ViewDependent />
                </div>
            </>
        );
    }
}