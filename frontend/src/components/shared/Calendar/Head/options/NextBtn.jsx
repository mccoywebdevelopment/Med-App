import React from 'react';

class NextBtn extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <button style={{float:'left'}} onClick={this.props.nextHandler}>&gt;</button>
            </>
        )
    }
}
export default NextBtn;