import {
  STORAGE_KEY,
  getOriginPattern,
  normalizeBaseUrl,
  validateConfig,
} from "./lib/config.js";
import {
  LANGUAGE_KEY,
  applyStaticTranslations,
  errorMessage,
  getLanguage,
  isSupportedLanguage,
  setLanguage,
  t,
} from "./lib/i18n.js";

const elements = {
  form: document.querySelector("#settingsForm"),
  baseUrl: document.querySelector("#baseUrl"),
  username: document.querySelector("#username"),
  password: document.querySelector("#password"),
  passwordToggle: document.querySelector("#passwordToggle"),
  languageBtn: document.querySelector("#languageBtn"),
  languageLabel: document.querySelector("#languageLabel"),
  saveBtn: document.querySelector("#saveBtn"),
  buttonLabel: document.querySelector("#saveBtn .button-label"),
  webuiLink: document.querySelector("#webuiLink"),
  status: document.querySelector("#status"),
  statusTitle: document.querySelector("#statusTitle"),
  statusDetail: document.querySelector("#statusDetail"),
  versionLabel: document.querySelector("#versionLabel"),
};

const BASE_URL_ERROR_CODES = new Set([
  "CONFIG_INVALID_OBJECT",
  "CONFIG_EMPTY_BASE_URL",
  "CONFIG_INVALID_BASE_URL",
  "CONFIG_INVALID_PROTOCOL",
  "CONFIG_INLINE_CREDENTIALS",
  "CONFIG_MISSING_HOST",
]);

let lang = "zh";
let busy = false;
let currentConfig = null;
let statusState = null;
let fieldErrorInput = null;

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(response);
    });
  });
}

function updateLanguageButton() {
  const switchingToEnglish = lang === "zh";
  elements.languageLabel.textContent = switchingToEnglish ? "EN" : "中文";
  const label = t(
    lang,
    switchingToEnglish ? "common.switchToEnglish" : "common.switchToChinese",
  );
  elements.languageBtn.title = label;
  elements.languageBtn.setAttribute("aria-label", label);
}

function renderStatus() {
  if (!statusState) {
    elements.status.hidden = true;
    elements.statusTitle.textContent = "";
    elements.statusDetail.textContent = "";
    return;
  }

  elements.status.hidden = false;
  elements.status.className = `status is-${statusState.kind}`;
  elements.statusTitle.textContent = t(
    lang,
    statusState.titleKey,
    statusState.titleParams ?? {},
  );

  let detail = "";
  if (statusState.errorCode) {
    detail = errorMessage(
      lang,
      statusState.errorCode,
      statusState.errorParams ?? {},
    );
  } else if (statusState.detailKey) {
    detail = t(lang, statusState.detailKey, statusState.detailParams ?? {});
  }
  elements.statusDetail.textContent = detail;
}

function setStatus(nextStatus) {
  statusState = nextStatus;
  renderStatus();
}

function clearStatus() {
  statusState = null;
  renderStatus();
}

function renderFieldError() {
  for (const input of [elements.baseUrl, elements.username, elements.password]) {
    input.removeAttribute("aria-invalid");
  }
  fieldErrorInput?.setAttribute("aria-invalid", "true");
}

function clearFieldError() {
  fieldErrorInput = null;
  renderFieldError();
}

function showFieldError(input, code, params = {}) {
  fieldErrorInput = input;
  renderFieldError();
  setStatus({
    kind: "error",
    titleKey: "options.status.checkSettingsTitle",
    errorCode: code,
    errorParams: params,
  });
  input.focus();
}

function updatePasswordToggle() {
  const showing = elements.password.type === "text";
  elements.passwordToggle.textContent = t(
    lang,
    showing ? "options.passwordHide" : "options.passwordShow",
  );
  elements.passwordToggle.setAttribute(
    "aria-label",
    t(lang, showing ? "options.passwordHide" : "options.passwordShow"),
  );
  elements.passwordToggle.setAttribute("aria-pressed", String(showing));
}

function renderBusy() {
  elements.saveBtn.disabled = busy;
  elements.saveBtn.classList.toggle("is-busy", busy);
  elements.buttonLabel.textContent = t(
    lang,
    busy ? "options.button.testing" : "options.button.save",
  );
  for (const field of [elements.baseUrl, elements.username, elements.password]) {
    field.disabled = busy;
  }
}

function setBusy(nextBusy) {
  busy = nextBusy;
  renderBusy();
}

function applyLanguageUI() {
  applyStaticTranslations(lang);
  updateLanguageButton();
  updatePasswordToggle();
  renderStatus();
  renderFieldError();
  renderBusy();
}

async function toggleLanguage() {
  lang = lang === "zh" ? "en" : "zh";
  applyLanguageUI();
  try {
    await setLanguage(lang);
  } catch (error) {
    console.warn("Could not persist the language preference.", error);
  }
}

function setWebuiLink(baseUrl) {
  if (!baseUrl) {
    elements.webuiLink.hidden = true;
    return;
  }
  elements.webuiLink.href = baseUrl;
  elements.webuiLink.hidden = false;
}

async function hasOriginPermission(baseUrl) {
  try {
    return await chrome.permissions.contains({
      origins: [getOriginPattern(baseUrl)],
    });
  } catch {
    return false;
  }
}

