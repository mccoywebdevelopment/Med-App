import React from 'react';

class UnExpand extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <div className="my-expand" onClick={this.props.expandHandler.bind(this,this.props.day)}>
                    -{this.props.length-1} show less <i className="fas fa-caret-up"/>
                </div>
            </>
        )
    }
}
export default UnExpand;