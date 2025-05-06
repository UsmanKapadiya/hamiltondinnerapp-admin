import requests from "./api.js";

const MenuServices = {
  getMenuList: async ({ currentPage, perPageRecords }) => {
    return requests.get(`/menus?pagesize=${perPageRecords}&pagenumber=${currentPage}`);
  },
  createMenu: async (formData) => {
    return requests.customPost(`/menus`, formData);
  },
  updateMenus: async (id, formData) => {
    console.log(id)
    return requests.put(`/menus/${id}`, formData);
  },
  deleteMenus: async (id) => {
    return requests.delete(`/menus/${id}`);
  },
  bulkdeleteMenus: async (data) => {
    // console.log("body", data);
    return requests.delete(`/menus/bulk-delete`, { data });
  }
  // getMediaList: async(body) =>{
  //   return requests.post("/media/list", body);
  // },
  // deleteMedia:async(id) =>{
  //   return requests.get(`/media/${id}/delete`);
  // }
}
export default MenuServices;
