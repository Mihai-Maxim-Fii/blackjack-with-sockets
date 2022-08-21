import { useState } from "react"
import { useSelector } from "react-redux"
import HitButton from "./Buttons/HitButton"
import FinishButton from "./Buttons/FinishButton"
import BetButton from "./Buttons/BetButton"
const GameBar = () => {

    
    const game_state = useSelector(state=>state.game_reducer.game)

    const user_name = useSelector(state => state.username_reducer.username)



    /*
        bet:"bet",
    deal:"deal",
    hit:"hit",
    dealer_hit:"dealer_hit"

    */

    let is_finished = game_state[user_name].done

    let in_bet = game_state.state==="bet"?true:false
    let in_deal = game_state.state==="deal"?true:false
    let in_hit = game_state.state==="hit"?true:false
    let in_dealer_hit = game_state.state==="dealer_hit"?true:false
    let game_ended = game_state.game_ended




    return !is_finished?<div className=" w-full h-12 flex items-center " style={{
        backgroundColor:"#525252"
    }}>

    {in_hit&&
     <HitButton>

     </HitButton>
     }

     {in_bet&&
     <BetButton>

     </BetButton>
     }

    <FinishButton>

    </FinishButton>

    </div>:<div className=" w-full h-12 flex items-center italic justify-center" style={{backgroundColor:"#525252"}} >{!game_ended?"Turn Ended":"Game ended"}</div>
}

export default GameBar