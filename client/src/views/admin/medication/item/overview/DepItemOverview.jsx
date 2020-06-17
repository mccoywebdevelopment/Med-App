import React from 'react';

import {Row,Col} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons';

import DynamicInput from '../../../../../components/shared/DynamicInput/DynamicInput';

export default class DepItemOverview extends React.Component{
    constructor(props){
        super(props);
    }
    getDate = (inputDateOfBirth) =>{
        var dateOfBirth = new Date(inputDateOfBirth);
        var mm = dateOfBirth.getMonth()+1;
        mm = mm.toString();
        if(mm.length==1){
            mm = '0'+mm;
        }
        var dd = dateOfBirth.getDate();
        dd = dd.toString();
        if(dd.length==1){
            dd = '0'+dd;
        }
        var yyyy = dateOfBirth.getFullYear();
        dateOfBirth = mm+"-"+dd+"-"+yyyy;
        return dateOfBirth;
    }
    getAge = (dateString) => {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    render(){
        return(
            <>
            <Row style={{paddingTop:'50px'}}>
                <Col lg='12' className='text-center'>
                    {!this.props.isEdit?<img src={typeof(this.props.data.pictureUrl)!=undefined && this.props.data.pictureUrl?this.props.data.pictureUrl:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} style={{borderRadius:'50%',height:'150px'}} alt="..."/>:null}
                </Col>
                <Col lg='3'></Col>
                <Col lg='3'style={{padding:'30px'}}>
                    <DynamicInput isInput={this.props.isEdit} onChange={this.props.onChangeFirstName} value={this.props.data.firstName} label='First Name'/>
                </Col>
                <Col lg='3' style={{padding:'30px'}}>
                    <DynamicInput isInput={this.props.isEdit} onChange={this.props.onChangeLastName} value={this.props.data.lastName} label='Last Name'/>
                </Col>
                <Col lg='3'></Col>
                <Col lg='3'></Col>
                <Col lg='3' style={{padding:'30px'}}>
                    <DynamicInput isInput={this.props.isEdit} type={'date'} onChange={this.props.onChangeDateOfBirth} value={this.getDate(this.props.data.dateOfBirth)}  label='Date of Birth'/>
                </Col>
                <Col lg='3' style={{padding:'30px'}}>
                    {!this.props.isEdit?<DynamicInput  value={this.getAge(this.props.data.dateOfBirth)} label='Age'/>:null}
                </Col>

            </Row>
            </>
        )
    }
}