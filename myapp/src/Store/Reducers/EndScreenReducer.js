const initial_state= {
    show_end_screen:false
}

const end_screen_reducer = (state = initial_state, action) =>{
    if(action.type==="SHOW_END_SCREEN"){
        return {
            show_end_screen:true
        }
    }
    
    if(action.type==="HIDE_END_SCREEN"){
        return initial_state
    }

    return state

}

export default end_screen_reducer