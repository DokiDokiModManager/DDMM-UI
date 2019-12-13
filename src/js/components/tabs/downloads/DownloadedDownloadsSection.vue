<template>
    <div>
        <h1>{{_("renderer.tab_downloads.downloaded.title")}}</h1>

        <div v-for="mod in mods" class="mod">
            <h3>{{mod.filename}}</h3>
            <br>
            <p>
                <button class="primary"><i class="fas fa-bolt fa-fw"></i>
                    {{_("renderer.tab_downloads.downloaded.button_install")}}
                </button>

                <button class="secondary" @click="showOptions(mod.filename)"><i class="fas fa-cog fa-fw"></i>
                    {{_("renderer.tab_downloads.downloaded.button_options")}}
                </button>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DownloadedDownloadsSection",
        methods: {
            _: ddmm.translate,
            showOptions(mod) {
                this.$store.commit("select_mod", {mod});
                this.$store.commit("show_modal", {modal: "mod_options"});
            }
        },
        computed: {
            mods() {
                return this.$store.state.game_data.mods;
            }
        }
    }
</script>

<style scoped>

</style>
