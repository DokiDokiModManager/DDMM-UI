<template>
    <div>
        <InstallOptionsDialog v-if="modalVisible('install_options')"></InstallOptionsDialog>
        <InstallRenameDialog v-if="modalVisible('install_rename')"></InstallRenameDialog>
        <SaveDeleteDialog v-if="modalVisible('save_delete')"></SaveDeleteDialog>
        <UninstallDialog v-if="modalVisible('uninstall')"></UninstallDialog>
        <InstallDialog v-if="modalVisible('installing')"></InstallDialog>
        <ErrorDialog v-if="modalVisible('error')"></ErrorDialog>
        <InstallCategoryDialog v-if="modalVisible('install_category')"></InstallCategoryDialog>
        <GameRunningDialog v-if="modalVisible('game_running')"></GameRunningDialog>
        <ModOptionsDialog v-if="modalVisible('mod_options')"></ModOptionsDialog>
        <NewsDialog v-if="modalVisible('news')"></NewsDialog>
        <ModPreviewDialog v-if="modalVisible('mod_preview')"></ModPreviewDialog>
        <IssueReportDialog v-if="modalVisible('issue_report')"></IssueReportDialog>
        <LanguageSwitchDialog v-if="modalVisible('language_switch')"></LanguageSwitchDialog>
    </div>
</template>

<script>
    import InstallOptionsDialog from "./dialogs/installs/InstallOptionsDialog.vue";
    import ModOptionsDialog from "./dialogs/mods/ModOptionsDialog.vue";
    import InstallRenameDialog from "./dialogs/installs/InstallRenameDialog.vue";
    import UninstallDialog from "./dialogs/installs/UninstallDialog.vue";
    import SaveDeleteDialog from "./dialogs/installs/SaveDeleteDialog.vue";
    import AlertDialog from "./dialogs/base/AlertDialog.vue";
    import InstallDialog from "./dialogs/installs/InstallDialog";
    import GameRunningDialog from "./dialogs/GameRunningDialog";
    import ErrorDialog from "./dialogs/ErrorDialog";
    import InstallCategoryDialog from "./dialogs/installs/InstallCategoryDialog";
    import NewsDialog from "./dialogs/NewsDialog";
    import ModPreviewDialog from "./dialogs/ModPreviewDialog";
    import IssueReportDialog from "./dialogs/IssueReportDialog";
    import LanguageSwitchDialog from "./dialogs/LanguageSwitchDialog";

    export default {
        name: "Dialogs",
        components: {
            LanguageSwitchDialog,
            IssueReportDialog,
            NewsDialog,
            InstallCategoryDialog,
            GameRunningDialog,
            InstallDialog,
            SaveDeleteDialog,
            UninstallDialog,
            InstallRenameDialog,
            ModOptionsDialog,
            InstallOptionsDialog,
            AlertDialog,
            ErrorDialog,
            ModPreviewDialog
        },
        methods: {
            _: ddmm.translate,
            modalVisible(modal) {
                return this.$store.state.modals[modal];
            }
        }
    }
</script>

<style scoped>

</style>
