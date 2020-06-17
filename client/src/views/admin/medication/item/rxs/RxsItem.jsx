import React from 'react';
import {Row,Col,Button} from 'reactstrap'

import ItemOptions from '../ItemOptions/ItemOptions';
export default class RxsItem extends React.Component{
    constructor(props){
        super(props);
    }
    test = (e,a) =>{

    }
    render(){
        const rxsMedList = (rxsMeds) =>{
            return rxsMeds.map((item,key)=>{
                var text = ', ';
                if(key==rxsMeds.length-1){
                    text = '';
                }
                return(
                    <>
                        <span onClick={()=>{this.props.selectChild(null,item._id)}} style={{color:'#3196DC',cursor:'pointer',textDecoration: 'underline'}}>{item.name}</span>{text}
                    </>
                )
            });
        }
        const rxsList = () =>{
            return this.props.data.map((item,key)=>{
                return(
                    <div key={'rxsItem'+key} className="card myItem" style={{marginTop:'30px'}}>
                        <div class="card-body" style={{textAlign:'left'}}>
                            <Row>
                                <Col lg='3'>
                                    <p style={{fontWeight:'bold'}}>Rxs Number:</p>
                                    <p>{item.rxsNumber}</p>
                                </Col>
                                <Col lg='3'>
                                    <p style={{fontWeight:'bold'}}>Rxs Medications:</p>
                                    {item.rxsMedications.length>0?
                                    <p>{rxsMedList(item.rxsMedications)}</p>
                                    :
                                    <p>No medication listed</p>}
                                </Col>
                                <Col lg='4'>
                                    <p style={{fontWeight:'bold'}}>Doctor Contacts:</p>
                                    <p style={{marginBottom:'0px'}}>{item.doctorContacts.name.firstName} {item.doctorContacts.name.lastName}</p>
                                    <p>(tel) <a href={"tel:"}>{item.doctorContacts.phoneNumber}</a></p>
                                </Col>
                                <Col lg='2'>

                                    <ItemOptions size={'25px'} style={{marginTop:'25%',float:'right'}} data={[{
                                        value:'Delete Rxs',
                                        isDelete:true,
                                        data:item,
                                        toggle:this.props.delete,
                                        disabled:false
                                    }]}/>
                                </Col>
                            </Row>
                        </div>
                    </div>          
                )
            });
        }
        return(
            <Row style={{padding:'30px',paddingTop:'30px',backgroundColor:'#F5F7F9',minHeight:'-webkit-fill-available',height:'auto'}}>
                <Col lg='12' className='text-center' >
                <div style={{backgroundColor:'#F5F7F9',color: '#212529'}}>
                     List of Prescription(s):
                </div>
                      
                {rxsList()}
                <Button onClick={()=>{this.props.addRxs(null,this.props.parentID)}} className='text-center' style={{marginTop:'20px'}}color='success'>Add Rxs</Button>
                </Col>
            </Row>
        )
    }
}