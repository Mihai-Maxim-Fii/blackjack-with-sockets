import ModalWrapper from "../../Utility/ModalWrapper"
import {useReducer, useRef} from "react"
import useEmitWithResponse from "../../../Hooks/useEmitWithResponse"
const NewRoom = (props) => {
    
    const button_ref = useRef()

    const validate_data = (type, data) => {
        if (type === "name" || type === "password") {
            return data.split("").length > 5
        }
        if (type === "description") {
            return data.split("").length > 9
        }

    }


    const room_data_reducer = (state, action) => {
        if (action.type === "set_room_name") {
            return {
                ...state,
                room_name: action.payload.name,
                valid_room_name: validate_data("name", action.payload.name)
            }
        }
        if (action.type === "set_password") {
            return {
                ...state,
                password: action.payload.password,
                password_valid: validate_data("password", action.payload.password)
            }
        }
        if (action.type === "set_room_description") {
            return {
                ...state,
                room_description: action.payload.description,
                valid_room_description: validate_data("description", action.payload.description)
            }
        }

        if (action.type === "set_has_password") {
            return {
                ...state,
                has_password: true
            }
        }
        return state
    }


    const [room_data, dispatch_room_data] = useReducer(room_data_reducer, {
        room_name: "",
        room_description: "",
        valid_room_name: false,
        valid_room_description: false,
        has_password: false,
        password: "",
        password_valid: false
    });


    const handle_new_room = () => {
        if (!room_data.has_password) {
            if (!(room_data.valid_room_name && room_data.valid_room_description)) {
                alert("Name must be at least 6 characters long! \nDescription must be at least 10 characters long!")
            } else {
                send_new_room_request({room_name: room_data.room_name, room_description: room_data.room_description, has_password: room_data.has_password, password: ""})
            }
        } else {

            if (!(room_data.valid_room_name && room_data.valid_room_description)) {
                alert("Name must be at least 6 characters long! \nDescription must be at least 10 characters long!")
                return false
            }

            if (!room_data.password_valid) {
                alert("Password must be at least 6 characters long!")
            } else {
                send_new_room_request({room_name: room_data.room_name, room_description: room_data.room_description, has_password: room_data.has_password, password: room_data.password})
            }

        }

    }


    const {isBusy: is_new_room_request_busy, isError: is_new_room_request_error, send_request: send_new_room_request} = useEmitWithResponse("new-room", (resp) => {
        if (resp.ok === true) {

            console.log("aici")
            props.close_room()
            button_ref.current.click()
            

        } else {

            alert(resp.msg)

        }
    })

    return (
        <ModalWrapper>
            <div className=" bg-white w-2/4 h-2/4 flex flex-col">
                <div className=" w-full h-10 bg-orange-300 flex justify-between items-center px-2">
                    <p className=" text-white">
                        New Room
                    </p>
                    <button className=" text-white" ref={button_ref}
                        onClick={
                            props.close_room()
                    }>
                        Close
                    </button>
                </div>
                <div className=" h-full w-full flex justify-center items-center ">
                    <div className=" w-3/4 h-5/6 bg-gray-500 text-white flex flex-col justify-center gap-5 relative">
                        <div className=" grid grid-cols-3 grid-rows-1 items-center    w-11/12">
                            <label className=" text-right px-2">
                                Name:
                            </label>
                            <input onChange={
                                    (element) => {
                                        dispatch_room_data({
                                            type: "set_room_name",
                                            payload: {
                                                name: element.target.value
                                            }
                                        })
                                    }
                                }
                                placeholder=" min 6 characters "
                                className={
                                    `${
                                        room_data.valid_room_name ? "bg-green-500" : "bg-orange-300"
                                    } w-full col-span-2 p-2 text-white `
                            }></input>
                    </div>
                    <div className=" grid grid-cols-3 w-11/12"
                        style={
                            {height: "40%"}
                    }>
                        <label className=" text-right px-2">
                            Description:
                        </label>
                        <textarea onChange={
                                (element) => {
                                    dispatch_room_data({
                                        type: "set_room_description",
                                        payload: {
                                            description: element.target.value.toString()
                                        }
                                    })
                                }
                            }

                            placeholder=" min 10 characters"
                            className={
                                `${
                                    room_data.valid_room_description ? "bg-green-500" : "bg-orange-300"
                                } col-span-2  p-2  resize-none`
                            }
                            style={
                                {height: "100%"}
                        }></textarea>
                </div>
                {
                room_data.has_password ? <div className=" grid grid-cols-3 grid-rows-1 items-center w-11/12">
                    <label className=" text-right px-2 ">Password:</label>
                    <input onChange={
                            (element) => {
                                dispatch_room_data({
                                    type: "set_password",
                                    payload: {
                                        password: element.target.value
                                    }
                                })
                            }
                        }
                        type="text"
                        placeholder=" min 6 characters "
                        className={
                            `  p-2 col-span-2 text-white ${
                                !room_data.password_valid ? " bg-orange-300" : " bg-green-400"
                            } `
                    }></input>
            </div> : <div onClick={
                        () => dispatch_room_data({type: "set_has_password"})
                    }
                    className="  grid grid-cols-3 grid-rows-1 items-center w-11/12 ">
                    <button className="  w-fit col-start-2 col-span-2 p-2 bg-orange-300 px-4 hover:bg-green-500">Add Password</button>
                </div>
            } </div>

        </div>

        <div className=" h-10 bg-gray-500 p-4 w-full flex justify-center items-center text-white cursor-pointer hover:bg-green-500"   onClick={handle_new_room}>
            <button className=" "
              >
                Add Room
            </button>

        </div>
    </div>
</ModalWrapper>
    )
}

export default NewRoom
