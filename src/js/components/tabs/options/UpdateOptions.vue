<template>
    <div>
        <h1>{{_("renderer.tab_options.section_updates.title")}}</h1>
        <p>{{_("renderer.tab_options.section_updates.subtitle")}}</p>
        <br>
        <p><strong>{{_("renderer.tab_options.section_updates.description_current_version", version)}}</strong></p>
        <template v-if="!error">
            <p><strong>{{_("renderer.tab_options.section_updates.description_latest_version", latest)}}</strong></p>
            <br>
            <p v-if="has_update">{{_("renderer.tab_options.section_updates.description_has_update")}}</p>
            <p v-else>{{_("renderer.tab_options.section_updates.description_no_update")}}</p>
        </template>
        <p v-else>{{_("renderer.tab_options.section_updates.description_error")}}</p>
        <br>
        <p v-if="has_update && !error">
            <button @click="doUpdate" class="primary" :disabled="checking">
                <i class="fas fa-download fa-fw"></i> {{_("renderer.tab_options.section_updates.button_update")}}
            </button>
        </p>
        <p v-else>
            <button @click="checkUpdate" class="primary" :disabled="checking">
                <i class="fas fa-sync-alt fa-fw"></i> {{_("renderer.tab_options.section_updates.button_check")}}
            </button>
        </p>
    </div>
</template>

<script>
    import Logger from "../../../utils/Logger";
    import * as semver from "semver";

    export default {
        name: "UpdateOptions",
        methods: {
            _: ddmm.translate,
            doUpdate() {
                Logger.info("Updates", "Forcing update check");
                ddmm.app.update();
                this.checking = true;
            },
            checkUpdate() {
                this.checking = true;
                fetch("https://api.github.com/repos/DokiDokiModManager/Mod-Manager/releases/latest")
                    .then(res => res.json()).then(release => {
                    this.error = false;
                    this.latest = release.name;
                }).catch(() => {
                    this.error = true;
                }).finally(() => {
                    this.checking = false;
                });
            }
        },
        data() {
            return {
                version: ddmm.version,
                latest: "",
                error: false,
                checking: true
            }
        },
        computed: {
            has_update() {
                return this.latest && semver.gt(this.latest, this.version);
            }
        },
        mounted() {
            this.checkUpdate();
        }
    }
</script>

<style scoped>

</style>