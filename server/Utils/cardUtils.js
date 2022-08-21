const types = {
    clubs: "clubs",
    hearts: "hearts",
    spades: "spades",
    diamonds: "diamonds"
  };
  
  const construct_pack_slice = (type) => {
    let pack_slice = [];
  
    let c_names = Object.keys(card_names);
    c_names.forEach((name) => {
      let new_card = Card(name, type);
      pack_slice.push(new_card);
    });
  
    return pack_slice;
  };
  
  const card_names = {
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    jack: 10,
    queen: 10,
    king: 10,
    ace: 11
  };
  
  function Card(name, type) {
    let n = name;
    let t = type;
    let v1 = card_names[name];
    let v2 = name === "ace" ? 1 : card_names[name];
    return {
      name: n,
      type: t,
      value_one: v1,
      value_two: v2,
      hidden:false
    };
  }
  
  const shuffle_array = (arr) => {
    arr.sort(() => Math.random() - 0.5);
  };
  
  const get_new_shuffled_deck = () => {
    let new_deck = [];
    Object.values(types).forEach((type) => {
      let new_slice = construct_pack_slice(type);
      new_deck = [...new_deck, ...new_slice];
    });

    shuffle_array(new_deck);
  
    return new_deck;
  };
  
  
  


  


  module.exports = {get_new_shuffled_deck}
  
  
  
  