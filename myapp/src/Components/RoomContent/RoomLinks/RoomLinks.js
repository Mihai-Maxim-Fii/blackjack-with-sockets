import Link from "./Link"
import {useEffect} from "react"
import {useDispatch} from "react-redux"
import RoomActions from "../../../Store/Actions/RoomActions"
import {useContext} from "react"
import {MySocketContext} from "../../../Store/Context/SocketContext"
import {useSelector} from "react-redux"
import useEmitWithResponse from "../../../Hooks/useEmitWithResponse"

const RoomLinks = (props) => {



    const {isBusy: is_get_rooms_request_busy, isError: is_get_rooms_request_error, send_request: send_get_rooms_request} = useEmitWithResponse("get-rooms", (resp) => {
        if (resp.ok === true) {
            dispatch(RoomActions.update_rooms(resp.rooms))
            

        } else {

            alert("could not load rooms")

        }
    })

    const all_rooms = useSelector(state => state.rooms_reducer.rooms)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(RoomActions.reset_selected_room())
        send_get_rooms_request()
    }, [])

    const socket_context = useContext(MySocketContext)

    socket_context.on("rooms-update", (rooms) => {
        dispatch(RoomActions.update_rooms(rooms))
    })


    return (
        <div className="">
            <div className=" w-full grid grid-cols-12 text-left p-4" >
                <p className=" col-start-0 col-span-2">
                 Room Name
                </p>
                <p className=" col-span-3">
                 Description
                </p>
                <p className=" col-span-2">
                    Owner
                </p>
                <p className=" col-span-2">
                    Players
                </p>
                <p className=" col-span-1">
                    Password
                </p>
                
            </div>
            {
            all_rooms.map((link, index) => {
                return <Link key={link.room_data.room_name}
                    owner={
                        link.owner
                    }
                    {...link.room_data}
                    player_number={
                        link.players.length
                }></Link>
        })
        } </div>
    )
}

export default RoomLinks
