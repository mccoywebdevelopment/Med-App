import React from "react";
import PassStrength from "./PassStrength";
import zxcvbn from 'zxcvbn';
import {register} from '../../api/auth/auth';
import {nameValidator,passwordValidator,phoneNumberValidator} from "../../config/validator";
import {Button,Card,CardBody,FormGroup,Form,Input,Col,Label, FormFeedback} from "reactstrap";

import {Redirect} from 'react-router';

class Register extends React.Component {
  state={
    password:"",
    firstName:"",
    lastName:"",
    phoneNumber:"",

    passwordScore:0,
    
    passwordErrorMsg:"",
    firstNameErrorMsg:"",
    lastNameErrorMsg:"",
    phoneNumberErrorMsg:"",

    firstNameInvalid:false,
    lastNameInvalid:false,
    phoneNumberInvalid:false,
    passwordInvalid:false,

    isValid:false,
    isRedirect:null
  }
  constructor(props){
    super(props);
    localStorage.setItem("JWT",null);
    if(!this.props.match.params.email){
      alert("You do not have access to this site.");
    }
  }
  firstNameChangeHandler=(e)=>{
    let newState = this.state;
    newState.firstName = e.target.value;
    this.setState(newState)
  }
  lastNameChangeHandler=(e)=>{
    let newState = this.state;
    newState.lastName = e.target.value;
    this.setState(newState)
  }
  phoneNumberChangeHandler=(e)=>{
    let newState = this.state;
    newState.phoneNumber = e.target.value;
    this.setState(newState)
  }
  passwordChangeHandler=(e)=>{
    let newState = this.state;
    newState.password = e.target.value;
    newState.passwordScore = zxcvbn(e.target.value).score;
    this.setState(newState)
  }
  sumbmitHandler=()=>{
    let newState = this.state;
    newState.passwordErrorMsg = passwordValidator(newState.password,true).errorMsg;
    newState.firstNameErrorMsg = nameValidator(newState.firstName,true).errorMsg;
    newState.lastNameErrorMsg = nameValidator(newState.lastName,true).errorMsg;
    newState.phoneNumberErrorMsg = phoneNumberValidator(newState.phoneNumber,true).errorMsg;

    this.setState(newState);
    this.checkInputs();
    
    if(this.state.isValid){
      var bodyData = {
        username:this.props.match.params.email,
        password:this.state.password,
        phoneNumber:this.state.phoneNumber,
        firstName:this.state.firstName,
        lastName:this.state.lastName
      }
      register(this.props.match.params.email,this.props.match.params.token,bodyData,(res)=>{
        if(res.error){
          alert(res.error);
        }else{
          let newState = this.state;
          var redirectURL = res.result.redirectURL;
          localStorage.setItem("JWT",res.result.JWT);
          newState.isRedirect = redirectURL;
          this.setState(newState);
        } 
      });
    }
  }
  checkInputs=()=>{

    let newState = this.state;
    newState.isValid = true;
    newState.firstNameInvalid = false;
    newState.lastNameInvalid = false;
    newState.phoneNumberInvalid = false;
    newState.passwordInvalid = false;

    if(newState.firstNameErrorMsg.length>0){
      newState.firstNameInvalid = true;
      newState.isValid = false;
    }
    if(newState.lastNameErrorMsg.length>0){
      newState.lastNameInvalid = true;
      newState.isValid = false;
    }
    if(newState.phoneNumberErrorMsg.length>0){
      newState.phoneNumberInvalid = true;
      newState.isValid = false;
    }
    if(newState.passwordErrorMsg.length>0){
      newState.passwordInvalid = true;
      newState.isValid = false;
    }
    this.setState(newState);

  }
  render() {

    return (
      <>
        {this.state.isRedirect? <Redirect to={this.state.isRedirect}/>:
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Sign up with credentials</small>
              </div>
              <Form role="form">
                  <Col lg={{size:12}}>
                    <Label>First Name</Label>
                    <Input placeholder="First Name" type="text" invalid={this.state.firstNameInvalid} name="firstName" onChange={this.firstNameChangeHandler}/>
                    <FormFeedback>{this.state.firstNameErrorMsg}</FormFeedback>
                  </Col>
                  <Col lg={{size:12}}>
                    <Label>Last Name</Label>
                    <Input placeholder="Last Name" type="text" invalid={this.state.lastNameInvalid} name="lastName" onChange={this.lastNameChangeHandler}/>
                    <FormFeedback>{this.state.lastNameErrorMsg}</FormFeedback>
                  </Col>
                  <Col lg={{size:12}}>
                    <Label>Phone Number</Label>
                    <Input placeholder="Phone Number" type="tel" invalid={this.state.phoneNumberInvalid} name="phoneNumber" onChange={this.phoneNumberChangeHandler}/>
                    <FormFeedback>{this.state.phoneNumberErrorMsg}</FormFeedback>
                  </Col>
                  <hr></hr>
                  <Col lg={{size:12}}>
                    <Label>Email</Label>
                    <Input placeholder="Email" type="email" value={this.props.match.params.email} disabled name="email" />
                  </Col>
                  <Col lg={{size:12}}>
                    <Label>Password</Label>
                    <Input placeholder="password" onChange={this.passwordChangeHandler} type="password" invalid={this.state.passwordInvalid} name="password"/>
                    <FormFeedback>{this.state.passwordErrorMsg}</FormFeedback>
                  </Col>
                  <Col lg={{size:12}}>
                    <PassStrength passwordScore={this.state.passwordScore}/>
                  </Col>
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="button" onClick={this.sumbmitHandler}>
                    Create account
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
        }
      </>
    );
  }
}

export default Register;
