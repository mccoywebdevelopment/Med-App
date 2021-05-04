import React from 'react'

export default class GroupNav extends React.Component{
    constructor(props){
        super(props);
    }
    /*
    name,
    id

    also need a filter handler
    */
    render(){

        const list = () =>{
            return this.props.items.names.map((item,index)=>{
                return (
                   
                )
            });
        }
        return(
            list()
        )
    }
}