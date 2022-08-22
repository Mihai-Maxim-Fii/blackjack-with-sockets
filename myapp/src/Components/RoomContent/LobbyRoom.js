import {useSelector} from "react-redux"
import {useDispatch} from "react-redux"
import {MySocketContext} from "../../Store/Context/SocketContext"
import {useContext, useEffect, useRef} from "react"
import {useState} from "react"
import LobbyMessages from "./LobbyMessages"

const LobbyRoom = () => {

    const selected_room_state = useSelector(state => state.selected_room_reducer)

    let players_string = selected_room_state.room_object.players.reduce((total, currrent) => total + `${currrent}, `, "")

    players_string = players_string.slice(0, players_string.split("").length - 2)

    const socket_context = useContext(MySocketContext)

    const [room_messages, set_room_messages] = useState([])

    const message_container_ref = useRef()

    let connected_players = selected_room_state.room_object.players

    let ready_players = selected_room_state.room_object.ready_players


    useEffect(() => {
        socket_context.on("room-chat-message-response", (message_object) => {

            set_room_messages((old) => [
                ...old,
                message_object
            ])

          

        })

        return() => {
            socket_context.off("room-chat-message-response")
        }

    }, [])


    return (
        <div className=" w-full h-full flex flex-col ">
            <div className=" relative h-fit px-2 py-2 flex w-full items-center justify-between "
                style={
                    {backgroundColor: "#525252"}
            }>

                <div className="pl-2">
                    Owner: {
                    selected_room_state.room_object.owner
                } </div>
                <div className=" left-0 ml-2 flex">
                    Connected Players: {
                        connected_players.map((player,index)=>{
                          return <div key={index} className={` flex ${ready_players.includes(player)?" ml-1 text-green-500 ":" ml-1 text-white"}`}>
                            {player}
                            {(index<connected_players.length-1)?<p className=" text-white">,</p>:""}
                          </div> 
                        })
                    } </div>
                </div>

            <div className="overflow-y-auto break-words "
                ref={message_container_ref}
                style={
                    {height: '88%'}
            }>

                <LobbyMessages message_objects={room_messages}></LobbyMessages>
            </div>
        </div>
    )
}

export default LobbyRoom
