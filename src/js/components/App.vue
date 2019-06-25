<template>
    <div :class="['app', 'os-'+system_platform]" :style="{'background-image': backgroundImageStyle}">
        <Titlebar :app_name="app_name" :app_version="app_version" :system_borders="system_borders"></Titlebar>

        <Dialogs></Dialogs>

        <OnboardingOverlay v-if="onboarding" @close="onboarding = false;"></OnboardingOverlay>

        <template v-else>
            <component :is="tab"></component>

            <Navbar :tabs="tabs" @tab="setTab"></Navbar>
        </template>
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
                return this.$store.state.options.background;
            },
            backgroundImageStyle() {
                if (this.backgroundImage && this.backgroundImage !== "none") {
                    let imagePath;
                    if (this.backgroundImage.startsWith("custom:")) {
                        imagePath = ddmm.fileToURL(this.backgroundImage.split("custom:")[1]);
                    } else {
                        imagePath = ddmm.fileToURL("src/renderer/images/backgrounds/" + this.backgroundImage);
                    }
                    return `radial-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.99) 90%), url(${imagePath})`;
                } else {
                    return "linear-gradient(#111, #111)";
                }
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

