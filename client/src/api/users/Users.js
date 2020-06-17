import variable from "../../config/variable";

var jwt = null;
const getAllUsers = async(jwt_token) =>{
    jwt = jwt_token;
    return await (await fetch(variable.api.baseURL+"/users/"+jwt)).json()
}

const getAllDependentsFromCurGroup = async(jwt_token) =>{
    jwt = jwt_token;
    return await (await fetch(variable.api.baseURL+"/users/get/dependents/"+jwt)).json()
}

function create(data,callback){
    fetch(variable.api.baseURL+"/users/"+jwt,{
        method:'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function patch(id,data,callback){
    fetch(variable.api.baseURL+"/users/"+id+"/"+jwt,{
        method:'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function userDelete(id,callback){
    fetch(variable.api.baseURL+"/users/"+id+"/"+jwt,{
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
export {
    getAllUsers,create,patch,userDelete,jwt,getAllDependentsFromCurGroup
}