import React from 'react';

import moment from 'moment';

export default class Test extends React.Component{

    componentDidMount = () =>{
        console.log(moment(new Date("2021-06-11T13:23")).format("hh:mm a"));
    }
    
    render(){
       

        return(
            <h1>test</h1>
        );
    }
}