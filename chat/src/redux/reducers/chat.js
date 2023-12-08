



import { actionTypes } from "../constants/action-types"



const initialState = {
    conversations: []
}


export const conversationReducer = (state = initialState, { type, payload: payload = {} }) => {

    switch (type) {
        case actionTypes.CONVERSATIONS_BY_USER:
            return { ...state, conversations: payload }
        default:
            return state
    }

}