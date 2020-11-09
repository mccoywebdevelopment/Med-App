import React from 'react';

class Expand extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <div className="my-expand" onClick={this.props.expandHandler.bind(this,this.props.day)}>
                    +{this.props.length-1} more <i className="fas fa-caret-down"/>
                </div>
            </>
        )
    }
}
export default Expand;