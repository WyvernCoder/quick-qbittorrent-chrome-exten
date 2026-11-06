import { MAX_MAGNETS, parseMagnets } from "./lib/config.js";
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
  loadingView: document.querySelector("#loadingView"),
  setupView: document.querySelector("#setupView"),
  permissionView: document.querySelector("#permissionView"),
  mainView: document.querySelector("#mainView"),
  setupTitle: document.querySelector("#setupTitle"),
  setupDescription: document.querySelector("#setupDescription"),
  setupBtn: document.querySelector("#setupBtn"),
  permissionSettingsBtn: document.querySelector("#permissionSettingsBtn"),
  grantBtn: document.querySelector("#grantBtn"),
  permissionHost: document.querySelector("#permissionHost"),
  settingsBtn: document.querySelector("#settingsBtn"),
  languageBtn: document.querySelector("#languageBtn"),
  languageLabel: document.querySelector("#languageLabel"),
  webuiLink: document.querySelector("#webuiLink"),
  serverAddress: document.querySelector("#serverAddress"),
  addForm: document.querySelector("#addForm"),
  magnetInput: document.querySelector("#magnetInput"),
  magnetError: document.querySelector("#magnetError"),
  inputMeta: document.querySelector("#inputMeta"),
  submitBtn: document.querySelector("#submitBtn"),
  submitLabel: document.querySelector("#submitLabel"),
  status: document.querySelector("#status"),
  statusTitle: document.querySelector("#statusTitle"),
  statusDetail: document.querySelector("#statusDetail"),
  versionLabel: document.querySelector("#versionLabel"),
};

let lang = "zh";
let publicState = null;
let busy = false;
let statusState = null;
let fieldErrorState = null;
let setupError = false;

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

function openSettings() {
  chrome.runtime.openOptionsPage();
  window.close();
}

