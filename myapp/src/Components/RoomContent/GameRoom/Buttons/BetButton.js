import { useState } from "react"
import BetSetter from "./BetSetter"

const BetButton = () =>{

    const [show_bet_setter, set_show_bet_setter] = useState(false)

    return <div className="w-full h-full ">
        
       <button onClick={()=>set_show_bet_setter(true)}  className="w-full h-full hover:bg-blue-400 flex justify-center items-center " >
          Bet

        </button>
        {show_bet_setter&&
        <BetSetter close={()=>set_show_bet_setter(false)}>

        </BetSetter>
        }
        </div>


}

export default BetButton