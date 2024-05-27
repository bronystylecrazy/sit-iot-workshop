import { Api } from "./api/server.ts/Api";

export const httpClient = new Api({
  baseUrl: "/api",
});
