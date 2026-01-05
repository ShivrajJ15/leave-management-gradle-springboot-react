import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/policies';

const getAllPolicies = () => {
  return axios.get(API_URL);
};

const createPolicy = (policyData) => {
  return axios.post(API_URL, policyData);
};

const updatePolicy = (type, policyData) => {
  return axios.put(`${API_URL}/${type}`, policyData);
};

export default {
  getAllPolicies,
  createPolicy,
  updatePolicy
};