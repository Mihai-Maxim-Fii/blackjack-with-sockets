import Room from "./Room"
import {useContext, useEffect} from "react"
import { MySocketContext } from "../Store/Context/SocketContext"
const RoomContainer = () => {
    const socket_context = useContext(MySocketContext)

    useEffect( ()=>{
        socket_context.on("owner-left-alert",(msg_object)=>{
            alert(msg_object.msg)
        })
    
        return () =>{
            socket_context.off("owner-left-alert")
        }
    
    },[])



    return (
        <div className="flex justify-center w-full h-full items-center">
            <Room></Room>
        </div>
    )

}

export default RoomContainer
