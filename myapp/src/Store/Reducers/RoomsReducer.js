const initial_state = {
    rooms:[]
}
const rooms_reducer = (state=initial_state, action) =>{
    if(action.type==="UPDATE_ROOMS"){
        return {rooms:action.payload.rooms}
    }

    return state
    
}


export default rooms_reducer

