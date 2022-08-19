import LoginUser from "./LoginBar"
import {useSelector} from "react-redux"
import BrowseBar from "./BrowseBar"
import RoomBar from "./RoomBar"
const BottomBar = (props) => {
    const bar_state = useSelector(state => state.bar_reducer)

    return <div className=" w-full  bg-gray-400  " style={{
        minHeight:"3rem"
    }}>
        {
        bar_state.login_state && <LoginUser></LoginUser>
    }
        {
        bar_state.browse_state && <BrowseBar></BrowseBar>
    }
        {
        bar_state.room_state && <RoomBar></RoomBar>
    } </div>
}

export default BottomBar
