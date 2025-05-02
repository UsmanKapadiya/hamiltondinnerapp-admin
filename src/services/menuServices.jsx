import requests from "./api.js";

const MenuServices = {
   getMenuList:  async ({ currentPage, perPageRecords }) => {
        return requests.get(`/menus?pagesize=${perPageRecords}&pagenumber=${currentPage}`);
      },
    // getMediaList: async(body) =>{
    //   return requests.post("/media/list", body);
    // },
    // deleteMedia:async(id) =>{
    //   return requests.get(`/media/${id}/delete`);
    // }
}
export default MenuServices;
