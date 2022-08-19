

let Users = []



const get_id_to_user_dict = () =>{
    let id_to_user_dict = {}
    Users.forEach(user=>{
        id_to_user_dict[user.id]=user
    })

    return id_to_user_dict
}

const get_user_id_by_name = (username) =>{
    const user=Users.filter(user=>user.name===username)[0]

    return user.id
}

const get_user_object_by_name = (username) => {
    const user=Users.filter(user=>user.name===username)[0]

    return user
}

const add_user = (user_object) =>{
    Users.push({
        id:user_object.id,
        name:user_object.name,
    })
}

const delete_user = (username) =>{
    Users=Users.filter(user=>user.name!==username)
}

const delete_user_by_id = (user_id) =>{
    Users=Users.filter(user=>user.id!==user_id)
}

const get_users = ()=>{
    return Users
}

module.exports={ 
    add_user,delete_user,get_users,delete_user_by_id,get_id_to_user_dict,get_user_id_by_name,get_user_object_by_name
}
