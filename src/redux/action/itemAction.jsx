export const setItemList = (data) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "SET_ITEM_LIST",
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
    }
}