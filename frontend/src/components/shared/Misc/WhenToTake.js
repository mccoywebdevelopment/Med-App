import React from 'react';

export default function WhenToTake(props){
    return props.data.map((value)=>{
        let styles = {
          ...props.styles,
          marginRight:"10px",
          borderRadius:"2px",
          padding:"5px"
        }
        if(value == "morning"){
          styles.backgroundColor = "rgba(0,185,251,0.1)"
          styles.color = "#00b9fb";
        }else if(value == "afternoon"){
          styles.backgroundColor = "rgba(255,165,0,0.1)"
          styles.color = "orange";
        }else{
          styles.backgroundColor = "rgba(191,0,255,0.1)";
          styles.color = "#bf00ff";
        }
        return(
          <span style={styles}>{value}</span>
        )
      });
}