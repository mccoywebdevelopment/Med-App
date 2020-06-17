import React from 'react';
import {
    Button,
    Card,
    CardBody,
    CardImg,
    CardTitle,
    CardText,
    Row,
    Col
  } from "reactstrap";

class OverviewCard extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        var classes = ["icon","icon-shape","bg-danger","text-white","rounded-circle","shadow"];
        var iconClasses=["fas"];
        //var iconClasses=["fas"];
        if(this.props.iconColor){
            classes.push("bg-"+this.props.iconColor);
        }
        if(this.props.iconName){
            iconClasses.push("fa-"+this.props.iconName);
        }else{
            iconClasses.push("fa-chart-bar");
        }
        return(
            <div>
                <Card className="card-stats mb-4 mb-lg-0" style={{minHeight:'120px'}}>
                    <CardBody>
                    <Row style={{height:'90px'}}>
                        <div className="col">
                            <CardTitle className="text-uppercase text-muted mb-0">
                                {this.props.title}
                            </CardTitle>
                            <span className="h3 font-weight-bold" style={{bottom:'0',position: 'absolute'}}>{this.props.data}</span>
                        </div>
                        <Col className="col-auto">
                        <div className={classes.join(' ')}>
                            <i className={iconClasses.join(' ')} />
                        </div>
                        </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" />
                        3.48%
                        </span>
                        <span className="text-nowrap">Since last month</span>
                    </p> */}
                    </CardBody>
                </Card>
            </div>
        )
    }
}
export default OverviewCard;