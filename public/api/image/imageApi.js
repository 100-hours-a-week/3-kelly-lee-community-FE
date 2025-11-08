import { multipartApi } from "/api/api.js";

const baseUrl = window.__CONFIG__.API_BASE_URL;
const baseImageUrl = baseUrl+"/images";

export const imageApi = {

    postImage: (data) =>{
        return multipartApi(`${baseImageUrl}`, {
        method: "POST",
        body: data});
    }
};