# CoreChatX Configuration Instructions

This file is a complete reference for the current public config shape of CoreChatX.
It is intentionally split into `Paper backend` and `Velocity proxy` so the install remains readable.

The goal of this document is simple:
- describe the files that actually exist today
- mirror the current defaults bundled in the jars
- explain what each line does
- call out what is reloadable and what still needs a restart

Related documents:
- `PLUGIN_FEATURES_LISTED.md` gives the commercial feature overview
- `FAQ.md` answers the common admin and setup questions

If a config file is deleted, CoreChatX recreates the bundled default on next boot.
That is the supported way to regenerate a clean config set.

---

## 0. Before You Configure

Use this document as the operational reference for a real installation.
It is intentionally more detailed than the feature list because it documents the files, runtime gates, restart requirements, and safety limits that matter when the plugin is already installed on a server.

Minimum expectations:
- Java 21 runtime
- Paper `1.21.11` for backend servers
- Velocity for multi-backend network installs
- the Paper CoreChatX jar installed only on Paper backends
- the Velocity CoreChatX jar installed only on Velocity

Optional integrations:
- LuckPerms for rank/group metadata and permission assignment
- PlaceholderAPI for dynamic placeholders in server-controlled templates
- Discord bot token and required gateway intents for the Discord bridge
- Telegram bot token for the Telegram Bot API long-polling bridge

Core terminology:
- `Paper backend` means a real Minecraft server running the Paper jar
- `Velocity proxy` means the proxy process running the Velocity jar
- `STANDALONE` means one Paper server without cross-backend CoreChatX routing
- `PROXY` means a Paper backend connected to a Velocity network
- `server-id` is the unique CoreChatX identity of one Paper backend
- `network-channel` is the plugin messaging channel shared by Paper and Velocity
- `bridge` means Discord or Telegram inbound/outbound relay
- `runtime data file` means generated player/plugin state, not a decorative default config

High-level runtime model:
- Paper owns chat parsing, formatting, commands, chat items, bubbles, pings, local bridge rendering, and all static backend configuration
- In `STANDALONE`, Paper owns runtime player/plugin data in local YAML files
- In `PROXY`, Velocity owns runtime data that must survive backend switches: player settings, nicknames, ignore lists, active channels, mutes, global state, Discord links, and pending link codes
- Velocity also relays network packets, player directory data, global completions, TAB entries, and remote ChatItem snapshot requests
- external bridges are configured on Paper and can export only the channels that opt in
- player-authored chat is sanitized and controlled before it becomes a rendered Adventure component
- server-controlled templates can use MiniMessage and, where supported, PlaceholderAPI

Keep this distinction in mind:
- admin config strings are trusted server templates
- raw player messages are untrusted input
- runtime data files are live state

### CoreChatX project identity

Current public identity:
- product/plugin name: `CoreChatX`
- Paper plugin name: `CoreChatX`
- Velocity plugin id: `corechatx`
- Java package root: `me.icewolf23.corechatx`
- Maven parent artifact: `corechatx-parent`
- Maven runtime artifacts: `corechatx-paper` and `corechatx-velocity`
- shared common module: `corechatx-common`
- default Paper command: `/corechatx`
- default Paper command alias: `/ccx`
- default settings command alias: `/ccxsettings`
- default permission namespace: `corechatx.*`
- default plugin messaging channel: `corechatx:main`

Clean install rule:
- install `corechatx-paper-<version>.jar` on Paper
- install `corechatx-velocity-<version>.jar` on Velocity
- keep Paper data in `plugins/CoreChatX/`
- keep Velocity data in `plugins/corechatx/`

Old install rule:
- do not mix old jars, old plugin ids, old permission namespaces, or old network channels with CoreChatX
- treat older differently named config folders as old install data
- for a clean CoreChatX setup, let the plugin generate fresh defaults and manually reapply only the settings you still want

---

## 1. Layout Overview

### Paper backend folder

```text
plugins/CoreChatX/
```

### Velocity proxy folder

```text
plugins/corechatx/
```

### Files created from bundled defaults on Paper

```text
config.yml
messages.yml
chat.yml
pings.yml
filter.yml
chatitems.yml
keywords.yml
chatbubbles.yml
channels.yml
privacy.yml
moderation.yml
storage.yml
discord.yml
telegram.yml
locales/en_us.yml
```

### Additional Paper runtime files created on demand

```text
playerdata.yml
state.yml
channeldata.yml
ignoredata.yml
mutedata.yml
discordlinks.yml
```

### Files created from bundled defaults on Velocity

```text
velocity-config.properties
```

---

## 2. Reload vs Restart

Safe with `/corechatx reload`:
- `config.yml` for non-identity runtime toggles such as `debug`, hooks, logging, bridge/runtime gates, join/quit, first-join, and reload summary behavior
- `messages.yml`
- `chat.yml`
- `pings.yml`
- `filter.yml`
- `chatitems.yml`
- `keywords.yml`
- `chatbubbles.yml`
- `channels.yml`
- `privacy.yml`
- `moderation.yml`
- `storage.yml`
- `discord.yml`
- `telegram.yml`
- locale files under `locales/`

Requires full restart to truly take effect:
- `config.yml -> deployment.mode`
- `config.yml -> deployment.server-id`
- `config.yml -> deployment.network-channel`
- switching a backend between standalone and proxy deployment
- changing Velocity `velocity-config.properties`; there is no proxy-side config reload command
- when Velocity `velocity-config.properties -> network-channel` changes, affected Paper backends must also use the same new `deployment.network-channel`

Important deployment rule:
- Paper backends and the Velocity proxy must use the exact same network channel

Artifact model:
- CoreChatX currently ships as two separate runtime jars.
- CoreChatX Paper jar: install `corechatx-paper-<version>.jar` on each Paper backend.
- CoreChatX Velocity jar: install `corechatx-velocity-<version>.jar` on the Velocity proxy.
- Do not install the Paper jar on Velocity, and do not install the Velocity jar on Paper.
- source builds also produce `corechatx-common-<version>.jar`, but that is an internal shared module and is not the runtime jar to install on servers

---

## 3. Quick Install Patterns

### Standalone Paper

Use the default backend config:

```yml
deployment:
  mode: "STANDALONE"
  server-id: "paper-1"
  network-channel: "corechatx:main"
  bridges-allowed: true
  network-features-allowed: false
```

In this setup:
- no Velocity module is required
- `NETWORK` channels behave as normal local backend chat
- cross-server PM routing is inactive
- network player directory, global TAB entries, and cross-backend chat completions are inactive

### Velocity network

On each Paper backend:
- set `deployment.mode: "PROXY"`
- set a unique `deployment.server-id`
- set `deployment.network-channel` to the CoreChatX group that backend should join
- set `deployment.network-features-allowed: true`

On Velocity:
- install the Velocity CoreChatX jar
- list every allowed group channel in `velocity-config.properties -> network-channel`

Example backend identities:
- `alpha`
- `beta`
- `survival-1`
- `hub`

Network behavior enabled by this setup:
- `NETWORK` channels can cross backend boundaries
- cross-server PM delivery can use the proxy route
- player communication settings are synchronized through Velocity
- active channel state, ping toggles, PM toggle, social spy, mention notifications, locale, staff-chat state, and ignore lists can follow backend switches
- the proxy can provide global player name completions and TAB entries for players connected to configured backends
- network chat preserves rendered Adventure components, ChatItem preview refs, mentions, and activated custom ping metadata across backends
- Velocity treats the real backend connection as the source of truth for proxy packets; backend-declared source ids cannot override it
- malformed, oversized, or oversized-generated plugin-message payloads are rejected before routing

### Production setup checklist

For a clean standalone Paper install:
- install only the Paper jar
- keep `deployment.mode: "STANDALONE"`
- keep `deployment.network-features-allowed: false`
- configure formats, channels, messages, moderation, chat items, keywords, bubbles, and optional bridges on that backend
- restart after changing deployment identity fields
- use `/corechatx reload` for normal wording, formatting, channel, filter, and feature tuning

For a clean Velocity network install:
- install the Paper jar on every backend
- install the Velocity jar on the proxy
- set every backend to `deployment.mode: "PROXY"`
- give every backend a unique `deployment.server-id`
- set each backend `deployment.network-channel` to the isolated group it should join
- include each backend group channel in `plugins/corechatx/velocity-config.properties -> network-channel`
- set `deployment.network-features-allowed: true` on each backend that should participate in cross-server features
- restart the affected Paper backends and Velocity after changing identity or network channel values

For `2026.2.0` upgrades, a clean setup is recommended. Regenerate fresh Paper and Velocity config files, then reapply server-specific values such as `deployment.*`, channels, Discord token, Discord routes and required role IDs. In proxy mode, do not reuse old backend runtime YAML as authoritative network data because Velocity now owns runtime/user state.

For bridge installs:
- keep `deployment.bridges-allowed: true`
- enable only the bridge services you actually use
- enable outbound export only on the CoreChatX channels that should leave Minecraft
- configure inbound routes so external messages land in an intentional CoreChatX channel
- in `STANDALONE`, Paper `discord.yml` owns Discord bridge inbound/outbound
- in `PROXY`, Velocity `velocity-discord.yml` owns Discord bridge inbound/outbound and forwards packets to the proper CoreChatX group
- in `PROXY`, Paper `discord.yml` may still run `discord.console.*` for backend console access only

For PlaceholderAPI-heavy installs:
- install PlaceholderAPI on every backend that must render placeholders
- install the expansions required by your formats
- keep raw player messages separate from admin templates
- remember that mention token placeholders use the mentioned player as context
- test offline-player placeholder behavior before relying on it for cross-backend hover text

For ChatItems on a network:
- keep ChatItems enabled only on the channels where previews are wanted
- tune byte limits only if you understand the size of your custom item metadata
- prefer the bundled on-demand snapshot flow over embedding huge item data into every network chat packet
- accept that expired or rejected snapshots should fail closed with a normal expired-preview message

---

