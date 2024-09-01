import axios from "axios";
import { logger } from "../../_utils/logger";

export const raydium = axios.create({
  baseURL: "https://api-v3.raydium.io",
});

export const getPrice = async (mint: string) => {
  try {
    const { data } = await raydium.get("/mint/price", {
      params: { mints: mint },
    });
    return data;
  } catch (err) {
    logger.error(err);
    throw new Error("Failed get price");
  }
};

// INFO: At the moment - logger
// but you can handle errors, calculate timeout, if it is large, then replace the request url with another api, etc.
// Request
raydium.interceptors.request.use(
  function (config) {
    // logger.info(config);
    return config;
  },
  function (error) {
    // logger.error(error);
    return Promise.reject(error);
  },
);

// Response
raydium.interceptors.response.use(
  function (response) {
    // logger.info(response);
    return response;
  },
  function (error) {
    // logger.error(error);
    return Promise.reject(error);
  },
);
