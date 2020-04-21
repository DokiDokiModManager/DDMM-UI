<template>
    <div class="main-content">
        <h1>{{_("renderer.tab_mods.install_creation.title")}}</h1>

        <template v-if="hasFreeSpace">

            <div class="form-group">
                <p><label>{{_("renderer.tab_mods.install_creation.label_install_name")}}</label></p>
                <p><input type="text" :placeholder="_('renderer.tab_mods.install_creation.placeholder_install_name')"
                          v-model="install_creation.install_name" @keyup="generateInstallFolderName"></p>
            </div>


            <p v-if="!is_installing && install_creation.folder_name.length > 2 && installExists(install_creation.folder_name)">
                <strong>{{_("renderer.tab_mods.install_creation.status_exists")}}</strong>
            </p>

            <div class="form-group">
                <p><label>{{_("renderer.tab_mods.install_creation.label_mod")}}</label></p>
                <p>
                    <select v-model="install_creation.mod_selection">
                        <option :value="'!none'">{{_("renderer.tab_mods.install_creation.modlist_none")}}</option>
                        <option :value="'!custom'">{{_("renderer.tab_mods.install_creation.modlist_custom")}}</option>

                        <optgroup :label="_('renderer.tab_mods.install_creation.modlist_library')">
                            <option v-for="mod in mods" :value="getPathToMod(mod)">{{getDisplayName(mod)}}</option>
                        </optgroup>
                    </select>
                </p>
                <template v-if="install_creation.mod_selection === '!custom'">
                    <br>
                    <p><input type="text" :placeholder="_('renderer.tab_mods.install_creation.description_mod')"
                              v-model="install_creation.mod" readonly @click="installCreationSelectMod"
                              style="cursor: pointer;"></p>
                </template>
            </div>

            <div class="form-group">
                <ChunkyRadioButtons
                        :options="[_('renderer.tab_mods.install_creation.option_local_save'), _('renderer.tab_mods.install_creation.option_global_save')]"
                        v-model="install_creation.save_option"></ChunkyRadioButtons>
            </div>

            <p v-if="install_creation.save_option === 1">
                {{_("renderer.tab_mods.install_creation.warning_global_save")}}
            </p>

            <div v-if="is_installing" class="form-group">
                <button class="primary" disabled><i class="fas fa-spinner fa-spin fa-fw"></i>
                    {{_("renderer.tab_mods.install_creation.button_installing")}}
                </button>
            </div>

            <div v-else class="form-group">
                <button class="primary" :disabled="shouldDisableCreation" @click="install"><i
                        class="fas fa-bolt fa-fw"></i> {{_("renderer.tab_mods.install_creation.button_install")}}
                </button>
            </div>

        </template>

        <template v-else>
            <p>{{_("renderer.tab_mods.install_creation.warning_no_space")}}</p>
        </template>
    </div>
</template>

<script>
    import ChunkyRadioButtons from "../../elements/ChunkyRadioButtons.vue";

    export default {
        name: "CreationView",
        components: {ChunkyRadioButtons},
        data() {
            return {
                install_creation: {
                    install_name: "",
                    folder_name: "",
                    mod_selection: "!none",
                    mod: "",
                    save_option: 0
                },

                is_installing: false
            }
        },
        methods: {
            _: ddmm.translate,
            installExists: ddmm.mods.installExists,
            hasFreeSpace() {
                return ddmm.app.getDiskSpace() > 2147483648; // 2 GiB
            },
            generateInstallFolderName() {
                this.install_creation.folder_name = this.install_creation.install_name
                    .trim()
                    .toLowerCase()
                    .replace(/\W/g, "-")
                    .replace(/-+/g, "-")
                    .substring(0, 32);

                if (ddmm.mods.installExists(this.install_creation.folder_name)) {
                    this.install_creation.folder_name = this.install_creation.folder_name + "-" + Math.floor(Math.random() * 100);
                }
            },
            installCreationSelectMod() {
                const mod = ddmm.mods.browseForMod();
                if (mod) {
                    this.install_creation.mod = mod;
                }
            },
            install() {
                gtag("event", "install_create", {event_label: this.install_creation.install_name, advanced: false});
                this.$store.commit("installation_status", {
                    installing: true,
                    preloaded_install_folder: this.install_creation.folder_name
                });
                ddmm.mods.createInstall({
                    folderName: this.install_creation.folder_name,
                    installName: this.install_creation.install_name,
                    globalSave: this.install_creation.save_option === 1,
                    mod: this.selectedMod
                });
                this.is_installing = true;
            },
            getPathToMod(filename) {
                return ddmm.joinPath(ddmm.config.readConfigValue("installFolder"), "mods", filename);
            },
            getDisplayName(filename) {
                const parts = filename.split(".");
                parts.pop();
                return parts.join(".");
            }
        },
        computed: {
            shouldDisableCreation() {
                return this.is_installing || !(this.selectedMod || this.install_creation.mod_selection === "!none")
                    || this.install_creation.install_name.length < 2 || this.install_creation.folder_name.length < 2;
            },
            user() {
                return this.$store.state.user;
            },
            mods() {
                return this.$store.state.game_data.mods;
            },
            selectedMod() {
                return this.install_creation.mod_selection !== "!none" ?
                    (this.install_creation.mod_selection === "!custom" ? this.install_creation.mod : this.install_creation.mod_selection) : null;
            }
        }
    }
</script>

<style scoped>

</style>
