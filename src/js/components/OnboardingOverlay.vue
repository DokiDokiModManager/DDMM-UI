<template>
    <div class="cover">
        <div class="onboarding-wizard">
            <div class="wizard-step" v-if="step === 1">
                <div class="wizard-step-content full-center">
                    <div>
                        <h1>Welcome to <strong>Doki Doki Mod Manager</strong> 4</h1>
                        <br>
                        <p>
                            <button class="primary" @click="next"><i class="fas fa-arrow-right fa-fw"></i> Get Started
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
                            <h2>Information for Steam users</h2>
                            <p>The Steam version of Doki Doki Literature Club is <strong>not</strong> compatible with
                                Doki Doki Mod
                                Manager. You will need to download a new copy of the game.</p>

                            <br>

                            <h2>Information for Safari users</h2>

                            <p>Safari may automatically extract the downloaded game. See
                                <Link to="https://apple.stackexchange.com/a/48749">this page</Link>
                                for information on how to disable this behaviour.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="wizard-step-controls">
                    <button class="primary" @click="next"><i class="fas fa-arrow-right fa-fw"></i> Next</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OnboardingOverlay",

        data() {
            return {
                step: 1
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

</style>
