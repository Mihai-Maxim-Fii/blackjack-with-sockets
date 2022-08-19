import { useRef } from "react"
import ModalWrapper from "../Utility/ModalWrapper"
import { useSelector } from "react-redux"
const RequirePassword = (props) =>{
    
    const password_ref = useRef()

    const room_name = useSelector(state=>state.selected_room_reducer.room)

     



    const join_room = () =>{

        props.join_method({
            room_name,
            password:password_ref.current.value
        })


    }

    

    return (<ModalWrapper>
        <div>
        <div className=" w-80 h-10 bg-orange-300 flex justify-between text-white items-center px-4">
            <p>
                Room: {props.room_name}
            </p>
            <button onClick={props.close_window()}>
                Close
            </button>
        </div>
        <div className=" bg-gray-300  w-80 h-40 rounded-b-md flex flex-col items-center justify-around">
          <div>
            <p className=" text-black">
                Enter Password:
            </p>
          </div>
          <input ref={password_ref} type="password" className=" px-4 py-2 ">
          </input>
          <button onClick={join_room}  className="text-white px-2 py-1 bg-orange-300 rounded-sm hover:bg-green-500">
            Join Room
          </button>
        </div>
        </div>
    </ModalWrapper>)
}

export default RequirePassword