require('dotenv').config()
const moment = require("moment")

const user_functions = require("./controllers/userController")
const room_functions = require("./controllers/roomController")

const socket_io = require("socket.io")(3001, {
    cors: {
        origin: [process.env.CLIENT_SERVER]
    }
})


const get_current_moment = () =>{

    return moment().format("h:mm a")

}



const remove_user_owned_rooms_on_disconnect=(socket)=>{
    let was_room_owner = room_functions.remove_user_owned_rooms_on_disconnect(socket.id)
    if(was_room_owner.success){
        socket_io.emit("rooms-update", was_room_owner.new_rooms)

        if(was_room_owner.second_player!==false){
        

            const user_socket=socket_io.sockets.sockets.get( was_room_owner.second_player)

            user_socket.emit("owner-left-alert",{
                msg:"The owner of the room has left/deleted the room!"
            })

            user_socket.leave(was_room_owner.old_room_name)

        }

    }
}

const remove_room_membership_on_disconnect=(socket)=>{
    let was_room_member = room_functions.remove_room_membership_on_disconnect(socket.id)
    if(was_room_member.success){

        socket_io.emit("rooms-update", was_room_member.new_rooms)



        const user_socket=socket_io.sockets.sockets.get(socket.id)

        user_socket.leave(was_room_member.old_room_name)



    }
    
    user_functions.remove_user_on_disconnect(socket.id)
    
}


const handle_disconnect = (socket) =>{

    remove_user_owned_rooms_on_disconnect(socket)

    remove_room_membership_on_disconnect(socket)

    
    socket.emit("logout-response", {
        ok: true,
        msg: "You are logged out!"
    })
}


socket_io.on("connection", (socket) => {


    console.log(socket.id + " connected!")


    socket.on("disconnect", () => {

        handle_disconnect(socket)

    });


    socket.on("delete-room",()=>{

        remove_user_owned_rooms_on_disconnect(socket)


    })

    socket.on("logout", () => {

        handle_disconnect(socket)

    })


    socket.on("toggle-ready", (room_name, username)=>{
        let add_response= room_functions.try_to_add_user_to_ready(room_name,username)

        if(add_response.success){

            socket_io.emit("rooms-update", add_response.new_rooms)

        }

        
    })



    socket.on("get-rooms",()=>{
        socket.emit("get-rooms-response",{ok:true, rooms:room_functions.get_pulic_rooms()})
    })


    socket.on("room-chat-message",(room_name, from, message)=>{
        socket_io.to(room_name).emit("room-chat-message-response",{
            from,
            message,
            time:get_current_moment()
        })
    })

    socket.on("exit-room",(room_name)=>{

        let exit_room_response = room_functions.try_to_exit_room(room_name, socket.id)

        if(exit_room_response.success){
            socket.emit("exit-room-response",{ok:true,msg:exit_room_response.msg})
            socket_io.emit("rooms-update", exit_room_response.new_rooms)
        }
        else{
            socket.emit("exit-room-response",{ok:false,msg:exit_room_response.msg})
        }
        
    })

    socket.on("join-room",(room_info)=>{

        let join_request_response=room_functions.try_to_join_room(room_info.room_name, room_info.password, socket.id)
        if(join_request_response.success){
            socket.emit("join-room-response",{ok:true, msg:join_request_response.msg})
            socket_io.emit("rooms-update", join_request_response.new_rooms)
            socket.join(room_info.room_name)
        }
        else{
            socket.emit("join-room-response",{ok:false, msg:join_request_response.msg})
        }
        
    })


    socket.on("login", (user_object) => {
        if (user_functions.add_new_user(user_object)) 
            socket.emit("login-response", ({ok: true, msg: "Welcome"}))
         else 
            socket.emit("login-response", ({ok: false, msg: "User already exists!"}))

        

    })

    socket.on("new-room", (room_data) => {

        let logged_user_object = user_functions.get_logged_user(socket.id)

        if (logged_user_object !== null) {
            let add_request_response=room_functions.add_new_room(room_data,logged_user_object)
            socket.emit("new-room-response", {ok: add_request_response.success, msg: add_request_response.msg})
            if(add_request_response.success)
             socket_io.emit("rooms-update", add_request_response.updated_rooms)
        } else {
            socket.emit("new-room-response", {ok: false, msg: "Your cannot create a room, you are not logged in!"})
        }
    })

    socket.broadcast.emit("new-visitor", "new visitor joined!")
})


