export const STORAGE_KEY = "qbtConfig";
export const MAX_MAGNETS = 50;

function configError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

/**
 * Turn user input into a clean qBittorrent base URL while preserving an
 * optional reverse-proxy sub-path. Throws a user-facing Error when invalid.
 */
export function normalizeBaseUrl(rawValue) {
  let value = String(rawValue ?? "").trim();
  if (!value) {
    throw configError(
      "CONFIG_EMPTY_BASE_URL",
      "A qBittorrent WebUI address is required.",
    );
  }

  if (!/^[a-z][a-z\d+.-]*:\/\//i.test(value)) {
    value = `http://${value}`;
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw configError(
      "CONFIG_INVALID_BASE_URL",
      "The WebUI address is not a valid URL.",
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw configError(
      "CONFIG_INVALID_PROTOCOL",
      "The WebUI address must use HTTP or HTTPS.",
    );
  }
  if (url.username || url.password) {
    throw configError(
      "CONFIG_INLINE_CREDENTIALS",
      "Do not put credentials in the URL.",
    );
  }
  if (!url.hostname) {
    throw configError(
      "CONFIG_MISSING_HOST",
      "The WebUI address is missing a host name.",
    );
  }

  // A pasted API URL is a common mistake. Use the WebUI root instead.
  url.pathname = url.pathname.replace(/\/api\/v2\/?$/i, "");
  url.pathname = url.pathname.replace(/\/+$/, "");
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/$/, "");
}

export function getOriginPattern(baseUrl) {
  return `${new URL(baseUrl).origin}/*`;
}

export function validateConfig(rawConfig) {
  if (!rawConfig || typeof rawConfig !== "object") {
    throw configError("CONFIG_INVALID_OBJECT", "Configuration is missing.");
  }

  const baseUrl = normalizeBaseUrl(rawConfig.baseUrl);
  const username = String(rawConfig.username ?? "").trim();
  const password = String(rawConfig.password ?? "");

  if (!username) {
    throw configError(
      "CONFIG_MISSING_USERNAME",
      "A qBittorrent username is required.",
    );
  }
  if (!password) {
    throw configError(
      "CONFIG_MISSING_PASSWORD",
      "A qBittorrent password is required.",
    );
  }

  return { baseUrl, username, password };
}

/**
 * Accepts one magnet per line. Returns de-duplicated magnet URIs and details
 * about invalid lines so the UI can point at the exact problem.
 */
export function parseMagnets(rawText) {
  const lines = String(rawText ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const magnets = [];
  const invalid = [];
  const seen = new Set();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const isValid =
      /^magnet:\?/i.test(line) &&
      /(?:[?&])xt=urn:(?:btih|btmh):/i.test(line);

    if (!isValid) {
      invalid.push({ line: index + 1, value: line.slice(0, 120) });
      continue;
    }

    if (!seen.has(line)) {
      seen.add(line);
      magnets.push(line);
    }
  }

  return {
    magnets: magnets.slice(0, MAX_MAGNETS),
    invalid,
    total: magnets.length,
    truncated: magnets.length > MAX_MAGNETS,
  };
}
