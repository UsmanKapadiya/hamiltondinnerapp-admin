import requests from "./api.js";

const ReportServices = {
  getReportList: async (date) => {
    return requests.get(`/reports?search_date=${date}`);
  },
  getMultipleDateReportList: async (startDate, endDate) => {
    return requests.get(`/reports?start_date=${startDate}&end_date=${endDate}`);
  },
  getChargesReportList: async (date) => {
    return requests.post(`/temp-get-charges-report?date=${date}`);
  },
  getMultipleDateChargesReportList: async (startDate, endDate) => {
    return requests.post(`/temp-get-charges-report?start_date=${startDate}&end_date=${endDate}`);
  },
}
export default ReportServices;
