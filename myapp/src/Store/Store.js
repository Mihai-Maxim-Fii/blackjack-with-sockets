import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { combineReducers } from "redux";

import bar_reducer from "./Reducers/BarReducer";
import username_reducer from "./Reducers/UserReducer"
import selected_room_reducer from "./Reducers/SelectedRoomReducer";
import rooms_reducer from "./Reducers/RoomsReducer";
import game_reducer from "./Reducers/GameReducer";
import end_screen_reducer from "./Reducers/EndScreenReducer";


const Store = configureStore({
    reducer:{
        bar_reducer,
        username_reducer,
        selected_room_reducer,
        rooms_reducer,
        game_reducer,
        end_screen_reducer
    },
    middleware:[thunk]
})

export default Store