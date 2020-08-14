import React from 'react';

import RxsMedForm from "./RxsMedForm";
import MedicationTable from '../tables/MedicationTable';

export default class MedList extends React.Component{
    state = {
        showMore:false,
        list:[],
        rxsList:[]
    }
    constructor(props){
        super(props);
        this._toggleShowMore = this._toggleShowMore.bind(this);
        this._updateMyState = this._updateMyState.bind(this);
        this._updateMyState(this.props.data.list,this.props.data.isAdd);
    }
    _toggleShowMore = () =>{
        let newState = this.state;
        newState.showMore = !newState.showMore;
        this.setState(newState);
    }
    _updateMyState = (list,isAdd) =>{
        let newState = this.state;
        newState.list = list;
        newState.isAdd = isAdd;
        newState.rxsList = [];
        for(var i=list.length-1;i>-1;--i){
            if(!isAdd || i!=list.length-1){
                newState.rxsList.push(list[i]);
            }
        }
    
        this.setState(newState);
    }
    render(){
        let rxsList = [];
        for(var i=this.props.data.list.length-1;i>-1;--i){
            if(!this.props.data.isAdd || i!=this.props.data.list.length-1){
                rxsList.push(this.props.data.list[i]);
            }
        }
        console.log(this.props);
        return(
            <>
                {this.props.data.isAdd?
                    <>
                        <RxsMedForm data={this.props.data.list[this.props.data.indexSelected]} update={this.props.update} 
                            index={this.props.data.indexSelected}/>
                    </>
                    :   null
                }
                {rxsList.length>0?
                    <MedicationTable list={rxsList} showMore={this.state.showMore}
                         toggleShowMore={this._toggleShowMore} delete={this.props.delete} edit={this.props.edit}/>
                    :null
                }
            </>
        //    <MedicationTable/>
        )
    }
}