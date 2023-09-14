const initialState = {
    user_info: {},
    isAuthenticated: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'login':
            console.log('>> Login', action.payload)
            return {
                ...state,
                isAuthenticated: true,
                user_info: action.payload
            }
        case 'logout':
            console.log('>> Logout')
            return {
                ...state,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};

export default reducer;