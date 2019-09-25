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
                <label><input type="checkbox" v-model="local_ui_interim" @change="setLocalUI(local_ui_interim)"> Local UI</label>
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
            }
        }
    }
</script>

<style scoped>

</style>