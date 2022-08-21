const e = require("express")
const Games = require("../models/Games")

const Rooms = require("../models/Rooms")

const draw_initial_cards = () => {}


const set_player_finish = (user_name, game_name) => {

    let game = Games.get_game_by_name(game_name)

    let player_data = game[user_name]

    if (player_data !== undefined) {

        player_data.done = true


        let other_user_name = game.serve_order.find(user => user !== user_name)

        if (game[other_user_name].done === true) {

            return {success: true, both_done: true, new_game: Games.get_public_game_by_name(game_name)}
        } else {

            return {success: true, both_done: false, new_game: Games.get_public_game_by_name(game_name)}

        }

    }


}


const deal_card_to_player = (game, player_name, socket_io) => {

    let game_name = game.game_name

    if (game.dealer_pack.length > 0) {

        let new_card = game.dealer_pack.pop()

        game[player_name].cards.push(new_card)

        socket_io.to(game_name).emit("game-log", {
                msg: `${player_name} has received: ${
                new_card.name
            } of ${
                new_card.type
            }`
        })

        socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))


        let value_response = calculate_best_value_of_pack(game[player_name].cards)


        const best_value = value_response.best_value



        if (best_value === 21) {
            socket_io.to(game_name).emit("game-log", {
                    msg: `${player_name} has scored a Blackjack! He wins ${
                    game[player_name].current_bet
                }`
            })

            game[player_name].won_blackjack=true
            game[player_name].funds = game[player_name].funds + game[player_name].current_bet
            game[player_name].current_bet = 0
            game[player_name].done = true
            socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))

        }

        if (best_value > 21) {


            socket_io.to(game_name).emit("game-log", {
                    msg: `${player_name} has busted! He loses ${
                    game[player_name].current_bet
                }`
            })

            game[player_name].funds = game[player_name].funds - game[player_name].current_bet
            game[player_name].current_bet = 0
            game[player_name].done = true
            socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))

            return {busted: true, blackjack: false}
        }

        return {busted: false, blackjack: false}

    } else {

        game.game_ended = true

        socket_io.to(game_name).emit("game-log", {msg: `The dealer ran out of cards, the game ended!`})

        let all_players = game.serve_order

        all_players.forEach(player=>{
            game[player].done=true
        })

        socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))

        delete_game(game_name)


    }

}

const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));


const calculate_best_value_of_pack = (pack) => {

    let pack_values_array = []


    if (pack.length > 1) {

        pack.forEach(card => {
            pack_values_array.push([card.value_one, card.value_two])
        });


        let all_possible_combinations = cartesian.apply(null, pack_values_array)

        let best_diff = 1000
        let best_value = 1000

        all_possible_combinations.forEach(combination => {

            let combination_sum = combination.reduce((total, current) => {
                return total += parseInt(current)
            }, 0)

            if (combination_sum <= 21 && (Math.abs(21 - combination_sum) < best_diff)) {
                best_diff = Math.abs(21 - combination_sum)
                best_value = combination_sum
            }
        })

        return {
            best_value,
            overflow: best_value > 21 ? true : false
        }
    } else {
        return {best_value: pack[0].value_one, overflow: false}
    }


}


const update_winings = (game, socket_io) => {}


const deal_card_to_dealer = (game, socket_io, secret) => {

    let game_name = game.game_name

    if (game.dealer_pack.length > 0) {


        let new_card = game.dealer_pack.pop()


        if (!secret) {

            socket_io.to(game_name).emit("game-log", {
                    msg: `The dealer has drawn: ${
                    new_card.name
                } of ${
                    new_card.type
                }`
            })
        } else {

            new_card.hidden = true
            socket_io.to(game_name).emit("game-log", {msg: `The dealer has drawn a secret card!`})

        }
        game.dealer_cards.push(new_card)


        socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))


        let total_response = calculate_best_value_of_pack(game.dealer_cards)


        if (total_response.overflow) {


            socket_io.to(game_name).emit("game-log", {msg: `The dealer has busted!`})

            socket_io.to(game_name).emit("game-log", {msg: `All players win their bet!`})


            update_winings(game, socket_io)

            return {busted: true}


        }

        return {busted: false}


    } else {

        game.game_ended = true

        socket_io.to(game_name).emit("game-log", {msg: `The dealer ran out of cards, the game ended!`})

        let all_players = game.serve_order

        all_players.forEach(player=>game[player].done=true)

        socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))

        delete_game(game_name)


    }


}


