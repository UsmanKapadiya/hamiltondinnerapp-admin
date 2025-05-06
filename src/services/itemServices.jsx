import requests from "./api.js";

const ItemServices = {
  getItemList: async () => {
    return requests.get(`/item-details`);
  },
  getItemsDetails: async (id) => {
    return requests.get(`/item-details/${id}`);
  },
  // getMediaList: async(body) =>{
  //   return requests.post("/media/list", body);
  // },
  // deleteMedia:async(id) =>{
  //   return requests.get(`/media/${id}/delete`);
  // }
}
export default ItemServices;
