<template>
    <div class="cover">
        <div class="onboarding-wizard">
            <div class="wizard-step" v-if="step === 1">
                <div class="wizard-step-content full-center">
                    <div>
                        <h1><strong>Doki Doki Mod Manager</strong> 4</h1>
                        <p>{{_("renderer.onboarding_v4.text_welcome")}}</p>
                        <br>
                        <p>
                            <button class="primary" @click="getStarted" :disabled="!selection.validated">
                                <i class="fas fa-arrow-right fa-fw"></i> {{_("renderer.onboarding_v4.button_start")}}
                            </button>
                        </p>
                        <br>
                        <p>
                            <span v-if="!selection.validated">
                                <i class="fas fa-spinner fa-spin"></i> {{_("renderer.onboarding_v4.text_scanning")}}
                            </span>
                            <span v-else>
                                &nbsp;
                            </span>
                        </p>

                        <template v-if="developer && !developer_local_ui">
                            <br>
                            <p>
                                <a href="javascript:;" @click="developerLocalUI">Enable local UI for onboarding flow</a>
                            </p>
                        </template>
                    </div>
                </div>
            </div>

            <div class="wizard-step" v-else-if="step === 2">
                <div class="wizard-step-content">
                    <h1>{{_("renderer.onboarding_v4.header_setup")}}</h1>
                    <p>{{_("renderer.onboarding_v4.subtitle_careful")}}</p>

                    <br>

                    <div>
                        <div>
                            <h2>{{_("renderer.onboarding_v4.header_download")}}</h2>
                            <p>{{_("renderer.onboarding_v4.text_download", correct_version)}}</p>
                            <br>
                            <p>
                                <button class="success" @click="openURL('https://ddlc.moe')"><i class="fas fa-external-link-alt fa-fw"></i>
                                    {{_("renderer.onboarding_v4.button_ddlc_website")}}
                                </button>
                            </p>
                            <br>
                            <p>{{_("renderer.onboarding_v4.text_s2_next")}}</p>
                            <p><strong>{{_("renderer.onboarding_v4.text_modification_warning")}}</strong></p>
                        </div>

                        <br>

                        <div v-if="warnings.mac_safari">
                            <h2>{{_("renderer.onboarding_v4.header_safari_warning")}}</h2>

                            <p>
                                {{_("renderer.onboarding_v4.text_safari_warning")}}
                                <Link to="https://help.doki.space/images/user_guide/macos_auto_extract.png">
                                    ({{_("renderer.onboarding_v4.link_safari_warning")}})
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="wizard-step-controls">
                    <button class="secondary" @click="previous"><i class="fas fa-arrow-left fa-fw"></i>
                        {{_("renderer.onboarding_v4.button_previous")}}
                    </button>
                    <button class="primary" @click="next"><i class="fas fa-arrow-right fa-fw"></i>
                        {{_("renderer.onboarding_v4.button_next")}}
                    </button>
                </div>
            </div>

            <div class="wizard-step" v-else-if="step === 3">
                <div class="wizard-step-content">
                    <div>
                        <h1>{{_("renderer.onboarding_v4.header_setup")}}</h1>
                        <p>{{_("renderer.onboarding_v4.subtitle_careful")}}</p>
                    </div>

                    <br>

                    <p>{{_("renderer.onboarding_v4.text_select")}}</p>

                    <br>

                    <DropZone :text="_('renderer.onboarding_v4.text_dropzone')"
                              @directory="folderCheck"
                              @file="fileCheck"
                              @click.native="browse"></DropZone>

                    <br>

                    <div v-if="selection.validating">
                        <i class="fas fa-spinner fa-spin"></i> {{_("renderer.onboarding_v4.text_validating")}}
                    </div>

                    <div v-if="selection.directory">
                        <h2><i class="fas fa-exclamation-triangle"></i> {{_("renderer.onboarding_v4.header_directory_selected")}}</h2>
                        <p>{{_("renderer.onboarding_v4.text_directory_selected")}}</p>
                    </div>

                    <template v-if="selection.validated && show_selection_warning">
                        <div v-if="selection.valid">
                            <div v-if="!selection.version_match">
                                <h2><i class="fas fa-exclamation-triangle"></i> {{_("renderer.onboarding_v4.header_version_mismatch")}}</h2>
                                <p>{{_("renderer.onboarding_v4.text_version_mismatch")}}</p>
                            </div>
                            <div v-else>
                                <h2><i class="fas fa-check"></i> {{_("renderer.onboarding_v4.header_success")}}</h2>
                                <p>{{_("renderer.onboarding_v4.text_success")}}</p>
                            </div>
                        </div>
                        <div v-else>
                            <h2><i class="fas fa-exclamation-triangle"></i> {{_("renderer.onboarding_v4.header_hash_mismatch")}}</h2>
                            <p>{{_("renderer.onboarding_v4.text_hash_mismatch")}}</p>
                        </div>
                    </template>

                </div>
                <div class="wizard-step-controls">
                    <button class="secondary" @click="previous"><i class="fas fa-arrow-left fa-fw"></i>
                        {{_("renderer.onboarding_v4.button_previous")}}
                    </button>
                    <button class="primary"
                            @click="next"
                            :disabled="!selection.valid || !selection.version_match">
                        <i class="fas fa-arrow-right fa-fw"></i>
                        {{_("renderer.onboarding_v4.button_next")}}
                    </button>
                </div>
            </div>

            <div class="wizard-step" v-else-if="step === 4">
                <div class="wizard-step-content">
                    <div>
                        <h1>{{_("renderer.onboarding_v4.header_setup")}}</h1>
                        <p>{{_("renderer.onboarding_v4.subtitle_last")}}</p>
                    </div>

                    <br>

                    <h2>{{_("renderer.onboarding_v4.header_save_location")}}</h2>
                    <p>{{_("renderer.onboarding_v4.text_save_location")}}</p>

                    <br>

                    <p><label for="ob_install_folder">{{_("renderer.onboarding_v4.label_save_location")}}</label></p>

                    <div class="input-row">
                        <input type="text" v-model="save_directory" readonly id="ob_install_folder">
                        <button class="primary">{{_("renderer.onboarding_v4.button_change_save_location")}}</button>
                    </div>

                    <br>

                    <h2>{{_("renderer.onboarding_v4.header_waifu")}}</h2>
                    <p>{{_("renderer.onboarding_v4.subtitle_waifu")}}</p>

                    <br>

                    <p><label for="ob_waifu">{{_("renderer.onboarding_v4.label_waifu")}}</label></p>

                    <p>
                        <select v-model="background" id="ob_waifu">
                            <option value="default.png">{{_("renderer.onboarding_v4.option_waifu_all")}}</option>
                            <option value="x-base-monika.png">{{_("renderer.onboarding_v4.option_waifu_monika")}}</option>
                            <option value="x-base-natsuki.png">{{_("renderer.onboarding_v4.option_waifu_natsuki")}}</option>
                            <option value="x-base-sayori.png">{{_("renderer.onboarding_v4.option_waifu_sayori")}}</option>
                            <option value="x-base-yuri.png">{{_("renderer.onboarding_v4.option_waifu_yuri")}}</option>
                        </select>
                    </p>
                </div>
                <div class="wizard-step-controls">
                    <button class="secondary" @click="backFromLastStep"><i class="fas fa-arrow-left fa-fw"></i>
                        {{_("renderer.onboarding_v4.button_previous")}}
                    </button>
                    <button class="primary" @click="finalise"><i class="fas fa-check fa-fw"></i>
                        {{_("renderer.onboarding_v4.button_finish")}}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import Link from "./elements/Link";
    import DropZone from "./elements/DropZone";
    import Logger from "../js/utils/Logger";

    export default {
        name: "OnboardingOverlay",
        components: {DropZone, Link},
        data() {
            return {
                developer: !!ddmm.env.DDMM_DEVELOPER,
                developer_local_ui: ddmm.config.readConfigValue("localUI"),
                step: 1,
                skipped_selection: true,
                show_selection_warning: false,
                warnings: {
                    // mac_safari: ddmm.platform === "darwin"
                    mac_safari: true
                },
                correct_version: ddmm.platform === "darwin" ? "DDLC (Mac)" : "DDLC (Windows)",
                selection: {
                    path: null,
                    directory: false,
                    validating: false,
                    validated: false,
                    valid: false,
                    version_match: false
                },
                save_directory: ddmm.config.readConfigValue("installFolder"),
                background: "default.png"
            }
        },
        mounted() {
            ddmm.on("onboarding validated", this._validateCallback);
            ddmm.onboarding.scan();
        },
        beforeDestroy() {
            ddmm.off("onboarding validated", this._validateCallback);
        },
        methods: {
            _: ddmm.translate,
            openURL: ddmm.app.openURL,
            getStarted() {
                if (this.selection.valid && !this.show_selection_warning) {
                    this.skipped_selection = true;
                    this.step = 4;
                } else {
                    this.step = 2;
                }
            },
            backFromLastStep() {
                if (this.skipped_selection) {
                    this.step = 1;
                } else {
                    this.step = 3;
                }
            },
            next() {
                this.step += 1;
            },
            previous() {
                this.step -= 1;
            },
            folderCheck() {
                this.show_selection_warning = true;
                this.selection.valid = false;
                this.selection.validated = false;
                this.selection.directory = true;
            },
            validate(path) {
                this.show_selection_warning = true;
                this.selection.path = path;
                this.selection.directory = false;
                this.selection.valid = false;
                this.selection.validating = true;
                this.selection.validated = false;
                ddmm.onboarding.validateGame(this.selection.path);
            },
            fileCheck(item) {
                this.validate(item.path);
            },
            browse() {
                ddmm.onboarding.browseForGame();
            },
            _validateCallback(result) {
                this.selection.path = result.path;
                this.selection.validating = false;
                this.selection.validated = true;
                this.selection.version_match = result.version_match;
                this.selection.valid = result.success;
            },
            finalise() {
                Logger.info("Onboarding", "Finalising setup!");
                this.$store.commit("set_background", this.background);
                ddmm.config.saveConfigValue("installFolder", this.save_directory);
                this.$emit("close");
                ddmm.onboarding.finalise(this.selection.path);
            },
            developerLocalUI() {
                ddmm.config.saveConfigValue("localUI", "http://localhost:1234/");
                ddmm.app.restart();
            }
        }
    }
</script>

<style scoped>

</style>
