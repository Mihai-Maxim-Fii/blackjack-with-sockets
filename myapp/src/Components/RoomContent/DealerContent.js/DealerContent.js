import Cards from "../Cards/Cards"
import { useSelector } from "react-redux"
const DealerContent = (props) =>{
    
    let in_bet = props.state==="bet"?true:false

    let in_deal = props.state==="deal"?true:false

    let in_hit = props.state==="hit"?true:false

    let in_dealer_hit = props.state==="dealer_hit"?true:false

    const game_state = useSelector(state=>state.game_reducer.game)
    const user_name = useSelector(state => state.username_reducer.username)

    let is_finished = game_state[user_name].done

    return (<div className=" w-full h-full flex flex-col justify-center items-center ">

        {in_bet&&<div className=" italic  flex gap-2  font-thin  " style={{
            fontSize:"1.25rem"
        }}>
            <p>
            The dealer is waiting for bets...
            </p>
             
            </div>}

        {(in_deal&&props.dealer_cards.length===0)&&
            <p>
                The dealer is serving the initial cards to the players...
            </p>
        }

        {
          ((in_deal||in_hit|| in_dealer_hit)&&props.dealer_cards.length!==0)&&

          <Cards cards={props.dealer_cards}>

          </Cards>
        }
    
    </div>)
}

export default DealerContent