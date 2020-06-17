import React from 'react';
import {Card,Button, Row} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';

import DepItemOverview from './overview/DepItemOverview';
import RxsItem from './rxs/RxsItem';
import ItemOptions from './ItemOptions/ItemOptions'
import RxsMedicationItem from './rxsMedication/RxsMedicationItem';

export default class DependentItem extends React.Component{
    constructor(props){
        super(props);

        var array = [
        {value:'Overview',isSelected:false},
        {value:'Prescription(s)',isSelected:false},
        {value:'Rxs Medication(s)',isSelected:true},
        {value:'OTC',isSelected:false},
        {value:'Ellipse',isSelected:false}
        ];



        var options =[
            [{
                value:'Edit Dependent',
                isDelete:false,
                toggle:this.toggleIsEdit.bind(this),
                disabled:false
            },{
                value:'Delete Dependent',
                isDelete:true,
                data:this.props.data,
                toggle:this.props.delete,
                disabled:false
            }],
            [{
                value:'Delete Dependent',
                isDelete:true,
                data:this.props.data,
                toggle:this.props.delete,
                disabled:false
            }],
            [{
                value:'Delete Dependent',
                isDelete:true,
                data:this.props.data,
                toggle:this.props.delete,
                disabled:false
            }],
            [{
                value:'Delete Dependent',
                isDelete:true,
                data:this.props.data,
                toggle:this.props.delete,
                disabled:false
            }]
        ]

        this.state={
            navs:array,
            allOptions:options,
            options:options[2],
            isEdit:false,
            isUndo:false,
            selectedRxsMed:null,
            dataOverview:{
                firstName:this.props.data.name.firstName,
                lastName:this.props.data.name.lastName,
                dateOfBirth:this.props.data.dateOfBirth
            }
        }
        console.log(this.state);
    }
    onChangeFirstName = (e) =>{
        let newState = this.state;
        newState.dataOverview.firstName = e.target.value;
        this.setState(newState);
    }
    onChangeLastName = (e) =>{
        let newState = this.state;
        newState.dataOverview.lastName = e.target.value;
        this.setState(newState);
    }
    onChangeDateOfBirth = (e) =>{
        let newState = this.state;
        newState.dataOverview.dateOfBirth = e.target.value;
        this.setState(newState);
    }
    toggleNav = (e,key) =>{
        let newState = this.state;
        for(var i=0;i<newState.navs.length;++i){
            if(i==key){
                newState.navs[i].isSelected = !newState.navs[i].isSelected;
                newState.options = newState.allOptions[i];
            }else{
                newState.navs[i].isSelected = false;
            }
        }
        if(key!=2){
            //selectedRxsMed
            newState.selectedRxsMed = null;
        }
        this.setState(newState);
    }
    toggleIsEdit = () =>{
        let newState = this.state;
        newState.isEdit = !newState.isEdit;
        this.setState(newState);
    }
    getRxsMedsFromRxs = (rxs) =>{
        var medications = [];
        for(var i=0;i<rxs.length;++i){
            for(var ix=0;ix<rxs[i].rxsMedications.length;++ix){
                medications.push(rxs[i].rxsMedications[ix]);
            }
        }
        return medications;
    }
    toggleUpdate = () =>{
        let newState = this.state;
        var body = {};
        if(this.state.navs[0].isSelected){
            body = {
                firstName:this.state.dataOverview.firstName,
                lastName:this.state.dataOverview.lastName,
                dateOfBirth:this.state.dataOverview.dateOfBirth
            }
        }
        newState.isEdit = false;
        this.props.update(this.props.data._id,body);
        this.setState(newState);
    }
    toggleUndo = (e) =>{
        let newState = this.state;
        newState.isEdit = false;
        newState.dataOverview={
                firstName:this.props.data.name.firstName,
                lastName:this.props.data.name.lastName,
                dateOfBirth:this.props.data.dateOfBirth
            }
    
        this.setState(newState);
    }
    selectRxsMed = (e,rxsMedId) =>{
        let newState = this.state;
        newState.selectedRxsMed = rxsMedId;
        this.setState(newState);
        this.toggleNav(null,2);
    }
    render(){
        const navs = () =>{
            return(
                <nav className="nav" style={{width:'100%'}}>
                    <>
                    {
                        this.state.navs.map((element,key)=>{
                            return(
                                <React.Fragment key={'lskdjfw32'+key}>
                                {key==this.state.navs.length-1?
                                    <ItemOptions data={this.state.options} toggleIsEdit={this.toggleIsEdit} size={'lg'}/>
                                    :
                                    <a className={'nav-link '+(element.isSelected?'nav-active ':' ')} onClick={(e)=>{this.toggleNav(e,key)}}>{element.value}</a>
                                }
                                </React.Fragment>
                            );
                        })
                    }
                    </>
            </nav>
            )
        }
        return(
            <Card className='fade-in' style={{height:'100%',padding:'30px',minHeight:'35em'}}>
                <nav className="nav">
                    {navs()}
                </nav>
                <div style={{padding:'0px',overflowY: 'auto',overflowX:'hidden',height: '525px'}}>
                {this.state.navs[0].isSelected?

                    <DepItemOverview onChangeFirstName={this.onChangeFirstName} onChangeLastName={this.onChangeLastName} 
                        onChangeDateOfBirth={this.onChangeDateOfBirth} isEdit={this.state.isEdit} isUndo={this.state.isUndo} data={this.state.dataOverview}/>

                :this.state.navs[1].isSelected?
                    <RxsItem addRxs={this.props.addRxs} selectChild={this.selectRxsMed} parentID={this.props.data._id} delete={this.props.deleteRxs} data={this.props.data.rxs}/>
                :this.state.navs[2].isSelected?
                    <RxsMedicationItem selectedItem={this.state.selectedRxsMed} data={this.getRxsMedsFromRxs(this.props.data.rxs)}/>
                :null}
                </div>
                <Row style={{marginTop:'10px',paddingLeft:'15px'}}>
                    {!this.state.isEdit?
                        <Button color='primary' onClick={this.props.goBack}><FontAwesomeIcon icon={faArrowLeft}/>  Back to Table</Button>
                        :
                        <div style={{right:'0'}}>
                            <Button onClick={this.toggleUndo} color='primary'>Undo Changes</Button>
                            <Button  color='primary' onClick={this.toggleUpdate}>Save</Button>
                        </div>
                    }
                </Row>
            </Card>
        );
    }
}