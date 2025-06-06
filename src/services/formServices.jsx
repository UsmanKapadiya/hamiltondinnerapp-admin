import requests from "./api.js";

const FormServices = {
  // Forms API's
  getFormList: async () => {
    return requests.get(`/form-types`);
  },
  getFormDetails: async (id) => {
    return requests.get(`/form-types/${id}`);
  },
  createFormsDetails: async (formData) => {
    return requests.post(`/form-types`, formData);
  },
  updatetFormsDetails: async (id, formData) => {
    return requests.put(`/form-types/${id}`, formData);
  },
  deleteForms: async (id) => {
    return requests.delete(`/form-types/${id}`);
  },
  bulkdeleteForms: async (data) => {
    return requests.delete(`/form-types/bulk-delete`, data );
  },
}
export default FormServices;