## 4. Paper Backend Files

## 4.1 `config.yml`

Purpose:
- deployment mode
- backend identity
- proxy transport gates
- bridge master switch
- hook toggles
- logging toggles
- general reload/save behavior

Current bundled default:

```yml
# Core plugin settings.

deployment:
  # STANDALONE = Paper-only mode. Runtime player data is stored in this backend's YAML files.
  # PROXY = Velocity-backed network mode. Runtime player data is owned by the CoreChatX Velocity module.
  # Changing this mode requires a full restart.
  mode: "STANDALONE"
  require-full-restart-on-mode-change: true
  # Backend id used for proxy routing and bridge source labels.
  server-id: "paper-1"
  # Plugin messaging channel shared with the Velocity module.
  # In PROXY mode this also selects the isolated Velocity data/routing group for this backend.
  network-channel: "corechatx:main"
  # Global switch for Discord / Telegram chat bridge runtime.
  # Discord console-only bots may still start through discord.yml -> discord.console.*.
  bridges-allowed: true
  # When false, Paper still boots in PROXY mode but proxy transport is intentionally disabled.
  # Cross-server chat, PM routing, player directory sync, and proxy-owned runtime data operations will not run.
  network-features-allowed: false
  pending-pm-timeout-seconds: 20

debug: false

hooks:
  # If true, PlaceholderAPI placeholders inside CoreChatX config formats are parsed when the plugin is present.
  placeholderapi: true
  # If true, LuckPerms group prefixes are read when the plugin is present.
  luckperms: true

logging:
  public-chat: true
  private-messages: true
  broadcasts: true
  reload: true
  errors: true

player-data:
  # STANDALONE only: toggle commands still save immediately; this mainly controls the fallback save on plugin disable.
  # In PROXY mode player settings, nicknames, ignore lists, active channel, mutes, global state and Discord links are stored by Velocity.
  auto-save-on-disable: true

nicknames:
  # Prefix prepended to {player_nickname} only when the player has a custom nickname.
  # Leave empty to show the nickname exactly as set with /nick.
  # Example: "~" makes {player_nickname} render as ~Nick while {player_name} still renders the real Minecraft username.
  prefix: ""
  # false = /nick can change the visible name text and styling, for example IceWolf23X -> IceWolf.
  # true = /nick can only change allowed colors/styles; the visible text after removing formatting must stay exactly the real Minecraft username.
  # Example with true: IceWolf23X may use &cIceWolf23X, but not &cIceWolf.
  change-only-colors: false

first-join:
  enabled: true
  counter-enabled: true

join-quit:
  # LOCAL = announce only on the current Paper backend.
  # NETWORK = in PROXY mode, announce true network join/leave through the Velocity module.
  mode: "LOCAL"
  join-enabled: true
  quit-enabled: true

reload:
  # A short summary is shown to the command sender after a successful reload.
  show-summary: true
```

Operational notes:
- `deployment.mode`, `deployment.server-id`, and `deployment.network-channel` require restart
- the startup log prints a `CORECHATX` banner with version, author, Paper architecture, project-link placeholder, then the deployment summary and transport state
- invalid proxy channel config does not crash the whole plugin; it degrades transport and logs the reason
- network channels must use lowercase Minecraft namespaced-key style, such as `corechatx:main` or `corechatx:network/main`
- invalid channel examples include `CoreChatX:main`, `core chat x:main`, `corechatx`, and `corechatx:Main`
- `deployment.bridges-allowed: false` disables outbound bridge dispatch and inbound Discord/Telegram chat bridge runtime; Discord console-only bots can still start through `discord.console.*`
- `deployment.network-features-allowed: false` leaves `PROXY` deployment bootable but intentionally disables proxy transport and all cross-server features
- `deployment.pending-pm-timeout-seconds` is clamped to at least 5 seconds
- with `hooks.placeholderapi: true`, almost every player-facing configurable string supports PlaceholderAPI placeholders when PlaceholderAPI is installed
- CoreChatX also registers `%corechatx_player_nickname%`, `%corechatx_first_join_date%` and `%corechatx_messages_count%` for other plugins when PlaceholderAPI is installed

---

## 4.2 `chat.yml`

Purpose:
- public chat formatting
- group-specific format overrides
- mention token formatting
- public and PM cooldowns

Current bundled default:

```yml
# Public chat formatting and moderation settings.

public-chat:
  enabled: true
  # Supported placeholders inside the format:
  # {plugin_prefix}, {channel_prefix}, {rank_prefix}, {player_name}, {player_nickname}, {message}
  # {player_name} is always the real Minecraft username.
  # {player_nickname} is the custom nickname when set, otherwise the real Minecraft username.
  # Layout inspired by the older NetworkChat proxy format:
  # prefix + player name + italic separator + processed message.
  # CoreChatX keeps its own default palette instead of copying the old colors verbatim.
  format: "{plugin_prefix} {channel_prefix}{rank_prefix}<white>{player_nickname}</white><dark_gray><italic>» </italic></dark_gray>{message}"
  # Optional group-specific format overrides keyed by LuckPerms primary group.
  # These are used only when channels.yml -> format is blank for the active channel.
  # Keys must match the LuckPerms primary group in lowercase.
  group-formats:
    owner: "{plugin_prefix} {channel_prefix}{rank_prefix}<white>{player_nickname}</white><dark_gray><italic>» </italic></dark_gray>{message}"
    admin: "{plugin_prefix} {channel_prefix}{rank_prefix}<white>{player_nickname}</white><dark_gray><italic>» </italic></dark_gray>{message}"
    mod: "{plugin_prefix} {channel_prefix}{rank_prefix}<white>{player_nickname}</white><dark_gray><italic>» </italic></dark_gray>{message}"
    vip: "{plugin_prefix} {channel_prefix}{rank_prefix}<white>{player_nickname}</white><dark_gray><italic>» </italic></dark_gray>{message}"
    default: "{plugin_prefix} {channel_prefix}{rank_prefix}<gray>{player_nickname}</gray><dark_gray><italic>» </italic></dark_gray>{message}"
  plugin-prefix: "<dark_gray>[</dark_gray><gradient:#79d6b8:#5aa9ff>Chat</gradient><dark_gray>]</dark_gray>"
  # Applied to non-global active channels such as local or staff.
  channel-prefix-format: "<dark_gray>[</dark_gray><white>{channel_name}</white><dark_gray>]</dark_gray> "
  fallback-rank-prefix: ""

mentions:
  enabled: true
  # Mention matching accepts both Steve and @Steve when the token matches a local or network-online player exactly.
  # If disabled, names are left as normal text and no mention notification logic runs.
  # The resolver accepts real usernames and custom plain nicknames; this format controls what the rendered mention displays.
  # {player_name} is the real Minecraft username. {player_nickname} is the visible nickname when set.
  token-format: "<#79d6b8>@{player_nickname}</#79d6b8>"

cooldowns:
  public:
    enabled: true
    seconds: 2
  private-messages:
    enabled: false
    seconds: 2
```

Format priority:
1. `channels.<id>.format`
2. `public-chat.group-formats.<luckperms-primary-group>`
3. `public-chat.format`

Important notes:
- `{rank_prefix}` works in every `group-formats.<group>` entry
- if LuckPerms is not available, group-specific formats are skipped and CoreChatX falls back to the base format
- if you already manage rank prefixes in LuckPerms, prefer `{rank_prefix}` over hardcoded titles in this file
- PlaceholderAPI placeholders can be used in most admin-controlled rendered strings, including chat formats and group formats, when PlaceholderAPI support is enabled
- raw player-authored message bodies do not pass through PlaceholderAPI; this prevents players from resolving arbitrary `%placeholder%` tokens inside normal chat text
- `mentions.token-format` resolves `{player_name}` to the mentioned player's name
- PlaceholderAPI in `mentions.token-format` uses the mentioned player as context, not the sender
- for cross-backend mentions, CoreChatX uses the mentioned player's `OfflinePlayer` context so PlaceholderAPI expansions with offline support can still resolve
- negative cooldown seconds are treated as `0`

---

## 4.3 `messages.yml`

Purpose:
- general user-facing text
- command feedback
- PM layouts
- moderation messages
- join/quit messages
- chat item feedback

Current bundled default:

