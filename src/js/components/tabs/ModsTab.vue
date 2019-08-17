<template>
    <div class="page-content">
        <div class="mod-viewer-pane">
            <div class="mod-viewer-mod-list">
                <!-- Search box -->
                <div><input type="text" class="small"
                            :placeholder="_('renderer.tab_mods.list.placeholder_search')" autofocus
                            @keydown="searchEscapeHandler" @focus="search = ''" v-model="search"></div>
                <br>
                <!-- Game install options -->
                <div class="mod-view-mod-list-title">{{_("renderer.tab_mods.list.header_new")}}</div>
                <div
                        :class="{'mod-view-mod-list-entry': true, 'active': selected_item.type === 'create' && selected_item.id === 'normal'}"
                        @click="handleCreateClick(false)">{{_("renderer.tab_mods.list.link_install")}}
                </div>
                <div
                        :class="{'mod-view-mod-list-entry': true, 'active': selected_item.type === 'create' && selected_item.id === 'advanced'}"
                        @click="handleCreateClick(true)">{{_("renderer.tab_mods.list.link_install_advanced")}}
                </div>
                <br>

                <!-- Installed games -->
                <template v-for="cat in categories">
                    <div class="mod-view-mod-list-title" v-if="searchResultsInstalls.length > 0">
                        {{cat ? cat : _("renderer.tab_mods.list.header_installed")}}
                    </div>
                    <div
                            :class="{'mod-view-mod-list-entry': true, 'active': selected_item.id === install.folderName && selected_item.type === 'install'}"
                            v-for="install in searchResultsInstalls.filter(i => i.category === cat)"
                            @dblclick="launchInstall(install.folderName)"
                            @click="handleInstallClick(install.folderName)"
                            :title="getPathToInstall(install.folderName)"
                    >
                        <span>{{install.name}}</span>
                        <span class="mod-view-mod-list-entry-button"
                              @click="showInstallOptions(install)"><i
                                class="fas fa-cog"></i></span>
                    </div>

                    <br v-if="searchResultsInstalls.filter(i => i.category === cat).length > 0">
                </template>

                <!-- Downloaded mods -->
                <div class="mod-view-mod-list-title" v-if="searchResultsMods.length > 0">
                    {{_("renderer.tab_mods.list.header_downloaded")}}
                </div>
                <div
                        :class="{'mod-view-mod-list-entry': true, 'active': selected_item.id === mod.filename && selected_item.type === 'mod', 'disabled': mod.downloading}"
                        v-for="mod in searchResultsMods"
                        @click="handleModClick(mod.filename, mod.downloading)"
                        @dblclick="showCreateInstall(getPathToMod(mod.filename))"
                        :title="getPathToMod(mod.filename)"
                >
                    <span><i class="fas fa-spinner fa-spin fa-fw" v-if="mod.downloading"></i> {{mod.filename}}</span>
                    <span class="mod-view-mod-list-entry-button"
                          @click="showModOptions(mod.filename)"><i
                            class="fas fa-cog"></i></span>
                </div>
            </div>
            <div class="mod-viewer-mod-display">
                <InstallView v-if="selectedInstall" :install="selectedInstall"></InstallView>
                <ModView v-else-if="selectedMod" :mod="selectedMod"></ModView>
                <CreationView v-else-if="selected_item.type === 'create' && selected_item.id === 'normal'"></CreationView>
                <AdvancedCreationView v-else-if="selected_item.type === 'create' && selected_item.id === 'advanced'"></AdvancedCreationView>
            </div>
        </div>
    </div>
</template>

<script>

    import InstallView from "./mods/InstallView.vue";
    import ModView from "./mods/ModView.vue";
    import CreationView from "./mods/CreationView.vue";

    import Logger from "../../utils/Logger";
    import Launcher from "../../utils/Launcher";
    import AdvancedCreationView from "./mods/AdvancedCreationView";

    export default {
        name: "ModsTab",
        components: {AdvancedCreationView, CreationView, ModView, InstallView},
        methods: {
            // helper methods
            _: ddmm.translate,
            getPathToInstall(folderName) {
                return ddmm.joinPath(ddmm.config.readConfigValue("installFolder"), "installs", folderName);
            },
            getPathToMod(filename) {
                return ddmm.joinPath(ddmm.config.readConfigValue("installFolder"), "mods", filename);
            },

            // install list interaction handlers
            handleCreateClick(advanced) {
                Logger.info("Mod List", "Selected creation (advanced = " + advanced + ")");
                this.$store.commit("install_list_selection", {
                    type: "create",
                    id: advanced ? "advanced" : "normal"
                });
            },
            handleInstallClick(folderName) {
                Logger.info("Mod List", "Selected install " + folderName);
                this.$store.commit("install_list_selection", {
                    type: "install",
                    id: folderName
                });
            },
            handleModClick(filename, downloading) {
                if (downloading) return;
                Logger.info("Mod List", "Selected mod " + filename);
                this.$store.commit("install_list_selection", {
                    type: "mod",
                    id: filename
                });
            },
            showInstallOptions(install) {
                this.$store.commit("select_install", {install});
                this.$store.commit("show_modal", {modal: "install_options"});
            },
            showModOptions(mod) {
                this.$store.commit("select_mod", {mod});
                this.$store.commit("show_modal", {modal: "mod_options"});
            },

            // install launch logic
            launchInstall(install) {
                Launcher.launch(install);
            },

            // search box interaction handlers
            searchEscapeHandler(e) {
                if (e.key === "Escape") {
                    Logger.info("Mod List", "Cleared search");
                    this.search = "";
                }
            }
        },
        data() {
            return {
                search: "",
                search_objs: {
                    installs: null,
                    mods: null
                }
            };
        },
        computed: {
            categories() {
                // noinspection JSCheckFunctionSignatures
                return Array.from(new Set(this.$store.state.game_data.installs.map(install => install.category))).sort();
            },

            selected_item() {
                return this.$store.state.install_list_selection;
            },

            installs() {
                return this.$store.state.game_data.installs;
            },

            mods() {
                return this.$store.state.game_data.mods;
            },

            searchResultsInstalls() {
                return this.$store.state.game_data.installs || [];
                // return this.search.length > 0 ? this.installs_search.search(this.search) : this.installs;
            },
            searchResultsMods() {
                return this.$store.state.game_data.mods || [];
                // return this.search.length > 0 ? this.mods_search.search(this.search) : this.mods;
            },

            selectedInstall() {
                if (this.selected_item.type === "install") {
                    return this.installs.find(install => install.folderName === this.selected_item.id);
                } else {
                    return null;
                }
            },
            selectedMod() {
                if (this.selected_item.type === "mod") {
                    return this.selected_item.id;
                } else {
                    return null;
                }
            }
        }
    }
</script>

<style scoped>

</style>