
const initial_state = {
    room:"",
    selected:false,
    room_object:{}
}



const selected_room_reducer = (state = initial_state, action)=>{

    if(action.type==="SET_ROOM"){
        return {room:action.payload.room,room_object:action.payload.room_object, selected:true}
    }
    
    if(action.type==="RESET_ROOM"){
        return {room:"",room_object:{}, selected:false}
    }

    return state


}


export default selected_room_reducer