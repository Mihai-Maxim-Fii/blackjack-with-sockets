
const InfoPannel = (props) =>{
    return (<>
    <div className="absolute left-0 top-0 ml-2 mt-2">
        <p>
            Funds: {props.funds}
        </p>
    </div>


    <div className="absolute left-0 bottom-0 ml-2 mb-2">
        <p>
            Current Bet: {props.current_bet}
        </p>
    </div>

    <div className="absolute right-0 top-0 mt-2 mr-2">
        <p>
            Player: {props.name}
        </p>
    </div>
   
    <div className="absolute right-0 bottom-0 mb-2 mr-2">
        <p>
            Finished: {`${props.done?"Yes":"No"}`}
        </p>
    </div>


    </>)
}

export default InfoPannel