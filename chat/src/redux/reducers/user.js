import { actionTypes } from "../constants/action-types"



const initialState = {
    users : []
}


export const userReducer = (state = initialState, {type, payload : payload = {}}) => {

    switch(type) {
        case actionTypes.ALL_USERS:
            return {...state, users : payload}
        default:
            return state
    }

}