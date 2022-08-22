require('dotenv').config()
const moment = require("moment")

const user_functions = require("./controllers/userController")
const room_functions = require("./controllers/roomController")
const game_functions = require("./controllers/gameController")

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
        socket_io.to("lobby").emit("rooms-update", was_room_owner.new_rooms)

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
    let was_room_member = room_functions.remove_room_membership_on_disconnect(socket.id, socket_io)


    if(was_room_member.success){



        socket_io.to("lobby").emit("rooms-update", was_room_member.new_rooms)


    }
    
    user_functions.remove_user_on_disconnect(socket.id)
    
}


const handle_disconnect = (socket) =>{

    try{

    remove_user_owned_rooms_on_disconnect(socket)

    remove_room_membership_on_disconnect(socket)

    
    socket.emit("logout-response", {
        ok: true,
        msg: "You are logged out!"
    })
    
    }  
    catch(error){
        console.log(error)
    } 
}


socket_io.on("connection", (socket) => {


    console.log(socket.id + " connected!")


    socket.on("disconnect", () => {

        handle_disconnect(socket)

    });


    socket.on("delete-room",()=>{

        try{

        remove_user_owned_rooms_on_disconnect(socket)
            }
            catch(error){

            console.log(error)
         }


    })

    socket.on("set-player-finish",(user_name,game_name)=>{

        try{
       let response=game_functions.set_player_finish(user_name,game_name)

       if(response.success){
        socket_io.to(game_name).emit("game-update",response.new_game)
        socket_io.to(game_name).emit("game-log",{
            msg:`${user_name} has finished his turn`
        })
        if(response.both_done){
            socket_io.to(game_name).emit("game-log",{
                msg:`Both players have finished their turn!`
            })

            let response = game_functions.switch_state(game_name, socket_io)


        }
       }
    }
    catch(err){
        console.log(err)
    }



    })


    socket.on("send-hit", (user_name,game_name)=>{
        try{
        game_functions.handle_player_hit(game_name,user_name,socket_io)
        }
        catch(err){
            console.log(err)
        }
    })

    socket.on("set-bet",(user_name, game_name, bet_value)=>{

        try{
        let response=game_functions.set_bet(user_name, game_name, parseInt(bet_value))
        if(response.success){
            socket_io.to(game_name).emit("game-update",response.new_game)
            socket_io.to(game_name).emit("game-log",{
                msg:`${user_name} has bet ${bet_value}`
            })

        }
    }
    catch(err){
        console.log(err)
    }

    })

    socket.on("logout", () => {


        handle_disconnect(socket)

    })


    socket.on("toggle-ready", (room_name, username)=>{

        try{
        let add_response = room_functions.try_to_add_user_to_ready(room_name,username)



        if(add_response.success){

            socket_io.in("lobby").emit("rooms-update", add_response.new_rooms)

        }
    }
    catch(err){
        console.log(err)
    }
        
    })



    socket.on("get-rooms",()=>{
        try{
        socket_io.to(socket.id).emit("get-rooms-response",{ok:true, rooms:room_functions.get_pulic_rooms()})

    }catch(err){
        console.log(err)
    }
    })


    socket.on("room-chat-message",(room_name, from, message)=>{
        try{
        socket_io.to(room_name).emit("room-chat-message-response",{
            from,
            message,
            time:get_current_moment()
        })
    }catch(err){
        console.log(err)
    }
    })

    socket.on("exit-room",(room_name)=>{

        try{

        let exit_room_response = room_functions.try_to_exit_room(room_name, socket.id)

        if(exit_room_response.success){
            socket_io.to(socket.id).emit("exit-room-response",{ok:true,msg:exit_room_response.msg})
            socket_io.in("lobby").emit("rooms-update", exit_room_response.new_rooms)
            socket.leave(room_name)


        }
        else{
            socket_io.to(socket.id).emit("exit-room-response",{ok:false,msg:exit_room_response.msg})
        }

    }catch(err){
        console.log(err)
    }
        
    })

    

    socket.on("join-room",(room_info)=>{

        try{

        let join_request_response=room_functions.try_to_join_room(room_info.room_name, room_info.password, socket.id)
        if(join_request_response.success){

            console.log(join_request_response.socket_id)

            socket.join(room_info.room_name)
            
            socket_io.in("lobby").emit("rooms-update", join_request_response.new_rooms)

            if(socket.id===join_request_response.socket_id){

                socket_io.to(socket.id).emit("join-room-response",{ok:true, msg:join_request_response.msg})
            }

        }
        else{
            socket_io.to(socket.id).emit("join-room-response",{ok:false, msg:join_request_response.msg})
        }
    }
    catch(err){
        console.log(err)
    }
        
    })

    socket.on("start-game", (room_name, username)=>{

        try{
        const start_game_response  = room_functions.try_to_start_game(room_name, username)
        if(start_game_response.success){
           

            socket_io.to(room_name).emit("game-update",start_game_response.new_game)
            socket_io.in("lobby").emit("rooms-update", start_game_response.new_rooms)
            socket_io.to(room_name).emit("game-log", {
                msg:`Round started! `
            })
              
        }
    }
    catch(err){
        console.log(err)
    }

    })


    socket.on("login", (user_object) => {

        try{
        if (user_functions.add_new_user(user_object)) {
            socket.join("lobby")
            socket_io.to(socket.id).emit("login-response", ({ok: true, msg: "Welcome"}))
        }
         else 
           socket_io.to(socket.id).emit("login-response", ({ok: false, msg: "User already exists!"}))

        }catch(err){
            console.log(err)
        }

        

    })

    socket.on("new-room", (room_data) => {

        try {

        let logged_user_object = user_functions.get_logged_user(socket.id)

        if (logged_user_object !== null) {
            let add_request_response=room_functions.add_new_room(room_data,logged_user_object)
            socket_io.to(socket.id).emit("new-room-response", {ok: add_request_response.success, msg: add_request_response.msg})
            if(add_request_response.success)
             socket_io.in("lobby").emit("rooms-update", add_request_response.updated_rooms)
        } else {
            socket_io.to(socket.id).emit("new-room-response", {ok: false, msg: "Your cannot create a room, you are not logged in!"})
        }

    }
    catch(err){
        console.log(err)
    }
    })

})