```yml
# Main message file.
# Supported placeholders vary by message, but common ones include:
# {prefix}, {player_name}, {player_nickname}, {target_name}, {sender_name}, {message}, {seconds}, {count}, {setting}, {state}

prefix: "<dark_gray>[</dark_gray><gradient:#79d6b8:#5aa9ff>CoreChatX</gradient><dark_gray>]</dark_gray>"

errors:
  no-permission: "{prefix} <red>You do not have permission to do that.</red>"
  players-only: "{prefix} <red>Only players can use this command.</red>"
  player-not-found: "{prefix} <red>That player is not online.</red>"
  cannot-message-self: "{prefix} <red>You cannot message yourself.</red>"
  empty-message: "{prefix} <red>Your message is empty after sanitization.</red>"
  no-reply-target: "{prefix} <red>You do not have anyone to reply to.</red>"
  invalid-chatitem-id: "{prefix} <red>This chat item preview is no longer available.</red>"
  invalid-usage: "{prefix} <red>Usage: {usage}</red>"
  runtime-storage-unavailable: "{prefix} <red>CoreChatX runtime data is temporarily unavailable. Try again in a moment.</red>"

reload:
  success: "{prefix} <green>Reload complete.</green>"
  summary: "{prefix} <gray>Modules reloaded: chat, pings, PMs, filter, chat items, player data hooks.</gray>"

commands:
  corechatx-help:
    header: "{prefix} <gray>Available CoreChatX subcommands:</gray>"
    reload: "<gray>/corechatx reload</gray>"
    settings: "<gray>/corechatx settings</gray>"
    locale: "<gray>/corechatx locale [tag]</gray>"

locale:
  current: "{prefix} <gray>Your active locale is <white>{locale}</white>.</gray>"
  changed: "{prefix} <gray>Your locale is now <white>{locale}</white>.</gray>"
  invalid: "{prefix} <red>Locale <white>{locale}</white> is not available on this server.</red>"

channels:
  list: "{prefix} <gray>Available channels: <white>{channels}</white></gray>"
  switched: "{prefix} <gray>Your active channel is now <white>{channel_name}</white>.</gray>"
  not-found: "{prefix} <red>Channel <white>{channel_name}</white> does not exist.</red>"
  disabled: "{prefix} <red>Channel <white>{channel_name}</white> is currently disabled.</red>"
  no-send-permission: "{prefix} <red>You cannot send messages to that channel.</red>"

privacy:
  ignore-disabled: "{prefix} <red>Ignore commands are currently disabled.</red>"
  ignore-self: "{prefix} <red>You cannot ignore yourself.</red>"
  ignore-limit: "{prefix} <red>You cannot ignore more than <white>{limit}</white> players.</red>"
  already-ignoring: "{prefix} <yellow>You are already ignoring <white>{target_name}</white>.</yellow>"
  not-ignoring: "{prefix} <yellow>You are not ignoring <white>{target_name}</white>.</yellow>"
  ignore-added: "{prefix} <gray>You are now ignoring <white>{target_name}</white>.</gray>"
  ignore-removed: "{prefix} <gray>You are no longer ignoring <white>{target_name}</white>.</gray>"
  ignore-list: "{prefix} <gray>Ignored players: <white>{targets}</white></gray>"
  pm-toggled: "{prefix} <gray>Private messages are now <white>{state}</white>.</gray>"

moderation:
  mute-disabled: "{prefix} <red>Mute commands are currently disabled.</red>"
  mutechat-disabled: "{prefix} <red>Global chat mute is currently disabled.</red>"
  muted-public: "{prefix} <red>You are muted and cannot use public chat right now.</red>"
  muted-private: "{prefix} <red>You are muted and cannot send private messages right now.</red>"
  chat-muted: "{prefix} <red>Public chat is currently muted.</red>"
  chat-muted-toggled: "{prefix} <gray>Global chat mute is now <white>{state}</white>.</gray>"
  anti-repeat: "{prefix} <red>Please do not repeat the same message.</red>"
  anti-caps: "{prefix} <red>Please avoid excessive caps.</red>"
  mute-success: "{prefix} <gray>Muted <white>{target_name}</white>. Reason: <white>{reason}</white></gray>"
  unmute-success: "{prefix} <gray>Unmuted <white>{target_name}</white>.</gray>"
  clear-chat-notice: "{prefix} <gray>Chat was cleared by <white>{sender_name}</white>.</gray>"
  clear-chat-sender: "{prefix} <gray>Cleared chat for <white>{count}</white> online player(s).</gray>"

cooldown:
  public: "{prefix} <yellow>You must wait <white>{seconds}</white> more second(s) before chatting again.</yellow>"
  pm: "{prefix} <yellow>You must wait <white>{seconds}</white> more second(s) before sending another private message.</yellow>"

ping:
  toggles:
    # Used by /ping <sound|actionbar> status with placeholders {setting} and {state}.
    status: "{prefix} <gray>Ping <white>{setting}</white> notifications are currently <white>{state}</white>.</gray>"
    sound-changed: "{prefix} <gray>Ping sound notifications are now <white>{state}</white>.</gray>"
    actionbar-changed: "{prefix} <gray>Ping actionbar notifications are now <white>{state}</white>.</gray>"
  state-on: "<green>enabled</green>"
  state-off: "<red>disabled</red>"
  # Used when a player is pinged by a mention or a custom ping.
  notification-actionbar: "<gold>Ping:</gold> <yellow>{sender_name}</yellow> mentioned you."
  notification-sound: "ENTITY_EXPERIENCE_ORB_PICKUP"
  notification-volume: 0.85
  notification-pitch: 1.25

private-messages:
  to-sender: "<dark_gray>[</dark_gray><light_purple>PM</light_purple><dark_gray>]</dark_gray> <gray>you -> </gray><white>{target_name}</white><dark_gray>: </dark_gray>{message}"
  to-target: "<dark_gray>[</dark_gray><light_purple>PM</light_purple><dark_gray>]</dark_gray> <white>{sender_name}</white><gray> -> you</gray><dark_gray>: </dark_gray>{message}"
  spy: "<dark_gray>[</dark_gray><red>SPY</red><dark_gray>]</dark_gray> <white>{sender_name}</white><gray> -> </gray><white>{target_name}</white><dark_gray>: </dark_gray>{message}"
  disabled-target: "{prefix} <red>That player has private messages disabled.</red>"
  blocked-by-target: "{prefix} <red>That player is not accepting messages from you.</red>"
  remote-unavailable: "{prefix} <red>The proxy transport could not forward that private message right now.</red>"
  received-sound: "BLOCK_NOTE_BLOCK_BELL"
  received-volume: 0.85
  received-pitch: 1.1
  socialspy-on: "{prefix} <gray>Social spy is now <green>enabled</green>.</gray>"
  socialspy-off: "{prefix} <gray>Social spy is now <red>disabled</red>.</gray>"

broadcast:
  format: "<dark_gray>[</dark_gray><gold>Broadcast</gold><dark_gray>]</dark_gray> <white>{sender_name}</white><dark_gray>: </dark_gray><gold>{message}</gold>"

nickname:
  changed: "{prefix} <gray>Your nickname is now <white>{nickname}</white>.</gray>"
  cleared: "{prefix} <gray>Your nickname has been cleared.</gray>"
  changed-other: "{prefix} <gray>Set <white>{target_name}</white>'s nickname to <white>{nickname}</white>.</gray>"
  cleared-other: "{prefix} <gray>Cleared <white>{target_name}</white>'s nickname.</gray>"
  invalid: "{prefix} <red>That nickname is invalid. Use one visible word after formatting is removed.</red>"
  duplicate: "{prefix} <red>That nickname is already used by another player or matches another player's real username.</red>"
  name-change-disabled: "{prefix} <red>Nicknames can only change colors/styles. The visible text must stay exactly the player's real Minecraft username.</red>"
  too-long: "{prefix} <red>Nicknames can be at most <white>{limit}</white> visible characters.</red>"
  realname: "{prefix} <white>{player_nickname}</white><gray>'s real name is </gray><white>{player_name}</white><gray>.</gray>"
  realname-not-found: "{prefix} <red>No custom nickname matches that value.</red>"

discord:
  link-code: "{prefix} <gray>Use Discord command <white>/link code:{code}</white> within <white>{minutes}</white> minute(s) to link your account.</gray>"
  link-required-kick: "<red>You must link your Discord account to play.</red>\n<gray>Use Discord command </gray><white>/link code:{code}</white><gray> within </gray><white>{minutes}</white><gray> minute(s).</gray>"
  missing-required-role-kick: "<red>Your Discord account is linked, but you do not have the required Discord role to play.</red>"
  role-check-unavailable-kick: "<red>Discord role verification is temporarily unavailable. Try again later.</red>"
  already-linked: "{prefix} <yellow>Your Minecraft account is already linked to Discord. Use <white>/discord unlink</white> first.</yellow>"
  linking-disabled: "{prefix} <red>Discord account linking is currently disabled.</red>"
  link-unavailable: "{prefix} <red>Discord account linking data is temporarily unavailable. Try again later.</red>"
  linked-status: "{prefix} <gray>Your Minecraft account is linked to Discord user id <white>{discord_id}</white>.</gray>"
  not-linked: "{prefix} <yellow>No Discord account is linked.</yellow>"
  unlinked: "{prefix} <gray>Discord account link removed.</gray>"
  admin-linked: "{prefix} <gray>Linked <white>{player_name}</white> to Discord user id <white>{discord_id}</white>.</gray>"
  invalid-discord-id: "{prefix} <red>That Discord user id is invalid.</red>"

chat:
  no-message-sent: "{prefix} <yellow>Nothing was sent because the message is empty after sanitization.</yellow>"

join-quit:
  join: "<dark_gray>[</dark_gray><green>+</green><dark_gray>]</dark_gray> <white>{player_nickname}</white>"
  quit: "<dark_gray>[</dark_gray><red>-</red><dark_gray>]</dark_gray> <white>{player_nickname}</white>"
  first-join: "<dark_gray>[</dark_gray><gradient:#79d6b8:#5aa9ff>Welcome</gradient><dark_gray>]</dark_gray> <white>{player_nickname}</white><gray> is joining for the first time as player </gray><white>#{count}</white><gray>.</gray>"

chatitems:
  # Hover shown on clickable chat preview tokens.
  click-to-open: "<gray>Click to open the saved preview.</gray>"
  expired: "{prefix} <red>This preview has expired or was cleared during reload/restart.</red>"
```

Locale note:
- `messages.yml` remains the final fallback source for message keys
- locale files can override individual keys without forcing you to duplicate the whole file

---

## 4.4 `channels.yml`

Purpose:
- channel definitions
- delivery scope
- per-channel permission gates
- per-channel mention and chat-item behavior
- per-channel bridge export control
- optional per-channel chat format

Current bundled default:

