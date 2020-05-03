<template>
    <div class="mas-export-control">
        <h2>{{_("renderer.tab_mods.install.title_mas_export")}}</h2>
        <p>{{_("renderer.tab_mods.install.description_mas_export")}}</p>
        <br>
        <button class="primary" @click="exportMonika"><i class="fas fa-heart fa-fw"></i> {{_("renderer.tab_mods.install.button_mas_export")}}</button>
    </div>
</template>

<script>
    export default {
        name: "MASExportControl",
        props: ["install"],
        methods: {
            _: ddmm.translate,
            exportMonika() {
                ddmm.mods.exportMAS(this.install);
            }
        }
    }
</script>

<style scoped>

</style>