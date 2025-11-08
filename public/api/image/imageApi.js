import { multipartApi } from "/api/api.js";
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.API_BASE_URL;
const baseImageUrl = baseUrl+"/images";

export const imageApi = {

    postImage: (data) =>{
        return multipartApi(`${baseImageUrl}`, {
        method: "POST",
        body: data});
    }
};