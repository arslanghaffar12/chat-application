



import { actionTypes } from "../constants/action-types"



const initialState = {
    conversations: []
}


export const conversationReducer = (state = initialState, { type, payload: payload = {} }) => {

    switch (type) {
        case actionTypes.CONVERSATIONS_BY_USER:
            console.log('payload===',payload);
            return { ...state, conversations: payload.sort((a,b) => {return new Date(b.timestamp) - new Date(a.timestamp)}) }
        default:
            return state
    }

}