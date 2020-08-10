import React from 'react';

import RxsMedForm from "./RxsMedForm";
import MedicationTable from '../tables/MedicationTable';

export default class MedList extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        console.log(this.props);
        return(
            <>
                {this.props.data.isAdd?
                    <RxsMedForm data={this.props.data.list[this.props.data.list.length-1]} update={this.props.update}/>
                    :null
                }
            </>
        //    <MedicationTable/>
        )
    }
}