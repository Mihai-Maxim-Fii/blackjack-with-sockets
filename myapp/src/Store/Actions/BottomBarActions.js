

const login_user = (username) =>{
    return (dispatch, getState)=>{

        dispatch({
            type:"LOGIN_USER",
            payload:{
                username,
                logged:true
            }
        })

        dispatch({
            type:"IN_BROWSE",
            payload:null
        })

    }
}

const logout_user = (username)=>{
    return (dispatch, getState)=>{
        console.log(username)

        dispatch({
            type:"LOGOUT_USER",
            payload:null
        })

        dispatch({
            type:"IN_LOGIN",
            payload:null
        })

    }
}


export default {login_user,logout_user}