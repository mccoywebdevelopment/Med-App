import variable from "../../config/variable";
var jwt = null;
const getAllDependentsWithMedication = async(jwt_token) =>{
    jwt = jwt_token;
    return await (await fetch(variable.api.baseURL+"/dependents/dependents-medication/medication/"+jwt)).json()
}
function create(data,callback){
    fetch(variable.api.baseURL+"/dependents/"+jwt,{
        method:'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function dependentPatch(id,data,callback){
    fetch(variable.api.baseURL+"/dependents/"+id+"/"+jwt,{
        method:'PATCH',
        credentials: 'same-origin', // <-- includes cookies in the request
        body: JSON.stringify(data),
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function deleteDep(id,callback){
    fetch(variable.api.baseURL+"/dependents/"+id+"/"+jwt,{
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function removeOTCFromDep(depId,medId,callback){
    fetch(variable.api.baseURL+"/dependents/"+depId+"/OTC-medication/"+medId+"/"+jwt,{
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function createAndAddOTCMedicationToDependent(depId,data,callback){
    var newData = {
        updatedFields:{
            medication:data
        }
    }
    fetch(variable.api.baseURL+"/dependents/"+depId+"/"+jwt,{
        method:'PATCH',
        body: JSON.stringify(newData),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
export {
    getAllDependentsWithMedication,createAndAddOTCMedicationToDependent,dependentPatch,deleteDep,removeOTCFromDep,create,jwt
}