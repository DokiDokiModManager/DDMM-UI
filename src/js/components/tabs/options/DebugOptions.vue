<template>
    <div>
        <h1>{{_("renderer.tab_options.section_testing.title")}}</h1>
        <p>{{_("renderer.tab_options.section_testing.subtitle")}}</p>

        <br>
        <h2>{{_("renderer.tab_options.section_testing.header_mod_debug")}}</h2>
        <p>{{_("renderer.tab_options.section_testing.description_mod_debug")}}</p>
        <br>
        <p>
            <label><input type="checkbox" v-model="sdk_debugging_interim" @change="setSDKDebugging(sdk_debugging_interim)"> {{_("renderer.tab_options.section_testing.checkbox_logging")}}</label>
        </p>

        <br>

        <h2>{{_("renderer.tab_options.section_testing.header_ui_url")}}</h2>
        <p>{{_("renderer.tab_options.section_testing.description_ui_url")}}</p>
        <br>
        <p>
            <label><input type="checkbox" v-model="local_ui_interim" @change="setLocalUI(local_ui_interim)"> {{_("renderer.tab_options.section_testing.checkbox_ui_url")}}</label>
        </p>
    </div>
</template>

<script>
    export default {
        name: "DebugOptions",
        data() {
            return {
                sdk_debugging_interim: ddmm.config.readConfigValue("sdkDebuggingEnabled"),
                local_ui_interim: ddmm.config.readConfigValue("localUI"),
            }
        },
        methods: {
            _: ddmm.translate,
            setSDKDebugging(enabled) {
                ddmm.config.saveConfigValue("sdkDebuggingEnabled", !!enabled);
            },
            setLocalUI(enabled) {
                ddmm.config.saveConfigValue("localUI", !!enabled);
            }
        }
    }
</script>

<style scoped>

</style>