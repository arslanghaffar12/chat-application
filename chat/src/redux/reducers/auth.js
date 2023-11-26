// import { enums, storage } from '../../helpers/common';
// import { menu } from '../../helpers/meta';
// import { dataPoints } from '../../helpers/meta';

import { actionTypes } from "../constants/action-types";

console.log('actionTypes==', actionTypes);

const getParsed = (key, _default = null) => {
    var value = JSON.parse(localStorage.getItem(key));
    if (value == undefined || value == null) {
        value = _default;
    }
    return value;
}
const defaultUser = { login: false, token: "" };
var user = getParsed('user', defaultUser);


const initialState = {
    user: user,
};


export const authreducer = (state = initialState, { type, payload = {} }) => {
    console.log('payload', type, payload);
    switch (type) {
        case actionTypes.LOGIN:
            let user = payload;
            // user.login = true;

            user.login = true;
            localStorage.setItem('user', JSON.stringify(user));
            console.log('payload in user', payload);
            return { ...state, user: payload };
        case actionTypes.LOGOUT:
            return { ...state, user: defaultUser };
        default:
            return state;
    }
}

