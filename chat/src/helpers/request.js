
import axios from "axios";
import { setAllUsers, setLogin } from "../redux/actions/auth";
import { setConversations } from "../redux/actions/chat";
import { storage } from "./common";


export const baseUrl = "http://localhost:4200/";

let defaultUser = { login: false }
var user = storage.getParsed('user', defaultUser);

console.log('user in request==', user);


export const authenticate = async (requestData) => {

    var payload;
    await axios({
        method: 'POST',
        data: requestData.data,
        url: `${baseUrl}users/authenticate`,

    }).then((res) => {
        payload = res.data
        console.log('response==', payload,res);
        user = payload.data;
        requestData.dispatch(setLogin(payload.data))

    }).catch(err => {
        // requestData.dispatch(setLogin(data.data))

    })


    return payload


}




export const usersRequest = async (requestData) => {

    var response = await axios({
        method: 'GET',
        // data : requestData.data,
        url: `${baseUrl}users`,
        headers: {
            "Content-Type": "application/json",
            // "Authorization": "Bearer " + user.token,
        }

    })

    let data = response.data;
    requestData.dispatch(setAllUsers(data.data))

    return data

}


export const getConservationByUser = async (requestData) => {

    console.log('user in getConservationByUser ===',user);

    var response = await axios({
        method: 'GET',
        // data : requestData.data,
        url: `${baseUrl}conversation/getByUser?id=${requestData._id}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user?.token,
        }

    })

    let data = response.data;
    if (data.status && 'data' in data) {
        requestData.dispatch(setConversations(data.data))

    }
    // requestData.dispatch(setAllUsers(data.data))

    return data

}


export const getConversationChunkById = async (requestData) => {

    var response = await axios({
        method: 'POST',
        data: requestData.data,
        url: `${baseUrl}conversation/getConversationChunkById`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user.token,
        }

    })

    let data = response.data;
    if (data.status && 'data' in data) {
        // requestData.dispatch(setConversations(data.data))

    }
    // requestData.dispatch(setAllUsers(data.data))

    return data

}




export const getChatByConversationId = async (requestData) => {

    var response = await axios({
        method: 'GET',
        // data : requestData.data,
        url: `${baseUrl}chat/getByConversationId?conservationId=${requestData.conservationId}`,
        headers: {
            "Content-Type": "application/json",
            // "Authorization": "Bearer " + user.token,
        }

    })

    let data = response.data;
    // requestData.dispatch(setAllUsers(data.data))

    return data

}


export const getByCvnIdsRequest = async (requestData) => {

    var response = await axios({
        method: 'POST',
        data: requestData.data,
        url: `${baseUrl}chat/getByCoversationIds`,
        headers: {
            "Content-Type": "application/json",
            // "Authorization": "Bearer " + user.token,
        }

    })

    let data = response.data;
    // requestData.dispatch(setAllUsers(data.data))

    return data

}

export const postMessageRequest = async (requestData) => {

    var response = await axios({
        method: 'POST',
        data: requestData.data,
        url: `${baseUrl}chat/insert`,
        headers: {
            "Content-Type": "application/json",
            // "Authorization": "Bearer " + user.token,
        }

    })

    let data = response.data;
    // requestData.dispatch(setAllUsers(data.data))

    return data

}



export const addUserRequest = async (requestData) => {

    var response = await axios({
        method: 'POST',
        data: requestData.data,
        url: `${baseUrl}users/create`,
        headers: {
            "Content-Type": "application/json",
            // "Authorization": "Bearer " + user.token,
        }

    })

    let data = response.data;
    // requestData.dispatch(setAllUsers(data.data))

    return data

}

export const deleteUserRequest = async (requestData) => {

    var response = await axios({
        method: 'DELETE',
        url: `${baseUrl}users/${requestData._id}`,
        headers: {
            "Content-Type": "application/json",
            // "Authorization": "Bearer " + user.token,
        }

    })

    let data = response.data;
    // requestData.dispatch(setAllUsers(data.data))

    return data

}

export const userUpdateRequest = async (requestData) => {

    var response = await axios({
        method: 'PUT',
        url: `${baseUrl}users/${requestData.params._id}`,
        data: requestData.data,
        headers: {
            "Content-Type": "application/json",
            // "Authorization": "Bearer " + user.token,
        }

    })

    let data = response.data;
    // requestData.dispatch(setAllUsers(data.data))

    return data

}

export const updatePassword = async (requestData) => {
    console.log('requestData', requestData);
    var response = await axios({
        method: 'put',
        data: requestData.data,
        url: `${baseUrl}users/updatePassword`,
        headers: {
            "Content-Type": "application/json",
            // "Authorization": "Bearer " + user.token,
        }

    })

    let data = response.data;
    // requestData.dispatch(setAllUsers(data.data))

    return data

}

export const conversationIdRequest = async (requestData) => {
    console.log('requestData', requestData);
    var response = await axios({
        method: 'POST',
        data: requestData.data,
        url: `${baseUrl}conversation/createIfNotExist`,
        headers: {
            "Content-Type": "application/json",
            // "Authorization": "Bearer " + user.token,
        }

    })

    let data = response.data;
    // requestData.dispatch(setAllUsers(data.data))

    return data

}


export const updateStatusByConversationId = async (requestData) => {
    console.log('requestData', requestData);
    var response = await axios({
        method: 'POST',
        data: requestData,
        url: `${baseUrl}chat/requestUpdate`,
        headers: {
            "Content-Type": "application/json",
            // "Authorization": "Bearer " + user.token,
        }

    })

    let data = response.data;
    // requestData.dispatch(setAllUsers(data.data))

    return data

}





