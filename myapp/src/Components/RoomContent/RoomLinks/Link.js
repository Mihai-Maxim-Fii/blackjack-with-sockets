import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import RoomActions from "../../../Store/Actions/RoomActions"
const Link = (props) =>{
    const selected_room_state = useSelector(state=>state.selected_room_reducer)

    const dispatch = useDispatch()


    const select_room = () =>{
        if (props.room_name===selected_room_state.room)
        {
            dispatch(RoomActions.reset_selected_room())
        }
        else
        dispatch(RoomActions.select_room(props.room_name))
    }
    return (
    <div className={` flex justify-between px-4 ${selected_room_state.room===props.room_name?" bg-green-500":""} hover:bg-white hover:text-black cursor-pointer`} onClick={select_room}>
    <div className=" w-full grid grid-cols-12 text-left py-2 items-start">
         <p className=" col-span-2 pr-1">
           {props.room_name}
        </p>
        <p className=" col-span-3 pr-1">
            {props.room_description}
        </p>

        <p className=" col-span-2 pr-1">
            {props.owner}
        </p>
       
        <p className=" col-span-2 pr-1 w-full ">
            {props.player_number+"/2"}
        </p>
        <p className=" col-span-1 pr-1 ">
            {
                props.has_password?"Yes":"No"
            }
        </p>

        {
            (selected_room_state.room===props.room_name)&&
        <div className=" col-start-11 col-span-2 flex justify-end pr-1" >
            ==>
        </div>
    }

    </div>
   
    </div>
    )
}

export default Link