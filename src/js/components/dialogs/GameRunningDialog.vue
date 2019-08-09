<template>
    <Dialog>
        <div style="text-align: center;">
            <br>
            <p><i class="fas fa-gamepad fa-2x"></i></p>
            <br>
            <h2>{{_("renderer.modal_running.title")}}</h2>
            <br>
            <p>{{_("renderer.modal_running.description")}}</p>
            <br>
            <button class="primary" @click="openFolder"><i class="fas fa-folder-open"></i> {{_("renderer.modal_running.button_browse")}}</button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from "./base/Dialog";
    import {join as joinPath} from "path";

    export default {
        components: {Dialog},
        name: "GameRunningDialog",
        methods: {
            _: ddmm.translate,
            openFolder() {
                ddmm.app.showFile(joinPath(this.$store.state.running_install_path, "install", "game"));
            }
        }
    }
</script>

<style scoped>

</style>