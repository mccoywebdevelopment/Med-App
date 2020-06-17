import React from 'react';
import {Card,Row,Col,Label,Input,Button} from 'reactstrap';

class ExportData extends React.Component{
    state = {
        month:"0",
        year:null
    }
    constructor(props){
        super(props);
        let newState = this.state;
        newState.year = new Date().getFullYear().toString();
        this.setState(newState);
    }
    monthChangeHandler = (e) =>{
        let newState = this.state;
        newState.month = e.target.value;
        this.setState(newState);
    }
    yearChangeHandler = (e) =>{
        let newState = this.state;
        newState.year = e.target.value;
        this.setState(newState);
    }
    downloadHandler = () =>{
        this.props.downloadFileHandler(this.state.month,this.state.year)
    }
    render(){
        var options = [];
        var year = new Date().getFullYear();
        for(var i=0;i<10;++i){
            var option;
            if(i==0){
                option = <option selected value={year}>{year}</option>
            }else{
                option = <option value={year}>{year}</option>
            }
            options.push(option);
            year = year -1;
        }
        return(<>
            <Card style={{minHeight:'250px',padding:'40px'}}>
                <Row>
                    <Col lg={12}>
                        <h1 style={{textAlign:'center'}}>Export Data Excel Format:</h1>
                    </Col>
                    <Col lg={4}>
                        <Label>Month:</Label>
                        <Input onChange={this.monthChangeHandler} type="select" name="month">
                            <option selected value="0">January</option>
                            <option value="1">February</option>
                            <option value="2">March</option>
                            <option value="3">April</option>
                            <option value="4">May</option>
                            <option value="5">June</option>
                            <option value="6">July</option>
                            <option value="7">August</option>
                            <option value="8">September</option>
                            <option value="9">October</option>
                            <option value="10">November</option>
                            <option value="11">December</option>
                        </Input>
                    </Col>
                    <Col lg={4}>
                        <Label>Year:</Label>
                        <Input onChange={this.yearChangeHandler} type="select" name="year">
                            {options}
                        </Input>
                    </Col>
                    <Col lg={4}>
                        <Button onClick={()=>{this.props.downloadFileHandler(this.state.month,this.state.year)}} style={{width:"100%",marginTop:'39px'}}color="primary">Download</Button>
                    </Col>
                </Row>
                {/*<Row>
                    <Col lg={4}>
                        <Button style={{width:"100%",marginBottom:"30px",marginLeft:"0px",marginTop:"30px"}}color="primary">Submit</Button>
                    </Col>
                    <Col lg={6}>
                    </Col>
                </Row>*/}
            </Card>
        </>);
    }
}
export default ExportData;