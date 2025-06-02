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
    return requests.uploadPosts(`/users`, formData);
  },
  updatetUser: async (id, formData) => {
    return requests.uploadPosts(`/users/${id}`, formData);
  },
  deleteUser: async (id) => {
    return requests.delete(`/users/${id}`);
  },
  bulkdeleteUser: async (data) => {
    return requests.delete(`/users/bulk-delete`, data );
  },

}
export default UserServices;