function setView(view) {
  for (const name of ["loadingView", "setupView", "permissionView", "mainView"]) {
    elements[name].hidden = name !== view;
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

function renderSetup() {
  if (setupError) {
    elements.setupTitle.textContent = t(lang, "popup.error.title");
    elements.setupDescription.textContent = t(lang, "popup.error.description");
  } else {
    elements.setupTitle.textContent = t(lang, "popup.setup.title");
    elements.setupDescription.textContent = t(lang, "popup.setup.description");
  }
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

function showStatus(nextStatus) {
  statusState = nextStatus;
  renderStatus();
}

function clearStatus() {
  statusState = null;
  renderStatus();
}

function renderFieldError() {
  if (!fieldErrorState) {
    elements.magnetError.hidden = true;
    elements.magnetError.textContent = "";
    elements.magnetInput.removeAttribute("aria-invalid");
    return;
  }

  elements.magnetError.textContent = t(
    lang,
    fieldErrorState.key,
    fieldErrorState.params ?? {},
  );
  elements.magnetError.hidden = false;
  elements.magnetInput.setAttribute("aria-invalid", "true");
}

function showFieldError(key, params = {}) {
  fieldErrorState = { key, params };
  renderFieldError();
  elements.magnetInput.focus();
}

function clearFieldError() {
  fieldErrorState = null;
  renderFieldError();
}

function updateMeta() {
  const parsed = parseMagnets(elements.magnetInput.value);
  const count = parsed.magnets.length;

  if (!elements.magnetInput.value.trim()) {
    elements.inputMeta.textContent = t(lang, "popup.meta.onePerLine");
    return;
  }

  if (count === 0) {
    elements.inputMeta.textContent = t(lang, "popup.meta.formatPending");
    return;
  }

  const countKey = count === 1 ? "popup.meta.countOne" : "popup.meta.countMany";
  let label = t(lang, countKey, { count });
  if (parsed.total > count) {
    label += t(lang, "popup.meta.deduped");
  }
  elements.inputMeta.textContent = label;
}

function renderBusy() {
  elements.submitBtn.disabled = busy;
  elements.magnetInput.disabled = busy;
  elements.submitLabel.textContent = t(
    lang,
    busy ? "popup.sending" : "popup.submit",
  );
}

function setBusy(nextBusy) {
  busy = nextBusy;
  renderBusy();
}

function applyLanguageUI() {
  applyStaticTranslations(lang);
  updateLanguageButton();
  renderSetup();
  renderStatus();
  renderFieldError();
  renderBusy();
  updateMeta();
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

async function init() {
  elements.versionLabel.textContent = `v${chrome.runtime.getManifest().version}`;

  try {
    const response = await sendMessage({ type: "qbt:getState" });
    if (!response?.ok) {
      throw new Error(response?.error || "Could not read settings.");
    }

    setupError = false;
    publicState = response.state;
    if (!publicState.configured) {
      renderSetup();
      setView("setupView");
      return;
    }

    elements.serverAddress.textContent = publicState.baseUrl;
    elements.serverAddress.title = publicState.baseUrl;
    setWebuiLink(publicState.baseUrl);

    if (!publicState.permissionGranted) {
      let host = publicState.baseUrl;
      try {
        host = new URL(publicState.baseUrl).host;
      } catch {
        // Keep the raw value if it cannot be parsed.
      }
      elements.permissionHost.textContent = host;
      setView("permissionView");
      return;
    }

    setView("mainView");
    elements.magnetInput.focus();
  } catch {
    setupError = true;
    renderSetup();
    setView("setupView");
  }
}

elements.settingsBtn.addEventListener("click", openSettings);
elements.setupBtn.addEventListener("click", openSettings);
elements.permissionSettingsBtn.addEventListener("click", openSettings);
elements.languageBtn.addEventListener("click", toggleLanguage);

elements.grantBtn.addEventListener("click", async () => {
  if (!publicState?.baseUrl) {
    openSettings();
    return;
  }

  elements.grantBtn.disabled = true;
  try {
    const pattern = `${new URL(publicState.baseUrl).origin}/*`;
    const granted = await chrome.permissions.request({ origins: [pattern] });
    if (!granted) {
      elements.grantBtn.disabled = false;
      return;
    }
    await init();
  } catch {
    elements.grantBtn.disabled = false;
    openSettings();
  }
});

elements.magnetInput.addEventListener("input", () => {
  clearFieldError();
  clearStatus();
  updateMeta();
});

elements.magnetInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    elements.addForm.requestSubmit();
  }
});

elements.addForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) {
    return;
  }

  clearFieldError();
  clearStatus();

  const parsed = parseMagnets(elements.magnetInput.value);
  if (parsed.total === 0) {
    showFieldError("popup.field.empty");
    return;
  }
  if (parsed.invalid.length > 0) {
    showFieldError("popup.field.invalidLine", { line: parsed.invalid[0].line });
    return;
  }
  if (parsed.total > MAX_MAGNETS) {
    showFieldError("popup.field.tooMany", { max: MAX_MAGNETS });
    return;
  }

  setBusy(true);
  showStatus({
    kind: "info",
    titleKey: "popup.status.sendTitle",
    detailKey: "popup.status.sendDetail",
  });

  try {
    const response = await sendMessage({
      type: "qbt:add",
      magnets: parsed.magnets,
    });

    if (!response?.ok) {
      let titleKey = "popup.status.addFailedTitle";
      if (response?.code === "PERMISSION_REQUIRED") {
        titleKey = "popup.status.permissionTitle";
      } else if (response?.code === "NOT_CONFIGURED") {
        titleKey = "popup.status.notConfiguredTitle";
      }

      showStatus({
        kind: "error",
        titleKey,
        errorCode: response?.code,
        errorParams: response?.params,
      });
      return;
    }

    const count = response.result.count;
    elements.magnetInput.value = "";
    updateMeta();
    showStatus({
      kind: "success",
      titleKey: "popup.status.successTitle",
      detailKey:
        count === 1
          ? "popup.status.successDetailOne"
          : "popup.status.successDetailMany",
      detailParams: { count },
    });
    elements.magnetInput.focus();
  } catch {
    showStatus({
      kind: "error",
      titleKey: "popup.status.backgroundTitle",
      errorCode: "BACKGROUND_UNAVAILABLE",
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

async function start() {
  lang = await getLanguage();
  applyStaticTranslations(lang);
  updateLanguageButton();
  renderSetup();
  updateMeta();
  renderBusy();
  await init();
}

start();
