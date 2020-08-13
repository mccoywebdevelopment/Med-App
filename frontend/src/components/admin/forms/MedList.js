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
    //PASS LIST rxsMEDLIST and SELECTED!!!!!!
    // componentWillReceiveProps=(newProps) =>{
    //     // alert("update")
    //     console.log(newProps);
    //     console.log(this.state);
    //     if(newProps.data.list!=this.state.list || newProps.data.isAdd!=this.state.isAdd){
    //         console.log("update")
    //         this._updateMyState(newProps.data.list,newProps.data.isAdd);
    //     }
    // }
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
                {this.props.data.list.length>1?
                    <MedicationTable list={rxsList} showMore={this.state.showMore} toggleShowMore={this._toggleShowMore}/>
                    :null
                }
            </>
        //    <MedicationTable/>
        )
    }
}