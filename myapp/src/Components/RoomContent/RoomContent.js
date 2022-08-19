import {useSelector} from "react-redux"
import BrowseRoom from "./BrowseRoom"
import {useDispatch} from "react-redux"
import BottomBarActions from "../../Store/Actions/BottomBarActions"
import RoomActions from "../../Store/Actions/RoomActions"
import LobbyRoom from "./LobbyRoom"
import HomeRoom from "./HomeRoom"
import useEmitWithResponse from "../../Hooks/useEmitWithResponse"
const RoomContent = () => {
    const username_state = useSelector(state => state.username_reducer)
    const screen_state = useSelector(state => state.bar_reducer)
    const selected_room_state = useSelector(state=>state.selected_room_reducer.room)

    const show_header = screen_state.browse_state || screen_state.room_state
    const left_arrow = "<"

    const dispatch = useDispatch()

    const handle_logout = () => {
        send_logout_request()
    }

    const handle_exit_room = () => {

        send_exit_room_request(selected_room_state)
    }



    const {isBusy: is_exit_room_busy, isLoading: is_exit_room_loading, send_request: send_exit_room_request} = useEmitWithResponse("exit-room", (resp) => {
        if (resp.ok === true) {
            dispatch(RoomActions.exit_room(selected_room_state))
        } else {
            alert(resp.msg)
        }
    })


    const {isBusy: is_logout_request_busy, isLoading: is_logout_request_loading, send_request: send_logout_request} = useEmitWithResponse("logout", (resp) => {
        if (resp.ok === true) {
            dispatch(BottomBarActions.logout_user())
        } else {
            alert("User could not be logged out!")
        }
    })


    return (
        <div className=" w-full h-full flex flex-col">
            {
            show_header && <div className=" w-full h-8 bg-orange-300 flex justify-between items-center px-2">
                {
                screen_state.browse_state && <button className=" ml-2"
                    onClick={handle_logout}>
                    Logout
                </button>
            }
                {
                screen_state.room_state && <button className=" ml-2"
                    onClick={handle_exit_room}>
                    {left_arrow}Exit {selected_room_state}
                </button>
               }
                <p>
                    User: {
                    username_state.username
                } </p>

            </div>
        }
            <div className=" w-full h-full">
              
                {
                screen_state.browse_state && <BrowseRoom></BrowseRoom>
            }
                {
                screen_state.room_state && <LobbyRoom></LobbyRoom>
            } 

             {
                screen_state.login_state && <HomeRoom></HomeRoom>
             } 
            
            
            
            </div>
        </div>

    )
}

export default RoomContent
