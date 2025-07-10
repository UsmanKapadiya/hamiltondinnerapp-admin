import requests from "./api.js";

const ReportServices = {
  getReportList: async (date) => {
    return requests.get(`/reports?search_date=${date}`);
  }
}
export default ReportServices;
