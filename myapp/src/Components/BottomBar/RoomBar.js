import {MySocketContext} from "../../Store/Context/SocketContext"
import {useContext, useRef} from "react"
import {useSelector} from "react-redux"
const RoomBar = () => {
    const socket_context = useContext(MySocketContext)
    const current_room_state = useSelector(state => state.selected_room_reducer)
    const user_state = useSelector(state => state.username_reducer)

    const message_input_ref = useRef()


    const are_we_ready=current_room_state.room_object.ready_players.some(player=>player===user_state.username)

    const send_ready_request = () =>{

      socket_context.emit("toggle-ready", current_room_state.room, user_state.username)

    }


    const try_to_start_game = () =>{

      socket_context.emit("start-game", current_room_state.room, user_state.username)

    }


    const send_room_chat_message = () => {
        if (message_input_ref.current.value.length !== 0) {
            socket_context.emit("room-chat-message", current_room_state.room, user_state.username, message_input_ref.current.value)
            message_input_ref.current.value = ""
            message_input_ref.current.focus()
        } else {
            alert("Messages cannot be empty!")
        }
    }


    return (
        <div className=" flex items-center h-full justify-between px-2">
            <input ref={message_input_ref}
                className="w-11/12 p-1 rounded-sm text-black"
                type="text"></input>
            <button onClick={send_room_chat_message}
                className=" bg-orange-300 px-4 py-1 ml-2 hover:bg-green-500 rounded-sm ">
                Send
            </button>
            <button className={`${are_we_ready?" bg-green-500":"bg-orange-300"} px-4 py-1 ml-2 hover:bg-blue-500 rounded-sm  `} onClick={send_ready_request}>
                Ready
            </button>

            {
            user_state.username === current_room_state.room_object.owner &&
             <button onClick={try_to_start_game} disabled={!current_room_state.room_object.start_game_ready?true:false} className={`  ${current_room_state.room_object.start_game_ready?" bg-green-500 hover:scale-110":"opacity-70 bg-red-500"} px-4 py-1 ml-2  rounded-sm  `}>
                Start
            </button>
        } </div>
    )
}
export default RoomBar
