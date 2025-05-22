import requests from "./api.js";

const ItemServices = {
  // ITEMS API's
  getItemList: async () => {
    return requests.get(`/item-details`);
  },
  getItemsDetails: async (id) => {
    return requests.get(`/item-details/${id}`);
  },
  createItems: async (formData) => {
    return requests.uploadPosts(`/item-details`, formData);
  },
  updatetItems: async (id, formData) => {
    return requests.uploadPut(`/item-details/${id}`, formData);
  },
  deleteItems: async (id) => {
    return requests.delete(`/item-details/${id}`);
  },
  bulkdeleteItems: async (data) => {
    return requests.delete(`/item-details/bulk-delete`, data);
  },


  // OPTIONS API's
  getOptionList: async () => {
    return requests.get(`/item-options`);
  },
  getOptionDetails: async (id) => {
    return requests.get(`/item-options/${id}`);
  },
  createOptionsDetails: async (formData) => {
    return requests.post(`/item-options`, formData);
  },
  updatetOptionsDetails: async (id, formData) => {
    return requests.put(`/item-options/${id}`, formData);
  },
  deleteOptions: async (id) => {
    return requests.delete(`/item-options/${id}`);
  },
  bulkdeleteOptions: async (data) => {
    return requests.delete(`/item-options/bulk-delete`, data );
  },


  //Preference API's
  getPreferencesList: async () => {
    return requests.get(`/item-preferences`);
  },
  getPreferencesDetails: async (id) => {
    return requests.get(`/item-preferences/${id}`);
  },
  createPreferencesDetails: async (formData) => {
    return requests.post(`/item-preferences`, formData);
  },
  updatetPreferencesDetails: async (id, formData) => {
    return requests.put(`/item-preferences/${id}`, formData);
  },
  deletePreferences: async (id) => {
    return requests.delete(`/item-preferences/${id}`);
  },
  bulkdeletePreferences: async (data) => {
    return requests.delete(`/item-preferences/bulk-delete`,  data );
  },


  // getMediaList: async(body) =>{
  //   return requests.post("/media/list", body);
  // },
  // deleteMedia:async(id) =>{
  //   return requests.get(`/media/${id}/delete`);
  // }
}
export default ItemServices;
