<template>
    <div :class="'os-'+system_platform">
        <div class="app-container-background">
            <div class="gradient"></div>
            <img alt="" :src="backgroundImage" :class="{'visible': !showBackground}">
            <img alt="" :src="backgroundOverride1" :class="{'visible': showBackground && !showBackground2}">
            <img alt="" :src="backgroundOverride2" :class="{'visible': showBackground && showBackground2}">
        </div>

        <div class="app app-container-contents">
            <Titlebar :app_name="app_name" :app_version="app_version" :system_borders="system_borders"></Titlebar>

            <Dialogs></Dialogs>

            <OnboardingOverlay v-if="onboarding" @close="onboarding = false;"></OnboardingOverlay>

            <template v-else>
                <component :is="tab"></component>

                <Navbar :tabs="tabs" @tab="setTab"></Navbar>
            </template>
        </div>
    </div>
</template>

<script>

    import Titlebar from "./Titlebar.vue";
    import Navbar from "./Navbar.vue";
    import ModsTab from "./tabs/ModsTab.vue";
    import OptionsTab from "./tabs/OptionsTab.vue";
    import AboutTab from "./tabs/AboutTab.vue";
    import Dialogs from "./Dialogs.vue";
    import OnboardingOverlay from "./OnboardingOverlay";

    export default {
        name: "App",
        components: {OnboardingOverlay, Navbar, Titlebar, ModsTab, OptionsTab, Dialogs, AboutTab},
        data() {
            return {
                // app / system meta
                app_name: "Doki Doki Mod Manager",
                app_version: ddmm.version,
                system_platform: ddmm.platform,

                onboarding: false,

                // config
                system_borders: ddmm.config.readConfigValue("systemBorders"),

                // tabs
                tab: "ModsTab",
                tabs: [
                    {
                        id: "mods",
                        name: ddmm.translate("renderer.tabs.tab_mods"),
                        component: "ModsTab"
                    },
                    {
                        id: "store",
                        name: ddmm.translate("renderer.tabs.tab_store"),
                        component: ""
                    },
                    {
                        id: "options",
                        name: ddmm.translate("renderer.tabs.tab_options"),
                        component: "OptionsTab"
                    },
                    {
                        id: "about",
                        name: ddmm.translate("renderer.tabs.tab_about"),
                        component: "AboutTab"
                    }
                ],
            }
        },
        computed: {
            backgroundImage() {
                const bg = this.$store.state.options.background;
                let imagePath;
                if (bg.startsWith("custom:")) {
                    imagePath = ddmm.fileToURL(bg.split("custom:")[1]);
                } else {
                    imagePath = ddmm.fileToURL("src/renderer/images/backgrounds/" + bg);
                }
                return imagePath;
            },

            backgroundOverride1() {
                return this.$store.state.custom_background.src_1;
            },

            backgroundOverride2() {
                return this.$store.state.custom_background.src_2;
            },

            showBackground() {
                return this.$store.state.custom_background.display;
            },

            showBackground2() {
                return this.$store.state.custom_background.display_2;
            }
        },
        methods: {
            setTab(tab) {
                this.tab = tab.component;
            }
        },
        mounted() {
            ddmm.on("start onboarding", () => {
                this.onboarding = true;
            });

            ddmm.on("onboarding downloaded", () => {
                this.onboarding = false;
            });
        }
    }
</script>

