let Rooms = [

]

const add_room=(room_data, owner)=>{
    Rooms.push({
        owner,
        room_data,
        players:[
        ],
        ready_players:[

        ],
        game_running:false,
        start_game_ready:false
    })
}


const add_player_to_ready = (user_object, room_name)=>{
    let room_to_edit = Rooms.filter(room=>room.room_data.room_name===room_name)[0]


    if(!room_to_edit.ready_players.some(p=>p.name===user_object.name)){
        room_to_edit.ready_players.push(user_object)
       
       if(room_to_edit.players.every(p=>room_to_edit.ready_players.some(rp=>rp.name===p.name)) && room_to_edit.players.length===2)
       room_to_edit.start_game_ready=true
    } 
    else{
        room_to_edit.ready_players=room_to_edit.ready_players.filter(p=>p.name!==user_object.name)
        room_to_edit.start_game_ready=false
    }


}





const set_game_running = (room_name, value) => {


    let room_to_edit = Rooms.filter(room=>room.room_data.room_name===room_name)[0]



    let index_of_room = Rooms.indexOf(room_to_edit)



    Rooms[index_of_room].game_running=value
}


const add_player_to_room = (user_object, room_name)=>{

    let room_to_edit = Rooms.filter(room=>room.room_data.room_name===room_name)[0]



    let index_of_room = Rooms.indexOf(room_to_edit)



    Rooms[index_of_room].players.push(user_object)

}

const remove_player_from_room = (user_object, room_name)=>{

    let room_to_edit = Rooms.filter(room=>room.room_data.room_name===room_name)[0]


    let index_of_room = Rooms.indexOf(room_to_edit)


    Rooms[index_of_room].players=Rooms[index_of_room].players.filter(player=>player.name!==user_object.name)
    Rooms[index_of_room].ready_players = Rooms[index_of_room].ready_players.filter(player=>player.name!==user_object.name)
    Rooms[index_of_room].game_running=false
    Rooms[index_of_room].start_game_ready=false

}





const get_rooms_public =()=>{
  let public_room_data = []

  Rooms.forEach(room=>{
    let public_players = []
    let public_ready_players = []

    room.players.forEach(player=>{
        public_players.push(player.name)
    })

    room.ready_players.forEach(player=>{
        public_ready_players.push(player.name)
    })
    public_room_data.push({
        owner:room.owner.name,
        room_data:{room_name:room.room_data.room_name, room_description:room.room_data.room_description, has_password:room.room_data.has_password},
        players:public_players,
        ready_players:public_ready_players,
        game_running:room.game_running,
        start_game_ready:room.start_game_ready
    })
  })

  return public_room_data
}



const get_rooms = ()=>{
    return Rooms
}

const get_room_by_name = (room_name) => {

    return  Rooms.filter(room=>room.room_data.room_name===room_name)[0]
}


const delete_room_by_name = (room_name) =>{

    Rooms=Rooms.filter(room=>room.room_data.room_name!==room_name)

}


module.exports={add_room, get_rooms, delete_room_by_name, get_rooms_public, add_player_to_room, add_player_to_ready, set_game_running, remove_player_from_room, get_room_by_name}