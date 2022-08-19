import { useContext, useState } from "react"
import { MySocketContext } from "../Store/Context/SocketContext"
const useEmitWithResponse = (emit_msg,  callback_function) =>{

    const socket_context = useContext(MySocketContext)
    
    const [isBusy, setIsBusy] = useState(false)
    const [isError, setIsError] = useState(false)


    const send_request = (data)=>{


        
    socket_context.on(emit_msg + "-response",(resp)=>{

        callback_function(resp)
        setIsBusy(false)

        socket_context.off(emit_msg + "-response")

    })

        setIsBusy(true)
        setIsError(false)

        try{

        socket_context.emit(emit_msg,data)

        }

        catch(error){
            setIsBusy(false)
            setIsError(true)
            socket_context.off(emit_msg+"-response")
        }


    }

    return {
        isBusy, isError, send_request
    }

    

}


export default useEmitWithResponse