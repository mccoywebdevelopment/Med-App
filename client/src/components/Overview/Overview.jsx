import React from "react";
import {Row,Col} from "reactstrap"
import OverviewCard from './card/OverviewCard';

class Overview extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        // style={{marginLeft:"0px",paddingLeft:"0px"}}
        return(
                <Row className='fade-in' style={{marginBottom:"30px"}}>
                    <Col size={4}>
                        <OverviewCard title={this.props.data[0].title} data={this.props.data[0].data}
                         iconName={this.props.iconName[0]} iconColor={this.props.iconColor[0]}/>
                    </Col>
                    <Col size={4}>
                        <OverviewCard title={this.props.data[1].title} data={this.props.data[1].data}
                         iconName={this.props.iconName[1]} iconColor={this.props.iconColor[1]}/>
                    </Col>
                    <Col size={4}>
                        <OverviewCard title={this.props.data[2].title} data={this.props.data[2].data}
                         iconName={this.props.iconName[2]} iconColor={this.props.iconColor[2]}/>
                    </Col>
                </Row>
        )
    }
}

export default Overview;