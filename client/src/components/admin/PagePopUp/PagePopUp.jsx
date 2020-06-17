import React from 'react';
import {Card,Container,Row,Col,Input,FormGroup,Label,Button,FormFeedback} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import myStyles from './styles';
import MultiSelectPopUp from './MultiSelect/MultiSelectPopUp';
import uuid from "uuid";


class PagePopUp extends React.Component{
    constructor(props){
        super(props);
    }
    state = {
        inputs:[],
        isPush:false,
        isLoaded:false,
        multiSelects:[]
    }
    changeHandler=(e,key)=>{
        var newValue = e.target.value;
        var newState = this.state;
        newState.isPush = true;
        newState.inputs[key].value = newValue;
        this.setState(newState);
    };
    handleSubmit=()=>{ 
        var obj = {};
        //validator
        for(var i=0;i<this.state.inputs.length;++i){
            obj[this.props.data[i].path] = this.state.inputs[i].value;
        }
        if(this.state.multiSelects.length>0){
            for(var i=0;i<this.state.multiSelects.length;++i){
                obj[this.state.multiSelects[i].path] = this.state.multiSelects[i].selected;
            }
        }

        var newState = this.state;
        newState.isPush = true;
        this.setState(newState);

        var id = this.props.data[0].parentId;
        var req = this.props.data[0].reqCreate;
        //else is update therefore update itself by Model.
        
        if(this.validator()){
            if(this.props.isAdd && this.props.createSelf){
                //alert("CREate self")
                req(obj,(res)=>{
                    if(res.error){
                        this.props.updateData(res.error);
                    }else{
                       this.props.updateData();
                    }
                });
            }
            else if(this.props.customReq){
                var jwt = localStorage.getItem("JWT");
                var id = this.props.rxsMedId;
                this.props.customReq(obj,jwt,id,(res)=>{
                    if(res.error){
                        this.props.updateData(res.error);
                    }else{
                        this.props.updateData();
                    }
                });
            }
            else if(this.props.isAdd){
                req(id,obj,(res)=>{
                    if(res.error){
                        this.props.updateData(res.error);
                    }else{
                       this.props.updateData();
                    }
                });
            }else{
                id = this.props.data[0].selfId;
                req = this.props.data[0].reqUpdate;
                req(id,obj,(res)=>{
                    if(res.error){
                        this.props.updateData(res.error);
                    }else{
                       this.props.updateData();
                    }
                });
    
            }
        }else{

        }
        

    }
    multiSelectSubmitCallback = (selected,req,path) =>{
        var id = this.props.data[0].selfId;
        let newState = this.state;
        if(typeof(newState.multiSelects.path)=='undefined'){
            newState.multiSelects.push({
                path:path,
                selected:selected
            });
        }else{
            var found = false;
            for(var i=0;i<newState.multiSelects.length;++i){
                if(newState.multiSelects[i].path == path){
                    found = true;
                    newState.multiSelects[i].selected = selected;
                }
            }
            if(!found){
                newState.multiSelects.push({
                    path:path,
                    selected:selected
                });
            }
        }
        this.setState(newState);

    }
    validator=()=>{
        var newState = this.state;
        var validatorObj = null;
        var isValid = true;
        for(var i=0;i<newState.inputs.length;++i){
            if(typeof(newState.inputs[i].validator)!='undefined' && newState.inputs[i].validator){
                validatorObj = newState.inputs[i].validator(newState.inputs[i].value,newState.inputs[i].required);
                newState.inputs[i].isValid = validatorObj.isValid;
                newState.inputs[i].errorMsg = validatorObj.errorMsg;
    
                if(!validatorObj.isValid){
                    isValid = false;
                }
            }else{
                if(newState.inputs[i].value.length<1 && newState.inputs[i].required){
                    newState.inputs[i].isValid = false;
                    newState.inputs[i].errorMsg = "This field is required.";
                    isValid = false;
                }else{
                    newState.inputs[i].isValid = true;
                    newState.inputs[i].errorMsg = "";
                }

            }
        }
        this.setState(newState);
        return isValid;
    }
    render(){
        function getMultiLIst(state,dataOptions){
            var obj={};
            var selected = [];
            var options = [];
            for(var i=0;i<dataOptions.length;++i){
                if(dataOptions[i].isSelected){
                    selected.push(dataOptions[i].value);
                    options.push({
                        label:dataOptions[i].label,
                        value:dataOptions[i].value
                    });
                }else{
                    options.push({
                        label:dataOptions[i].label,
                        value:dataOptions[i].value
                    });
                }
            }

            state.isLoaded = true;

            obj.options = options;
            obj.selected = selected;
            return obj;
        }
        var getOptions = (item) =>{
            return item.data.options.map((option,optionKey)=>{
                return (
                    <>
                        <option value={option}>{option}</option>
                    </>
                
                )
            })
        }
        const getRows = () =>{
            var data = this.props.data;
            var rows = [];
            var row = [];
            
            for(var i=0;i<data.length;++i){
                if(row.length>0){
                    row.push({
                        data:data[i],
                        id:i
                    });
                    rows.push(row);
                    row = [];
                }
                else if(i==data.length-1 && row.length<1){
                    row.push({
                            data:data[i],
                            id:i
                        });
                    rows.push(row);
                }else{
                    row.push({
                        data:data[i],
                        id:i
                    });
                }
            }
           return rows.map((row,rowKey)=>{
                return(
                    <Row>
                        {row.map((item,itemKey)=>{
                            var itemKey = item.id;
                            if(!this.state.isPush && item.data.type!='multiSelect'){
                                var tValue = item.data.value
                                if(!tValue || this.props.isAdd){
                                    tValue = "";
                                }
                                this.state.inputs.push({
                                        value:tValue,
                                        isValid:true,
                                        errorMsg:"",
                                        required:item.data.required,
                                        validator:item.data.validator
                                    });
                            }
                            var span
                            if(!item.data.required){
                                span = <span style={{fontSize:'80%'}}>(Optional)</span>
                            }
                            var inputValue = "";
                            if(item.data.type!='multiSelect' && typeof(item.id)!='undefined' && this.state.inputs[item.id].value){
                                inputValue = this.state.inputs[item.id].value;
                            }
                            var multiSelectReq = this.props.data[0].reqPatch;
                            if(this.props.createSelf){
                                multiSelectReq = this.props.data[0].reqCreate;
                            }
                
                            return(
                                <Col lg={{size:'6'}}>
                                    <FormGroup>
                                        <Label for={"example"+itemKey}>{item.data.label} {span}</Label>
                                        {item.data.type=='select' && !this.props.isAdd?
                                        <Input type={item.data.type} style={{color:'black'}} name="email" id={"example"+itemKey}  onChange={(e)=>{this.changeHandler(e,item.id)}} value={inputValue} placeholder={item.data.placeHolder}>
                                            {getOptions(item)}
                                        </Input>
                                        :item.data.type=='multiSelect'?
                                        <>
                                            <MultiSelectPopUp path={item.data.path} req={multiSelectReq} selected={getMultiLIst(this.state,item.data.options).selected} multiSelectSubmitCallback={this.multiSelectSubmitCallback} options={getMultiLIst(this.state,item.data.options).options}/>
                                        </>
                                        :item.data.type=='select' && !this.state.inputs[itemKey].isValid?
                                        <>
                                            <Input type={item.data.type} value={inputValue} style={{color:'black'}} name="email" id={"example"+itemKey}  onChange={(e)=>{this.changeHandler(e,item.id)}} placeholder={item.data.placeHolder}  invalid>
                                                {getOptions(item)}
                                            </Input>
                                            <FormFeedback>{this.state.inputs[itemKey].errorMsg}</FormFeedback>
                                        </>
                                        :item.data.type=='select'?
                                        <>
                                            <Input type={item.data.type} value={inputValue} style={{color:'black'}} name="email" id={"example"+itemKey}  onChange={(e)=>{this.changeHandler(e,item.id)}} placeholder={item.data.placeHolder}>
                                                {getOptions(item)}
                                            </Input>
                                
                                        </>
                                        :this.props.isAdd && this.state.inputs[itemKey].isValid && !this.state.isPush?
                                        <Input type={item.data.type} style={{color:'black'}} name="email" id={"example"+itemKey}  onChange={(e)=>{this.changeHandler(e,item.id)}} placeholder={item.data.placeHolder}/>
                                        :this.props.isAdd && this.state.inputs[itemKey].isValid && this.state.isPush?
                                        <Input type={item.data.type} style={{color:'black'}} name="email" id={"example"+itemKey} value={this.state.inputs[itemKey].value}  onChange={(e)=>{this.changeHandler(e,item.id)}} placeholder={item.data.placeHolder}/>
                                        :!this.state.inputs[itemKey].isValid?
                                        <>
                                            <Input type={item.data.type} style={{color:'black'}} name="email" id={"example"+itemKey}  onChange={(e)=>{this.changeHandler(e,item.id)}} value={inputValue} placeholder={item.data.placeHolder} invalid/>
                                            <FormFeedback>{this.state.inputs[itemKey].errorMsg}</FormFeedback>
                                        </>
                                        :<Input type={item.data.type} style={{color:'black'}} name="email" id={"example"+itemKey}  onChange={(e)=>{this.changeHandler(e,item.id)}} value={inputValue} placeholder={item.data.placeHolder} />}
                                    </FormGroup>
                                </Col>
                            )
                        })}
                    </Row>
                )
            });
        }
        return(
            <>

                <div style={myStyles.popUp}>
                    <Card style={myStyles.popUpContent}>
                        <Container style={{fontSize:'20px'}}>
                            <Row>
                                <Col lg={{ size: 11}}>
                                    <h1>
                                        {this.props.isAdd?
                                        <span>New</span>
                                        :this.props.data[0].value}
                                    </h1>
                                </Col>
                                <Col lg={{ size: 1}}>
                                    <FontAwesomeIcon onClick={this.props.listPopUp.bind(null)} style={myStyles.exit} icon={faTimes} />
                                </Col>
                            </Row>
                            {getRows()}
                            <Row style={{height:'100%'}}>
                            <Col lg={{size:12}} style={{height:'100%'}}>
                                    <Button onClick={this.handleSubmit} style={{width:'100%',marginBottom:'20px'}} color="success">Save Changes</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Card>
                </div>
            </>
        )
    }
}

export default PagePopUp;