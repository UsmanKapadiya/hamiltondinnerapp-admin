import requests from "./api.js";

const UserServices = {
  // ITEMS API's
  getUserList: async () => {
    return requests.get(`/users`);
  },
  getUserDetails: async (id) => {
    return requests.get(`/users/${id}`);
  },
  createUser: async (formData) => {
    return requests.post(`/users`, formData);
  },
  updatetUser: async (id, formData) => {
    return requests.put(`/users/${id}`, formData);
  },
  deleteUser: async (id) => {
    return requests.delete(`/users/${id}`);
  },
  bulkdeleteUser: async (data) => {
    return requests.delete(`/users/bulk-delete`, data );
  },

}
export default UserServices;