```yml
# Channel defaults.
# In STANDALONE mode, NETWORK still behaves as a normal local channel unless the proxy bridge is enabled.
# In PROXY mode, only channels with scope NETWORK are forwarded cross-server.
# SERVER and LOCAL_RADIUS always stay backend-local.

channels:
  global:
    enabled: true
    default: true
    scope: "NETWORK"
    permission-send: ""
    permission-receive: ""
    # Controls whether player names and custom ping tokens are parsed by source.
    allow-mentions:
      from-minecraft: true
      from-discord: true
      from-telegram: true
    # If false, [item]/[inv]/[ec] tokens stay plain text in this channel.
    allow-chatitems: true
    # If false, successful player chat in this channel does not create overhead chat bubbles.
    allow-chat-bubbles: true
    # If true, locally-sent messages in this channel may be exported to Discord / Telegram bridges.
    export-to-bridges: true
    # Optional per-channel format. Leave blank to use chat.yml -> public-chat.format.
    format: ""
    discord:
      # Optional Discord format for Minecraft -> Discord messages from this channel.
      # Leave blank to use discord.yml -> discord.format.
      outbound-format: ""
      # Optional Discord format for Discord -> Minecraft messages routed to this channel.
      # Leave blank to use discord.yml -> discord.inbound.format.
      inbound-format: ""
      # Account-link requirement override for Discord -> Minecraft messages routed to this CoreChatX channel.
      # Values: inherit, true, false.
      require-linked-inbound: "inherit"
    telegram:
      # Optional Telegram format for Minecraft -> Telegram messages from this channel.
      # Leave blank to use telegram.yml -> telegram.format.
      outbound-format: ""
      # Optional Telegram format for Telegram -> Minecraft messages routed to this channel.
      # Leave blank to use the regular CoreChatX channel chat format.
      inbound-format: ""
  local:
    enabled: true
    default: false
    scope: "LOCAL_RADIUS"
    radius: 100
    permission-send: "corechatx.channel.local"
    permission-receive: ""
    allow-mentions:
      from-minecraft: true
      from-discord: true
      from-telegram: true
    allow-chatitems: true
    allow-chat-bubbles: true
    export-to-bridges: false
    format: ""
    discord:
      outbound-format: ""
      inbound-format: ""
      require-linked-inbound: "inherit"
    telegram:
      outbound-format: ""
      inbound-format: ""
  staff:
    enabled: true
    default: false
    scope: "NETWORK"
    permission-send: "corechatx.channel.staff"
    permission-receive: "corechatx.staff"
    allow-mentions:
      from-minecraft: true
      from-discord: true
      from-telegram: true
    allow-chatitems: false
    allow-chat-bubbles: false
    export-to-bridges: true
    format: ""
    discord:
      outbound-format: ""
      inbound-format: ""
      require-linked-inbound: "inherit"
    telegram:
      outbound-format: ""
      inbound-format: ""
```

Important behavior:
- invalid dynamic permission nodes are detected and warned during load
- only the broken binding is disabled; the plugin does not crash for one malformed permission
- `export-to-bridges: true` means locally-originating messages in that channel are eligible for Discord/Telegram outbound export
- in proxy mode, outbound bridge export is performed only from the source backend so a network message is not exported once per backend
- `discord.outbound-format` and `telegram.outbound-format` override the global bridge export format for that channel
- `discord.inbound-format` and `telegram.inbound-format` override how inbound bridge messages are displayed when routed to that channel

---

## 4.5 `pings.yml`

Purpose:
- mention notification toggles
- custom ping definitions
- permission rules for custom pings

Current bundled default:

```yml
# Mention and custom ping behaviour.

mentions:
  # Global switches for notification delivery once a target is selected.
  notify-sound: true
  notify-actionbar: true

custom-pings:
  # Each entry is generic and fully data-driven:
  # trigger = visible token matched in chat
  # use-permission = who may activate it
  # receive-permission = who may be targeted; leave blank for everyone online
  # discord-roles = Discord role IDs allowed to activate this ping from Discord; empty blocks Discord usage
  # bypass-toggle = if true, recipients are notified even when they disabled ping sound/actionbar
  # token-format = how the token itself is rendered in chat
  all:
    trigger: "@all"
    use-permission: "corechatx.ping.use.all"
    receive-permission: ""
    discord-roles: []
    bypass-toggle: false
    token-format: "<#79d6b8>{trigger}</#79d6b8>"
  help:
    trigger: "@help"
    use-permission: "corechatx.ping.use.help"
    receive-permission: "corechatx.ping.receive.help"
    discord-roles: []
    bypass-toggle: false
    token-format: "<#5aa9ff>{trigger}</#5aa9ff>"
  staff:
    trigger: "@staff"
    use-permission: "corechatx.ping.use.staff"
    receive-permission: "corechatx.staff"
    discord-roles: []
    bypass-toggle: true
    token-format: "<#ff8f8f>{trigger}</#ff8f8f>"
```

Validation note:
- `use-permission` and `receive-permission` are validated
- malformed dynamic permission nodes are warned and individually disabled

Network note:
- when a custom ping is activated in a `NETWORK` channel, CoreChatX forwards the activated ping metadata with the message so remote backends can deliver the matching actionbar/sound notification locally

---

## 4.6 `privacy.yml`

Purpose:
- PM defaults
- staff PM bypass behavior
- ignore system configuration

Current bundled default:

```yml
# Privacy defaults.

private-messages:
  enabled-by-default: true
  allow-staff-bypass: true
  staff-bypass-permission: "corechatx.staff"

ignore:
  enabled: true
  max-ignored-players: 200
  # If true, ignored players also stop mention/custom-ping notifications.
  block-mentions-from-ignored: true
```

Validation note:
- `staff-bypass-permission` is also validated
- if malformed, only that bypass binding is disabled and the plugin logs a warning
- `ignore.max-ignored-players` is clamped to `0` or higher

---

## 4.7 `moderation.yml`

Purpose:
- mute behavior
- mutechat master switch
- anti-repeat
- anti-caps

Current bundled default:

```yml
# Moderation defaults.

mute:
  enabled: true
  # If true, active mutes also block /msg and /reply.
  block-private-messages: true
  default-reason: "No reason provided"

mutechat:
  enabled: true

anti-repeat:
  enabled: true
  history-window: 3
  block-identical: true

anti-caps:
  enabled: false
  min-length: 8
  max-uppercase-ratio: 0.7
```

Bounds note:
- `anti-repeat.history-window` is clamped to at least `1`
- `anti-caps.min-length` is clamped to at least `1`

---

## 4.8 `filter.yml`

Purpose:
- word filter behavior
- replacement style
- optional hover over censored words

Current bundled default:

```yml
# Word filter configuration.

enabled: true

# The filter censors and still sends the message.
blocked-words:
  - idiota
  - stupido

replacement-character: "*"

hover-original:
  enabled: false
  text: "<gray>Original term:</gray> <red>{word}</red>"
```

Important behavior:
- this is a censoring filter, not a whole-message dropper by default

---

## 4.9 `chatitems.yml`

Purpose:
- token aliases
- permission nodes per token family
- visible token formatting
- preview expiration
- preview inventory titles

Current bundled default:

```yml
# Chat item token configuration.
# Every token is matched on sanitized player text.
# If the sender lacks the configured permission, the message is still sent
# but that token stays plain text and no preview is created.

tokens:
  item:
    # [item] upgrades to [shulker] automatically when the held item is a shulker box
    # and the sender has corechatx.chatitem.shulker.
    # The snapshot stores the held item exactly as it looked when the message was sent.
    aliases: [ "[item]", "[i]" ]
    permission: "corechatx.chatitem.item"
    token-format: "<#79d6b8>[item]</#79d6b8>"
    shulker-token-format: "<#5fc7c2>[shulker]</#5fc7c2>"
  armor:
    # Opens a read-only preview with helmet, chestplate, leggings, boots, and offhand.
    aliases: [ "[armor]" ]
    permission: "corechatx.chatitem.armor"
    token-format: "<#6fb6ff>[armor]</#6fb6ff>"
  hotbar:
    # Shows the first 9 inventory slots from the sender at message time.
    aliases: [ "[hotbar]" ]
    permission: "corechatx.chatitem.hotbar"
    token-format: "<#8bc8ff>[hotbar]</#8bc8ff>"
  inventory:
    # Includes the main inventory plus armor and offhand in a read-only snapshot.
    aliases: [ "[inventory]", "[inv]" ]
    permission: "corechatx.chatitem.inventory"
    token-format: "<#5aa9ff>[inventory]</#5aa9ff>"
  enderchest:
    # Opens the sender ender chest snapshot captured when the message was sent.
    aliases: [ "[enderchest]", "[ender]", "[ec]" ]
    permission: "corechatx.chatitem.enderchest"
    token-format: "<#7db8ff>[enderchest]</#7db8ff>"

previews:
  # Snapshots are ephemeral runtime data. Reload clears them to avoid mixing old and new state.
  # Expired or cleared previews will no longer open from old chat messages.
  expire-after-minutes: 30
  titles:
    # {player_name} is always the real snapshot owner's username.
    # {player_nickname} uses the owner's custom nickname when available.
    item: "<#79d6b8>{player_nickname}'s item</#79d6b8>"
    shulker: "<#5fc7c2>{player_nickname}'s shulker</#5fc7c2>"
    armor: "<#6fb6ff>{player_nickname}'s armor</#6fb6ff>"
    hotbar: "<#8bc8ff>{player_nickname}'s hotbar</#8bc8ff>"
    inventory: "<#5aa9ff>{player_nickname}'s inventory</#5aa9ff>"
    enderchest: "<#7db8ff>{player_nickname}'s ender chest</#7db8ff>"

network:
  # Network mode sends only lightweight snapshot refs in chat packets.
  # Multiple ChatItem tokens in the same message share one snapshot bundle with per-token views.
  # The full bundle is fetched from the source backend when a remote player clicks a view.
  request-timeout-seconds: 5
  # Maximum unique snapshot bundle refs attached to one network chat message.
  # The plugin-message protocol currently hard-caps the effective value to 3.
  max-snapshots-per-message: 3
  max-compressed-bytes: 30000
  max-uncompressed-bytes: 2097152
  max-item-bytes: 262144
```

