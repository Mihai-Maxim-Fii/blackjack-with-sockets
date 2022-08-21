const initial_state = {
    game:{}
}
const game_reducer = (state=initial_state, action) =>{
    if(action.type==="UPDATE_GAME"){
        return {game:action.payload.game}
    }

    return state
    
}


export default game_reducer