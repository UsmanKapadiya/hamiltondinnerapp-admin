import requests from "./api.js";

const RoleServices = {
  getRoleList: async () => {
    return requests.get(`/roles`);
  },
  getRoleById: async (id) => {
    return requests.get(`/roles/${id}`);
  },
  deleteRole: async (id) => {
    return requests.delete(`/roles/${id}`);
  },
  bulkdeleteRole: async (data) => {
    return requests.delete(`/roles/bulk-delete`,  data );
  }
  // getRoomDetails: async (id) => {
  //   return requests.get(`/rooms/${id}`);
  // },
  // createRoomDetails: async (formData) => {
  //   return requests.post(`/rooms`, formData);
  // },
  // updateRoomDetails: async (id, formData) => {
  //   // console.log("FormData", formData)
  //   return requests.put(`/rooms/${id}`, formData);
  // },
  
}
export default RoleServices;