Behavior notes:
- if the sender lacks the required permission, the token stays plain text
- snapshots are runtime objects and are cleared on reload/restart
- multiple ChatItem tokens in the same player message share one snapshot UUID/bundle; each token click carries the requested view, such as `item`, `armor`, or `inventory`
- snapshot UUIDs are treated as short-lived capability ids: anyone who received the rendered chat component can open the available preview views until it expires, but ids are random, not listed, and not persisted
- in proxy mode, chat packets carry only lightweight ChatItem bundle refs; on click, Velocity requests the full bundle from the source backend and forwards the response to the requesting backend
- Velocity can cache a returned remote bundle until it expires, so later clicks on other views from the same message do not have to ask the source backend again
- because current per-message parsing shares one bundle, normal chat generally emits one bundle ref even when the message contains several ChatItem tokens; `network.max-snapshots-per-message` remains a defensive protocol bound
- if the remote bundle is missing, expired, rejected, or not returned before `network.request-timeout-seconds`, the player receives the normal expired-preview feedback
- oversized or invalid ChatItem bundle payloads are rejected without blocking the chat message itself
- `network.max-compressed-bytes`, `network.max-uncompressed-bytes`, and `network.max-item-bytes` protect Paper-side bundle serialization and import during remote click handling
- `network.request-timeout-seconds` is clamped to at least `1`
- ChatItem byte limits are clamped to at least `1024` bytes

---

## 4.9.1 `keywords.yml`

Purpose:
- interactive reusable chat tokens
- one MiniMessage renderer per keyword
- optional permission gates
- optional PlaceholderAPI expansion per keyword
- optional channel restrictions

Current bundled default:

```yml
# Interactive keyword token configuration.
# Each keyword replaces one or more literal aliases with one MiniMessage renderer.

keywords:
  discord:
    enabled: true
    tokens: [ "[discord]", "[dc]" ]
    renderer: "<blue><hover:show_text:'<gray>Join our Discord</gray>'><click:open_url:'https://discord.gg/example'>discord</click></hover></blue>"
    allow-placeholderapi: false
    permission: "corechatx.keywords.use.discord"
    enabled-channels: []
    disabled-channels: []

  rules:
    enabled: true
    tokens: [ "[rules]" ]
    renderer: "<yellow><hover:show_text:'<gray>Click to read the rules</gray>'><click:run_command:'/rules'>rules</click></hover></yellow>"
    allow-placeholderapi: false
    permission: ""
    enabled-channels: []
    disabled-channels: []
```

Behavior notes:
- token aliases are matched literally and case-sensitively
- if a sender lacks the configured permission, the token remains plain text
- if `enabled-channels` is non-empty, the keyword only works in those channels
- if the current channel is listed in `disabled-channels`, the token remains plain text
- if `allow-placeholderapi: true`, PlaceholderAPI is applied to the renderer before MiniMessage deserialization when PlaceholderAPI is installed and enabled
- in proxy mode, network chat and remote PMs transport the rendered component from the source backend
- invalid keyword definitions only disable themselves and log a warning

---

## 4.9.2 `chatbubbles.yml`

Purpose:
- optional overhead chat bubbles for successful player public chat
- per-player default toggle
- channel/world filtering
- TextDisplay visual settings
- lifetime, stacking, wrapping, and cleanup behavior

Current bundled default:

```yml
# Chat bubbles / overhead chat configuration.

enabled: true
default-enabled: true

permission: "corechatx.chatbubbles.use"

enabled-channels: []
disabled-channels: [ "staff" ]

max-active-bubbles: 3

base-height: 0.75
stack-offset: 0.32

max-visible-distance: 32

base-duration-ticks: 80
ticks-per-character: 2
max-duration-ticks: 160

max-plain-length: 80
max-line-length: 28

shadow: true
see-through: false

text-color: "#FFFFFF"
background-color: "#80000000"

hide-while-sneaking: false
hide-if-invisible: true

world-filter:
  enabled: false
  disabled-worlds: []

renderer:
  format: "{message}"
```

Behavior notes:
- bubbles are created only after public chat passes normal CoreChatX checks
- the bubble text is derived from the already processed message body, not raw input
- `allow-chat-bubbles: false` in `channels.yml` disables bubbles for that channel
- player settings include a persistent chat bubbles toggle
- in proxy mode, bubbles stay local to the Paper backend where the sender physically is
- bubble entities are removed on expiry, player quit, reload, and plugin disable
- numeric bubble limits are bounded defensively: counts and text lengths stay at least `1`, `ticks-per-character` stays at least `0`, and distances/offsets cannot become invalid negative values

---

## 4.10 `discord.yml`

Purpose:
- Discord outbound formatting and routing
- Discord inbound gateway relay settings
- route mapping from Discord channels into CoreChatX channels
- optional Paper console bot settings, including backend console commands and live log mirroring

Current bundled default:

```yml
# Discord integration for Paper.
# STANDALONE owns chat bridge, account linking and optional console here.
# PROXY keeps chat bridge/account linking on Velocity, but may still run a local console-only bot per backend.

account-linking:
  # Master switch for Discord-Minecraft account linking.
  # STANDALONE: this backend owns the bot, link codes, linked accounts and optional Discord role checks.
  # PROXY: configure the bot, Discord bridge routes and login gates in Velocity's velocity-discord.yml instead.
  # Paper keeps this file for standalone setups and local formatting only.
  enabled: false
  # If true, unlinked Discord users cannot write through routed Discord inbound channels.
  # Route and channel overrides can still force true/false for specific destinations.
  require-linked: false
  # If true, unlinked Minecraft players are kicked after joining the backend with a code to use in Discord command /link code:<code>.
  require-linked-to-play: false
  required-play-roles:
    # Extra gate for require-linked-to-play. When enabled, linked players must also have at least one listed Discord role.
    enabled: false
    # Discord guild/server id used for the role check.
    # If blank and the standalone Paper bot is in one guild, that guild is used automatically.
    guild-id: ""
    # Discord role ids allowed to join. Empty list disables the role gate and logs a warning when enabled.
    role-ids: []
    # If true, kick linked players when Discord role verification cannot be completed.
    deny-if-unverifiable: true
  # Deletes blocked unlinked messages when the bot has Discord's Manage Messages permission.
  delete-unlinked-messages: true
  # Sends a private Discord DM explaining why the message was blocked.
  dm-unlinked-users: true
  # Link codes generated by /discord link or required-link-to-play expire after this many minutes.
  code-expire-minutes: 10
  # If true, linked Discord users may chat while the Minecraft account is offline when stored data and LuckPerms data can be resolved.
  allow-offline-linked-players: true
  # If true, Minecraft mute state blocks linked Discord inbound messages.
  enforce-minecraft-mutes: true
  # If true, the linked Minecraft account must have permission to send to the target CoreChatX channel.
  enforce-channel-send-permission: true
  # Rate limit for warnings when CoreChatX cannot delete a Discord message because the bot lacks Manage Messages.
  missing-manage-messages-warning-seconds: 300
  # STANDALONE only: Discord slash command names registered by the backend that runs the Discord bot.
  # If another plugin already owns /link, change these names before starting the bot.
  link-command-name: "link"
  unlink-command-name: "unlink"
  messages:
    unlinked-dm: "Link your Minecraft account before chatting in this channel. Run /discord link in-game, then use the Discord /link command with that code here."
    linked: "Your Discord account is now linked to {player_name}."
    unlinked: "Your Discord account has been unlinked."
    not-linked: "This Discord account is not linked to a Minecraft account."
    already-linked: "This Discord account or Minecraft account is already linked. Unlink it first."
    code-not-found: "That link code is invalid or expired."
    minecraft-denied: "Your linked Minecraft account cannot send messages to that channel right now."

discord:
  # STANDALONE: enables the Paper-owned Discord bot for bridge/linking/console.
  # PROXY: enables only discord.console.* on this backend; bridge/account-linking targets must be configured on Velocity.
  enabled: false
  bot-token: ""
  default-channel-id: ""
  format: "[{source_server}] [{channel_id}] {rank_prefix}{sender_name}: {plain_text}"
  # If true, Minecraft -> Discord bridge output breaks Discord mention tokens before sending.
  # This prevents players from pinging Discord users, roles, @everyone or @here by typing raw Discord mention syntax in Minecraft.
  prevent-mentions-from-minecraft: true
  connection-messages:
    # STANDALONE only. In PROXY, configure Discord join/quit mirrors in Velocity's velocity-discord.yml.
    # If true, CoreChatX mirrors accepted join, first-join and quit messages to Discord.
    # Messages are sent only when the Minecraft join/quit message is actually announced.
    enabled: false
    # CoreChatX channel ids that should receive join/quit mirrors.
    # Empty list = all enabled channels with export-to-bridges: true and a Discord target.
    channels: []
    # Tokens: {source}, {source_type}, {source_server}, {channel_id}, {sender_name}, {rank_prefix}, {plain_text}, {message}
    format: "{plain_text}"
    # Optional action-specific plain-text formats. Leave empty to use format above.
    join-format: ""
    first-join-format: ""
    quit-format: ""
    embed:
      # If true, join/quit mirrors are sent as a Discord embed instead of plain content.
      enabled: false
      # Hex color used for the embed side bar.
      color: "#57F287"
      # Optional action-specific colors. Leave empty to use color above.
      join-color: "#57F287"
      first-join-color: "#57F287"
      quit-color: "#ED4245"
      # Leave title empty for a compact embed with only the description.
      title: ""
      # Supports the same tokens as connection-messages.format.
      description: "{plain_text}"
      # Optional action-specific descriptions. Leave empty to use description above.
      join-description: ""
      first-join-description: ""
      quit-description: ""
  console:
    # Allows this Paper backend to act as a Discord console bot even when chat bridge/account linking are disabled.
    # In PROXY mode this is the only Paper Discord feature that can run.
    # Use a separate Discord bot token per backend console to avoid duplicated gateway sessions.
    enabled: false
    # Discord channel id used as the console channel.
    channel-id: ""
    # Messages starting with this prefix are executed as Paper console commands.
    # Set to "" to execute every message in the console channel as a command.
    command-prefix: "!"
    # If true, Paper console log lines are mirrored live to the Discord console channel.
    live-log: true
    # Sends a short Discord acknowledgement after dispatching a command.
    send-command-feedback: true
    # Empty allow lists mean anyone who can write in the configured Discord channel can run commands.
    allowed-user-ids: []
    allowed-role-ids: []
    max-log-line-length: 1800
  # Optional per-channel overrides:
  # channel-overrides:
  #   global: "123456789012345678"
  channel-overrides: {}
  inbound:
    enabled: false
    default-channel: "global"
    max-length: 400
    # Format used for Discord -> Minecraft messages.
    # Tokens: {source}, {source_type}, {channel_id}, {channel_prefix}, {sender_name}, {player_name}, {player_nickname}, {discord_name}, {discord_id}, {rank_prefix}, {role_color}, {plain_text}, {message}
    # When account-linking is enabled and the Discord user is linked, {sender_name}, {player_name}, {player_nickname}, and {rank_prefix} use the linked Minecraft identity.
    # Use {role_color} as a MiniMessage color tag, for example: "{role_color}{rank_prefix}</role_color> "
    format: "{channel_prefix}[Discord] {role_color}{rank_prefix}</role_color>{sender_name}: {plain_text}"
    # Optional per Discord route account-link override.
    # Values: inherit, true, false.
    # route-overrides:
    #   "123456789012345678":
    #     require-linked: true
    route-overrides: {}
    # Map Discord channel ids to CoreChatX channel ids.
    # channel-routes:
    #   "123456789012345678": "staff"
    channel-routes: {}
```

