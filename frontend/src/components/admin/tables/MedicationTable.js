import React from "react";

export default class MedicationTable extends React.Component{
  constructor(props){
    super(props);
    console.log(this.props)
  }
  render(){
    var left = [];
    if(this.props.list.length>2 && !this.props.showMore){
      for(var i=2;i<this.props.list.length;++i){
        left.push(this.props.list[i]);
      }
      this.state = {
        list:[this.props.list[0],this.props.list[1]],
        left:left
      }
    }else{
      this.state = {
        list:this.props.list,
        left:[]
      }
    }
    const list = () =>{
      return this.state.list.map((element,index)=>{
        return(
          <>
          {index!=this.props.index?
            <tr index={"medTable^&*&^"+index}>
              <th scope="row" style={{paddingBottom:'0',paddingTop:'0'}}>
                <p style={{marginBottom:'0px',paddingTop:'28px'}}>{index + 1}</p>
                <p title="view rest of med" style={{color:'#2196F3',paddingTop:"5px",marginBottom:'10px'}}>More</p>
              </th>
              <td>{element.values.name}</td>
              <td>{element.values.dosageQuantity} {element.values.dosageUnits}</td>
              <td>{element.values.rxsNumber}</td>
              <td>{element.values.datePrescribed}</td>
              <td>
                <i onClick={()=>{this.props.edit(element.index)}} title="edit" className="fas fa-edit" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
                <i onClick={()=>{this.props.delete(element.index)}} title="Delete" className="fas fa-trash" style={{ color: '#2196F3' }}></i>
              </td>
          </tr>
          :null
          }
          </>
        )
      });
    }
    return (
      <>
        <table className="table my-med-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Dosage</th>
              <th scope="col">Rxs#</th>
              <th scope="col">Date prescribed</th>
              <th scope="col">Actions{this.props.isExpand?<i title="expand" className="fas fa-expand" style={{ float: 'right' }}></i>:null}</th>
            </tr>
          </thead>
          <tbody>
            {list()}
          </tbody>
        </table>
        {this.state.left.length>0?
        <p onClick={this.props.toggleShowMore} title="view" style={{ marginTop: '15px', marginLeft: '5px', cursor: 'pointer', color: '#2196F3',marginBottom:'0' }}>
          <i className="fas fa-plus" style={{paddingRight:'10px'}}></i> 
          {this.state.left.length} More Medications
        </p>
        :this.props.showMore && this.state.list.length>2?
          <p onClick={this.props.toggleShowMore} title="view" style={{ marginTop: '15px', marginLeft: '5px', cursor: 'pointer', color: '#2196F3',marginBottom:'0' }}>
            <i className="fas fa-minus" style={{paddingRight:'10px'}}></i> 
            Show Less
          </p>
        :null
        }
      </>
    );
  }
}