


const update_game = (game)=>{
    return (dispatch, getState)=>{
        console.log(game)
        dispatch({
            type:"UPDATE_GAME",
            payload:{
            game
        }
        })
    }
}







const leave_game_on_game_end = ( ) =>{
    return (dispatch, getState)=>{
        dispatch({
            type:"UPDATE_GAME",
            payload:{
            game:{...getState().game_reducer.game, game_running:false}
        }
        })
    }

}




export default {update_game,leave_game_on_game_end}