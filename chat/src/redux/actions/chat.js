import { actionTypes } from "../constants/action-types"


export const setConversations = (payload) => {
    return {
        type: actionTypes.CONVERSATIONS_BY_USER,
        payload: payload
    }
}