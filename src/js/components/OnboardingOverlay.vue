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

            <div class="wizard-step" v-if="step === 2">
                <div class="wizard-step-content">
                    <div>
                        <h1>Download DDLC</h1>
                        <p>You will need to select a copy of the Doki Doki Literature Club
                            game in the next step.</p>

                        <br>

                        <p class="text-center"><strong>Please read the following information carefully.</strong></p>

                        <br>

                        <div class="regular-font">
                            <h2><i class="fab fa-steam fa-fw"></i> Information for Steam users</h2>
                            <p>The Steam version of Doki Doki Literature Club is <strong>not</strong> compatible with
                                Doki Doki Mod Manager. If you previously played through Steam, you will need to download
                                a new copy of the game.</p>

                            <br>

                            <template v-if="warnings.mac_safari || true">
                                <h2><i class="fab fa-apple fa-fw"></i> Information for macOS / Safari users</h2>

                                <p>Safari may automatically extract the downloaded game. You should disable this feature
                                    as
                                    it interferes with the setup process. This can be done from Safari's preferences
                                    screen.
                                    <Link to="https://help.doki.space/images/user_guide/macos_auto_extract.png">
                                        (Click here for a visual guide)
                                    </Link>
                                </p>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="wizard-step-controls">
                    <button class="secondary" @click="previous"><i class="fas fa-arrow-left fa-fw"></i> Previous
                    </button>
                    <button class="primary" @click="next"><i class="fas fa-arrow-right fa-fw"></i> Next</button>
                </div>
            </div>

            <div class="wizard-step" v-if="step === 3">
                <div class="wizard-step-content">
                    <div>
                        <h1>Download DDLC</h1>
                        <p>You will need to select a copy of the Doki Doki Literature Club
                            game in the next step.</p>
                    </div>

                    <br>

                    <div class="drop-zone">
                        <p><i class="fas fa-upload fa-2x"></i></p>
                        <p>Drag your downloaded copy of DDLC here</p>
                    </div>
                </div>
                <div class="wizard-step-controls">
                    <button class="secondary" @click="previous"><i class="fas fa-arrow-left fa-fw"></i> Previous
                    </button>
                    <button class="primary" @click="$emit('close')"><i class="fas fa-arrow-right fa-fw"></i> Next
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import Link from "./elements/Link";

    export default {
        name: "OnboardingOverlay",
        components: {Link},
        data() {
            return {
                step: 1,
                warnings: {
                    mac_safari: ddmm.platform === "darwin"
                }
            }
        },
        methods: {
            _: ddmm.translate,
            next() {
                this.step += 1;
            },
            previous() {
                this.step -= 1;
            }
        }
    }
</script>

<style scoped>
    .drop-zone {
        border: 5px dashed rgba(255, 255, 255, 0.5);
        padding: 1em;
        cursor: pointer;
        text-align: center;
        border-radius: 10px;
    }

    .drop-zone.active {
        border-color: #fff;
    }
</style>
