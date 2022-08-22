import { useSelector } from "react-redux"
import RoomActions from "../../Store/Actions/RoomActions"
import { useDispatch } from "react-redux"
import ModalWrapper from "../Utility/ModalWrapper"
import { useState } from "react"
import RequirePassword from "./RequirePassword"
import useEmitWithResponse from "../../Hooks/useEmitWithResponse"
import AddRoom from "../RoomContent/AddRoom"
import { useContext } from "react"
import { MySocketContext } from "../../Store/Context/SocketContext"

const BrowseBar = () => {

    const socket_context = useContext(MySocketContext)

    const dispatch = useDispatch()

    const selected_room_state = useSelector(state=>state.selected_room_reducer)

    const user_state = useSelector(state=>state.username_reducer)

    const [show_request_password, set_show_request_password] = useState(false)



    const {isBusy: is_join_room_request_busy, isError: is_join_room_request_error, send_request: send_new_join_room_request} = useEmitWithResponse("join-room", (resp) => {
        if (resp.ok === true) {

            dispatch(RoomActions.join_room())

        } else {

            alert(resp.msg)

        }
    })


    const delete_room = () =>{

        socket_context.emit("delete-room")


    }

    const join_room = () =>{
        //dispatch(RoomActions.join_room(selected_room_state.room))
        if(selected_room_state.room===""){
            alert("Please select a room!")
            return
        }


        let room_object = selected_room_state.room_object

        if(room_object.players.length>1){
            alert("The room is full!")
            return
        }


        if(!room_object.players.includes(room_object.owner) && room_object.players.length>0 && user_state.username!==room_object.owner ){
            alert("The room is waiting for the owner to return!")
            return
        }

        if(room_object.room_data.has_password){

            set_show_request_password(true)
            return
        }

        send_new_join_room_request(
            {
                room_name:selected_room_state.room,
                password:""
            }
        )

    }

    return (
        <div className="w-full h-full flex">
        <div className="flex h-full w-full justify-center items-center h-full hover:bg-orange-300 cursor-pointer " onClick={join_room}>
            <button >
                Join Room
            </button>
           
        </div>
            {
            selected_room_state.room_object.owner===user_state.username&&
        <div className="flex h-full w-full justify-center items-center h-full hover:bg-orange-300 cursor-pointer " onClick={delete_room}>
            <button >
                Delete Room
            </button>
           
        </div>
        }

        <AddRoom>

        </AddRoom>


        {show_request_password&&
            <RequirePassword room_name={selected_room_state.room} join_method={send_new_join_room_request} close_window={()=>()=>set_show_request_password(false)}>

            </RequirePassword>
         }
        </div>
    )
}

export default BrowseBar
