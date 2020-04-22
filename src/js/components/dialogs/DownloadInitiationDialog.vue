<template>
    <AlertDialog title="TODO: changeme" :modal_id="'download_initiation'" :button_text="'Cancel'">
        <iframe :src="url" style="width: 100%; height: 400px;"></iframe>
    </AlertDialog>
</template>

<script>
    import AlertDialog from "./base/AlertDialog";

    // function handlePopup(ev) {
    //     console.log("PREVENTING POPUP!", ev);
    //     ev.preventDefault();
    //     // ddmm.downloads.startDownload(url);
    // }

    export default {
        name: "DownloadInitiationDialog",
        components: {AlertDialog},
        computed: {
            url() {
                return this.$store.state.download_initiation_url;
            }
        }
    }
</script>

<style scoped>

</style>
