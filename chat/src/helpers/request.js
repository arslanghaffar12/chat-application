
import axios from "axios";
import { setAllUsers, setLogin } from "../redux/actions/auth";


const baseUrl = "http://localhost:4200/"
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