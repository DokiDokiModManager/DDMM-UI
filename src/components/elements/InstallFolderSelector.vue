<template>
    <div>
        <p><label for="ob_install_folder">{{_("renderer.component_install_folder_selector.label")}} <strong v-if="error">({{error}})</strong></label></p>

        <div class="input-row">
            <input type="text" v-model="save_directory" readonly id="ob_install_folder">
            <button class="secondary" @click="change">{{_("renderer.component_install_folder_selector.button_select")}}</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "InstallFolderSelector",
        props: ["value"],
        methods: {
            _: ddmm.translate,
            change() {
                const data = ddmm.app.selectFolder();
                if (data.path) {
                    this.save_directory = data.path;
                    this.error = null;
                    this.$emit("folder", data.path);
                } else {
                    this.error = data.error;
                    this.$emit("folder", null);
                }
            }
        },
        data() {
            return {
                save_directory: ddmm.config.readConfigValue("installFolder"),
                error: null
            }
        }
    }
</script>

<style scoped>

</style>
