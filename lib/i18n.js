export const LANGUAGE_KEY = "uiLanguage";
export const DEFAULT_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["zh", "en"];

const messages = {
  zh: {
    "common.defaultBadge": "默认设置",
    "common.openWebui": "打开 qBittorrent WebUI",
    "common.openSettings": "打开扩展设置",
    "common.switchToEnglish": "Switch to English / 切换到英文",
    "common.switchToChinese": "切换到中文",

    "popup.documentTitle": "qBittorrent 磁力快传",
    "popup.brand": "磁力快传",
    "popup.loading": "正在读取配置…",
    "popup.loadingAria": "正在读取配置",
    "popup.setup.title": "先连接你的 qBittorrent",
    "popup.setup.description":
      "填写 WebUI 地址、用户名和密码。连接测试通过后，就可以一键添加磁力任务。",
    "popup.setup.action": "打开设置",
    "popup.permission.title": "需要访问授权",
    "popup.permission.lead": "允许扩展访问",
    "popup.permission.tail": "，才能连接你的 qBittorrent。",
    "popup.permission.grant": "授权访问",
    "popup.permission.settings": "打开设置",
    "popup.error.title": "无法读取扩展状态",
    "popup.error.description": "请打开设置页重新保存配置。",
    "popup.magnetLabel": "磁力链接",
    "popup.meta.onePerLine": "每行一条",
    "popup.meta.countOne": "{count} 条",
    "popup.meta.countMany": "{count} 条",
    "popup.meta.deduped": "（已去重）",
    "popup.meta.formatPending": "格式待确认",
    "popup.placeholder": "magnet:?xt=urn:btih:...",
    "popup.hint":
      "支持一次粘贴多条，每行一条。下载路径、分类、限速等全部沿用 qBittorrent 默认配置。",
    "popup.submit": "开始下载",
    "popup.sending": "正在发送…",
    "popup.field.empty": "请粘贴至少一条磁力链接。",
    "popup.field.invalidLine": "第 {line} 行不是有效的磁力链接，请检查后重试。",
    "popup.field.tooMany": "一次最多提交 {max} 条，请分批添加。",
    "popup.status.sendTitle": "正在发送任务",
    "popup.status.sendDetail": "正在登录 qBittorrent 并提交磁力链接…",
    "popup.status.successTitle": "已开始下载",
    "popup.status.successDetailOne":
      "{count} 个任务已交给 qBittorrent，下载设置沿用其默认配置。",
    "popup.status.successDetailMany":
      "{count} 个任务已交给 qBittorrent，下载设置沿用其默认配置。",
    "popup.status.addFailedTitle": "添加失败",
    "popup.status.permissionTitle": "需要重新授权",
    "popup.status.notConfiguredTitle": "还没有完成设置",
    "popup.status.backgroundTitle": "无法连接扩展后台",
    "popup.status.backgroundDetail": "请关闭弹窗后重试。",
    "popup.footer": "链接只会发送到你配置的 qBittorrent",

    "options.documentTitle": "设置 · qBittorrent 磁力快传",
    "options.brand": "磁力快传",
    "options.secure": "凭据仅存本机",
    "options.introTitle": "连接你的 qBittorrent",
    "options.introDescription":
      "设置一次，之后在扩展弹窗里粘贴磁力链接即可开始下载。扩展不会修改下载路径、分类、限速或暂停状态，所有下载配置都由 qBittorrent 自己决定。",
    "options.connectionHeading": "WebUI 连接",
    "options.baseUrlLabel": "WebUI 地址",
    "options.baseUrlHelpHtml":
      "填 qBittorrent 的完整访问地址，可带反向代理子路径，例如 <code>https://example.com/qbt</code>。不要填 <code>/api/v2</code>。",
    "options.usernameLabel": "用户名",
    "options.usernamePlaceholder": "qBittorrent 用户名",
    "options.passwordLabel": "密码",
    "options.passwordPlaceholder": "qBittorrent 密码",
    "options.passwordShow": "显示",
    "options.passwordHide": "隐藏",
    "options.permissionNote":
      "保存时 Chrome 会请求访问上面这个地址的权限。扩展只会连接你填写的 qBittorrent，不会读取其他网站。首次使用需要允许，否则无法发送任务。",
    "options.status.readyTitle": "配置已就绪",
    "options.status.readyDetail":
      "上次成功连接 qBittorrent {version}。如需检查新设置，请重新保存并测试。",
    "options.status.savedTitle": "配置已保存",
    "options.status.savedDetail": "点击“保存并测试连接”验证当前配置。",
    "options.status.permissionTitle": "访问权限已失效",
    "options.status.permissionDetail":
      "Chrome 目前未允许扩展访问该地址。请点击“保存并测试连接”重新授权。",
    "options.status.verifyingTitle": "正在验证连接",
    "options.status.verifyingDetail": "正在请求站点权限并登录 qBittorrent…",
    "options.status.permissionDeniedTitle": "未获得访问权限",
    "options.status.permissionDeniedDetail":
      "Chrome 权限请求被拒绝。扩展无法连接该地址，请重试并选择“允许”。",
    "options.status.successTitle": "连接成功，设置已保存",
    "options.status.successDetail":
      "qBittorrent {version} · 现在可以点击浏览器工具栏图标添加磁力链接。",
    "options.status.failureTitle": "连接失败",
    "options.status.checkSettingsTitle": "请检查设置",
    "options.status.backgroundTitle": "扩展后台不可用",
    "options.status.backgroundDetail": "请刷新此页面后重试。",
    "options.status.saveFailedTitle": "保存失败",
    "options.status.readFailedTitle": "读取设置失败",
    "options.status.readFailedDetail": "请刷新页面后重试。",
    "options.button.openWebui": "打开 WebUI",
    "options.button.save": "保存并测试连接",
    "options.button.testing": "正在测试连接…",
    "options.details.title": "工作方式",
    "options.details.description": "简单、透明，不接管你的下载规则。",
    "options.details.step1Title": "登录",
    "options.details.step1Description":
      "每次操作先通过 qBittorrent WebUI API 登录，结束后立即退出会话。",
    "options.details.step2Title": "提交磁力",
    "options.details.step2DescriptionHtml":
      "只发送磁力链接到 <code>/api/v2/torrents/add</code>，不携带覆盖参数。",
    "options.details.step3Title": "按默认下载",
    "options.details.step3Description":
      "保存路径、分类、标签、限速、暂停等全部沿用 qBittorrent 当前默认设置。",
    "options.footerHtml":
      "账号密码保存在本机 Chrome 的 <code>chrome.storage.local</code> 中，不会同步到云端，也不会发送给 qBittorrent 以外的服务。",

    "errors.configMissing": "配置缺失。",
    "errors.emptyBaseUrl": "请填写 qBittorrent WebUI 地址。",
    "errors.invalidBaseUrl":
      "WebUI 地址格式不正确，例如：http://192.168.1.10:8080",
    "errors.invalidProtocol": "WebUI 地址必须以 http:// 或 https:// 开头。",
    "errors.inlineCredentials": "请不要把账号密码写在地址里，请填写到下方输入框。",
    "errors.missingHost": "WebUI 地址缺少主机名。",
    "errors.missingUsername": "请填写 qBittorrent 用户名。",
    "errors.missingPassword": "请填写 qBittorrent 密码。",
    "errors.notConfigured": "还没有配置 qBittorrent，请先打开扩展设置。",
    "errors.timeout": "连接 qBittorrent 超时，请检查地址、端口和网络。",
    "errors.network": "无法连接到 qBittorrent，请检查 WebUI 地址、端口和网络。",
    "errors.authForbidden":
      "登录被拒绝。请检查用户名、密码；连续失败可能触发 qBittorrent 的 IP 临时封禁。",
    "errors.loginHttp": "qBittorrent 登录失败（HTTP {status}）。",
    "errors.invalidCredentials": "用户名或密码错误。",
    "errors.unexpectedLogin":
      "登录接口返回了无法识别的响应，请确认该地址是 qBittorrent WebUI。",
    "errors.sessionNotEstablished":
      "登录成功，但会话没有生效。请检查浏览器是否允许该站点的 Cookie，然后重试。",
    "errors.versionHttp": "读取 qBittorrent 版本失败（HTTP {status}）。",
    "errors.notQbittorrent":
      "该地址没有返回 qBittorrent 版本信息，请确认 WebUI 地址。",
    "errors.permissionRequired":
      "扩展尚未获得该 qBittorrent 地址的访问权限，请到设置页重新保存配置并授权。",
    "errors.emptyMagnets": "没有可提交的磁力链接。",
    "errors.tooManyMagnets": "一次最多提交 {max} 条磁力链接。",
    "errors.invalidMagnet": "提交内容中包含无效的磁力链接。",
    "errors.sessionExpired":
      "qBittorrent 拒绝了请求，登录会话可能已失效。请重试；若持续失败，请检查浏览器 Cookie 设置。",
    "errors.addHttp": "qBittorrent 添加任务失败（HTTP {status}）。",
    "errors.addRejected": "qBittorrent 拒绝了该磁力链接，请确认链接完整且未失效。",
    "errors.unknown": "发生了未预期的错误，请重试。",
    "errors.unknownMessage": "未知的请求。",
    "errors.backgroundUnavailable": "无法连接扩展后台，请关闭弹窗后重试。",
  },

  en: {
    "common.defaultBadge": "Defaults",
    "common.openWebui": "Open qBittorrent WebUI",
    "common.openSettings": "Open extension settings",
    "common.switchToEnglish": "Switch to English",
    "common.switchToChinese": "Switch to Chinese / 切换到中文",

    "popup.documentTitle": "qBittorrent Magnet Quick Add",
    "popup.brand": "Magnet Quick Add",
    "popup.loading": "Loading settings…",
    "popup.loadingAria": "Loading settings",
    "popup.setup.title": "Connect your qBittorrent first",
    "popup.setup.description":
      "Enter your WebUI address, username and password. Once the connection test passes, adding magnet tasks takes one click.",
    "popup.setup.action": "Open settings",
    "popup.permission.title": "Access permission needed",
    "popup.permission.lead": "Allow the extension to access",
    "popup.permission.tail": " to connect to your qBittorrent.",
    "popup.permission.grant": "Grant access",
    "popup.permission.settings": "Open settings",
    "popup.error.title": "Unable to read extension state",
    "popup.error.description":
      "Open the settings page and save your configuration again.",
    "popup.magnetLabel": "Magnet links",
    "popup.meta.onePerLine": "One per line",
    "popup.meta.countOne": "{count} link",
    "popup.meta.countMany": "{count} links",
    "popup.meta.deduped": " (deduplicated)",
    "popup.meta.formatPending": "Check format",
    "popup.placeholder": "magnet:?xt=urn:btih:...",
    "popup.hint":
      "Paste one magnet link per line. Download path, category, speed limits and everything else follow your qBittorrent defaults.",
    "popup.submit": "Start download",
    "popup.sending": "Sending…",
    "popup.field.empty": "Paste at least one magnet link.",
    "popup.field.invalidLine":
      "Line {line} is not a valid magnet link. Please check it and try again.",
    "popup.field.tooMany":
      "You can add up to {max} links at a time. Please split them into batches.",
    "popup.status.sendTitle": "Sending tasks",
    "popup.status.sendDetail":
      "Signing in to qBittorrent and submitting magnet links…",
    "popup.status.successTitle": "Download started",
    "popup.status.successDetailOne":
      "{count} task was sent to qBittorrent using its default download settings.",
    "popup.status.successDetailMany":
      "{count} tasks were sent to qBittorrent using its default download settings.",
    "popup.status.addFailedTitle": "Could not add",
    "popup.status.permissionTitle": "Permission needed",
    "popup.status.notConfiguredTitle": "Setup is not complete",
    "popup.status.backgroundTitle": "Cannot reach the extension background",
    "popup.status.backgroundDetail": "Close the popup and try again.",
    "popup.footer": "Links are sent only to your qBittorrent",

    "options.documentTitle": "Settings · qBittorrent Magnet Quick Add",
    "options.brand": "Magnet Quick Add",
    "options.secure": "Credentials stay local",
    "options.introTitle": "Connect your qBittorrent",
    "options.introDescription":
      "Configure it once, then paste magnet links into the popup. The extension never changes your download path, category, speed limits or paused state — qBittorrent decides all of that.",
    "options.connectionHeading": "WebUI connection",
    "options.baseUrlLabel": "WebUI address",
    "options.baseUrlHelpHtml":
      "Enter the full qBittorrent address. A reverse-proxy subpath is supported, for example <code>https://example.com/qbt</code>. Do not append <code>/api/v2</code>.",
    "options.usernameLabel": "Username",
    "options.usernamePlaceholder": "qBittorrent username",
    "options.passwordLabel": "Password",
    "options.passwordPlaceholder": "qBittorrent password",
    "options.passwordShow": "Show",
    "options.passwordHide": "Hide",
    "options.permissionNote":
      "Chrome will ask for access to this address when you save. The extension only connects to the qBittorrent you enter, never other sites. You must allow access before tasks can be sent.",
    "options.status.readyTitle": "Configuration ready",
    "options.status.readyDetail":
      "Last successful connection: qBittorrent {version}. Save and test again to verify new settings.",
    "options.status.savedTitle": "Configuration saved",
    "options.status.savedDetail":
      "Choose “Save & test connection” to verify the current configuration.",
    "options.status.permissionTitle": "Access permission is missing",
    "options.status.permissionDetail":
      "Chrome has not granted the extension access to this address. Choose “Save & test connection” to grant it again.",
    "options.status.verifyingTitle": "Verifying connection",
    "options.status.verifyingDetail":
      "Requesting site access and signing in to qBittorrent…",
    "options.status.permissionDeniedTitle": "Access was not granted",
    "options.status.permissionDeniedDetail":
      "The Chrome permission request was denied. The extension cannot reach this address. Try again and choose “Allow”.",
    "options.status.successTitle": "Connected and saved",
    "options.status.successDetail":
      "qBittorrent {version} · Use the toolbar icon to add magnet links.",
    "options.status.failureTitle": "Connection failed",
    "options.status.checkSettingsTitle": "Check your settings",
    "options.status.backgroundTitle": "Extension background unavailable",
    "options.status.backgroundDetail": "Refresh this page and try again.",
    "options.status.saveFailedTitle": "Could not save",
    "options.status.readFailedTitle": "Could not load settings",
    "options.status.readFailedDetail": "Refresh the page and try again.",
    "options.button.openWebui": "Open WebUI",
    "options.button.save": "Save & test connection",
    "options.button.testing": "Testing connection…",
    "options.details.title": "How it works",
    "options.details.description":
      "Simple and transparent. Your download rules stay in charge.",
    "options.details.step1Title": "Sign in",
    "options.details.step1Description":
      "Each action signs in through the qBittorrent WebUI API and ends the session immediately afterwards.",
    "options.details.step2Title": "Add magnets",
    "options.details.step2DescriptionHtml":
      "Send only magnet links to <code>/api/v2/torrents/add</code>, with no override parameters.",
    "options.details.step3Title": "Download with defaults",
    "options.details.step3Description":
      "Save path, category, tags, speed limits, pause state and everything else follow the current qBittorrent defaults.",
    "options.footerHtml":
      "Credentials are stored locally in Chrome's <code>chrome.storage.local</code>. They are not synced to the cloud or sent to any service other than your qBittorrent.",

    "errors.configMissing": "Configuration is missing.",
    "errors.emptyBaseUrl": "Enter the qBittorrent WebUI address.",
    "errors.invalidBaseUrl":
      "That WebUI address is not valid. Example: http://192.168.1.10:8080",
    "errors.invalidProtocol":
      "The WebUI address must start with http:// or https://.",
    "errors.inlineCredentials":
      "Do not put credentials in the URL. Use the fields below.",
    "errors.missingHost": "The WebUI address is missing a host name.",
    "errors.missingUsername": "Enter the qBittorrent username.",
    "errors.missingPassword": "Enter the qBittorrent password.",
    "errors.notConfigured":
      "qBittorrent is not configured yet. Open the extension settings first.",
    "errors.timeout":
      "The connection to qBittorrent timed out. Check the address, port and network.",
    "errors.network":
      "Could not reach qBittorrent. Check the WebUI address, port and network.",
    "errors.authForbidden":
      "Login was rejected. Check the username and password; repeated failures may temporarily ban your IP in qBittorrent.",
    "errors.loginHttp": "qBittorrent login failed (HTTP {status}).",
    "errors.invalidCredentials": "Incorrect username or password.",
    "errors.unexpectedLogin":
      "The login endpoint returned an unexpected response. Make sure this address is the qBittorrent WebUI.",
    "errors.sessionNotEstablished":
      "Login succeeded, but the session did not stick. Check whether the browser allows cookies for this site and try again.",
    "errors.versionHttp":
      "Could not read the qBittorrent version (HTTP {status}).",
    "errors.notQbittorrent":
      "This address did not return a qBittorrent version. Check the WebUI address.",
    "errors.permissionRequired":
      "The extension does not have access to this qBittorrent address. Save the configuration again in Settings and grant permission.",
    "errors.emptyMagnets": "There are no magnet links to submit.",
    "errors.tooManyMagnets": "You can submit at most {max} magnet links at a time.",
    "errors.invalidMagnet": "The submission contains an invalid magnet link.",
    "errors.sessionExpired":
      "qBittorrent rejected the request. The login session may have expired. Try again; if it keeps failing, check your browser's cookie settings.",
    "errors.addHttp": "qBittorrent could not add the task (HTTP {status}).",
    "errors.addRejected":
      "qBittorrent rejected this magnet link. Make sure it is complete and still valid.",
    "errors.unknown": "Something unexpected happened. Please try again.",
    "errors.unknownMessage": "Unknown request.",
    "errors.backgroundUnavailable":
      "Could not reach the extension background. Close the popup and try again.",
  },
};

