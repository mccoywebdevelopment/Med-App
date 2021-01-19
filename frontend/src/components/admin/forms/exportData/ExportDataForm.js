
import React from 'react';
import {Row,Col,Label,Input,Button} from 'reactstrap';
import {fetchExportData} from "../../../../actions/data";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ExportDataForm extends React.Component{
    state = {
        month:"0",
        year:null
    }
    constructor(props){
        super(props);
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
    _submit = () =>{
        this.props.fetchExportData(this.state.month,this.state.year,true);
    }
    componentDidMount = () =>{
        let newState = this.state;
        newState.year = new Date().getFullYear().toString();
        this.setState(newState);
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
                <Row>
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
                </Row>
                <Row>
                    <Col lg={4} style={{marginTop:'30px',marginBottom:'30px'}}>
                        <Button onClick={()=>{this._submit()}} color="primary">Download</Button>
                    </Col>
                </Row>
        </>);
    }
}
ExportDataForm.propTypes = {
    fetchExportData: PropTypes.func.isRequired,
};
export default connect(null, {fetchExportData})(ExportDataForm);