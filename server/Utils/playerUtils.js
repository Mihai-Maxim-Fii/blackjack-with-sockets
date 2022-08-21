

const init_player = (player_name, start_funds)=>{
    const player_object = {
        name:player_name,
        funds:start_funds,
        cards:[],
        cards_total:0,
        done:false,
        current_bet:0,
        won_blackjack:false
    }

    return player_object

}

module.exports = {init_player}