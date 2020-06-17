import variable from "../../config/variable";
var jwt = null;
const getAllEvents = async(jwt_token) =>{
    jwt = jwt_token;
    return await (await fetch(variable.api.baseURL+"/events/"+jwt)).json()
}
function tookToday(data,jwt,rxsMedId,callback){
    fetch(variable.api.baseURL+"/rxsMedication-event/"+jwt+"/"+rxsMedId,{
        method:'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.text())
    .then(jsondata => callback(jsondata));
}
function deleteMedEventById(id,jwt,callback){
    fetch(variable.api.baseURL+"/rxsMedication-event/"+jwt+"/med-event/"+id,{
        method:'delete',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}

export {
    getAllEvents,
    tookToday,
    deleteMedEventById
}