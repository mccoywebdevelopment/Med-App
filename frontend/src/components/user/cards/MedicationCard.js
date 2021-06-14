import React from 'react'

export default class MedicationCard extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let cardStyle = {
            opacity:'1'
        }
        if(this.props.isHistory){
            cardStyle.opacity = '0.5'
        }
        return(
            <>
                <div className="card w-100 medication-card" style={cardStyle} onClick={()=>{this.props.selectMedCart(this.props.data,this.props.isHistory)}}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-7">
                                <h5 className="card-title">{this.props.data.rxsMedication.name}</h5>
                                <p style={{margin:'0px',color:"#7c7c7c",fontSize:".8rem"}}><i className="fas fa-user" style={{paddingRight:'10px'}}></i>{this.props.data.dependent.name.firstName + " " + this.props.data.dependent.name.lastName}</p>
                            </div>
                            <div className="col-5">
                                <h4 style={{margin:'0px',paddingTop:'20%',color:"rgb(33, 150, 243)",fontWeight:'bold',fontSize:"1.1rem",float:'right'}}> {this.props.data.rxsMedication.dosage.quantity} {this.props.data.rxsMedication.dosage.unit}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}