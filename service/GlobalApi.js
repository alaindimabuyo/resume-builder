import axios from 'axios';
import { Delete } from 'lucide-react';

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + '/api/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
});

const CreateNewResume = (data) => axiosClient.post('/user-resume-builders', data);

const GetUserResumes = (userEmail) =>
  axiosClient.get('/user-resume-builders?filters[userEmail][$eq]=' + userEmail);

const UpdateResumeDetail = (id, data) => axiosClient.put('/user-resume-builders/' + id, data);

const GetResumeById = (id) => axiosClient.get('/user-resume-builders/' + id + '?populate=*');

const DeleteResumeById = (id) => axiosClient.delete('/user-resume-builders/' + id);

export default {
  CreateNewResume,
  GetUserResumes,
  UpdateResumeDetail,
  GetResumeById,
  DeleteResumeById,
};
