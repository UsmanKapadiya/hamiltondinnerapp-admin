import requests from "./api.js";

const CategoryServices = {
   getCategoryList:  async () => {
        return requests.get(`/categories`);
      },
    // getMediaList: async(body) =>{
    //   return requests.post("/media/list", body);
    // },
    // deleteMedia:async(id) =>{
    //   return requests.get(`/media/${id}/delete`);
    // }
}
export default CategoryServices;
