<template>
    <div>
        <h1>{{_("renderer.tab_downloads.downloaded.title")}}</h1>

        <br>

        <p><input type="text" v-model="search" :placeholder="_('renderer.tab_downloads.store.placeholder_search')"></p>

        <div v-for="mod in modList" class="mod">
            <div>
                <h3>{{getDisplayName(mod)}}</h3>
                <p>{{getPathToMod(mod)}}</p>
                <br>
                <p>
                    <button class="primary" @click="installMod(mod)"><i class="fas fa-bolt fa-fw"></i>
                        {{_("renderer.tab_downloads.downloaded.button_install")}}
                    </button>

                    <button class="secondary" @click="showOptions(mod)"><i class="fas fa-cog fa-fw"></i>
                        {{_("renderer.tab_downloads.downloaded.button_options")}}
                    </button>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import Fuse from "fuse.js";

    export default {
        name: "DownloadedDownloadsSection",
        methods: {
            _: ddmm.translate,
            showOptions(mod) {
                this.$store.commit("select_mod", {mod});
                this.$store.commit("show_modal", {modal: "mod_options"});
            },
            getPathToMod(filename) {
                return ddmm.joinPath(ddmm.config.readConfigValue("installFolder"), "mods", filename);
            },
            getDisplayName(filename) {
                const parts = filename.split(".");
                parts.pop();
                return parts.join(".");
            },
            installMod(mod) {
                this.$store.dispatch("install_mod", {
                    mod: this.getPathToMod(mod),
                    custom: false
                });
            }
        },
        data() {
            return {
                fuse: null,
                search: ""
            }
        },
        computed: {
            mods() {
                return this.$store.state.game_data.mods;
            },
            modList() {
                if (!this.search) return this.mods;
                return this.fuse.search(this.search).map(r => r.item);
            }
        },
        mounted() {
            this.fuse = new Fuse(this.mods);
        }
    }
</script>

<style scoped>

</style>
