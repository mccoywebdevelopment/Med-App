import React from 'react';
import {Container,Alert, Button} from 'reactstrap'
import variable from '../../../config/variable';

import Overview from "../../../components/Overview/Overview";
import DependentTable from "../../../components/admin/AdminTable/AdminTable";
import TableModel from '../../../components/admin/AdminTable/TableModel/TableModel';
import AddDependent from './modelTemplate/AddDependent';
import DeleteDependent from './modelTemplate/DeleteDependent';
import DependentItem from './item/DependentItem';
import AddRxs from './modelTemplate/AddRxs';

class ViewDependents extends React.Component{
    state = {
        error:{
            display:false,
            msg:null
        },
        tableData:null,
        viewDependentItem:false,
        viewDependentItemIndex:null,
        formmattedTableData:null,
        overViewData:[{
            title:"Number of Dependents:",
            data:""
        },
        {
            title:"Avg Rxs Meds of Dependent:",
            data:""
        },
        {
            title:"Avg Age of Dependent:",
            data:""
        }],

        viewModel:false,
        modelData:null,
        modelTitle:"",
    
        needConfirmation:false,

        isSubmitted:false
    }
    fetchDep = (index) =>{
        let jwt = localStorage.getItem('JWT');
        const APIDependent = variable.api.baseURL + "/dependents/dependents-medication/medication/" + jwt;
        fetch(APIDependent).then(response => response.json()).then(res =>{
            let newState = this.state;
            if(res.error){
                newState.error.msg = res.error;
                newState.error.display = true;
            }else{
                newState.tableData = res;
                this.getDataForTable();
                if(typeof(index)!=undefined){
                    newState.viewDependentItem = newState.tableData[index];
                }
            }
            this.setState(newState);
        });
    }
    fetchOverview = () =>{
        let jwt = localStorage.getItem('JWT');
        const APIData = variable.api.baseURL + "/data/" + jwt;

        fetch(APIData).then(response => response.json()).then(res =>{
            let newState = this.state;
            if(res.error){
                newState.error.msg = res.error;
                newState.error.display = true;
            }else{
                var data = [];

                data.push({
                    title:"Number of Dependents:",
                    data:res.dependents.total
                });
                data.push({
                    title:"Avg Rxs Meds of Dependent:",
                    data:res.dependents.avgRxsMeds
                });
                data.push({
                    title:"Avg Age of Dependent:",
                    data:res.dependents.avgAge
                });
                newState.overViewData = data;
            }
            this.setState(newState);
        });
    }
    updateDependent = (id,dataBody) =>{
        var data = {
            updatedFields:dataBody
        }
        let jwt = localStorage.getItem('JWT');
        fetch(variable.api.baseURL+"/dependents/"+id+"/"+jwt,{
            method:'PATCH',
            credentials: 'same-origin', // <-- includes cookies in the request
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(res => {
            let newState = this.state;
            if(res.error){
                newState.error.msg = res.error;
                newState.error.display = true;
            }else{
                this.fetchOverview();
                this.fetchDep();
            }
            this.setState(newState);
        });
    }
    componentDidMount = () =>{
        this.fetchOverview();
        this.fetchDep();
    }
    getDataForTable = () =>{
        let newState = this.state;
        let data = newState.tableData;
        let tableData = {};

        tableData ={
            tableHead:this.getTableHead(),
            tableBody:this.getTableBody(data)
        }
        newState.formmattedTableData = tableData;
        this.setState(newState);
        return tableData
    }
    getNumberOfRxsMeds = (dep) =>{
        var rxs = dep.rxs;
        var count = 0;

        for(var i=0;i<rxs.length;++i){
            count = count + rxs[i].rxsMedications.length;
        }

        return count;
    }
    getNumberOfOTCMeds = (dep) =>{
        var count = dep.medications.length;
        return count;
    }
    getTableBody = () =>{
        let tableBody = [];
        let data = this.state.tableData

        for(var i=0;i<data.length;++i){
            tableBody.push({
                value:i+1,
                isEditable:false,
                isObject:null
            });
            tableBody.push({
                value:data[i].name.firstName,
                isEditable:true,
                type:"text",
                isObject:null
            });
            tableBody.push({
                value:data[i].name.lastName,
                isEditable:true,
                type:"text",
                isObject:null
            });
            var dateOfBirth = new Date(data[i].dateOfBirth);
            var mm = dateOfBirth.getMonth()+1;
            mm = mm.toString();
            if(mm.length==1){
                mm = '0'+mm;
            }
            var dd = dateOfBirth.getDate();
            dd = dd.toString();
            if(dd.length==1){
                dd = '0'+dd;
            }
            var yyyy = dateOfBirth.getFullYear();
            dateOfBirth = mm+"-"+dd+"-"+yyyy;

            tableBody.push({
                value:dateOfBirth,
                isEditable:true,
                type:"date",
                isObject:null
            });
      
            tableBody.push({
                value:this.getNumberOfRxsMeds(data[i]),
                isEditable:false,
                isObject:null
            });
            tableBody.push({
                value:this.getNumberOfOTCMeds(data[i]),
                isEditable:false,
                isObject:null
            });
            tableBody.push({
                isEditable:false,
                isObject:this.getOptionObject(data[i]),
            });
        }
        return tableBody;
    }
    getTableHead = () =>{
        let tableHead = [];

        tableHead.push("#");
        tableHead.push("First Name:");
        tableHead.push("Last Name:");
        tableHead.push("Date of Birth:");
        tableHead.push("# of Rxs Medications:");
        tableHead.push("# of OTC Medications:");
        tableHead.push("Options:");

        return tableHead;
    }
    formatRxsData = (rxs) =>{
        var tableData = {
            tableHead:this.getTableHeadRxs(),
            tableBody:this.getTableBodyRxs(rxs)
        }
        return tableData;
    }
    getTableBodyRxs = (rxs) =>{
        let tableBody = [];
        for(var i=0;i<rxs.length;++i){

            tableBody.push({
                value:i+1,
                isEditable:false,
                isObject:null
            });

            tableBody.push({
                value:rxs[i].rxsNumber,
                isEditable:true,
                type:"text",
                isObject:null
            });
            
            var rxsMedications = "";
            for(var ix=0;ix<rxs[i].rxsMedications.length;++ix){
                rxsMedications = rxsMedications + " " + rxs[i].rxsMedications[ix].name;
            }
            tableBody.push({
                value:rxsMedications || "No listed medications.",
                isEditable:true,
                type:"text",
                isObject:null
            });

            tableBody.push({
                value:rxs[i].doctorContacts.name.firstName + " " + rxs[i].doctorContacts.name.lastName,
                isEditable:false,
                isObject:null
            });

            tableBody.push({
                value:rxs[i].doctorContacts.phoneNumber,
                isEditable:false,
                isObject:null
            });

            tableBody.push({
                isEditable:false,
                isObject:this.getOptionRxs(),
            });
        }
        return tableBody;
    }
    deleteDependent =  (dep) =>{
        let jwt = localStorage.getItem('JWT');
        var id = dep._id.toString();
        fetch(variable.api.baseURL+"/dependents/"+id+"/"+jwt,{
            method:'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
        .then(res => {
            if(res.error){
                let newState = this.state;
                newState.error.msg = res.error;
                newState.error.display = true;
                this.setState(newState);
            }else{
                let newState = this.state;
                newState.viewModel = false;
                newState.viewDependentItem = null;
                this.setState(newState);
                this.fetchDep();
                this.fetchOverview();
            }
        });
    }
    deleteDependentModel = (dep) =>{
        let newState = this.state;
        newState.viewModel = !newState.viewModel;

        var text = 'Are you sure you want to delete '+dep.name.firstName+' '+dep.name.lastName+' and all of their data?'
        newState.modelData = <DeleteDependent text={text} obj={dep} toggleTable={this.toggleTable} delete={this.deleteDependent}/>

        newState.modelTitle = "Confirmation";
        this.setState(newState);
    }
    getTableHeadRxs = () =>{
        let tableHead = [];

        tableHead.push("#");
        tableHead.push("Rxs Number:");
        tableHead.push("Medication(s):");
        tableHead.push("Doctor's Name:");
        tableHead.push("Doctor's #:");
        tableHead.push("Options:");

        return tableHead;
    }
    toggleTable = () =>{
        let newState = this.state;
        newState.viewModel = !newState.viewModel;
        this.setState(newState);
    }
    toggleRxsTable = (rxs) =>{
        let newState = this.state;
        newState.viewModel = !newState.viewModel;
        newState.modelData = <DependentTable styles={{color:'blue'}} data={this.formatRxsData(rxs)}/>;
        this.setState(newState);
    }
    getOptionRxs = () =>{
        var headString = "List of Actions:";
        var top = [];
        var bottom = [];

        top.push({
            value:"View/Edit OTC",
            disabled:false,

        });
        top.push({
            value:"View/Edit Rxs",
            disabled:false,
            toggle:this.toggleRxsTable,
            data:null
        });

        bottom.push({
            value:"Edit Dependent",
            isEdit:true,
            disabled:false
        });

        bottom.push({
            value:"Delete Dependent",
            disabled:false
        })

        return({
            header:headString,
            top:top,
            bottom:bottom
        });
    }
    getOptionObject = (dep) =>{
        var headString = "List of Actions:";
        var top = [];
        var bottom = [];

        top.push({
            value:"View/Edit OTC",
            disabled:false,

        });
        top.push({
            value:"View/Edit Rxs",
            disabled:false,
            toggle:this.toggleRxsTable,
            data:dep.rxs
        });

        bottom.push({
            value:"Edit Dependent",
            isEdit:true,
            disabled:false
        });

        bottom.push({
            value:"Delete Dependent",
            disabled:false,
            toggle:this.deleteDependentModel,
            data:dep
        })

        return({
            header:headString,
            top:top,
            bottom:bottom
        });
    }
    submitDependent = (body) =>{
        //alert("Submitted")
        let jwt = localStorage.getItem('JWT');
        fetch(variable.api.baseURL+"/dependents/"+jwt,{
            method:'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
        .then(res => {
            if(res.error){
                let newState = this.state;
                let msg = res.error;
                if(typeof(msg)=='object'){
                    msg = JSON.stringify(msg);
                }
                newState.error.msg = msg;
                newState.error.display = true;
                this.setState(newState);
            }else{
                let newState = this.state;
                newState.viewModel = false;
                this.setState(newState);
                this.fetchDep();
                this.fetchOverview();
            }
        });
    }
    viewDependentItem = (e,index) =>{
        let newState = this.state;
        newState.viewDependentItem = newState.tableData[index];
        newState.viewDependentItemIndex = index;
        this.setState(newState);
    }
    goBackToTable = () =>{
        let newState = this.state;
        newState.viewDependentItem = null;
        newState.viewDependentItemIndex = null;
        this.setState(newState);
    }
    addDependentModel = () =>{
        let newState = this.state;
        newState.viewModel = !newState.viewModel;

        newState.modelData = <AddDependent isAddDependent={true} submitDependent={this.submitDependent} toggleTable={this.toggleTable} 
                                isSubmitted={this.state.isSubmitted}/>

        newState.modelTitle = "Add Dependent";
        

        this.setState(newState);
    }
    addRxsModel = (e,dependentID) =>{
        let newState = this.state;
        newState.viewModel = !newState.viewModel;

        newState.modelData = <AddDependent isAddRxs={dependentID} submitAddRxsToDep={this.submitAddRxsToDep} submitDependent={this.submitDependent} toggleTable={this.toggleTable} 
                                isSubmitted={this.state.isSubmitted}/>

        newState.modelTitle = "Add Prescription";
        

        this.setState(newState);
    }
    submitAddRxsToDep = (depID,body) =>{
        let jwt = localStorage.getItem('JWT');
        fetch(variable.api.baseURL+'/dependents/'+depID+'/'+jwt,{
            method:'PATCH',
            body: JSON.stringify({updatedFields:{rxs:body}}),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
        .then(res => {
            if(res.error){
                let newState = this.state;
                let msg = res.error;
                if(typeof(msg)=='object'){
                    msg = JSON.stringify(msg);
                }
                newState.error.msg = msg;
                newState.error.display = true;
                this.setState(newState);
            }else{
                let newState = this.state;
                newState.viewModel = false;
                this.setState(newState);
                this.fetchDep(this.state.viewDependentItemIndex);
                this.fetchOverview();
            }
        });
    }
    deleteRxsModel = (rxs) =>{
        let newState = this.state;
        newState.viewModel = !newState.viewModel;

        var text = 'Are you sure you want to delete rxs num:'+rxs.rxsNumber+' and all of the data including medications under this rxs?'
        newState.modelData = <DeleteDependent text={text} obj={rxs} toggleTable={this.toggleTable} delete={this.deleteRxs}/>

        newState.modelTitle = "Confirmation";
        this.setState(newState);
    }
    deleteRxs =  (rxs) =>{
        let jwt = localStorage.getItem('JWT');
        var id = rxs._id.toString();
        fetch(variable.api.baseURL+"/rxs/"+id+"/"+jwt,{
            method:'DELETE',
            headers: {
             
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
        .then(res => {
            if(res.error){
                let newState = this.state;
                newState.error.msg = res.error;
                newState.error.display = true;
                this.setState(newState);
            }else{
                let newState = this.state;
                newState.viewModel = false;
                this.setState(newState);
                this.fetchDep(this.state.viewDependentItemIndex);
                this.fetchOverview();
            }
        });
    }

    /*
        Table data will be formated to the following:
        data = {
            tableHead:[String,...],
            tableBody:[{
                value:String,
                isEditable:Bool,
                type:String,Date,...
                iObject:{type:OptionObject,default:null}
            }]
        }
        OptionObject:{
            header:String,
            top:[{
                value:String,
                disabled:Bool,
                action:{type:ActionObject,default:null}
            }]
            bottom:[{}]
        }
        ActionObject:{
            //Model Stuff
        }
    */
    render(){
        return(
            <>
                {this.state.error.display?
                    <Alert color="danger">{this.state.error.msg}</Alert>
                :
                    <Alert className="d-none" color="danger">{this.state.error.msg}</Alert>
                }

                {this.state.viewModel?
                    <TableModel modelTitle={this.state.modelTitle} isOpen={this.state.viewModel} toggle={this.toggleTable}>
                        {this.state.modelData}
                    </TableModel>
                :
                    null
                }
                <Container>
                    {!this.state.viewDependentItem?
                        <>
                        {this.state.overViewData?
                            <Overview data={this.state.overViewData} iconColor={["green","yellow","blue"]} iconName={["users","pills","address-card"]}/>
                        :
                            <Overview className="d-none" data={this.state.overViewData} iconColor={["green","yellow","blue"]} iconName={["users","pills","address-card"]}/>
                        }
                        <Button color="primary" className='fade-in' style={{width:"10em",marginBottom:'30px'}} onClick={this.addDependentModel}>Add</Button>
                        {this.state.formmattedTableData?
                            <DependentTable data={this.state.formmattedTableData} viewItem={this.viewDependentItem.bind(this)}/>
                        :
                        null}
                        </>
                    :<DependentItem addRxs={this.addRxsModel} deleteRxs={this.deleteRxsModel} delete={this.deleteDependentModel} update={this.updateDependent} goBack={this.goBackToTable} data={this.state.viewDependentItem}/>
                    }
                </Container>
            </>
        );
    }
}

export default ViewDependents;