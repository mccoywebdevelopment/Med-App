import React from 'react';

class TodayBtn extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <button style={{marginTop:'10px'}} onClick={this.props.todayHandler}>Today</button>
            </>
        )
    }
}
export default TodayBtn;