import requests from "./api.js";

const SettingServices = {
    getSettings: async () => {
        return requests.get(`/settings`);
    },
    createSettings: async (payload) => {
        return requests.post(`/settings`, payload);
    },
    updateSettings: async (payload) => {
        return requests.put(`/settings`, payload);
    },


}
export default SettingServices;
