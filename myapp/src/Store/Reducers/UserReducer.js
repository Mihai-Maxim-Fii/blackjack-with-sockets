
const initial_state = {
    username:"",
    logged:false
}



const username_reducer = (state = initial_state, action)=>{

    if(action.type==="LOGIN_USER"){
        return {username:action.payload.username, logged:action.payload.logged}
    }
    
    if(action.type==="LOGOUT_USER"){
        return {username:"", logged:false}
    }

    return state


}


export default username_reducer