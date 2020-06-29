<template>
    <AlertDialog
            :modal_id="'mod_preview'"
            :title="mod.name"
            :button_text="_('renderer.modal_mod_preview.button_close')"
    >
        <p><strong>{{mod.shortDescription}}</strong></p>
        <br>
        <p v-if="ddl === 'available'">
            <button class="success" @click="download"><i class="fas fa-download fa-fw"></i> {{_("renderer.modal_mod_preview.button_download_direct")}}</button>
            <button class="secondary" @click="downloadExternal"><i class="fas fa-external-link-alt fa-fw"></i> {{_("renderer.modal_mod_preview.button_download_external")}}</button>
        </p>
        <p v-else-if="ddl === 'unavailable'">
            <button class="success" @click="downloadExternal"><i class="fas fa-external-link-alt fa-fw"></i> {{_("renderer.modal_mod_preview.button_download_external")}}</button>
        </p>
        <p v-else>
            <i class="fas fa-spinner fa-spin"></i> {{_("renderer.modal_mod_preview.text_loading")}}
        </p>
        <br>
        <div style="white-space: pre-line; overflow: auto; max-height: 200px;">{{mod.description}}</div>
    </AlertDialog>
</template>

<script>
    import AlertDialog from "./base/AlertDialog";
    import DDLStatus from "../../js/stores/types/DDLStatus";
    import Logger from "../../js/utils/Logger";

    export default {
        name: "ModPreviewDialog",
        components: {AlertDialog},
        data() {
            return {
                ddl: this.$store.state.mod_preview.directDownload,
            }
        },
        methods: {
            _: ddmm.translate,
            downloadExternal() {
                ddmm.app.openURL(this.mod.downloadURL);
            },
            download() {
                ddmm.downloads.downloadWithInteraction(this.mod.downloadURL);
            }
        },
        computed: {
            mod() {
                return this.$store.state.mod_preview;
            }
        },
        mounted() {
            Logger.info("Download Filename", "Preloading filename: " + this.mod.name);
            ddmm.downloads.preloadFilename(this.mod.name);
            if (this.ddl === "unknown") {
                this.mod.store.testDDL(this.mod.id).then(res => {
                    this.ddl = res.downloadable ? DDLStatus.AVAILABLE : DDLStatus.UNAVAILABLE;
                });
            }
        },
        beforeDestroy() {
            Logger.info("Download Filename", "Removing filename preload");
            ddmm.downloads.preloadFilename(null);
        }
    }
</script>

<style scoped>

</style>
