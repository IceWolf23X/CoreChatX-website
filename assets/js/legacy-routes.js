/* Preserve production page bookmarks when the wiki replaces the standalone pages. */
(function (root) {
  'use strict';
  const routes = {
  "features.html": {
    "route": "#/docs/guides/features",
    "anchors": null
  },
  "installation.html": {
    "route": "#/docs/guides/installation",
    "anchors": null
  },
  "advancement-sync.html": {
    "route": "#/docs/guides/advancement-sync",
    "anchors": null
  },
  "migration.html": {
    "route": "#/docs/guides/migration",
    "anchors": null
  },
  "migration-paper.html": {
    "route": "#/docs/guides/migration-paper",
    "anchors": null
  },
  "migration-velocity.html": {
    "route": "#/docs/guides/migration-velocity",
    "anchors": null
  },
  "faq.html": {
    "route": "#/docs/guides/faq",
    "anchors": null
  },
  "tags.html": {
    "route": "#/docs/guides/plugin-comparisons",
    "anchors": null
  },
  "changelog.html": {
    "route": "#/docs/reference/changelog",
    "anchors": null
  },
  "docs.html": {
    "route": "#/docs/instructions",
    "anchors": null
  },
  "configuration.html": {
    "route": "#/docs/instructions",
    "anchors": {
      "0-before-you-configure": "#/docs/instructions/before-you-configure",
      "model": "#/docs/instructions/before-you-configure",
      "corechatx-project-identity": "#/docs/instructions/before-you-configure~corechatx-project-identity",
      "1-layout-overview": "#/docs/instructions/layout-overview",
      "paper-backend-folder": "#/docs/instructions/layout-overview~paper-backend-folder",
      "velocity-proxy-folder": "#/docs/instructions/layout-overview~velocity-proxy-folder",
      "files-created-from-bundled-defaults-on-paper": "#/docs/instructions/layout-overview~files-created-from-bundled-defaults-on-paper",
      "additional-paper-runtime-files-created-on-demand": "#/docs/instructions/layout-overview~additional-paper-runtime-files-created-on-demand",
      "files-created-from-bundled-defaults-on-velocity": "#/docs/instructions/layout-overview",
      "additional-velocity-runtime-files-created-on-demand": "#/docs/instructions/layout-overview~additional-velocity-runtime-files-created-on-demand",
      "2-reload-vs-restart": "#/docs/instructions/reload-vs-restart",
      "3-quick-install-patterns": "#/docs/instructions/quick-install-patterns",
      "standalone-paper": "#/docs/instructions/quick-install-patterns~standalone-paper",
      "velocity-network": "#/docs/instructions/quick-install-patterns~velocity-network",
      "production-setup-checklist": "#/docs/instructions/quick-install-patterns~production-setup-checklist",
      "4-paper-backend-files": "#/docs/paper/files",
      "paper-files": "#/docs/paper/files",
      "4-1-config-yml": "#/docs/paper/config-yml",
      "4-2-chat-yml": "#/docs/paper/chat-yml",
      "4-3-messages-yml": "#/docs/paper/messages-yml",
      "4-4-channels-yml": "#/docs/paper/channels-yml",
      "channels": "#/docs/paper/channels-yml",
      "4-5-pings-yml": "#/docs/paper/pings-yml",
      "4-6-privacy-yml": "#/docs/paper/privacy-yml",
      "4-7-moderation-yml": "#/docs/paper/moderation-yml",
      "4-8-filter-yml": "#/docs/paper/filter-yml",
      "4-9-chatitems-yml": "#/docs/paper/chatitems-yml",
      "chatitems": "#/docs/paper/chatitems-yml",
      "4-9-1-keywords-yml": "#/docs/paper/keywords-yml",
      "4-9-2-chatbubbles-yml": "#/docs/paper/chatbubbles-yml",
      "4-10-discord-yml": "#/docs/paper/discord-yml",
      "bridges": "#/docs/paper/discord-yml",
      "4-11-telegram-yml": "#/docs/paper/telegram-yml",
      "4-12-storage-yml": "#/docs/paper/storage-yml",
      "storage": "#/docs/paper/storage-yml",
      "storage-maintenance": "#/docs/paper/storage-yml~storage-maintenance-and-migration-workflow",
      "4-13-locales-en-us-yml": "#/docs/paper/locales-en-us-yml",
      "5-paper-runtime-data-files": "#/docs/runtime/files",
      "runtime-data": "#/docs/runtime/files",
      "5-1-playerdata-yml": "#/docs/runtime/playerdata-yml",
      "channel-persistence": "#/docs/reference/per-player-channel-persistence",
      "5-2-state-yml": "#/docs/runtime/state-yml",
      "5-3-channeldata-yml": "#/docs/runtime/channeldata-yml",
      "5-4-ignoredata-yml": "#/docs/runtime/ignoredata-yml",
      "5-5-mutedata-yml": "#/docs/runtime/mutedata-yml",
      "5-6-discordlinks-yml": "#/docs/runtime/discordlinks-yml",
      "6-velocity-proxy": "#/docs/velocity/introduction",
      "velocity": "#/docs/velocity/introduction",
      "6-1-velocity-config-properties": "#/docs/velocity/velocity-config-properties",
      "velocity-storage": "#/docs/velocity/velocity-storage-yml",
      "6-2-velocity-messages-yml": "#/docs/velocity/velocity-messages-yml",
      "6-3-velocity-discord-yml": "#/docs/velocity/velocity-discord-yml",
      "7-regenerating-a-clean-config-set": "#/docs/reference/regenerating-a-clean-config-set",
      "paper-backend": "#/docs/reference/regenerating-a-clean-config-set~paper-backend",
      "velocity-proxy": "#/docs/reference/regenerating-a-clean-config-set~velocity-proxy",
      "8-command-reference": "#/docs/reference/command-reference",
      "commands": "#/docs/reference/command-reference",
      "velocity-commands": "#/docs/reference/command-reference",
      "9-permission-reference": "#/docs/reference/permission-reference",
      "permissions": "#/docs/reference/permission-reference",
      "10-practical-admin-notes": "#/docs/reference/practical-admin-notes",
      "limits": "#/docs/reference/practical-admin-notes",
      "11-troubleshooting-quick-reference": "#/docs/reference/troubleshooting-quick-reference",
      "troubleshooting": "#/docs/reference/troubleshooting-quick-reference",
      "startup-banner-does-not-appear": "#/docs/reference/troubleshooting-quick-reference~startup-banner-does-not-appear",
      "corechatx-reload-does-not-apply-a-change": "#/docs/reference/troubleshooting-quick-reference~corechatx-reload-does-not-apply-a-change",
      "network-messages-do-not-cross-servers": "#/docs/reference/troubleshooting-quick-reference~network-messages-do-not-cross-servers",
      "discord-or-telegram-messages-do-not-send": "#/docs/reference/troubleshooting-quick-reference~discord-or-telegram-messages-do-not-send",
      "discord-or-telegram-inbound-does-not-appear-in-minecraft": "#/docs/reference/troubleshooting-quick-reference~discord-or-telegram-inbound-does-not-appear-in-minecraft",
      "removing-a-discord-whitelist-role-does-not-disconnect-the-player": "#/docs/reference/troubleshooting-quick-reference~removing-a-discord-whitelist-role-does-not-disconnect-the-player",
      "placeholderapi-placeholders-do-not-render": "#/docs/reference/troubleshooting-quick-reference~placeholderapi-placeholders-do-not-render",
      "mentions-do-not-notify-players": "#/docs/reference/troubleshooting-quick-reference~mentions-do-not-notify-players",
      "chatitems-work-locally-but-not-across-servers": "#/docs/reference/troubleshooting-quick-reference~chatitems-work-locally-but-not-across-servers",
      "discord-chatitem-images-do-not-render": "#/docs/reference/troubleshooting-quick-reference~discord-chatitem-images-do-not-render",
      "chat-bubbles-are-missing": "#/docs/reference/troubleshooting-quick-reference~chat-bubbles-are-missing",
      "a-config-permission-warning-appears": "#/docs/reference/troubleshooting-quick-reference~a-config-permission-warning-appears",
      "a-runtime-data-file-looks-wrong": "#/docs/reference/troubleshooting-quick-reference~a-runtime-data-file-looks-wrong",
      "12-production-validation-checklist": "#/docs/reference/production-validation-checklist",
      "optional-network-features": "#/docs/guides/advancement-sync",
      "related-pages": "#/docs/reference/related-documents"
    }
  }
};
  /** Select a fixed local wiki route, retaining only the legacy page's own section. */
  function target(page, hash) {
    const entry = routes[page];
    if (!entry) return 'index.html#/docs/instructions';
    let anchor = '';
    try { anchor = decodeURIComponent(String(hash || '').replace(/^#/, '')); } catch (_) { /* Invalid bookmarks select the page root. */ }
    const route = entry.anchors ? (entry.anchors[anchor] || entry.route) : entry.route + (anchor ? '~' + encodeURIComponent(anchor) : '');
    return 'index.html' + route;
  }
  if (typeof module === 'object' && module.exports) module.exports = { target, routes };
  else if (root.document) root.location.replace(target(root.document.body.dataset.legacyPage, root.location.hash));
}(typeof window !== 'undefined' ? window : globalThis));
