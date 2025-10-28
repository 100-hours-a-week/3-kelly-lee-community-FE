import { multipartApi } from "/api/api.js";

const baseImageUrl = "http://localhost:8080/images";

export const imageApi = {

    postImage: (data) =>{
        return multipartApi(`${baseImageUrl}`, {
        method: "POST",
        body: data});
    }
};