import variable from "../../config/variable";

var jwt = null;
const getAllGroups = async(jwt_token) =>{
    jwt = jwt_token;
    return await (await fetch(variable.api.baseURL+"/groups/"+jwt)).json()
}
function patch(id,data,callback){
    if(!data.updatedFields){
        data = {
            updatedFields:data
        }
    }
    fetch(variable.api.baseURL+"/groups/"+id+"/"+jwt,{
        method:'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function create(data,callback){
    fetch(variable.api.baseURL+"/groups"+"/"+jwt,{
        method:'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function deleteGroup(groupId,callback){
    fetch(variable.api.baseURL+"/groups/"+groupId+"/"+jwt,{
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
export{
    getAllGroups,patch,deleteGroup,create,jwt
}