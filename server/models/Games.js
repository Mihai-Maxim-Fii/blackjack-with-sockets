const cardUtils = require("../Utils/cardUtils")
const playerUtils = require("../Utils/playerUtils")

let Games = []


const game_states = {
    bet: "bet",
    deal: "deal",
    hit: "hit",
    dealer_hit: "dealer_hit"
}


const next_state_map = {
    bet: "deal",
    deal: "hit",
    hit: "dealer_hit",
    dealer_hit: "bet"
}


const get_next_state_map = () => {
    return next_state_map
}


const get_games = () => {
    return Games
}


const get_game_by_name = (game_name) => {
    return Games.find(game => game.game_name === game_name)
}

const get_public_game_by_name = (game_name) => {

    let game = get_game_by_name(game_name)

    let hidden_cards = []

    game.dealer_cards.forEach(card => {
        if (card.hidden) {
            hidden_cards.push({name: "hidden", type: "hidden", value_one: -1, value_two: -1})
        } else {
            hidden_cards.push(card)
        }
    })

    return {
        ... game,
        dealer_pack: [],
        dealer_cards: hidden_cards
    }
}


const delete_game_by_name = (game_name) => {

    Games = Games.filter(game => game.game_name !== game_name)
}

const add_new_game_object = (game_name, owner_name, second_player_name) => {


    const new_game_object = {
        game_name,
        dealer_pack: cardUtils.get_new_shuffled_deck(),
        dealer_cards: [],
        state: game_states.bet,
        serve_order: [
            owner_name, second_player_name
        ],
        game_ended: false
    }
    new_game_object.serve_order.forEach(player => {
        new_game_object[player] = playerUtils.init_player(player, 1000)
    })


    Games.push(new_game_object)

}


module.exports = {
    add_new_game_object,
    get_games,
    get_public_game_by_name,
    get_game_by_name,
    get_next_state_map,
    delete_game_by_name
}
