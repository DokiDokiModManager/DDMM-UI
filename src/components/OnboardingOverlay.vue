<template>
    <div class="cover">
        <div class="onboarding-wizard">
            <div class="wizard-step" v-if="step === 1">
                <div class="wizard-step-content full-center">
                    <div>
                        <p>Welcome to</p>
                        <h1><strong>Doki Doki Mod Manager</strong> 4</h1>
                        <br>
                        <p>
                            <button class="primary" @click="next">
                                <i class="fas fa-arrow-right fa-fw"></i> Get Started
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <div class="wizard-step" v-else-if="step === 2">
                <div class="wizard-step-content">
                    <h1>First time setup</h1>
                    <p>Please read the following instructions carefully.</p>

                    <br>

                    <div>
                        <div>
                            <h2>Download DDLC</h2>
                            <p>Visit the DDLC website, click Download Now and follow the instructions. When you
                                are asked, choose the file named {{correct_version}} and save it somewhere easy to
                                find.</p>
                            <br>
                            <p>
                                <button class="success">Open Browser</button>
                            </p>
                            <br>
                            <p>
                                When your download is complete, please continue to the next step. <strong>Do not
                                make any changes to the downloaded file.</strong>
                            </p>
                        </div>

                        <br>

                        <div v-if="warnings.mac_safari">
                            <h2>Important information for Safari users</h2>

                            <p>Safari may automatically extract the downloaded game. You should disable this feature
                                as
                                it interferes with the setup process. This can be done from Safari's preferences
                                screen.
                                <Link to="https://help.doki.space/images/user_guide/macos_auto_extract.png">
                                    (Click here for a visual guide)
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="wizard-step-controls">
                    <button class="secondary" @click="previous"><i class="fas fa-arrow-left fa-fw"></i> Previous
                    </button>
                    <button class="primary" @click="next"><i class="fas fa-arrow-right fa-fw"></i> Next</button>
                </div>
            </div>

            <div class="wizard-step" v-else-if="step === 3">
                <div class="wizard-step-content">
                    <div>
                        <h1>First time setup</h1>
                        <p>Please read the following instructions carefully.</p>
                    </div>

                    <br>

                    <p>Open the folder where you saved your downloaded copy of DDLC. Drag and drop the file into the
                        space below.</p>

                    <br>

                    <DropZone :text="'Drag your downloaded copy of DDLC here'"
                              @directory="folderCheck"
                              @file="fileCheck"
                              @click.native="browse"></DropZone>

                    <br>

                    <div v-if="selection.validating">
                        <i class="fas fa-spinner fa-spin"></i> Please wait a moment...
                    </div>

                    <div v-if="selection.directory">
                        <h2><i class="fas fa-exclamation-triangle"></i> You selected a folder instead of the DDLC
                            zip file</h2>
                        <p>Please make sure you aren't selecting an extracted copy of the game and try again.</p>
                    </div>

                    <template v-if="selection.validated">
                        <div v-if="selection.valid">
                            <div v-if="!selection.version_match">
                                <h2><i class="fas fa-exclamation-triangle"></i> That doesn't look like the right zip
                                    file</h2>
                                <p>Please go back and double-check you followed the instructions exactly as shown.</p>
                            </div>
                            <div v-else>
                                <h2><i class="fas fa-check"></i> We found your copy of DDLC</h2>
                                <p>You're now ready to move on to the next step!</p>
                            </div>
                        </div>
                        <div v-else>
                            <h2><i class="fas fa-exclamation-triangle"></i> That doesn't look like the right file</h2>
                            <p>Please double-check you dragged the right file and try again.</p>
                        </div>
                    </template>

                </div>
                <div class="wizard-step-controls">
                    <button class="secondary" @click="previous"><i class="fas fa-arrow-left fa-fw"></i> Previous
                    </button>
                    <button class="primary"
                            @click="next"
                            :disabled="!selection.valid || !selection.version_match">
                        <i class="fas fa-arrow-right fa-fw"></i> Next
                    </button>
                </div>
            </div>

            <div class="wizard-step" v-else-if="step === 4">
                <div class="wizard-step-content">
                    <div>
                        <h1>First time setup</h1>
                        <p>Just a couple more things...</p>
                    </div>

                    <br>

                    <h2>Save Location</h2>
                    <p>If you want to store your mods on a different drive, now's your chance to choose it.</p>

                    <br>

                    <p><label for="ob_install_folder">Save Location</label></p>

                    <div class="input-row">
                        <input type="text" v-model="save_directory" readonly id="ob_install_folder">
                        <button class="primary">Change</button>
                    </div>

                    <br>

                    <h2>Who's your favourite character?</h2>
                    <p>Don't think, just answer.</p>

                    <br>

                    <p><label for="ob_waifu">Best Girl</label></p>

                    <p>
                        <select v-model="background" id="ob_waifu">
                            <option value="default.png">All of them!</option>
                            <option value="x-base-monika.png">Monika!</option>
                            <option value="x-base-natsuki.png">Natsuki!</option>
                            <option value="x-base-sayori.png">Sayori!</option>
                            <option value="x-base-yuri.png">Yuri!</option>
                        </select>
                    </p>
                </div>
                <div class="wizard-step-controls">
                    <button class="secondary" @click="previous"><i class="fas fa-arrow-left fa-fw"></i> Previous
                    </button>
                    <button class="primary" @click="finalise"><i class="fas fa-check fa-fw"></i> Finish</button>
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
                step: 1,
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
        },
        beforeDestroy() {
            ddmm.off("onboarding validated", this._validateCallback);
        },
        methods: {
            _: ddmm.translate,
            next() {
                this.step += 1;
            },
            previous() {
                this.step -= 1;
            },
            folderCheck() {
                this.selection.valid = false;
                this.selection.validated = false;
                this.selection.directory = true;
            },
            validate(path) {
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
                if (result.path === this.selection.path) {
                    this.selection.validating = false;
                    this.selection.validated = true;
                    this.selection.version_match = result.version_match;
                    this.selection.valid = result.success;
                }
            },
            finalise() {
                Logger.info("Onboarding", "Finalising setup!");
                this.$store.commit("set_background", this.background);
                ddmm.config.saveConfigValue("installFolder", this.save_directory);
                this.$emit("close");
                ddmm.onboarding.finalise(this.selection.path);
            }
        }
    }
</script>

<style scoped>

</style>
