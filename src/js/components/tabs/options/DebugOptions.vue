<template>
    <div>
        <h1>{{_("renderer.tab_options.section_testing.title")}}</h1>
        <p>{{_("renderer.tab_options.section_testing.subtitle")}}</p>

        <br>
        <h2>{{_("renderer.tab_options.section_testing.header_mod_debug")}}</h2>
        <p>{{_("renderer.tab_options.section_testing.description_mod_debug")}}</p>
        <br>
        <p>
            <button class="danger" v-if="sdkDebuggingEnabled()" @click="setSDKDebugging(false)"><i
                    class="fas fa-times fa-fw"></i> {{_("renderer.tab_options.section_testing.button_disable")}}
            </button>
            <button class="success" v-else @click="setSDKDebugging(true)"><i class="fas fa-check fa-fw"></i>
                {{_("renderer.tab_options.section_testing.button_enable")}}
            </button>
        </p>

        <br>

        <h2>{{_("renderer.tab_options.section_testing.header_ui_url")}}</h2>
        <p>{{_("renderer.tab_options.section_testing.description_ui_url")}}</p>
        <br>
        <p>
            <select v-model="ui_url_interim" @change="setUIurl">
                <option value="https://ui.doki.space/">{{_("renderer.tab_options.section_testing.option_production")}}</option>
                <option value="https://staging.ui.doki.space/">{{_("renderer.tab_options.section_testing.option_staging")}}</option>
                <option value="http://localhost:1234/">{{_("renderer.tab_options.section_testing.option_local")}}</option>
            </select>
        </p>
    </div>
</template>

<script>
    export default {
        name: "DebugOptions",
        data() {
            return {
                ui_url_interim: ddmm.config.readConfigValue("uiURL")
            }
        },
        methods: {
            _: ddmm.translate,
            sdkDebuggingEnabled() {
                return ddmm.config.readConfigValue("sdkDebuggingEnabled");
            },
            setSDKDebugging(enabled) {
                ddmm.config.saveConfigValue("sdkDebuggingEnabled", !!enabled);
                this.$forceUpdate();
            },
            setUIurl() {
                ddmm.config.saveConfigValue("uiURL", this.ui_url_interim);
            }
        }
    }
</script>

<style scoped>

</style>