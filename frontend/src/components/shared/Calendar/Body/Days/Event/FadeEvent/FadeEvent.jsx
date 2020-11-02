import React from 'react';


class FadeEvent extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                 <div className="my-task-container my-fade">
                    <div className="my-task-title">
                        {this.props.depName}
                    </div>
                    <div className="my-task-detail">
                        {this.props.medName}
                    </div>
                 </div>
            </>
        )
    }
}
export default FadeEvent;