const ERROR_KEYS = {
  CONFIG_INVALID_OBJECT: "errors.configMissing",
  CONFIG_EMPTY_BASE_URL: "errors.emptyBaseUrl",
  CONFIG_INVALID_BASE_URL: "errors.invalidBaseUrl",
  CONFIG_INVALID_PROTOCOL: "errors.invalidProtocol",
  CONFIG_INLINE_CREDENTIALS: "errors.inlineCredentials",
  CONFIG_MISSING_HOST: "errors.missingHost",
  CONFIG_MISSING_USERNAME: "errors.missingUsername",
  CONFIG_MISSING_PASSWORD: "errors.missingPassword",
  NOT_CONFIGURED: "errors.notConfigured",
  TIMEOUT: "errors.timeout",
  NETWORK: "errors.network",
  AUTH_FORBIDDEN: "errors.authForbidden",
  LOGIN_HTTP_ERROR: "errors.loginHttp",
  INVALID_CREDENTIALS: "errors.invalidCredentials",
  UNEXPECTED_LOGIN_RESPONSE: "errors.unexpectedLogin",
  SESSION_NOT_ESTABLISHED: "errors.sessionNotEstablished",
  VERSION_HTTP_ERROR: "errors.versionHttp",
  NOT_QBITTORRENT: "errors.notQbittorrent",
  PERMISSION_REQUIRED: "errors.permissionRequired",
  EMPTY_MAGNETS: "errors.emptyMagnets",
  TOO_MANY_MAGNETS: "errors.tooManyMagnets",
  INVALID_MAGNET: "errors.invalidMagnet",
  SESSION_EXPIRED: "errors.sessionExpired",
  ADD_HTTP_ERROR: "errors.addHttp",
  ADD_REJECTED: "errors.addRejected",
  UNKNOWN_ERROR: "errors.unknown",
  UNKNOWN_MESSAGE: "errors.unknownMessage",
  BACKGROUND_UNAVAILABLE: "errors.backgroundUnavailable",
};

