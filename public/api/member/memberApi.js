import { api } from "/api/api.js";

const baseMemberUrl = "http://localhost:8080/members";

export const memberApi = {
    signup: (data) =>
        api(baseMemberUrl, {
        method: "POST",
        body: JSON.stringify(data)}),
    
    nicknameValidation: (data) =>
        api(`${baseMemberUrl}/nickname-validation?nickname=${encodeURIComponent(data)}`, {
        method: "GET"}),

    emailValidation: (data) =>
        api(`${baseMemberUrl}/email-validation?email=${encodeURIComponent(data)}`, {
        method: "GET"}),

    getMemberProfile: (id) =>
        api(`${baseMemberUrl}/${encodeURIComponent(id)}/profile`, {
        method: "GET"}),

    patchMemberProfile: (id, data) =>
        api(`${baseMemberUrl}/${encodeURIComponent(id)}/profile`, {
        method: "PATCH",
        body: JSON.stringify(data)}),

    patchPassword: (id, data) =>
        api(`${baseMemberUrl}/${encodeURIComponent(id)}/password`, {
        method: "PATCH",
        body: JSON.stringify(data)}),

    withdrawal: (id) =>
        api(`${baseMemberUrl}/${encodeURIComponent(id)}`, {
        method: "PATCH"}),
};