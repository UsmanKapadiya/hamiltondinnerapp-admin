import requests from "./api.js";

const CategoryServices = {
  getCategoryList: async () => {
    return requests.get(`/categories`);
  },
  getCategoryDetails: async (id) => {
    return requests.get(`/categories/${id}`);
  },
  createCategoryDetails: async (formData) => {
    return requests.post(`/categories`, formData);
  },
  updateCategoryDetails: async (id, formData) => {
    // console.log("FormData", formData)
    return requests.put(`/categories/${id}`, formData);
  },
  deleteCategorys: async (id) => {
    return requests.delete(`/categories/${id}`);
  },
  bulkdeleteCategorys: async (data) => {
    // console.log("body", data);
    return requests.delete(`/categories/bulk-delete`, data);
  }
  // getCategoryDetails: async (id) => {
  //   return requests.get(`/categories/${id}`);
  // },
  // getMediaList: async(body) =>{
  //   return requests.post("/media/list", body);
  // },
  // deleteMedia:async(id) =>{
  //   return requests.get(`/media/${id}/delete`);
  // }
}
export default CategoryServices;
