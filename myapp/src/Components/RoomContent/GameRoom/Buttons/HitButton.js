import {useSelector} from "react-redux"
import {useRef} from "react"
import {useContext} from "react"
import {MySocketContext} from "../../../../Store/Context/SocketContext"

const HitButton = () =>{
   
    const socket_context = useContext(MySocketContext)

    const game_name = useSelector(state => state.game_reducer.game.game_name)

    const user_name = useSelector(state => state.username_reducer.username)

    const send_hit = () =>{
        socket_context.emit("send-hit", user_name,game_name)
    }

   return <button onClick={send_hit}  className="w-full h-full hover:bg-blue-400 flex justify-center items-center ">
    Hit
   </button>
}

export default HitButton