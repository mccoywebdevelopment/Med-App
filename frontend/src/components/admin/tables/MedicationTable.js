import React, { useState } from "react";
import { formateDate ,formatPhoneNumber } from "../../../config/helpers";
import WhenToTake from "../../shared/Misc/WhenToTake";

export default class MedicationTable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    var left = [];
    if (this.props.list.length > 2 && !this.props.showMore) {
      for (var i = 2; i < this.props.list.length; ++i) {
        left.push(this.props.list[i]);
      }
      this.state = {
        list: [this.props.list[0], this.props.list[1]],
        left: left
      }
    } else {
      this.state = {
        list: this.props.list,
        left: []
      }
    }
    // const whenToTake = (element) =>{
    //   return element.values.whenToTake.map((value)=>{
    //     let styles = {
    //       marginRight:"10px",
    //       borderRadius:"2px",
    //       padding:"5px"
    //     }
    //     if(value == "morning"){
    //       styles.backgroundColor = "rgba(0,185,251,0.1)"
    //       styles.color = "#00b9fb";
    //     }else if(value == "afternoon"){
    //       styles.backgroundColor = "rgba(255,165,0,0.1)"
    //       styles.color = "orange";
    //     }else{
    //       styles.backgroundColor = "rgba(191,0,255,0.1)";
    //       styles.color = "#bf00ff";
    //     }
    //     return(
    //       <span style={styles}>{value}</span>
    //     )
    //   });
    // }
    const list = () => {
      return this.state.list.map((element, index) => {
        let style = {
          background: 'inherit'
        }
        if (index % 2 == 0) {
          // style.background = "#ededed";
        }
        return (
          <React.Fragment key={"slk3(((asdf" + index}>
            <tr index={"medTable^&*&^" + index} style={style}>
              <th scope="row" style={{ paddingBottom: '0', paddingTop: '0' }}>
                <p style={{ marginBottom: '0px', paddingTop: '10px' }}>{index + 1}</p>
                <p onClick={() => { this.props.expandItem(element.index) }} title="view rest of med"
                  style={{ color: '#2196F3', paddingTop: "5px", marginBottom: '10px', cursor: "pointer" }}>
                  {!element.isExpand ? "More" : ""}&nbsp;
</p>
              </th>
              <td>{element.values.name || "-"}</td>
              <td>{element.values.dosageQuantity} {element.values.dosageUnits}</td>
              {/* <td>{element.values.rxsNumber || "-"}</td> */}
               <td colSpan="3">
                  {<span><WhenToTake data={element.values.whenToTake}/></span> || "-"}
                </td>
              {/* <td colSpan="2">{formateDate(element.values.datePrescribed) || "-"}</td> */}
              <td style={{ textAlign: 'left' }}>
                {!this.props.isCreate ?

                  <div className="dropdown">
                    <i title="Actions" className="fas fa-ellipsis-v" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                      style={{ color: '#2196F3', fontSize: '20px', paddingRight: '5px' }}></i>


                    <div className="dropdown-menu dropdown-menu-left my-dropdown" aria-labelledby="dropdownMenuButton">
                      <a onClick={() => { this.props.viewDates(element.index) }} className="dropdown-item"
                        style={{ cursor: 'pointer' }}>
                        View Dates <i title="View Dates" className="fas fa-calendar-alt"
                          style={{ color: '#2196F3', float: 'right' }}></i>
                      </a>
                      <a onClick={() => { this.props.tookMed(element.index) }} className="dropdown-item"
                        style={{ cursor: 'pointer', paddingTop: '15px' }}>
                        Log <i title="Verify Med Taken" className="fas fa-calendar-check"
                          style={{ color: '#2196F3', float: 'right' }}></i>
                      </a>

                      {!this.props.isUser ?
                        <>
                          <div className="dropdown-divider"></div>
                          <a onClick={() => { this.props.edit(element.index) }} className="dropdown-item"
                            style={{ cursor: 'pointer' }}>
                            Edit <i title="Edit Medication" className="fas fa-edit"
                              style={{ color: '#2196F3', float: 'right' }}></i>
                          </a>
                          <a onClick={() => { this.props.delete(element.index) }} className="dropdown-item"
                            style={{ cursor: 'pointer', paddingTop: '15px' }}>
                            Delete <i title="Delete Medication" className="fas fa-trash"
                              style={{ color: '#2196F3', float: 'right' }}></i>
                      </a>
                        </>

                        :
                        null
                      }

                    </div>
                  </div>


                  :
                  <>
                    <i onClick={() => { this.props.edit(element.index) }} title="edit" className="fas fa-edit"
                      style={{ paddingRight: '20px', color: '#2196F3', paddingBottom: '10px' }}></i>

                    <i onClick={() => { this.props.delete(element.index) }} title="Delete" className="fas fa-trash"
                      style={{ color: '#2196F3', paddingBottom: '10px', paddingRight: '20px' }}></i>
                  </>
                }
              </td>
            </tr>
            {element.isExpand ?
              <React.Fragment key={"slk3(((" + index}>
                <tr index={"lkjmedTableInside^sdf&*&^" + index} className="no-border" style={style}>
                  <td></td>
                  <td colSpan="2">
                    <span className="inner-title">Doctor's Name:</span><br /><br />{element.values.doctorName || "-"}
                  </td>
                  <td colSpan="3">
                    <span className="inner-title">Doctor's Number #:</span><br /><br />{formatPhoneNumber(element.values.doctorPhone) || "-"}
                  </td>
                </tr>
                <tr index={"medTableInside^&23*&^" + index} className="no-border" style={style}>
                  <td></td>
                  <td colSpan="2"> <span className="inner-title">Date PSCR:</span><br /><br />{formateDate(element.values.datePrescribed) || "-"}</td>
                  <td colSpan="3">
                    <span className="inner-title">End Date:</span><br /><br />{formateDate(element.values.endDate) || "-"}
                  </td>
                  {/* <td colSpan="3">
                    <span className="inner-title">When to Take:</span><br /><br />{<span>{whenToTake(element)}</span> || "-"}
                  </td> */}
                </tr>
                <tr index={"mAedTableInhjkhkhside^&*&^" + index} className="no-border" style={style}>
                  <th scope="row" style={{ paddingBottom: '0', paddingTop: '0', borderTop: 'none' }}>
                    <p style={{ marginBottom: '0px', paddingTop: '28px' }}></p>
                    <p onClick={() => { this.props.expandItem(element.index) }} title="view rest of med"
                      style={{ color: '#2196F3', paddingTop: "5px", marginBottom: '10px', cursor: "pointer" }}>{element.isExpand ? "Less" : ""}&nbsp;</p>
                  </th>
                  <td colSpan="2" style={{ verticalAlign: 'top' }}>
                    <span className="inner-title">Reason:</span><br /><br />{element.values.reason || "-"}</td>
                  <td colSpan="3" style={{ verticalAlign: 'top' }}>
                    <span className="inner-title">Intructions:</span><br /><br />{element.values.instructions || "-"}</td>
                </tr>
                <tr index={"medTableInside^&7876*&^" + index} className="no-border-top" style={style}>
                  <td></td>
                  <td colSpan="6"><span className="inner-title">RXS Number:</span><br /><br />{element.values.rxsNumber || "-"}</td>
                </tr>
              </React.Fragment>
              : null
            }
          </React.Fragment>
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
              <th scope="col" colSpan="3">When to Take</th>
              {/* <th scope="col" colSpan="2">Date PSCR</th> */}
              <th scope="col">Actions{this.props.isExpand ? <i title="expand" className="fas fa-expand" style={{ float: 'right' }}></i> : null}</th>
            </tr>
          </thead>
          <tbody>
            {list()}
          </tbody>
        </table>
        {this.state.left.length > 0 ?
          <p onClick={this.props.toggleShowMore} title="view" style={{ marginTop: '15px', marginLeft: '5px', cursor: 'pointer', color: '#2196F3', marginBottom: '0' }}>
            <i className="fas fa-plus" style={{ paddingRight: '10px' }}></i>
            {this.state.left.length} More Medications
</p>
          : this.props.showMore && this.state.list.length > 2 ?
            <p onClick={this.props.toggleShowMore} title="view" style={{ marginTop: '15px', marginLeft: '5px', cursor: 'pointer', color: '#2196F3', marginBottom: '0' }}>
              <i className="fas fa-minus" style={{ paddingRight: '10px' }}></i>
Show Less
</p>
            : null
        }
      </>
    );
  }
}