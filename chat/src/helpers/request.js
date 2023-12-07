
import axios from "axios";
import { setAllUsers, setLogin } from "../redux/actions/auth";


export const baseUrl = "http://localhost:4200/";
export const authenticate = async (requestData) => {

    var response = await axios({
        method: 'POST',
        data: requestData.data,
        url: `${baseUrl}users/authenticate`,

    })

    let data = response.data;
    requestData.dispatch(setLogin(data.data))

    return data


    console.log("response in login", response)
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

    var response = await axios({
        method: 'GET',
        // data : requestData.data,
        url: `${baseUrl}conversation/getByUser?id=${requestData._id}`,
        headers: {
            "Content-Type": "application/json",
            // "Authorization": "Bearer " + user.token,
        }

    })

    let data = response.data;
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
    console.log('requestData',requestData);
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
    console.log('requestData',requestData);
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

