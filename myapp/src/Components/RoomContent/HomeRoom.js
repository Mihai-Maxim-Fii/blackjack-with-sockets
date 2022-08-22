import { useContext, useEffect, useState } from "react"
import { MySocketContext } from "../../Store/Context/SocketContext"
import useEmitWithResponse from "../../Hooks/useEmitWithResponse"
const HomeRoom = () => {


    return (
        <div className=" flex flex-col gap-4 px-6 py-8 h-full justify-between">
            <p>
            Welcome to Blackjack With Sockets!
            </p>
            <div className=" flex flex-col gap-2">
            
            <p>
                All user/room/game data will be lost if you refresh the page!
            </p>
            <p>
                You may only create one room per user!
            </p>
            </div>
            <p>
            Play Responsibly - Winners know when to stop!
            </p>
          
        </div>
    )
}

export default HomeRoom
