
import {useSelector} from "react-redux"
import GameContent from "./GameContent"
import GameHeader from "./GameBar"
import { useEffect } from "react"
import { MySocketContext } from "../../../Store/Context/SocketContext"
import { useContext } from "react"
import GameBar from "./GameBar"
import { useDispatch } from "react-redux"
import  GameActions from "../../../Store/Actions/GameActions"
import Logs from "./Logs/Logs"
const GameContainer = () =>{



    return (
            <div className= "w-full h-full flex flex-col justify-center items-center" style={{
               
            }}>
                <div className="w-11/12 " style={{
                    backgroundColor:"#525252",
                    color:"white",
                    textAlign:"center"
                }}>
                 <Logs>

                 </Logs>
                </div>
                <div className="w-11/12 h-5/6  bg-gray-500 text-white flex flex-col justify-between" style={{
                    height:"80vh"
                }}>
                    <GameContent></GameContent>
                    
                </div>

            </div>
          
        )
}

export default GameContainer