const switch_to_deal = (game_name, socket_io) => {


    let game = Games.get_game_by_name(game_name)

    let current_state = game.state

    if (current_state === "bet") {
        game.state = "deal"
    }

    socket_io.to(game_name).emit("game-log", {msg: `The dealer is dealing the initial cards...`})

    socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))


    let serve_order = game.serve_order

    let resp = null
    for (let i = 0; i < 2; i++) {

        for (let j = 0; j < 2; j++) {
            if (! game.game_ended) 

                resp = deal_card_to_player(game, serve_order[j], socket_io)

            

            if (resp.busted) {
                return
            }
        }

    }

    let all_users = game.serve_order

    all_users.forEach(user => {
        if (game[user].current_bet === 0) {
            game[user].done = true
        }
    })

    socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))


    if (! game.game_ended) 
        resp = deal_card_to_dealer(game, socket_io, false)


    


    if (!resp.busted) 
        if (! game.game_ended) 
            deal_card_to_dealer(game, socket_io, true)


        
    


    if (! game.game_ended) 
        switch_to_hit(game_name, socket_io)


    


}

const handle_player_hit = (game_name, player_name, socket_io) => {

    socket_io.to(game_name).emit("game-log", {msg: `${player_name} hit!`})

    let game = Games.get_game_by_name(game_name)

    let resp = deal_card_to_player(game, player_name, socket_io)

    if (! game.game_ended) {
        let all_players = game.serve_order
        let all_finished = true
        let all_busted = true
        all_players.forEach(player => {
            if (game[player].done === false) {
                all_finished = false
            }
            if (game[player].current_bet !== 0 ) {
                all_busted = false
            }

            if(game[player].won_blackjack){
                all_busted = false
            }

        })
        if (all_finished && ! all_busted) {

            setTimeout(() => {
                switch_to_dealer_hit(game_name, socket_io)
            }, 2000);

        } else if (all_busted) {
            socket_io.to(game_name).emit("game-log", {msg: `Both players busted, the round ends!`})

            setTimeout(() => {
                switch_to_bet(game_name, socket_io)
            }, 5000);
        }
    }


}

const delete_game = (game_name)=>{

    Games.delete_game_by_name(game_name)

    let room = Rooms.get_room_by_name(game_name)

    console.log("Rooom here",room)

}



const switch_to_dealer_hit = (game_name, socket_io) => {
    let game = Games.get_game_by_name(game_name)

    game.state = "dealer_hit"

    game.dealer_cards[1].hidden = false

    socket_io.to(game_name).emit("game-log", {msg: `The dealer is revealing the hidden card!`})

    socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))


    socket_io.to(game_name).emit("game-log", {
            msg: `The hidden card was: ${
            game.dealer_cards[1].name
        } of ${
            game.dealer_cards[1].type
        }`
    })


    let dealer_pack_value = calculate_best_value_of_pack(game.dealer_cards)

    while(dealer_pack_value.best_value<17){

        if(!game.game_ended){

        socket_io.to(game_name).emit("game-log", {
            msg:`The dealers card add up to a value of ${dealer_pack_value.best_value}, he must draw another card! `
        })

        deal_card_to_dealer(game,socket_io,false)

        socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))
        dealer_pack_value = calculate_best_value_of_pack(game.dealer_cards)


    }
    else{
        break
    }

    }


    if(!game.game_ended){

        if(dealer_pack_value.best_value>21){
            socket_io.to(game_name).emit("game-log", {
                msg:`The dealar busted! `
            })
        }else
        socket_io.to(game_name).emit("game-log", {
            msg:`The dealars cards add up to a value of ${dealer_pack_value.best_value} `
        })

        let all_players = game.serve_order

        all_players.forEach(player=>{
            if(game[player].current_bet!==0){

                if(dealer_pack_value.best_value<=21){



                let player_card_value = calculate_best_value_of_pack(game[player].cards)

                if(player_card_value.best_value>dealer_pack_value.best_value && dealer_pack_value.best_value!==1000){
                    socket_io.to(game_name).emit("game-log", {
                        msg:`${player} cards add up to a value of ${player_card_value.best_value}, he won his bet! `
                    })
                    game[player].funds+=game[player].current_bet
                    game[player].current_bet=0

                }
                else
                if(player_card_value.best_value===dealer_pack_value.best_value){
                    socket_io.to(game_name).emit("game-log", {
                        msg:`${player} cards add up to a value of ${player_card_value.best_value}, it's a draw! `
                    })
                    game[player].current_bet=0
                }
                else{
                    socket_io.to(game_name).emit("game-log", {
                        msg:`${player} cards add up to a value of ${player_card_value.best_value}, he lost his bet!`
                    })
                    game[player].funds-=game[player].current_bet
                    game[player].current_bet=0


                }
            }
            else{
                 socket_io.to(game_name).emit("game-log", {
                    msg:`${player} won his bet!  `
                })

                game[player].funds+=game[player].current_bet
                game[player].current_bet=0

            }


            }
        })
        socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))

        setTimeout( () =>{
            socket_io.to(game_name).emit("game-log", {
                msg:`The next round will begin in 10 seconds! `
            })
            setTimeout(() => {
                switch_to_bet(game_name,socket_io)
            }, (10000));
    
        },2000)

    }


}


