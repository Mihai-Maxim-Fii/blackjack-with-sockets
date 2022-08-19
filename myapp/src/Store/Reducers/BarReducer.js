
const initial_state= {
    login_state:true,
    room_state:false,
    browse_state:false
}

const all_false_state={
    login_state:false,
    room_state:false,
    browse_state:false
}


const bar_reducer = (state = initial_state, action)=>{

    if(action.type==="IN_LOGIN"){
        return {...all_false_state, login_state:true}
    }
    
    if(action.type==="IN_BROWSE"){
        return{...all_false_state, browse_state:true}
    }

    if(action.type==="IN_ROOM"){
        return {...all_false_state, room_state:true}
    }

    return state


}


export default bar_reducer