import React from 'react';

class PrevBtn extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <button style={{float:'right'}} onClick={this.props.prevHandler}>&lt;</button>
            </>
        )
    }
}
export default PrevBtn;