Important operational note:
- Discord inbound requires `MESSAGE CONTENT` intent on the bot
- Discord inbound uses the Discord Gateway through JDA, not REST polling
- `deployment.bridges-allowed: false` prevents Discord outbound and inbound bridge runtime from starting, but `discord.console.*` may still start when `discord.enabled` and `discord.console.enabled` are true
- `discord.enabled: false` disables Discord inbound even if `discord.inbound.enabled: true`
- Discord outbound applies a small backoff when Discord responds with HTTP 429 rate limits
- Discord outbound clamps formatted messages to a safe API-sized payload and logs when truncation happens
- the bot must also have access to the guild channels listed in `discord.default-channel-id` or `discord.inbound.channel-routes`
- CoreChatX ignores inbound messages from bots and webhooks
- inbound messages are sanitized and clamped by `discord.inbound.max-length` before they enter Minecraft chat
- in proxy mode, Discord bridge I/O and account linking are configured on Velocity; Paper `discord.yml` can only run the optional console-only backend bot
- use a separate Discord bot token for each proxy backend console bot to avoid duplicated gateway sessions
- per-channel Discord formats can be configured in `channels.yml` under `channels.<id>.discord.outbound-format` and `channels.<id>.discord.inbound-format`

---

## 4.11 `telegram.yml`

Purpose:
- Telegram outbound formatting and routing
- Telegram Bot API long-polling inbound relay settings
- route mapping from Telegram chats or forum topics into CoreChatX channels

Current bundled default:

```yml
# Telegram bridge.
# Uses Telegram Bot API only.
# Inbound uses long polling through getUpdates(timeout=...).
# Outbound uses sendMessage.
# No webhook, no Telegram4J, no MTProto.

telegram:
  enabled: false

  bot-token: ""

  # Fallback target for outbound messages when no per-channel target is configured.
  # Can be a numeric chat id or a Bot API-supported @username target.
  default-chat-id: ""

  format: "[{source_server}] [{channel_id}] {sender_name}: {plain_text}"

  outbound:
    # Per-CoreChatX-channel Telegram targets.
    # message-thread-id targets a Telegram forum topic when greater than 0.
    channel-targets:
      global:
        chat-id: ""
        message-thread-id: 0
      staff:
        chat-id: ""
        message-thread-id: 0

  inbound:
    enabled: false

    # Long polling timeout passed to Telegram getUpdates.
    timeout-seconds: 30

    # Small delay between normal long-poll cycles.
    retry-delay-seconds: 3

    # Backoff delay after network/API/parsing errors.
    error-backoff-seconds: 10

    skip-pending-on-start: true
    max-length: 400
    default-channel: "global"
    # Display name used for Telegram -> Minecraft messages.
    # Tokens: {source}, {source_type}, {sender_name}
    # Set to "{sender_name}" to remove the [Telegram] prefix.
    display-name-format: "[{source}] {sender_name}"

    # Logs detected safe route keys to help configure groups/topics.
    debug-route-detection: false

    # Inbound route map.
    # Keys can be "chatId" or "chatId:messageThreadId".
    routes:
      # "-1001111111111": "global"
      # "-1001111111111:25": "staff"
```

Important operational note:
- Telegram uses Telegram Bot API long polling through `getUpdates`
- Telegram does not use Telegram4J
- per-channel Telegram formats can be configured in `channels.yml` under `channels.<id>.telegram.outbound-format` and `channels.<id>.telegram.inbound-format`
- Telegram does not use MTProto
- Telegram does not use webhook mode and does not start an embedded HTTP server
- no `api-id` or `api-hash` are required; only `telegram.bot-token` is needed
- outbound supports per-channel Telegram targets through `telegram.outbound.channel-targets`
- outbound supports Telegram forum topics through `message-thread-id`
- Telegram outbound clamps formatted messages to a safe Bot API-sized payload and logs when truncation happens
- inbound routes can use `chatId` or `chatId:messageThreadId`
- `debug-route-detection: true` logs safe detected route keys to help admins configure group/topic routing
- `deployment.bridges-allowed: false` prevents Telegram outbound and inbound runtime from starting even if `telegram.enabled` or `telegram.inbound.enabled` is true
- `skip-pending-on-start: true` prevents old queued updates from flooding Minecraft when the bridge starts
- Telegram long-polling requests use a bounded HTTP timeout so reloads cannot leave an old polling request hanging indefinitely
- Telegram inbound timing values are clamped: `timeout-seconds` to `1..60`, `retry-delay-seconds` to `0..30`, and `error-backoff-seconds` to `1..300`
- inbound messages are sanitized and clamped by `telegram.inbound.max-length` before they enter Minecraft chat

---

## 4.12 `storage.yml`

Purpose:
- storage backend declaration
- future-facing SQL config placeholders

Current bundled default:

```yml
# Storage defaults.
# STANDALONE runtime data uses local YAML repositories.
# PROXY runtime data is owned by Velocity; this file remains local backend configuration.

storage:
  backend: "YAML"
  sql:
    enabled: false
    type: "SQLITE"
    host: "localhost"
    port: 3306
    database: "corechatx"
    username: "user"
    password: "password"
```

Important accuracy note:
- SQL settings exist as groundwork
- the active implementation in the codebase is still YAML-backed
- YAML runtime stores are saved through a temporary file and replace move to reduce corruption risk during writes

---

## 4.13 `locales/en_us.yml`

Purpose:
- locale override file
- per-key localized message overrides

Current bundled default:

```yml
# Locale overrides for player-facing messages.
# Missing keys fall back to messages.yml.

general:
  player_not_found: "<red>Player not found.</red>"

commands:
  corechatx-help:
    header: "{prefix} <gray>Available CoreChatX subcommands:</gray>"
    reload: "<gray>/corechatx reload</gray>"
    settings: "<gray>/corechatx settings</gray>"
    locale: "<gray>/corechatx locale [tag]</gray>"

privacy:
  ignore:
    usage: "<red>Usage: /ignore <player></red>"
    self: "<red>You cannot ignore yourself.</red>"
    already: "<yellow>You are already ignoring that player.</yellow>"
    success: "<gray>You are now ignoring <white>{target_name}</white>.</gray>"

moderation:
  clear-chat-sender: "{prefix} <gray>Cleared chat for <white>{count}</white> online player(s).</gray>"
```

How locale resolution works now:
1. selected player locale file
2. `en_us.yml`
3. `messages.yml`

That means locale files are override layers, not the only message source.

---

## 5. Paper Runtime Data Files

These files are not your main admin-facing config, but they are part of the live plugin state.
They are authoritative only in `STANDALONE`.
In `PROXY`, equivalent runtime data is stored by the Velocity module under `plugins/corechatx/data/groups/<encoded-channel>/`, while Paper keeps only runtime caches and local static config.

## 5.1 `playerdata.yml`

Purpose:
- per-player saved settings

Bundled default:

```yml
players: {}
```

Typical keys written at runtime per UUID:
- `ping-sound`
- `ping-actionbar`
- `social-spy`
- `pm-enabled`
- `mention-notifications`
- `staff-chat-enabled`
- `chat-bubbles-enabled`
- `locale`

This file is normally not edited by hand.

Proxy authority note:
- in `PROXY` mode, player settings and nicknames are written to Velocity-owned runtime storage, not to this Paper YAML file
- receiving backends still respect their own permissions; an active channel from Velocity is not forced if the player cannot use that channel on the destination backend

---

## 5.2 `state.yml`

Purpose:
- global runtime state

Bundled default:

```yml
first-joins:
  count: 0
chat:
  muted: false
```

This file stores:
- first-join counter
- current global chat-muted state

---

## 5.3 `channeldata.yml`

Purpose:
- per-player active channel selection

Created:
- on demand, when players actually switch away from the implicit default

Typical structure:

```yml
players:
  00000000-0000-0000-0000-000000000000:
    active-channel: "staff"
```

---

## 5.4 `ignoredata.yml`

Purpose:
- ignore lists

Created:
- on demand, when ignore data exists

Typical structure:

```yml
players:
  00000000-0000-0000-0000-000000000000:
    - "11111111-1111-1111-1111-111111111111"
    - "22222222-2222-2222-2222-222222222222"
```

---

## 5.5 `mutedata.yml`

Purpose:
- active mute records

Created:
- on demand, when mute data exists

Typical structure:

```yml
players:
  00000000-0000-0000-0000-000000000000:
    created-at: 1710000000000
    until: 1710003600000
    reason: "Spam"
    actor: "33333333-3333-3333-3333-333333333333"
    blocks-private-messages: true
```

For permanent mutes, `until` may be missing or non-positive depending on how the record was created.

---

## 6. Velocity Proxy

The proxy side owns routing plus proxy-mode runtime data.

Folder:

```text
plugins/corechatx/
```

## 6.1 `velocity-config.properties`

