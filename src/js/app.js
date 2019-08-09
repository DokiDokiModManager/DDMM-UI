import Logger from "./utils/Logger";

import Vue from "vue";
import Vuex from "vuex";
import App from "./components/App.vue";

import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

Sentry.init({
    dsn: "https://bf0edf3f287344d4969e3171c33af4ea@sentry.io/1297252",
    integrations: [new Integrations.Vue({Vue, attachProps: true})]
});

Vue.use(Vuex);

// noinspection JSValidateTypes
const store = new Vuex.Store({
    state: {
        custom_background: {
            src_1: null,
            src_2: null,
            display_2: false,
            display: false
        },

        options: {
            background: ddmm.config.readConfigValue("background"),
            system_borders: ddmm.config.readConfigValue("systemBorders"),
            sdk_mode: ddmm.config.readConfigValue("sdkMode"),
            discord: ddmm.config.readConfigValue("discordEnabled"),
            language: ddmm.config.readConfigValue("language"),
            mod_backgrounds: ddmm.config.readConfigValue("modBackgrounds")
        },

        game_data: {
            installs: [],
            mods: []
        },

        modals: {
            login: false,
            install_options: false,
            mod_options: false,
            install_rename: false,
            uninstall: false,
            save_delete: false,
            installing: false,
            game_running: false
        },

        preloaded_install_folder: "",

        selected_install: {},
        selected_mod: "",

        install_list_selection: {
            type: "",
            id: ""
        },

        running_install_path: null
    },
    mutations: {
        options(state, payload) {
            Logger.info("Options", "Updated options: " + JSON.stringify(payload));

            if (payload.hasOwnProperty("background")) {
                ddmm.config.saveConfigValue("background", payload.background);
                state.options.background = payload.background;
            }

            if (payload.hasOwnProperty("system_borders")) {
                ddmm.config.saveConfigValue("systemBorders", payload.system_borders);
                state.options.system_borders = payload.system_borders;
            }

            if (payload.hasOwnProperty("sdk_mode")) {
                ddmm.config.saveConfigValue("sdkMode", payload.sdk_mode);
                state.options.sdk_mode = payload.sdk_mode;
            }

            if (payload.hasOwnProperty("discord")) {
                ddmm.config.saveConfigValue("discordEnabled", payload.discord);
                state.options.discord = payload.discord;
            }

            if (payload.hasOwnProperty("language")) {
                ddmm.config.saveConfigValue("language", payload.language);
                state.options.language = payload.language;
            }

            if (payload.hasOwnProperty("mod_backgrounds")) {
                ddmm.config.saveConfigValue("modBackgrounds", payload.mod_backgrounds);
                state.options.mod_backgrounds = payload.mod_backgrounds;
            }
        },
        load_installs(state, payload) {
            state.game_data.installs = payload;
        },
        load_mods(state, payload) {
            state.game_data.mods = payload;
        },
        show_modal(state, payload) {
            if (state.modals.hasOwnProperty(payload.modal)) {
                state.modals[payload.modal] = true;
            } else {
                Logger.error("Modal", "Attempted to show modal that doesn't exist: " + payload.modal)
            }
        },
        hide_modal(state, payload) {
            if (state.modals.hasOwnProperty(payload.modal)) {
                state.modals[payload.modal] = false;
            } else {
                Logger.error("Modal", "Attempted to hide modal that doesn't exist: " + payload.modal)
            }
        },
        select_install(state, payload) {
            Logger.info("InstallOpts", "Selected install " + payload.install.folderName);
            state.selected_install = payload.install;
        },
        select_mod(state, payload) {
            Logger.info("ModOpts", "Selected mod " + payload.mod);
            state.selected_mod = payload.mod
        },
        override_background(state, background) {
            if (!ddmm.config.readConfigValue("modBackgrounds")) return;

            if (background) {
                Logger.info("BG", "Displaying custom background");
                state.custom_background.display = true;
                state.custom_background.display_2 = !state.custom_background.display_2;
                if (state.custom_background.display_2) {
                    state.custom_background.src_2 = background;
                } else {
                    state.custom_background.src_1 = background;
                }

            } else {
                Logger.info("BG", "Hiding custom background");
                state.custom_background.display = false;
            }
        },
        installation_status(state, payload) {
            console.log(payload);
            state.modals.installing = !!payload.installing;
            state.preloaded_install_folder = payload.preloaded_install_folder;
        },
        install_list_selection(state, payload) {
            state.install_list_selection = payload;
        },
        set_running_install(state, payload) {
            state.running_install_path = payload;
        }
    },
    strict: ddmm.env.NODE_ENV !== 'production'
});

// hacky way to enable Vuex injection without using runtime compiled templates
// this way i get to keep my CSP
// <3
Object.assign(App, {
    store
});

const app = new Vue(App).$mount("#app-mount").$nextTick(() => {
    ddmm.mods.refreshInstallList();
    ddmm.mods.refreshModList();
});

ddmm.on("install list", installs => {
    Logger.info("Install List", "Got a list of " + installs.length + " installs");
    store.commit("load_installs", installs);
    if (store.state.preloaded_install_folder) {
        store.commit("install_list_selection", {
            type: "install",
            id: store.state.preloaded_install_folder
        });
    }
    store.commit("installation_status", {installing: false, preloaded_install_folder: ""});
});

ddmm.on("mod list", mods => {
    Logger.info("Mod List", "Got a list of " + mods.length + " mods");
    store.commit("load_mods", mods);
});

ddmm.on("running cover", cover => {
   Logger.info("Game Running", cover.display ? "Install running from " + cover.folder_path : "Game ended");
   if (cover.display) {
       gtag("event", "game_launch");
       store.commit("set_running_install", cover.folder_path);
       store.commit("show_modal", {modal: "game_running"});
   } else {
       gtag("event", "game_quit");
       store.commit("hide_modal", {modal: "game_running"});
   }
});

window.__ddmm_vue = app;
window.__ddmm_state = store;