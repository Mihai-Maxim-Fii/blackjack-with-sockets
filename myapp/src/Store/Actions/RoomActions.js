
const select_room = (room) =>{


    return (dispatch, getState)=>{

        let all_rooms = getState().rooms_reducer.rooms

        let room_object = all_rooms.filter(rm=>rm.room_data.room_name===room)

        if(room_object.length===0){
            dispatch({
                type:"SET_ROOM",
                payload:{
                    room:"",
                    selected:false,
                    room_object:{}
                }
            })

            dispatch({
                type:"IN_BROWSE",
                payload:null
            })

        }
        else{

        room_object=room_object[0]
        
        let username = getState().username_reducer.username

        if(!room_object.players.includes(username)){
        room_object={...room_object, game_running:false}
        }

        dispatch({
            type:"SET_ROOM",
            payload:{
                room,
                selected:true,
                room_object:room_object
            }
        })
    }

    }
}

const join_room = ( ) =>{
    return (dispatch, getState)=>{
        dispatch({
            type:"IN_ROOM",
            payload:null
        })

    }
}



const leave_game_on_game_end = ( ) =>{
    return (dispatch, getState)=>{
      
        dispatch({
            type:"SET_ROOM",
            payload:{
                ...getState().selected_room_reducer,
                room_object:{
                    ...getState().selected_room_reducer.room_object,
                    game_running:false
                }
             }
            
        })
    }


}

const update_rooms = (rooms) => {
    return (dispatch, getState)=>{

        console.log(rooms)
        dispatch({
            type:"UPDATE_ROOMS",
            payload:{
                rooms
            }
        })

        dispatch(select_room(getState().selected_room_reducer.room))

    }
}

const exit_room = ()=>{
    return (dispatch, getState)=>{
    dispatch({
        type:"IN_BROWSE",
        payload:null
    })
}
}


const reset_selected_room = ()=>{
    return (dispatch, getState)=>{
        dispatch({
            type:"RESET_ROOM",
            payload:null
        })

    }
}

export default {select_room, reset_selected_room, join_room, exit_room, update_rooms,leave_game_on_game_end}