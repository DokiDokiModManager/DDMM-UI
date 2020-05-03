<template>
    <div class="page-content">
        <div class="text-container">

            <p>{{_("blatantly.wrong.translation.key")}}</p>

            <br>

            <p>
                <button @click="devtools" class="primary">Open DevTools</button>
            </p>

            <br>

            <p>
                <button @click="langReload" class="primary">Reload Languages</button>
            </p>

            <br>

            <p>
                <label><input type="checkbox" v-model="local_ui_interim" @change="setLocalUI(local_ui_interim)"> Local UI</label>
            </p>

            <br>

            <p>
                <button class="secondary"
                        @click="startDownload('https://github.com/Monika-After-Story/MonikaModDev/releases/download/v0.11.0/Monika_After_Story-0.11.0-Mod.zip')">
                    Download MAS
                </button>

                <button class="secondary"
                        @click="startDownload('http://ipv4.download.thinkbroadband.com/1GB.zip')">
                    Download Test 1GB
                </button>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ExperimentsTab",
        data() {
            return {
                local_ui_interim: ddmm.config.readConfigValue("localUI")
            }
        },
        methods: {
            _: ddmm.translate,
            devtools() {
                ddmm.window.openDevtools();
            },
            setLocalUI(enabled) {
                ddmm.config.saveConfigValue("localUI", !!enabled);
            },
            langReload() {
                ddmm.reloadLanguages();
            },
            startDownload(url) {
                ddmm.downloads.startDownload(url);
            }
        }
    }
</script>

<style scoped>

</style>
