import { useSelector } from "react-redux"
import GameBar from "./GameBar"
import OurContent from "../UserContent/OurContent"
import SecondPlayerContent from "../UserContent/SecondPlayerContent"
import DealerContent from "../DealerContent.js/DealerContent"


const GameContent = () =>{
    const our_username = useSelector(state=>state.username_reducer.username)

    const game_state = useSelector(state=>state.game_reducer.game)
    
    const player_two_username = game_state.serve_order.filter(name=>name!==our_username)[0]


    
    return (
    <div className="w-full h-full  grid col-span-9 " style={{
        gridTemplateRows:" repeat(11, minmax(0, 1fr))"
    }}>
        <div className="w-full row-span-4 bg-green-800   ">
        <SecondPlayerContent player_content={game_state[player_two_username]}>

        </SecondPlayerContent>
        
        </div>

        <div className="w-full row-span-3  bg-orange-300"> 
        <DealerContent  dealer_cards={game_state.dealer_cards} state={game_state.state}>

        </DealerContent>

        </div>

        <div className="w-full row-span-4 bg-green-800 flex flex-col justify-between">
        
            
            <OurContent player_content={{...game_state[our_username]}}>

            </OurContent>
    
        </div>
        <div className=" w-full row-span-1">
        <GameBar></GameBar>
        </div>
       
    </div>
    

    )
}

export default GameContent