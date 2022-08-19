import BottomBar from "./BottomBar/BottomBar"
import RoomContent from "./RoomContent/RoomContent"

const Room = () => {
    return (
        <div className="w-3/4 h-3/4  bg-gray-500 text-white flex flex-col justify-between">
          
            <RoomContent></RoomContent>
           
            <BottomBar></BottomBar>
        </div>

    )
}
export default Room