Purpose:
- declare one or more plugin messaging channels used as isolated CoreChatX groups
- control proxy-provided group player chat completions and TAB entries
- document where proxy-owned runtime data is stored
- optionally pin Velocity backend names to CoreChatX groups so pre-backend Discord login gates can run before Paper receives the player

Current bundled default:

```properties
# CoreChatX Velocity proxy settings.

# --- Network groups / channels ---
# Comma-separate values to split this proxy into isolated CoreChatX network groups.
# Each Paper backend joins the group matching its deployment.network-channel.
network-channel=corechatx:main

# Optional backend -> network-channel pins.
# These are required only when Velocity must decide before a backend receives the player,
# such as required Discord link/role login gates in multi-group deployments.
# Keys are Velocity backend names; values must match one value from network-channel.
# backend-groups.survival-1=corechatx:survival
# backend-groups.survival-2=corechatx:survival

# --- Player directory ---
# Adds group player names and @names to client chat completions.
player-directory.chat-completions=true

# Adds group online players to TAB where Velocity exposes them.
player-directory.tab-entries=true

# --- Runtime data storage ---
# In PROXY mode, Velocity is the authority for player settings, nicknames, ignore lists, active channels,
# mutes, global state, Discord links and pending link codes.
# Runtime proxy data is stored separately under data/groups/<encoded-channel>/*.yml.
# Do not place player state, mutes, privacy or Discord links in this config file.

# Discord bot/account-linking settings live in velocity-discord.yml.
```

Important rules:
- each listed `network-channel` value creates a separate CoreChatX group
- each Paper backend joins the group matching its own `deployment.network-channel`
- `backend-groups.<velocity-server-name>=<network-channel>` is optional for normal routing but required for true pre-backend account-linking/role kicks in multi-group setups
- changing this file requires a Velocity restart
- changing `network-channel` also requires restart on affected backends after their `deployment.network-channel` is aligned
- Velocity startup prints the same `CORECHATX` banner shape with version, author, Velocity architecture, and project-link placeholder
- if invalid, the proxy logs degraded routing state instead of silently pretending everything is fine
- the same lowercase namespaced-key validation used by Paper is applied here
- Velocity normalizes packet source identity to the real backend connection and logs mismatches
- `player-directory.chat-completions: false` leaves client chat completions untouched by CoreChatX
- `player-directory.tab-entries: false` leaves client TAB entries untouched by CoreChatX
- in `PROXY`, runtime data is stored under Velocity `data/groups/<encoded-channel>/`; Paper runtime YAML files are not the authority for cross-server state
- in `PROXY`, Discord bridge I/O, account-linking and required-play role checks are configured in Velocity `velocity-discord.yml`; there is no backend `authority-server` carrier requirement

---

## Velocity `velocity-discord.yml`

This file exists only on Velocity and is used when Paper backends run in `deployment.mode: "PROXY"`.
In proxy mode, the Discord bot for account linking, login role checks and Discord bridge I/O must live on Velocity.
Paper backends may still run separate console-only Discord bots through Paper `discord.yml -> discord.console.*`.
In standalone mode, ignore this file and configure Paper `discord.yml` instead.

```yml
# CoreChatX Velocity Discord settings.
# In PROXY deployments this is the authority for Discord bridge, account linking and login gates.
# Paper keeps discord.yml for STANDALONE mode and optional per-backend console-only bots.

account-linking:
  # Master switch for Discord-Minecraft account linking handled by Velocity.
  enabled: false
  # If true, unlinked Discord users cannot write from Discord into Minecraft bridge channels.
  require-linked: false
  # Deletes blocked unlinked Discord messages when the bot has Manage Messages in that channel.
  delete-unlinked-messages: true
  # Sends a private DM explaining why the Discord message was blocked.
  dm-unlinked-users: true
  # If true, linked Discord users may chat while the Minecraft account is offline when stored data can be resolved.
  allow-offline-linked-players: true
  # If true, Minecraft mute state blocks linked Discord inbound messages.
  enforce-minecraft-mutes: true
  # If true, the linked Minecraft account must have permission to send to the target CoreChatX channel.
  # Velocity carries this policy to Paper; Paper performs the actual Bukkit/LuckPerms permission check.
  enforce-channel-send-permission: true
  # If true, unlinked Minecraft players are kicked by backends after Velocity gives them a Discord /link code.
  require-linked-to-play: false
  required-play-roles:
    # Extra login gate for require-linked-to-play. Linked players must have at least one listed Discord role.
    enabled: false
    # Discord guild/server id used for role checks. If blank and the bot is in one guild, that guild is used automatically.
    guild-id: ""
    # Discord role ids allowed to join. Empty list disables only the role gate.
    role-ids: []
    # If true, linked players are denied when Discord role verification cannot be completed.
    deny-if-unverifiable: true
    # Optional per CoreChatX network-channel overrides.
    # Missing fields inherit the global values above. Set enabled: false to disable the role gate for one group.
    # Group ids must match velocity-config.properties network-channel values.
    groups:
      # corechatx:survival:
      #   enabled: true
      #   guild-id: ""
      #   role-ids:
      #     - "123456789012345678"
      #   deny-if-unverifiable: true
      # corechatx:minigames:
      #   enabled: true
      #   role-ids:
      #     - "234567890123456789"
  # Link codes generated by /discord link or required-link-to-play expire after this many minutes.
  code-expire-minutes: 10
  # Discord slash command names registered by the Velocity bot.
  # Change these if another bot/plugin already owns /link or /unlink in the guild.
  link-command-name: "link"
  unlink-command-name: "unlink"
  messages:
    unlinked-dm: "Link your Minecraft account before chatting in this channel. Run /discord link in-game, then use the Discord /link command with that code here."
    linked: "Your Discord account is now linked to {player_name}."
    unlinked: "Your Discord account has been unlinked."
    not-linked: "This Discord account is not linked to a Minecraft account."
    already-linked: "This Discord account or Minecraft account is already linked. Unlink it first."
    code-not-found: "That link code is invalid or expired."
    disabled: "CoreChatX Discord account linking is disabled."
    unavailable: "CoreChatX cannot complete that Discord linking action right now."
    link-required-kick: "<red>You must link your Discord account to play.</red>\n<gray>Use Discord command </gray><white>/link code:{code}</white><gray> within </gray><white>{minutes}</white><gray> minute(s).</gray>"
    missing-required-role-kick: "<red>Your Discord account is linked, but you do not have the required Discord role to play.</red>"
    role-check-unavailable-kick: "<red>Discord role verification is temporarily unavailable. Try again later.</red>"

discord:
  # Starts the Velocity-owned Discord bot for PROXY deployments.
  enabled: false
  bot-token: ""
  default-channel-id: ""
  connection-messages:
    # If true, accepted proxy-level join, first-join and quit messages are mirrored to Discord once per CoreChatX group.
    enabled: false
    # CoreChatX channel ids that should receive join/quit mirrors.
    # Empty list = channel-overrides keys, or the inbound default channel when no overrides are configured.
    channels: []
    # Tokens: {source}, {source_type}, {source_server}, {channel_id}, {sender_name}, {rank_prefix}, {plain_text}, {message}
    format: "{plain_text}"
    # Optional action-specific plain-text formats. Leave empty to use format above.
    join-format: ""
    first-join-format: ""
    quit-format: ""
    embed:
      # If true, join/quit mirrors are sent as a Discord embed instead of plain content.
      enabled: false
      # Hex color used for the embed side bar.
      color: "#57F287"
      # Optional action-specific colors. Leave empty to use color above.
      join-color: "#57F287"
      first-join-color: "#57F287"
      quit-color: "#ED4245"
      # Leave title empty for a compact embed with only the description.
      title: ""
      # Supports the same tokens as connection-messages.format.
      description: "{plain_text}"
      # Optional action-specific descriptions. Leave empty to use description above.
      join-description: ""
      first-join-description: ""
      quit-description: ""
  console:
    # Allows the Velocity Discord bot to execute proxy console commands from one Discord channel.
    # Backend live logs are not mirrored from Velocity; use Paper backend console-only bots for full per-backend live logs.
    enabled: false
    channel-id: ""
    # Set to "" to execute every message in the console channel as a command.
    command-prefix: "!"
    # Reserved for future proxy log streaming; command responses are returned today.
    live-log: false
    # Empty allow lists mean anyone who can write in the configured Discord channel can run commands.
    allowed-user-ids: []
    allowed-role-ids: []
    max-response-chars: 1800
  # In PROXY mode Paper renders the Discord outbound text before sending it to Velocity.
  # Leave this true to preserve per-channel Paper formats from channels.yml.
  use-paper-outbound-format: true
  # Used only when use-paper-outbound-format=false or a backend sends no rendered text.
  format: "[{source_server}] [{channel_id}] {rank_prefix}{sender_name}: {plain_text}"
  # If true, Minecraft -> Discord bridge output breaks Discord mention tokens before sending.
  # This prevents players from pinging Discord users, roles, @everyone or @here by typing raw Discord mention syntax in Minecraft.
  prevent-mentions-from-minecraft: true
  # Optional CoreChatX channel id -> Discord channel id overrides.
  # channel-overrides:
  #   global: "123456789012345678"
  channel-overrides: {}
  inbound:
    enabled: false
    default-channel: "global"
    max-length: 400
    # Map Discord channel ids to CoreChatX channel ids.
    # With one network-channel group, a simple string value is enough:
    # channel-routes:
    #   "123456789012345678": "global"
    #
    # With multiple Velocity network-channel groups, use object values and select the target group:
    # channel-routes:
    #   "123456789012345678":
    #     channel: "global"
    #     network-channel: "corechatx:survival"
    #     require-linked: inherit
    channel-routes: {}
    # Optional per Discord route account-link override.
    # Values: inherit, true, false.
    route-overrides: {}
```

