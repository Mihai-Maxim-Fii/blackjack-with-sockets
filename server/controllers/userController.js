const Users = require("../models/Users")


const add_new_user = (user_object) => {

    let current_users = Users.get_users()

    if (current_users.some(u => u.name === user_object.name) || current_users.some(u => u.id === user_object.id)) {
        return false
    } else {
        Users.add_user(user_object)
        return true
    }
}


const get_logged_user = (socket_id)=>{
    let current_users = Users.get_users() 
    if(current_users.some(user=>user.id===socket_id)){
        return Users.get_id_to_user_dict()[socket_id]
    }
    else
    return null
}


const remove_user_on_disconnect = (socket_id) => {
    Users.delete_user_by_id(socket_id)
}

module.exports = {
    add_new_user,remove_user_on_disconnect,get_logged_user
}
