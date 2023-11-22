// import { enums, storage } from '../../helpers/common';
// import { menu } from '../../helpers/meta';
// import { dataPoints } from '../../helpers/meta';

import { actionTypes } from "../constants/action-types";

console.log('actionTypes==',actionTypes);

const defaultUser = { login: false, token: "" };


const initialState = {
    user: defaultUser,
};


export const authreducer = (state = initialState, { type, payload = {} }) => {
    console.log('payload', type, payload);
    switch (type) {
        case actionTypes.LOGIN:
            // let user = payload;
            // user.login = true;
            console.log('payload in user',payload);
            return { ...state, user: payload };
        case actionTypes.LOGOUT:
            return { ...state, user: defaultUser };
        default:
            return state;
    }
}