const switch_to_bet = (game_name, socket_io) => {

    let game = Games.get_game_by_name(game_name)
    let users = game.serve_order


    //users have enough funds
    let all_have_funds=true

    let there_are_enough_cards = game.dealer_pack.length>=6

    users.forEach(user=>{

        if(game[user].funds===0)
         all_have_funds=false

    })




    if(there_are_enough_cards && all_have_funds){


    socket_io.to(game_name).emit("game-log", {
        msg:`Round started! `
    })


    game.state = "bet"

    game.dealer_cards = []

    users.forEach(user => {
        game[user].won_blackjack=false
        game[user].cards = []
        game[user].done = false
        game[user].current_bet = 0
    })

    socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))
    }
    else{

        game.game_ended = true
        
        if(!there_are_enough_cards)
        socket_io.to(game_name).emit("game-log", {msg: `The dealer ran out of cards, the game ended!`})

        if(!all_have_funds){

            users.forEach(user=>{

                if(game[user].funds===0)
                socket_io.to(game_name).emit("game-log", {msg: `${user} ran out of funds, the game ended!`})

                game[user].done=true
        
            })

        }


        socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))

        delete_game(game_name)

        

    }



}


const switch_to_hit = (game_name, socket_io) => {

    let game = Games.get_game_by_name(game_name)
     
    let players = game.serve_order

    let all_zero=true

    players.forEach(player => {
        if(game[player].current_bet!==0){
         game[player].done = false
         all_zero=false}
    })

    if(all_zero===true){
        socket_io.to(game_name).emit("game-log", {msg: `Both players scored a blackjack!`})
        socket_io.to(game_name).emit("game-log", {msg: `All players win their bet!`})

        setTimeout( () =>{

            socket_io.to(game_name).emit("game-log", {
                msg:`The next round will begin in 10 seconds! `
            })
            setTimeout(() => {

                switch_to_bet(game_name,socket_io)
                
            }, 10000);

        },5000)

    }
    else{

    socket_io.to(game_name).emit("game-log", {msg: `Players can now hit!`})

    game.state = "hit"

    socket_io.to(game_name).emit("game-update", Games.get_public_game_by_name(game_name))
    }
}


const switch_state = (game_name, socket_io) => {
    let game = Games.get_game_by_name(game_name)

    let current_state = game.state

    let next_state = Games.get_next_state_map()[current_state]

    let response = null


    switch (next_state) {
        case "deal": response = switch_to_deal(game_name, socket_io)
            break;
        case "hit": response = switch_to_hit(game_name, socket_io)
            break;
        case "dealer_hit": response = switch_to_dealer_hit(game_name, socket_io)
            break;
        case "bet": response = switch_to_bet(game_name, socket_io)
            break;
        default:
            // code block
    }


}


const set_bet = (username, game_name, bet_value) => {

    let game = Games.get_game_by_name(game_name)

    if (game.state === "bet") {

        let player_data = game[username]

        if (player_data !== undefined) {

            if (player_data.funds >= bet_value) {
                player_data.current_bet = bet_value


                return {success: true, msg: "Bet was set", new_game: Games.get_public_game_by_name(game_name)}
            }
        }
    }
}


module.exports = {
    set_bet,
    set_player_finish,
    switch_state,
    handle_player_hit
}
