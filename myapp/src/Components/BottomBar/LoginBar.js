import BottomBarActions from "../../Store/Actions/BottomBarActions"
import {useDispatch} from "react-redux"
import {useState} from "react"
import { useContext } from "react"
import {useReducer} from "react"
import useEmitWithResponse from "../../Hooks/useEmitWithResponse"
import { MySocketContext } from "../../Store/Context/SocketContext"

const LoginBar = () => {
    const dispatch_action = useDispatch()

    const validate_name_function = (name) => {
        return name.split("").length > 5
    }

    const socket_context = useContext(MySocketContext)

    const username_reducer = (state, action) => {
        if (action.type === "set_user") {
            return {
                name: action.payload.name,
                valid: validate_name_function(action.payload.name)
            }
        }
        return state
    }

    const {isBusy: is_login_request_busy, isError: is_login_request_error, send_request: send_login_request} = useEmitWithResponse("login", (resp) => {
        if (resp.ok === true) {
            dispatch_action(BottomBarActions.login_user(username.name))
        } else {
            alert("Username is already taken!")
        }
    })

    const [username, dispatch_username] = useReducer(username_reducer, {
        name: "",
        valid: false
    });

    return (<div className=" flex h-full items-center ">
        <div className=" flex h-full justify-center w-full items-center px-4 ">
            <div className=" flex gap-2 ">
                <label>Username:</label>
                <input type="text" placeholder=" min 6 characters..."
                    className={
                        ` h-8 px-2  bg-white text-black ${
                            username.valid ? "bg-green-500 text-white" : "bg-red-50"
                        }`
                    }
                    onChange={
                        (element) => dispatch_username({
                            type: "set_user",
                            payload: {
                                name: element.target.value
                            }
                        })
                }></input>
            </div>
        </div>
        <button className=" bg-orange-300 hover:bg-green-500 h-full w-full"
            onClick={
                () => {
                    if (username.valid) {
                        send_login_request(
                            {
                             name:username.name,
                             id: socket_context.id
                            }
                                           )
                    }
                    else{
                        alert("Username must be at least 6 characters long!")
                    }
                }
        }>
            Enter Lobby
        </button>
    </div>)
}

export default LoginBar
