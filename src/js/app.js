import Logger from "./utils/Logger";

import Vue from "vue";
import Vuex from "vuex";
import App from "../components/App.vue";

import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import DDLCModClub from "./stores/DDLCModClub";

Sentry.init({
    dsn: "https://bf0edf3f287344d4969e3171c33af4ea@sentry.io/1297252",
    integrations: [new Integrations.Vue({Vue, attachProps: true})]
});

Vue.use(Vuex);

window.__DDMM_SENTRY__ = Sentry;

// noinspection JSValidateTypes
const store = new Vuex.Store({
    state: {
        custom_background: {
            src_1: null,
            src_2: null,
            display_2: false,
            display: false
        },

        tab: "ModsTab",

        background: ddmm.config.readConfigValue("background"),

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
            game_running: false,
            error: false,
            install_category: false,
            news: false,
            mod_preview: false
        },

        preloaded_install_folder: "",

        selected_install: {},
        selected_mod: "",

        install_list_selection: {
            type: "",
            id: ""
        },

        error: {
            fatal: false,
            stacktrace: "Beans"
        },

        news_modal: {
            title: "",
            body: ""
        },

        running_install_path: null,

        rerender_key: Math.random(),

        downloads: [],

        mod_preview: {}
    },
    mutations: {
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
        set_background(state, background) {
            ddmm.config.saveConfigValue("background", background);
            state.background = background;
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
        },
        error(state, payload) {
            state.error.fatal = payload.fatal;
            state.error.stacktrace = payload.stacktrace;
        },
        show_news(state, payload) {
            state.news_modal.title = payload.title;
            state.news_modal.body = payload.body;
        },
        rerender(state) {
            state.rerender_key = Math.random();
        },
        set_tab(state, payload) {
            state.tab = payload;
        },
        set_downloads(state, payload) {
            console.log(payload);
            state.downloads = payload;
        },
        preview_mod(state, payload) {
            state.mod_preview = payload;
            state.modals.mod_preview = true;
        }
    },
    strict: ddmm.env.NODE_ENV !== 'production'
});

Object.assign(App, {
    store
});

new Vue(App).$mount("#app-mount").$nextTick(() => {
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

ddmm.on("error", error => {
    Logger.error("Main Error", "An error occurred in the main process (fatal = " + error.fatal + ")\n\n" + error.stacktrace);
    store.commit("show_modal", {modal: "error"});
    store.commit("error", error);
});

ddmm.on("got downloads", downloads => {
    store.commit("set_downloads", downloads);
});

ddmm.on("download started", () => {
    store.commit("hide_modal", {modal: "download_initiation"});
});

const NEWS_URL = "https://dokidokimodmanager.github.io/Meta/news.json";

if (!localStorage.getItem("last_news_timestamp")) {
    localStorage.setItem("last_news_timestamp", "0");
}

fetch(NEWS_URL).then(res => res.json()).then(news => news.news.filter(news => news.timestamp > localStorage.getItem("last_news_timestamp"))).then(backwards => {
    const news = backwards.reverse();
    store.commit("show_news", news[0]);
    store.commit("show_modal", {modal: "news"});
});

window.test = new DDLCModClub();
