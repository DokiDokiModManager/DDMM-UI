<template>
    <div class="page-content">
        <div class="mod-viewer-pane">
            <div class="mod-viewer-mod-list">
                <template v-for="section in menu">
                    <div class="mod-view-mod-list-title">{{section.header}}</div>
                    <template v-for="item in section.contents">
                        <div :class="{'mod-view-mod-list-entry': true, 'active': selected_option === item.component}"
                             @click="selectOption(item.component)"
                             v-if="!item.hideIf || !item.hideIf()"
                        >
                            <span>{{item.title}}</span></div>
                    </template>
                    <br>
                </template>
            </div>
            <div class="mod-viewer-mod-display">
                <div class="main-content">
                    <component :is="selected_option"></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Logger from "../../js/utils/Logger";

    import BackgroundOptions from "./options/BackgroundOptions.vue";
    import AdvancedAppearanceOptions from "./options/AdvancedAppearanceOptions.vue";
    import UpdateOptions from "./options/UpdateOptions.vue";
    import StorageOptions from "./options/StorageOptions.vue";
    import LanguageOptions from "./options/LanguageOptions.vue";
    import SDKOptions from "./options/SDKOptions.vue";
    import DiscordOptions from "./options/DiscordOptions.vue";
    import DebugOptions from "./options/DebugOptions.vue";

    export default {
        name: "OptionsTab",
        components: {
            BackgroundOptions,
            AdvancedAppearanceOptions,
            UpdateOptions,
            StorageOptions,
            LanguageOptions,
            SDKOptions,
            DiscordOptions,
            DebugOptions
        },
        data() {
            return {
                selected_option: sessionStorage.getItem("tab_options_last_selection") ? sessionStorage.getItem("tab_options_last_selection") : "LanguageOptions",
                menu: [
                    {
                        header: ddmm.translate("renderer.tab_options.list.header_application"),
                        contents: [
                            {
                                title: ddmm.translate("renderer.tab_options.list.link_language"),
                                component: "LanguageOptions"
                            },
                            {
                                title: ddmm.translate("renderer.tab_options.list.link_updates"),
                                component: "UpdateOptions",
                                hideIf() { return !!ddmm.env.SNAP }
                            },
                            {
                                title: ddmm.translate("renderer.tab_options.list.link_storage"),
                                component: "StorageOptions",
                                hideIf() { return !!ddmm.env.SNAP }
                            }
                        ]
                    },
                    {
                        header: ddmm.translate("renderer.tab_options.list.header_appearance"),
                        contents: [
                            {
                                title: ddmm.translate("renderer.tab_options.list.link_background"),
                                component: "BackgroundOptions"
                            },
                            {
                                title: ddmm.translate("renderer.tab_options.list.link_advanced_appearance"),
                                component: "AdvancedAppearanceOptions"
                            }
                        ]
                    },
                    {
                        header: ddmm.translate("renderer.tab_options.list.header_enhancements"),
                        contents: [
                            {
                                title: ddmm.translate("renderer.tab_options.list.link_sdk"),
                                component: "SDKOptions"
                            },
                            {
                                title: ddmm.translate("renderer.tab_options.list.link_discord"),
                                component: "DiscordOptions"
                            }
                        ]
                    },
                    {
                        header: ddmm.translate("renderer.tab_options.list.header_developers"),
                        contents: [
                            {
                                title: ddmm.translate("renderer.tab_options.list.link_testing"),
                                component: "DebugOptions"
                            }
                        ]
                    }
                ]
            }
        },
        methods: {
            selectOption(component) {
                Logger.info("Options", "Selecting options from component " + component);
                sessionStorage.setItem("tab_options_last_selection", component);
                this.selected_option = component;
            }
        }
    }
</script>

<style scoped>

</style>