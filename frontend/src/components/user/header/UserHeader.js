import React from 'react'

export default class UserHeader extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props);
    }
    render(){
        return(
            <>
                <h1>{this.props.header}&nbsp;</h1>
                <p>{this.props.subHeader}&nbsp;</p>
            </>
        )
    }
}