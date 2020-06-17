/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import {emailValidator,passwordValidator} from "../../config/validator";
import {login} from '../../api/auth/auth';
import {Redirect} from 'react-router';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  Label,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  FormFeedback
} from "reactstrap";



class Login extends React.Component {
  state = {
    email:"",
    password:"",
    emailErrorMsg:"",
    passwordErrorMsg:"",
    isRedirect:null
  }
  // state = {
  //   email:"t@gmail.com",
  //   password:"Test123!",
  //   emailErrorMsg:"",
  //   passwordErrorMsg:"",
  //   isRedirect:null
  // }
  constructor(props){
    super(props);
    // alert("Please use the current creditials to loggin as admin.");
  }
  changeHandler = (e,isEmail) =>{
    let newState = this.state;
    if(isEmail){
      newState.email = e.target.value
    }else{
      newState.password = e.target.value;
    }
    this.setState(newState);
  }
  submitHandler = async() =>{
    let newState = this.state;
    var isValid = true;
    newState.emailErrorMsg = emailValidator(newState.email,true).errorMsg;
    newState.passwordErrorMsg = passwordValidator(newState.password,true).errorMsg;
    if(newState.emailErrorMsg.length>0 || newState.passwordErrorMsg.length>0){
      isValid = false;
    }
    this.setState(newState);
    
    if(isValid){
      var bodyData ={
        username:this.state.email,
        password:this.state.password
      }
     await login(bodyData,(res)=>{
        if(res.error){
          alert(res.error);
        }else{
          localStorage.clear();
          let newState = this.state;
          var redirectURL = res.result.redirectURL;
          localStorage.setItem("JWT",res.result.JWT);
          newState.isRedirect = redirectURL;
          this.setState(newState);
        }
      });
    }
    
  }
  render() {
    return (
      <>
         {this.state.isRedirect? <Redirect to={this.state.isRedirect}/>:
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Sign in with credentials</small>
              </div>
              <Form role="form">
                <FormGroup className="mb-3">
          
                    {this.state.emailErrorMsg.length>0?
                    <>
                    <Label>Email</Label>
                    <Input  style={{color:'black'}} placeholder="Email" onChange={(e)=>{this.changeHandler(e,true)}} type="email" invalid />
                    <FormFeedback>{this.state.emailErrorMsg}</FormFeedback>
                    </>
                    :
                    <>
                    <Label>Email</Label>
                    <Input style={{color:'black'}} placeholder="Email" value={this.state.email} onChange={(e)=>{this.changeHandler(e,true)}} type="email"/>
                    </>
                    }
                </FormGroup>
                <FormGroup>
              
                    {this.state.passwordErrorMsg.length>0?
                    <>
                    <Label>Password</Label>
                    <Input  style={{color:'black'}} placeholder="Password" onChange={(e)=>{this.changeHandler(e,false)}} type="password" invalid />
                    <FormFeedback>{this.state.passwordErrorMsg}</FormFeedback>
                    </>
                    :
                    <>
                    <Label>Password</Label>
                    <Input style={{color:'black'}} placeholder="Password" value={this.state.password} onChange={(e)=>{this.changeHandler(e,false)}} type="password"/>
                    </>
                    }
                </FormGroup>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="button" onClick={this.submitHandler}>
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="/auth/forgot-password"
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
              </a>
            </Col>
          </Row>
        </Col>
         }
      </>
    );
  }
}

export default Login;
