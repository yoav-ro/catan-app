import { chatReducerActionTypes } from "../utils/actionTypes";

const initialState = {
    chatId: "none",
    messages: [],
}

export default function chatReducer(state = initialState, action) {
    switch (action.type) {
        case chatReducerActionTypes.newMsg:
            const newState = {
                chatId: action.data.chatId,
                messages: [...state.messages, action.data],
            }
            console.log(newState)
            return newState
        case chatReducerActionTypes.resetChat:
            return initialState;
        default:
            return state;
    }
}