Important rules:
- `discord.enabled` starts the Velocity-owned Discord bot
- `account-linking.enabled` enables Velocity-owned Discord/Minecraft linking for proxy groups
- `account-linking.require-linked` blocks unlinked Discord users from writing through configured Discord inbound routes
- `allow-offline-linked-players`, `enforce-minecraft-mutes`, and `enforce-channel-send-permission` are Velocity-owned in proxy mode and are forwarded to Paper for linked Discord inbound messages
- `require-linked-to-play` kicks unlinked Minecraft players with a Velocity-generated link code
- `required-play-roles.role-ids` must contain numeric Discord role IDs, not role names
- `required-play-roles.groups.<network-channel>` can override `enabled`, `guild-id`, `role-ids`, and `deny-if-unverifiable` per isolated CoreChatX group
- missing group override fields inherit the global `required-play-roles` value; setting `enabled: false` disables the role gate for that group
- if `guild-id` is blank, the bot must be in exactly one guild for role checks to be verifiable
- `discord.default-channel-id` and `discord.channel-overrides` are the Velocity-side targets for Minecraft -> Discord messages
- `discord.inbound.channel-routes` maps Discord channel IDs to CoreChatX channel IDs; in multi-group setups use object routes with `network-channel`
- `use-paper-outbound-format: true` preserves backend/channel formatting while Velocity performs the Discord send
- Paper `discord.yml` is still used for standalone mode. In proxy mode, use it only for optional per-backend `discord.console.*` bots with separate bot tokens.

---

## 7. Regenerating a Clean Config Set

If you want a clean reset:

### Paper backend

Delete the generated admin config files:

```text
config.yml
messages.yml
chat.yml
channels.yml
privacy.yml
moderation.yml
pings.yml
filter.yml
chatitems.yml
keywords.yml
chatbubbles.yml
discord.yml
telegram.yml
storage.yml
locales/
```

Then restart the server.
CoreChatX recreates the bundled defaults automatically.

If you are using proxy mode, you must then reapply:
- `deployment.mode: "PROXY"`
- unique `deployment.server-id`
- `deployment.network-features-allowed: true`

### Velocity proxy

Delete:

```text
plugins/corechatx/velocity-config.properties
```

Then restart Velocity.
The proxy module recreates its bundled default file.

---

## 8. Config-driven Permissions

Some permissions are defined in config files and can be changed by the server owner.

Examples:
- `pings.yml -> custom-pings.<id>.use-permission`
- `pings.yml -> custom-pings.<id>.receive-permission`
- `keywords.yml -> keywords.<id>.permission`
- `channels.yml -> channels.<id>.permission-send`
- `channels.yml -> channels.<id>.permission-receive`
- `privacy.yml -> private-messages.staff-bypass-permission`
- `chatitems.yml -> tokens.<type>.permission`

These nodes may not all be listed in `plugin.yml` because they are configurable values, not fixed plugin API.

Validation behavior:
- `channels.yml`, `pings.yml`, and `privacy.yml` validate malformed dynamic permission nodes and disable only the broken binding through an internal disabled permission node
- `keywords.yml` validates `keywords.<id>.permission`; an invalid permission disables that keyword definition
- `chatitems.yml` token permissions are read as configured, so keep them as valid Bukkit permission nodes

Bundled fixed command permissions are intentionally split:
- player-facing commands such as `/corechatx`, `/corechatx settings`, `/corechatx locale`, `/msg`, `/reply`, `/ping`, `/channel`, `/ignore`, `/unignore`, `/ignorelist`, `/pmtoggle`, and `/chatsettings` default to `true`
- administrative and moderation commands such as reload, broadcast, social spy, mute, unmute, mutechat, and clearchat remain `op` by default

---

## 9. Practical Admin Notes

- Keep `messages.yml` as the main wording file unless you actively need locale-specific overrides.
- Use LuckPerms for rank titles/prefixes, and use CoreChatX for layout.
- Keep `group-formats` keyed to the LuckPerms primary group in lowercase.
- Treat SQL settings as groundwork, not as the active public storage backend.
- When testing a network, always verify backend `server-id` values are unique.
- If a custom permission node in `channels.yml`, `pings.yml`, or `privacy.yml` is malformed, CoreChatX warns and disables only that specific binding; malformed keyword permissions disable only that keyword.
- If you delete runtime data files such as `playerdata.yml` or `mutedata.yml`, you are deleting live player/plugin state, not just decorative cache.

Operational guidance:
- treat `config.yml -> deployment.*` and `velocity-config.properties -> network-channel` as boot identity, not casual reload settings
- keep one source of truth for each visual decision; do not duplicate the same format across many plugins
- use channels for routing rules instead of hardcoding bridge behavior in several places
- use PlaceholderAPI in trusted templates, not as a way to let players execute arbitrary placeholder expansion through chat
- keep bridge tokens private and never paste them into public support logs
- back up runtime data before manually editing player settings, mutes, ignores, or active channel state

---

## 10. Troubleshooting Quick Reference

### Startup banner does not appear

Check that the correct jar is installed for the platform.
The Paper jar must be on Paper, and the Velocity jar must be on Velocity.
On startup, CoreChatX prints a `CORECHATX` banner with version, author, architecture, and a project-link placeholder.

### `/corechatx reload` does not apply a change

Some settings are identity or transport settings and require restart:
- `deployment.mode`
- `deployment.server-id`
- `deployment.network-channel`
- Velocity `network-channel`

If the change affects runtime transport, restart the affected backend or proxy instead of relying on reload.

### Network messages do not cross servers

Verify:
- every backend uses `deployment.mode: "PROXY"`
- every backend has a unique `deployment.server-id`
- every backend has `deployment.network-features-allowed: true`
- every backend `deployment.network-channel` is present in Velocity `velocity-config.properties -> network-channel`
- the Velocity jar is installed and started
- at least one eligible player connection exists for plugin-message transport when Paper needs a packet carrier

Also check that the channel itself is configured as `scope: NETWORK`.
In standalone mode, `NETWORK` channels fall back to normal local chat behavior.

### Discord or Telegram messages do not send

Verify:
- `deployment.bridges-allowed: true`
- the specific bridge `enabled` value is true
- the CoreChatX channel has `export-to-bridges: true`
- tokens, channel ids, chat ids, and topic ids are valid
- outbound routing points to the intended external target

In proxy mode, outbound export is performed only from the source backend to avoid duplicate external messages.

### Discord or Telegram inbound does not appear in Minecraft

Verify:
- inbound is enabled for that bridge
- the inbound route points to an existing CoreChatX channel
- the backend running the inbound listener is one that should locally display the message
- for Discord, the bot has the required Message Content intent when message content is needed
- for Telegram, the bot is reachable through Bot API long polling

Telegram uses Bot API `getUpdates`.
It does not use MTProto, Telegram4J, webhook mode, or an embedded HTTP server.

### PlaceholderAPI placeholders do not render

Verify:
- PlaceholderAPI is installed on that backend
- `hooks.placeholderapi: true`
- the expansion that owns the placeholder is installed and working
- the string being edited is a supported server-controlled template

Raw player message bodies do not pass through PlaceholderAPI.
Mention token PlaceholderAPI context is the mentioned player, using `OfflinePlayer` where possible for cross-backend mentions.

### Mentions do not notify players

Verify:
- mentions are enabled in `chat.yml`
- the channel has `allow-mentions: true`
- the target player allows mention notifications
- ignore and privacy settings are not blocking the notification
- permissions and staff bypass rules are configured as intended

### ChatItems work locally but not across servers

Verify:
- backend and Velocity network settings match
- ChatItems are enabled for the channel
- remote snapshot request limits are not rejecting the item bundle
- the snapshot has not expired
- `network-features-allowed` is true on participating backends

Cross-server ChatItems use lightweight refs in chat and on-demand snapshot retrieval through Velocity.
They intentionally avoid embedding a full inventory payload into every chat packet.

### Chat bubbles are missing

Verify:
- chat bubbles are enabled in `chatbubbles.yml`
- the player has the bubble permission
- the player has not disabled bubbles in settings
- the channel has `allow-chat-bubbles: true`
- the message passed normal CoreChatX checks

In proxy mode, bubbles stay local to the backend where the sender is physically playing.

### A config permission warning appears

Check dynamic permission nodes in:
- `channels.yml`
- `pings.yml`
- `privacy.yml`
- `keywords.yml`
- `chatitems.yml`

Malformed nodes disable only the affected binding or keyword where validation is available.
They do not require deleting the whole config.

### A runtime data file looks wrong

Stop the server, back up the file, then inspect it.
Runtime files such as `playerdata.yml`, `channeldata.yml`, `ignoredata.yml`, and `mutedata.yml` are live state.
Deleting or editing them changes player/plugin data.

---

## 11. Production Validation Checklist

Before opening a server to players:
- boot every Paper backend once and confirm the `CORECHATX` startup banner
- boot Velocity once and confirm the proxy-side `CORECHATX` startup banner
- run a normal public chat message
- run a channel switch and verify send/receive permissions
- test `/msg` and `/reply`
- test mentions, custom pings, and notification toggles
- test one PlaceholderAPI value in a server-controlled template
- test one keyword hover/click action
- test one ChatItem preview locally
- in proxy mode, test one network channel message from each backend
- in proxy mode, test one cross-backend PM
- in proxy mode, test one cross-backend ChatItem preview click
- test Discord outbound and inbound if enabled
- test Telegram outbound, inbound, and topic routing if enabled
- test mute, mutechat, clear chat, social spy, ignore, and PM toggle behavior
- run `/corechatx reload` after a harmless wording change and confirm it applies

For source builds, useful checks are:

```bash
mvn clean test
mvn clean package -DskipTests
git diff --check
```

Build-time warnings from Maven Shade about overlapping metadata/resources can be normal for shaded dependency jars.
They should still be reviewed when dependencies change.

---

## 12. Related Documents

- `PLUGIN_FEATURES_LISTED.md`: feature overview written for server owners and presentation pages
- `FAQ.md`: common questions and short answers
- this file: exact config keys, defaults, restart rules, and operational notes

This document is aligned to the current codebase and bundled defaults as of the present project state.
