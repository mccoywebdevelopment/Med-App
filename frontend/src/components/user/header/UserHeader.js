import React from 'react'

export default class UserHeader extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <h3>{this.props.header}&nbsp;</h3>
                <p>{this.props.subHeader}&nbsp;</p>
            </>
        )
    }
}