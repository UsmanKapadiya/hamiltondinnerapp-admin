import requests from "./api.js";

const ReportServices = {
  getReportList: async (date) => {
    return requests.get(`/reports?search_date=${date}`);
  },
  getMultipleDateReportList: async (startDate,endDate) => {
    return requests.get(`/reports?start_date=${startDate}&end_date=${endDate}`);
  },

}
export default ReportServices;
