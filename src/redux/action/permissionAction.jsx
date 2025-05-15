export const setPermissionList = (data) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "SET_PERMISSION_LIST",
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
    }
}