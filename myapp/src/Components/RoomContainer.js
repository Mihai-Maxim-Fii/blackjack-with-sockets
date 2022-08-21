import Room from "./Room"
import {useContext, useEffect} from "react"
import { MySocketContext } from "../Store/Context/SocketContext"
import {useDispatch} from "react-redux"
import RoomActions from "../Store/Actions/RoomActions"
const RoomContainer = () => {

    const dispatch = useDispatch()

    const socket_context = useContext(MySocketContext)

    useEffect( ()=>{
        socket_context.on("owner-left-alert",(msg_object)=>{
            alert(msg_object.msg)
        })
    
        return () =>{
            socket_context.off("owner-left-alert")
        }
    
    },[])


    useEffect( ()=>{
        socket_context.on("rooms-update", (rooms) => {
            dispatch(RoomActions.update_rooms(rooms))
        })
        return () =>{
            socket_context.off("rooms-update")
        }

    },[])



    return (
        <div className=" w-full " style={{
            height:"100vh"
        }}>
            <Room></Room>
        </div>
    )

}

export default RoomContainer
