import {
  MAX_MAGNETS,
  getOriginPattern,
  validateConfig,
} from "./config.js";

const REQUEST_TIMEOUT_MS = 15_000;

export class QbtError extends Error {
  constructor(code, message = code, details = {}) {
    super(message);
    this.name = "QbtError";
    this.code = code;
    this.details = details;
  }
}

function endpoint(baseUrl, path) {
  return `${baseUrl}/api/v2/${path}`;
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...options,
      credentials: "include",
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new QbtError("TIMEOUT", "The request timed out.");
    }
    throw new QbtError("NETWORK", "Could not reach qBittorrent.");
  } finally {
    clearTimeout(timer);
  }
}

async function login(config) {
  const response = await request(endpoint(config.baseUrl, "auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: config.username,
      password: config.password,
    }).toString(),
  });

  if (response.status === 403) {
    throw new QbtError(
      "AUTH_FORBIDDEN",
      "qBittorrent rejected the login request.",
    );
  }

  const text = (await response.text()).trim();

  if (!response.ok) {
    throw new QbtError(
      "LOGIN_HTTP_ERROR",
      "qBittorrent login failed.",
      { status: response.status },
    );
  }

  if (text === "Fails.") {
    throw new QbtError(
      "INVALID_CREDENTIALS",
      "Incorrect username or password.",
    );
  }

  if (text !== "Ok." && text !== "") {
    throw new QbtError(
      "UNEXPECTED_LOGIN_RESPONSE",
      "The login endpoint returned an unexpected response.",
    );
  }
}

async function logout(baseUrl) {
  try {
    await request(endpoint(baseUrl, "auth/logout"), {
      method: "POST",
    });
  } catch {
    // Logging out is best-effort and must not hide the real operation result.
  }
}

async function getVersion(baseUrl) {
  const response = await request(endpoint(baseUrl, "app/version"), {
    method: "GET",
  });

  if (response.status === 401 || response.status === 403) {
    throw new QbtError(
      "SESSION_NOT_ESTABLISHED",
      "The authenticated session was not established.",
    );
  }
  if (!response.ok) {
    throw new QbtError(
      "VERSION_HTTP_ERROR",
      "Could not read the qBittorrent version.",
      { status: response.status },
    );
  }

  const version = (await response.text()).trim();
  if (!version) {
    throw new QbtError(
      "NOT_QBITTORRENT",
      "This address did not return a qBittorrent version.",
    );
  }

  return version;
}

async function ensurePermission(baseUrl) {
  const granted = await chrome.permissions.contains({
    origins: [getOriginPattern(baseUrl)],
  });

  if (!granted) {
    throw new QbtError(
      "PERMISSION_REQUIRED",
      "The extension does not have access to this address.",
    );
  }
}

export async function testConnection(rawConfig) {
  const config = validateConfig(rawConfig);
  await ensurePermission(config.baseUrl);

  await login(config);
  let version;
  try {
    version = await getVersion(config.baseUrl);
  } finally {
    await logout(config.baseUrl);
  }

  return { version, baseUrl: config.baseUrl };
}

export async function addTorrents(rawConfig, magnets) {
  const config = validateConfig(rawConfig);
  await ensurePermission(config.baseUrl);

  if (!Array.isArray(magnets) || magnets.length === 0) {
    throw new QbtError("EMPTY_MAGNETS", "There are no magnet links to submit.");
  }
  if (magnets.length > MAX_MAGNETS) {
    throw new QbtError(
      "TOO_MANY_MAGNETS",
      "Too many magnet links.",
      { max: MAX_MAGNETS },
    );
  }
  if (magnets.some((magnet) => !/^magnet:\?/i.test(String(magnet)))) {
    throw new QbtError(
      "INVALID_MAGNET",
      "The submission contains an invalid magnet link.",
    );
  }

  await login(config);

  try {
    // Deliberately send only `urls`. Save path, category, paused state, limits
    // and every other setting stay exactly as configured in qBittorrent.
    const body = new FormData();
    body.set("urls", magnets.join("\n"));

    const response = await request(endpoint(config.baseUrl, "torrents/add"), {
      method: "POST",
      body,
    });

    if (response.status === 401 || response.status === 403) {
      throw new QbtError(
        "SESSION_EXPIRED",
        "qBittorrent rejected the request because the session is not valid.",
      );
    }
    if (!response.ok) {
      throw new QbtError(
        "ADD_HTTP_ERROR",
        "qBittorrent could not add the task.",
        { status: response.status },
      );
    }

    const text = (await response.text()).trim();
    if (text.toLowerCase() === "fails.") {
      throw new QbtError(
        "ADD_REJECTED",
        "qBittorrent rejected the magnet link.",
      );
    }
  } finally {
    await logout(config.baseUrl);
  }

  return { count: magnets.length };
}
