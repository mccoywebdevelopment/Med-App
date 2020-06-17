import variable from "../../config/variable";
import {jwt} from "../dependents/Dependents";

function createAndAddToDependent(id,data,callback){
    var newData = {
        updatedFields:{
            rxs:data
        }
    }
    fetch(variable.api.baseURL+"/dependents/"+id+"/"+jwt,{
        method:'PATCH',
        body: JSON.stringify(newData),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function rxsPatch(id,data,callback){
    fetch(variable.api.baseURL+"/rxs/"+id+"/"+jwt,{
        method:'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function deleteRxs(id,callback){
    fetch(variable.api.baseURL+"/rxs/"+id+"/"+jwt,{
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
///:id/add-medication/:medId
function removeMedFromArr(id,medId,callback){
    fetch(variable.api.baseURL+"/rxs/"+id+"/rxs-medication/"+medId+"/"+jwt,{
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function createAndAddRxsMedicationToRxs(rxsId,data,callback){
    var NewData = {
        updatedFields:{
            rxsMedication:data
        }
    }
    fetch(variable.api.baseURL+"/rxs/"+rxsId+"/"+jwt,{
        method:'PATCH',
        body: JSON.stringify(NewData),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
export {
    rxsPatch,deleteRxs,removeMedFromArr,createAndAddRxsMedicationToRxs,createAndAddToDependent
}