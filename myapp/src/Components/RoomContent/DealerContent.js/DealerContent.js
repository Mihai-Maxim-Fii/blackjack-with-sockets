import Cards from "../Cards/Cards"
const DealerContent = (props) =>{
    
    let in_bet = props.state==="bet"?true:false

    let in_deal = props.state==="deal"?true:false

    let in_hit = props.state==="hit"?true:false

    let in_dealer_hit = props.state==="dealer_hit"?true:false

    return (<div className=" w-full h-full flex flex-col justify-center items-center ">

        {in_bet&&<div className="  text-lg ">
            <p>
            The dealer is waiting for bets...
            </p>
            <p>
            Place your bet and hit End Turn
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