
import axios from "axios";
import { setLogin } from "../redux/actions/auth";


const baseUrl = "http://localhost:4200/"
export const authenticate = async (requestData) => {

    var response = await axios({
        method : 'POST',
        data : requestData.data,
        url : `${baseUrl}users/authenticate`,
        
    })
    // .then(
    //     response => {
    //         console.log('login response', response);
    //     }
    // )
    // .catch(err => {
    //     console.log("login error",err);
    // })
    let data = response.data;
    requestData.dispatch(setLogin(data.data))

    return data


    console.log("response in login",response)
}