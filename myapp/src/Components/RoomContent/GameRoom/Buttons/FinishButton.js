import { useReducer } from "react"
import { useSelector } from "react-redux"
import { MySocketContext } from "../../../../Store/Context/SocketContext"
import { useContext } from "react"

const FinishButton = () =>{


    const user_name = useSelector(state => state.username_reducer.username)

    const game_name = useSelector(state => state.game_reducer.game.game_name)

    const game_state = useSelector(state =>state.game_reducer.game.state)

    const user_current_bet = useSelector(state => state.game_reducer.game[user_name].current_bet)

    const socket_context = useContext(MySocketContext)

    const set_finish =() =>{

        if(user_current_bet>0 || game_state!=="bet"){
        socket_context.emit("set-player-finish",user_name, game_name )
        }
        else{

            alert("You must bet before ending the turn")
        }
    }

    return <button onClick={set_finish}  className="w-full h-full hover:bg-blue-400 flex justify-center items-center ">
    End Turn
   </button>
}

export default FinishButton