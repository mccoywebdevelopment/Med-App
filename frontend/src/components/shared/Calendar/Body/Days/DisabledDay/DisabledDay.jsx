import React from 'react';

class DisabledDay extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>  
                {!this.props.isZindex?
                <div className="day day--disabled">
                    {this.props.day}
                    {/* <Event events={this.props.events} toggleOverFlow = {this.toggleOverFlow} day={this.props.dayIndex} toggleZIndex={this.props.toggleZIndex}/> */}
                </div>
                :
                <div className="day day--disabled" style={{zIndex:-1}}>
                    
                </div>
                }
            </>
        )
    }
}
export default DisabledDay;