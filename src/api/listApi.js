import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.REACT_APP_API_URL + "/lists/";

export function getLists() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}

export function getList(listId) {
  return fetch(baseUrl + listId)
    .then(handleResponse)
    .catch(handleError);
}

export function saveList(list) {
  return fetch(baseUrl + (list.id || ""), {
    method: list.id ? "PUT" : "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(list)
  })
    .then(handleResponse)
    .catch(handleError);
}

export function deleteList(listId) {
  return fetch(baseUrl + listId, { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}