import React from 'react'

export default class Progress extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let styleWidth = {
            width:(this.props.width*100) + "%",
            color:"rgb(33, 150, 243)"
        }
        return(
            <div className="progress progress-md" style={{height:'4px'}}>
                <div className="progress-bar" role="progressbar" style={styleWidth}></div>
            </div>
        )
    }
}
