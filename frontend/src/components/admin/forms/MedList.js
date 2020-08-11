import React from 'react';

import RxsMedForm from "./RxsMedForm";
import MedicationTable from '../tables/MedicationTable';

export default class MedList extends React.Component{
    state = {
        showMore:false
    }
    constructor(props){
        super(props);
        this._toggleShowMore = this._toggleShowMore.bind(this);
    }
    _toggleShowMore = () =>{
        let newState = this.state;
        newState.showMore = !newState.showMore;
        this.setState(newState);
    }
    render(){
        return(
            <>
                {this.props.data.isAdd?
                    <>
                        <RxsMedForm data={this.props.data.list[this.props.data.index]} update={this.props.update} index={this.props.data.index}/>
                    </>
                    :   null
                }
                {this.props.data.list.length>1?
                    <MedicationTable list={this.props.data.list} index={this.props.data.index}
                         showMore={this.state.showMore} toggleShowMore={this._toggleShowMore}/>
                    :null
                }
            </>
        //    <MedicationTable/>
        )
    }
}