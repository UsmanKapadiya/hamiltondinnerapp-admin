import requests from "./api.js";

const ReportServices = {
  getReportList: async (date) => {
    console.log(date)
    return requests.get(`/reports?search_date=${date}`);
  }
}
export default ReportServices;
