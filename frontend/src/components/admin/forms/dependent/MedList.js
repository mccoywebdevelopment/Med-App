import React from 'react';

import RxsMedForm from "./RxsMedForm";
import MedicationTable from '../../tables/MedicationTable';

export default class MedList extends React.Component{
    state = {
        showMore:false,
        list:[],
        rxsList:[]
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
        console.log("test");
        console.log(this.props);
        let rxsList = [];
        for(var i=this.props.data.list.length-1;i>-1;--i){
            if(!this.props.data.isAdd || i!=this.props.data.list.length-1){
                rxsList.push(this.props.data.list[i]);
            }
        }
        return(
            <>
                {this.props.data.isAdd && this.props.data.list.length>0?
                    <>
                        <RxsMedForm data={this.props.data.list[this.props.data.indexSelected]} update={this.props.update} 
                            index={this.props.data.indexSelected}/>
                    </>
                    :   null
                }
                {rxsList.length>0?
                    <MedicationTable tookMed={this.props.tookMed} viewDates={this.props.viewDates} isCreate={this.props.isCreate}
                         list={rxsList} showMore={this.state.showMore} expandItem={this.props.toggleExpandMed}
                         toggleShowMore={this._toggleShowMore} delete={this.props.delete} edit={this.props.edit}
                         isUser={this.props.isUser}/>
                    :null
                }
            </>
        //    <MedicationTable/>
        )
    }
}