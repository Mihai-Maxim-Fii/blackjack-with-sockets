import {useEffect, useRef} from "react"
import {MySocketContext} from "../../../../Store/Context/SocketContext"
import {useContext} from "react"
import {useState} from "react"
import { useSelector } from "react-redux"

import ArrowDownIcon from "../../../svgs/DownArrow"
import ArrowUpShortIcon from "../../../svgs/UpArrow"
import { useDispatch } from "react-redux"
import RoomActions from "../../../../Store/Actions/RoomActions"

const Logs = () => {

    const socket_context = useContext(MySocketContext)

    const log_container_ref = useRef()

    const is_game_over = useSelector(state=>state.game_reducer.game.game_ended)

    const dispatch = useDispatch()


    useEffect(() => {
        socket_context.on("game-log", (data) => {
            set_game_logs(old => [
                ...old,
                data.msg
            ])
        })

        return() => {
            socket_context.off("game-log")
        }

    }, [])


    const [show_full_logs, set_show_full_logs] = useState(false)

    const [game_logs, set_game_logs] = useState([])


    useEffect( () =>{
        setTimeout( ()=>{
            try{
            if(log_container_ref.current!==null)
            log_container_ref.current.scrollTop = log_container_ref.current.scrollHeight
            }
            catch(err){

            }
        },100)
    },[game_logs])


    const handle_leave_game_on_game_over = ()=>{
        dispatch(RoomActions.leave_game_on_game_end())
    }

    return  <div className=" w-full h-full ">
    <div className=" relative w-full h-12 flex justify-center  px-4 items-center relative ">
        <div className="flex cursor-pointer absolute left-2 " onClick={()=>{
            
            if(show_full_logs===false){
                setTimeout( ()=>{
                    if(log_container_ref.current!==null)
                    log_container_ref.current.scrollTop = log_container_ref.current.scrollHeight
                },100)
            }

            set_show_full_logs(old=>!old)
            
            
            
            }}>

        {!show_full_logs?
        <ArrowDownIcon height={25} width={25}></ArrowDownIcon>:
        <ArrowUpShortIcon height={25} width={25}></ArrowUpShortIcon>
        }
        <p>Game Logs </p> 
       
        </div>
        
        {!show_full_logs&&<p>
            {game_logs[game_logs.length-1]}
            </p>}

         {is_game_over&&
        <button onClick={handle_leave_game_on_game_over} className=" absolute right-0 mr-2 ">
            Leave
        </button>
        }

    </div>
    {show_full_logs===true&&<div ref={log_container_ref} className="  w-full p-4  flex flex-col overflow-auto  gap-4 " style={{
        maxHeight:'10rem'
    }}>
            
            {
            
            game_logs.map((log, index) => {
                return <p key={index}>  {log} </p>
                })
                } 
              
        </div>
        }

  </div>
}

export default Logs
