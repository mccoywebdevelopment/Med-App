import React from 'react';
import {Alert,Container} from 'reactstrap';
import {downloadFile} from '../../../api/exportData/exportData';
import ExportData from '../../../components/admin/ExportData/ExportData';

class ExportDataView extends React.Component{
    state = {
        error:{
          display:false,
          msg:null
        }
      }
      exportDataHandler = async(month,year) =>{
          await downloadFile(localStorage.getItem("JWT"),month,year);
      }
      setTimerForError = () =>{
        let newState = this.state;
        newState.error.display = false;
        setTimeout(() => {
          this.setState(newState);
        }, 7000)
      }
    render(){
        return(<>
            {this.state.error.display?<Alert color="danger">{this.state.error.msg}</Alert>:<Alert className="d-none" color="danger">{this.state.error.msg}</Alert>}
            <Container>
                {!this.state.error.display? <ExportData downloadFileHandler={this.exportDataHandler}/>:null}
            </Container>
        </>)
    }
}
export default ExportDataView;