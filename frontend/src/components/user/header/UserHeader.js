import React from 'react'

export default class UserHeader extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <h3 style={{fontWeight:'bold'}}>{this.props.header}&nbsp;</h3>
                <p style={{fontWeight:'bold'}}>{this.props.subHeader}&nbsp;</p>
            </>
        )
    }
}