import React from 'react';
import {Row,Col,Button} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faArrowAltCircleLeft, faArrowLeft} from '@fortawesome/free-solid-svg-icons';

import ItemOptions from '../ItemOptions/ItemOptions';

export default class RxsMedicationItem extends React.Component{
    state = {
        scrollEle:null
    }
    constructor(props){
        super(props);
        if(this.props.selectedItem){
            let newState = this.state;
            newState.scrollEle = React.createRef();
            this.setState(newState);
        }
    }
    componentDidMount = () =>{
        if(this.state.scrollEle){
            this.state.scrollEle.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });;
        }
    }
    render(){
        const rxsMedList = () =>{
            return this.props.data.map((item,key)=>{
                var ref;
                if(this.props.selectedItem==item._id){
                    ref = this.state.scrollEle;
                }
                return(
                    <div ref={ref?ref:null} key={'rxsItem'+key} className={'card myItem '+(this.props.selectedItem==item._id?'selected-card':null)} style={{marginTop:'30px',textAlign:'left'}}>
                        <div class="card-body">
                            <Row>
                                <Col lg='2'>
                                    <p style={{fontWeight:'bold'}}>Name:</p>
                                    <p>{item.name}</p>
                                </Col>
                                <Col lg='2'>
                                    <p style={{fontWeight:'bold'}}>Dosage:</p>
                                    <p>{item.dosage.quantity} {item.dosage.unit}</p>
                                </Col>
                                <Col lg='2'>
                                    <p style={{fontWeight:'bold'}}>Date Prescribed:</p>
                                    <p>{item.datePrescribed}</p>
                                </Col>
                                <Col lg='2'>
                                    <p style={{fontWeight:'bold'}}>End Date:</p>
                                    <p>{item.endDate}</p>
                                </Col>
                                <Col lg='2'>
                                    <p style={{fontWeight:'bold'}}>When to Take:</p>
                                    <p>{item.whenToTake.value}</p>
                                </Col>
                                <Col lg='2'>
                                    <ItemOptions size={'25px'} style={{marginTop:'25%',float:'right'}} data={[]}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg='12'>
                                    <hr/>
                                </Col>
                                <Col lg='6'>
                                    <p style={{fontWeight:'bold'}}>Reason:</p>
                                    <p>{item.reason}</p>
                                </Col>
                                <Col lg='6'>
                                    <p style={{fontWeight:'bold'}}>Instructions:</p>
                                    <p>{item.instructions}</p>
                                </Col>
                            </Row>
                        </div>
                    </div>          
                )
            });
        }
        return(
            <Row style={{padding:'30px',paddingTop:'30px',backgroundColor:'#F5F7F9',minHeight:'-webkit-fill-available',height:'auto'}}>
                <Col lg='12' className='text-center h-100' style={{backgroundColor:'#F5F7F9'}} >
                <div style={{backgroundColor:'#F5F7F9',color: '#212529'}}>
                     List of Rxs Medication(s):
                </div>  
                {rxsMedList()}
                <p style={{marginTop:'20px',marginBottom:'0px'}}>To add a rxs medication go to Prescription(s).</p>
                <p style={{marginBottom:'0px'}}>Click the icon <FontAwesomeIcon  icon={faEllipsisV}/> on the prescription you want to add to.</p>
                <p style={{marginBottom:'0px'}}>Or Click 'Add Rxs'</p>
                </Col>
            </Row>
        )
    }
}