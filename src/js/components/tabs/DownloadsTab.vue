<template>
    <div class="page-content">
        <div class="mod-viewer-pane">
            <div class="mod-viewer-mod-list">
                <template v-for="section in menu">
                    <div class="mod-view-mod-list-title">{{section.header}}</div>
                    <div v-for="item in section.contents"
                         :class="{'mod-view-mod-list-entry': true, 'active': selected_option === item.component}"
                         @click="selectOption(item.component)"><span>{{item.title}}</span></div>
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
    import Logger from "../../utils/Logger";
    import DownloadedDownloadsSection from "./downloads/DownloadedDownloadsSection";

    export default {
        name: "DownloadsTab",
        components: {DownloadedDownloadsSection},
        methods: {
            _: ddmm.translate,
            selectOption(component) {
                Logger.info("Downloads", "Selecting section from component " + component);
                sessionStorage.setItem("tab_downloads_last_selection", component);
                this.selected_option = component;
            }
        },
        data() {
            return {
                selected_option: sessionStorage.getItem("tab_downloads_last_selection") ? sessionStorage.getItem("tab_downloads_last_selection") : "DownloadedDownloadsSection",
                menu: [
                    {
                        header: ddmm.translate("renderer.tab_downloads.list.header_library"),
                        contents: [
                            {
                                title: ddmm.translate("renderer.tab_downloads.list.link_downloaded"),
                                component: "DownloadedDownloadsSection"
                            },
                            {
                                title: ddmm.translate("renderer.tab_downloads.list.link_downloads"),
                                component: ""
                            }
                        ]
                    },
                    {
                        header: ddmm.translate("renderer.tab_downloads.list.header_browse"),
                        contents: [
                            {
                                title: ddmm.translate("renderer.tab_downloads.list.link_featured"),
                                component: ""
                            },
                        ]
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>