export function normalizeLanguage(value) {
  return SUPPORTED_LANGUAGES.includes(value) ? value : null;
}

export function isSupportedLanguage(value) {
  return normalizeLanguage(value) !== null;
}

export async function getLanguage() {
  try {
    const stored = await chrome.storage.local.get(LANGUAGE_KEY);
    return normalizeLanguage(stored?.[LANGUAGE_KEY]) || DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export async function setLanguage(language) {
  const normalized = normalizeLanguage(language);
  if (!normalized) {
    throw new Error(`Unsupported language: ${language}`);
  }
  await chrome.storage.local.set({ [LANGUAGE_KEY]: normalized });
  return normalized;
}

export function t(language, key, params = {}) {
  const dictionary = messages[language] || messages[DEFAULT_LANGUAGE];
  const template = dictionary[key] ?? messages[DEFAULT_LANGUAGE][key] ?? key;
  return String(template).replace(/\{(\w+)\}/g, (match, name) =>
    Object.hasOwn(params, name) ? String(params[name]) : match,
  );
}

export function errorMessage(language, code, params = {}) {
  const key = ERROR_KEYS[code];
  return key ? t(language, key, params) : t(language, "errors.unknown");
}

export function hasTranslation(language, key) {
  return Object.hasOwn(messages[language] ?? {}, key);
}

export function applyStaticTranslations(language, root = document) {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

  for (const element of root.querySelectorAll("[data-i18n]")) {
    element.textContent = t(language, element.getAttribute("data-i18n"));
  }
  for (const element of root.querySelectorAll("[data-i18n-html]")) {
    element.innerHTML = t(language, element.getAttribute("data-i18n-html"));
  }
  for (const element of root.querySelectorAll("[data-i18n-placeholder]")) {
    element.setAttribute(
      "placeholder",
      t(language, element.getAttribute("data-i18n-placeholder")),
    );
  }
  for (const element of root.querySelectorAll("[data-i18n-title]")) {
    element.setAttribute("title", t(language, element.getAttribute("data-i18n-title")));
  }
  for (const element of root.querySelectorAll("[data-i18n-aria-label]")) {
    element.setAttribute(
      "aria-label",
      t(language, element.getAttribute("data-i18n-aria-label")),
    );
  }
}
