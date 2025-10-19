/* eslint-disable @typescript-eslint/no-explicit-any */
// Centralized auth/cookie handling for NIS/TNI requests
// Uses the same login flow that was previously in resolvers/index.ts

// Using require to align with existing dependency usage
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("request");
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

let cookies = "";

export const envUrl = process.env.PORTAL_BASE_URL;
const token = process.env.PORTAL_BASIC_TOKEN;
const doLogin = () => {
  const options = {
    method: "POST",
    url: `${envUrl}/api/tcs/v1/user-auth/login`,
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: `Basic ${token}`,
      "Content-Length": "0",
      Origin: envUrl,
      Referer: envUrl + '/',
    },
  };

  request(options, function (
    error: unknown,
    _response: unknown,
    body: string
  ) {
    if (error)
      throw new Error(
        typeof error === "object" && error && "message" in error
          ? String((error as any).message)
          : String(error)
      );
    const parsed = JSON.parse(body as unknown as string);
    console.log("**** Successfully loggedIn, setting cookies *****")
    cookies = `refreshToken=${parsed.data.refreshToken};accessToken=${parsed.data.accessToken};idToken=${parsed.data.idToken}`;
  });
};

// Kick off login at module load
doLogin();

export const getCommonHeaders = (operatorId: string): Record<string, string> => {
  return {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    "x-operator-context": operatorId,
    cookie: cookies,
  };
};


