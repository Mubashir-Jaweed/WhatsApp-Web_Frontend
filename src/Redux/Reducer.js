const selectedChat = {
    user:"",
}
const Reducer = (state = selectedChat, action) =>{
    switch(action.type){
        case "selectUser" :
            return {...state, user: action.payload}

        default : return state    
    }
}

export default Reducer