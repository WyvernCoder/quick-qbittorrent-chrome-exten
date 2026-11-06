import { STORAGE_KEY, getOriginPattern, validateConfig } from "./lib/config.js";
import {
  QbtError,
  addTorrents,
  testConnection,
} from "./lib/qbt-api.js";

let operationQueue = Promise.resolve();

function enqueue(task) {
  const result = operationQueue.then(task, task);
  operationQueue = result.catch(() => {});
  return result;
}

async function loadConfig() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const config = stored?.[STORAGE_KEY];
  if (!config?.baseUrl || !config?.username || !config?.password) {
    throw new QbtError(
      "NOT_CONFIGURED",
      "qBittorrent is not configured yet.",
    );
  }
  return validateConfig(config);
}

async function getPublicState() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const config = stored?.[STORAGE_KEY];

  if (!config?.baseUrl) {
    return { configured: false, permissionGranted: false };
  }

  let permissionGranted = false;
  try {
    permissionGranted = await chrome.permissions.contains({
      origins: [getOriginPattern(config.baseUrl)],
    });
  } catch {
    permissionGranted = false;
  }

  return {
    configured: Boolean(config.username && config.password),
    permissionGranted,
    baseUrl: config.baseUrl,
    username: config.username,
    savedAt: config.savedAt ?? null,
  };
}

function serializeError(error) {
  if (error instanceof QbtError) {
    return {
      ok: false,
      code: error.code,
      error: error.message,
      params: error.details ?? {},
    };
  }
  console.error("[磁力快传] 未预期的错误", error);
  return {
    ok: false,
    code: error?.code || "UNKNOWN_ERROR",
    error: error?.message || "Unexpected error.",
    params: error?.params ?? {},
  };
}

async function handleMessage(message) {
  switch (message?.type) {
    case "qbt:getState":
      return { ok: true, state: await getPublicState() };

    case "qbt:testConnection":
      return {
        ok: true,
        result: await enqueue(() => testConnection(message.config)),
      };

    case "qbt:add":
      return {
        ok: true,
        result: await enqueue(async () => {
          const config = await loadConfig();
          return addTorrents(config, message.magnets);
        }),
      };

    default:
      return { ok: false, code: "UNKNOWN_MESSAGE", error: "Unknown request." };
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) {
    return false;
  }

  handleMessage(message)
    .then(sendResponse)
    .catch((error) => sendResponse(serializeError(error)));

  return true;
});
