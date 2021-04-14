import React from 'react';
import MedicationCard from "./MedicationCard";

export default class MedicationCardList extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let todoList = () =>{
            return this.props.activeMeds.map((obj,key)=>{

                return(
                    <React.Fragment key={"medicationCardList"+key}>
                        {key==0?
                            <>
                                <div className="row">
                                    <div className="col-6">
                                        <h5 style={{color:'rgb(33, 150, 243)',fontWeight:'bold'}}>{this.props.period} Todo</h5>
                                    </div>
                                    <div className="col-6">
                                        <p style={{float:'right',color:'rgb(33, 150, 243)',fontWeight:'bold'}}>({this.props.activeMeds.length}) Assign</p>
                                    </div>
                                </div>
                                <div className="col-lg-12" style={{paddingBottom:'1em'}}>
                                    <MedicationCard selectMedCart={this.props.selectMedCart} data={obj}/>
                                </div>
                            </>
                        :
                        <div className="col-lg-12" style={{paddingBottom:'1em'}}>
                            <MedicationCard selectMedCart={this.props.selectMedCart} data={obj}/>
                        </div>
                    }
                    </React.Fragment>
                )
            });
        }
        let historyList = () =>{
            return this.props.historyMeds.map((obj,key)=>{

                return(
                    <React.Fragment key={"medicationCardList"+key}>
                        {key==0?
                            <>
                                <div className="row">
                                    <div className="col-6">
                                        <h5 style={{color:'rgb(33, 150, 243)',fontWeight:'bold',opacity:'0.5'}}>{this.props.period} History</h5>
                                    </div>
                                    <div className="col-6">
                                        <p style={{float:'right',color:'rgb(33, 150, 243)',fontWeight:'bold',opacity:'0.5'}}>({this.props.historyMeds.length}) Administered</p>
                                    </div>
                                </div>
                                <div className="col-lg-12" style={{paddingBottom:'1em'}}>
                                    <MedicationCard selectMedCart={this.props.selectMedCart} data={obj} isHistory={true}/>
                                </div>
                            </>
                        :
                        <div className="col-lg-12" style={{paddingBottom:'1em'}}>
                            <MedicationCard selectMedCart={this.props.selectMedCart} data={obj} isHistory={true}/>
                        </div>
                    }
                    </React.Fragment>
                )
            });
        }
        return(
            <>
                {todoList()}
                {historyList()}
            </>
        )
    }
}