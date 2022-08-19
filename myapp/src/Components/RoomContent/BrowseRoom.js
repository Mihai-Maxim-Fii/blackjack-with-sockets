import RoomLinks from "./RoomLinks/RoomLinks"
import AddRoom from "./AddRoom"
import { useContext } from "react"
import { MySocketContext } from "../../Store/Context/SocketContext"
import { useEffect } from "react"

const BrowseRoom = () =>{


    return (<div className="overflow-y-auto flex flex-col justify-between " style={{
        height:'100%'
    }} >
        <RoomLinks>

        </RoomLinks>
        
    </div>)
}

export default BrowseRoom