async function loadSavedConfig() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const config = stored?.[STORAGE_KEY];

  if (!config?.baseUrl) {
    return;
  }

  currentConfig = config;
  elements.baseUrl.value = config.baseUrl || "";
  elements.username.value = config.username || "";
  elements.password.value = config.password || "";
  setWebuiLink(config.baseUrl);

  const permissionGranted = await hasOriginPermission(config.baseUrl);
  if (!permissionGranted) {
    setStatus({
      kind: "error",
      titleKey: "options.status.permissionTitle",
      detailKey: "options.status.permissionDetail",
    });
    return;
  }

  if (config.version) {
    setStatus({
      kind: "success",
      titleKey: "options.status.readyTitle",
      detailKey: "options.status.readyDetail",
      detailParams: { version: config.version },
    });
  } else {
    setStatus({
      kind: "info",
      titleKey: "options.status.savedTitle",
      detailKey: "options.status.savedDetail",
    });
  }
}

elements.languageBtn.addEventListener("click", toggleLanguage);

elements.passwordToggle.addEventListener("click", () => {
  elements.password.type = elements.password.type === "password" ? "text" : "password";
  updatePasswordToggle();
  elements.password.focus();
});

elements.webuiLink.addEventListener("click", (event) => {
  if (!elements.webuiLink.href || elements.webuiLink.hidden) {
    event.preventDefault();
  }
});

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) {
    return;
  }

  clearStatus();
  clearFieldError();

  let config;
  try {
    config = validateConfig({
      baseUrl: elements.baseUrl.value,
      username: elements.username.value,
      password: elements.password.value,
    });
  } catch (error) {
    const code = error?.code || "UNKNOWN_ERROR";
    if (BASE_URL_ERROR_CODES.has(code)) {
      showFieldError(elements.baseUrl, code);
    } else if (code === "CONFIG_MISSING_USERNAME") {
      showFieldError(elements.username, code);
    } else if (code === "CONFIG_MISSING_PASSWORD") {
      showFieldError(elements.password, code);
    } else {
      showFieldError(elements.baseUrl, "UNKNOWN_ERROR");
    }
    return;
  }

  elements.baseUrl.value = config.baseUrl;
  setWebuiLink(config.baseUrl);
  setBusy(true);
  setStatus({
    kind: "info",
    titleKey: "options.status.verifyingTitle",
    detailKey: "options.status.verifyingDetail",
  });

  try {
    // The permission request must be the first asynchronous call in this
    // submit handler so Chrome still sees the user's click as its origin.
    const pattern = getOriginPattern(config.baseUrl);
    const granted = await chrome.permissions.request({ origins: [pattern] });

    if (!granted) {
      setStatus({
        kind: "error",
        titleKey: "options.status.permissionDeniedTitle",
        detailKey: "options.status.permissionDeniedDetail",
      });
      return;
    }

    let response;
    try {
      response = await sendMessage({
        type: "qbt:testConnection",
        config,
      });
    } catch {
      setStatus({
        kind: "error",
        titleKey: "options.status.backgroundTitle",
        errorCode: "BACKGROUND_UNAVAILABLE",
      });
      return;
    }

    if (!response?.ok) {
      setStatus({
        kind: "error",
        titleKey: "options.status.failureTitle",
        errorCode: response?.code,
        errorParams: response?.params,
      });
      return;
    }

    const previousConfig = currentConfig;
    const nextConfig = {
      baseUrl: config.baseUrl,
      username: config.username,
      password: config.password,
      version: response.result.version,
      savedAt: new Date().toISOString(),
    };

    await chrome.storage.local.set({ [STORAGE_KEY]: nextConfig });
    currentConfig = nextConfig;

    // Clean up a stale grant if the host or scheme changed. Keep it if only
    // the reverse-proxy path changed, since the origin pattern is unchanged.
    if (
      previousConfig?.baseUrl &&
      getOriginPattern(previousConfig.baseUrl) !== getOriginPattern(config.baseUrl)
    ) {
      chrome.permissions
        .remove({ origins: [getOriginPattern(previousConfig.baseUrl)] })
        .catch(() => {});
    }

    setStatus({
      kind: "success",
      titleKey: "options.status.successTitle",
      detailKey: "options.status.successDetail",
      detailParams: { version: response.result.version },
    });
  } catch {
    setStatus({
      kind: "error",
      titleKey: "options.status.saveFailedTitle",
      errorCode: "UNKNOWN_ERROR",
    });
  } finally {
    setBusy(false);
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local" || !changes[LANGUAGE_KEY]) {
    return;
  }
  const nextLanguage = changes[LANGUAGE_KEY].newValue;
  if (isSupportedLanguage(nextLanguage) && nextLanguage !== lang) {
    lang = nextLanguage;
    applyLanguageUI();
  }
});

// Keep a clean address in the field when the user leaves it.
elements.baseUrl.addEventListener("blur", () => {
  if (!elements.baseUrl.value.trim()) {
    return;
  }
  try {
    const normalized = normalizeBaseUrl(elements.baseUrl.value);
    elements.baseUrl.value = normalized;
    setWebuiLink(normalized);
  } catch {
    // Validation on submit will show the helpful error.
  }
});

async function start() {
  lang = await getLanguage();
  applyStaticTranslations(lang);
  elements.versionLabel.textContent = `v${chrome.runtime.getManifest().version}`;
  updateLanguageButton();
  updatePasswordToggle();
  renderBusy();
  try {
    await loadSavedConfig();
  } catch {
    setStatus({
      kind: "error",
      titleKey: "options.status.readFailedTitle",
      detailKey: "options.status.readFailedDetail",
    });
  }
}

start();
