import requests from "./api.js";

const AuthServices = {
 login: async (formData) => {
    return requests.post(`/login`, formData);
  },
   logout: async () => {
    return requests.post(`/logout`);
  },
}
export default AuthServices;
