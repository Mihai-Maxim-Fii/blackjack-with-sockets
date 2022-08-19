const Rooms = require("../models/Rooms")
const Users = require("../models/Users")
const user_functions = require("../controllers/userController")

const get_pulic_rooms =()=>{
    
    return Rooms.get_rooms_public()

}

const add_new_room = (room_object, user_object) => {
    let rooms = Rooms.get_rooms()

    let room_count = rooms.filter(room => room.owner.name == user_object.name).length

    // check room count
    if (room_count > 0) {
        return {success: false, msg: "Only one room per user is allowed!"}
    } else { 
        // check room name
        let is_room_name_taken = rooms.some(room => room.room_data.room_name === room_object.room_name)

        if (is_room_name_taken) {
            return {success: false, msg: "There already exists a room with this name!"}
        }


        Rooms.add_room(room_object, user_object)

        return {success: true, msg: "Room has been created successfully!", updated_rooms:Rooms.get_rooms_public()}

    }
}


const get_room_by_name = (room_name) =>{
    let all_rooms = Rooms.get_rooms()

    room = all_rooms.filter(rm=>rm.room_data.room_name===room_name)

    if(room.length===1){
        return room[0]
    }
    else{
        return null
    }

}

const try_to_add_user_to_ready = (room_name, username)=>{

    let room = get_room_by_name(room_name)

    if(room!==null){
        if(room.players.some(player=>player.name===username)){
            let user_object = Users.get_user_object_by_name(username)
            Rooms.add_player_to_ready(user_object,room_name)

            return {
                success:true,
                msg:"User added to ready",
                new_rooms:Rooms.get_rooms_public()
            }
        }
    }
    return {
        success:false,
        msg:"User was not added to ready"
    }




}


const remove_user_owned_rooms_on_disconnect = (id)=>{
    let user=user_functions.get_logged_user(id)
    
    let all_rooms = Rooms.get_rooms()


    let user_owned_rooms = all_rooms.filter((room)=>room.owner.name===user.name)


    if(user_owned_rooms.length!==0){

       
        let second_player = user_owned_rooms[0].players.filter(player=>player.name!==user.name)



        if(second_player.length>0){
            second_player=second_player[0].name

            console.log("scnd player", second_player)

            second_player=Users.get_user_id_by_name(second_player)

        }
        else
        second_player=false


        const old_room_name = user_owned_rooms[0].room_data.room_name

        Rooms.delete_room_by_name(old_room_name)


        return {
            success:true,
            msg:"User owns a room, it was removed",
            new_rooms:Rooms.get_rooms_public(),
            second_player,
            old_room_name
        }
    }
    else{
        return {
            success:false,
            msg:"User does not own a room"
        }
    }


    // 
}

const try_to_exit_room = (room_name, id) =>{
    let user=user_functions.get_logged_user(id)

    if(user!==null){
        let wanted_room = get_room_by_name(room_name)

        if(wanted_room!==null){


           if (wanted_room.players.some(p=>p.name===user.name)){

            Rooms.remove_player_from_room(user,room_name)
            return {

                success:true,
                msg:"You have exited the room!",
                new_rooms:Rooms.get_rooms_public(),
                old_room_name:room_name

            }

           }
           else{

            return {
                success:false,
                msg:"User is not in room!"
            }

           }

        }
        else{
            return {
                success:false,
                msg:"Could not find the room!"
            }
        }
    }
    else{
        return {
            success:false,
            msg:"User is not logged in!"
        }
    }
}



const remove_room_membership_on_disconnect = (id) =>{

    let user=user_functions.get_logged_user(id)

    let all_rooms = Rooms.get_rooms_public()

    let user_member_room = all_rooms.filter((room)=>room.players.some(player=>player===user.name))


    if(user_member_room.length!==0){

        Rooms.remove_player_from_room(user, user_member_room[0].room_data.room_name)
        return {
            success:true,
            msg:"User was removed from a room!",
            new_rooms:Rooms.get_rooms_public()
        }
    }

    else{

        return {
            success:false,
            msg:"User did not belong to any room!"
        }

    }



}

const try_to_join_room = (room_name, password, id)=>{

    let user=user_functions.get_logged_user(id)

    if(user!==null){

        let wanted_room = get_room_by_name(room_name)

        if(wanted_room!==null){

            if(wanted_room.players.length>1){
                return {
                    success:false,
                    msg:"Room is full"
                }
            }
            else
            if(wanted_room.room_data.has_password){

                if(wanted_room.room_data.password === password){

                  Rooms.add_player_to_room(user,room_name)

                    return {
                        success:true,
                        new_rooms:Rooms.get_rooms_public(),
                        msg:`You have joined ${room_name} `
                    }

                }
                else{
                    return {
                        success:false,
                        msg:`Invalid password `
                    }
                }
            }
            else{
                Rooms.add_player_to_room(user,room_name)
                return {
                    success:true,
                    new_rooms:Rooms.get_rooms_public(),
                    msg:`You have joined ${room_name} `
                }

            }

        }
        else{
            return {
                success:false,
                msg:"Could not find the room!"
            }
        }


    }
    else{
        return {
            success:false,
            msg:"User is not logged in!"
        }
    }
}

module.exports = {
    add_new_room,get_pulic_rooms,try_to_join_room,try_to_exit_room,remove_user_owned_rooms_on_disconnect, remove_room_membership_on_disconnect,try_to_add_user_to_ready
}
