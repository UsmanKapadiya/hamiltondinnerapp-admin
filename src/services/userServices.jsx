import requests from "./api.js";

const UserServices = {
  // ITEMS API's
  getUserList: async () => {
    return requests.get(`/users`);
  },
  getItemsDetails: async (id) => {
    return requests.get(`/user-details/${id}`);
  },
  createItems: async (formData) => {
    return requests.post(`/user-details`, formData);
  },
  updatetItems: async (id, formData) => {
    return requests.put(`/user-details/${id}`, formData);
  },
  deleteItems: async (id) => {
    return requests.delete(`/user-details/${id}`);
  },
  bulkdeleteItems: async (data) => {
    return requests.delete(`/user-details/bulk-delete`, { data });
  },


  // OPTIONS API's
  getOptionList: async () => {
    return requests.get(`/user-options`);
  },
  getOptionDetails: async (id) => {
    return requests.get(`/user-options/${id}`);
  },
  createOptionsDetails: async (formData) => {
    return requests.post(`/user-options`, formData);
  },
  updatetOptionsDetails: async (id, formData) => {
    return requests.put(`/user-options/${id}`, formData);
  },
  deleteOptions: async (id) => {
    return requests.delete(`/user-options/${id}`);
  },
  bulkdeleteOptions: async (data) => {
    return requests.delete(`/user-options/bulk-delete`, { data });
  },


  //Preference API's
  getPreferencesList: async () => {
    return requests.get(`/user-preferences`);
  },
  getPreferencesDetails: async (id) => {
    return requests.get(`/user-preferences/${id}`);
  },
  createPreferencesDetails: async (formData) => {
    return requests.post(`/user-preferences`, formData);
  },
  updatetPreferencesDetails: async (id, formData) => {
    return requests.put(`/user-preferences/${id}`, formData);
  },
  deletePreferences: async (id) => {
    return requests.delete(`/user-preferences/${id}`);
  },
  bulkdeletePreferences: async (data) => {
    return requests.delete(`/user-preferences/bulk-delete`, { data });
  },


  // getMediaList: async(body) =>{
  //   return requests.post("/media/list", body);
  // },
  // deleteMedia:async(id) =>{
  //   return requests.get(`/media/${id}/delete`);
  // }
}
export default UserServices;
