import NewRoom from "./NewRoom/NewRoom"
import { useState } from "react"
const AddRoom = () =>{
    const [show_new_room, set_show_new_room] = useState(false)

    const close_new_room = () =>{
        set_show_new_room(false)
    }

    const open_new_room = () =>{
        set_show_new_room(true)
    }
    return (
       <div className=" w-full h-full">
        <div className="w-full  h-full cursor-pointer   " onClick={()=>set_show_new_room(true)} >
        <div className="w-full h-full flex justify-center items-center  hover:bg-orange-300  " >
            Create Room
        </div>

    </div>
    {show_new_room&&
        <NewRoom close_room={()=>close_new_room}>
            
        </NewRoom>
        }
    
    </div>)
}
export default AddRoom