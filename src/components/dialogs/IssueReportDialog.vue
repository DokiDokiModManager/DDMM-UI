<template>
    <Dialog>
        <h2>Report an issue</h2>
        <br>
        <p>Sorry to hear you're having an issue. Please tell me what the issue is, in as much detail as
            possible.</p>
        <br>
        <p>Not all reports will receive a reply. Please use English if you can so I have the best chance of
            understanding your issue.</p>
        <br>
        <label for="issue_report_type">Issue Type</label>
        <p><select id="issue_report_type" v-model="type">
            <option value="bug">Application bug</option>
            <option value="broken mod">Mod not working</option>
            <option value="other">Other</option>
        </select></p>
        <br>
        <label for="issue_report_contact">Contact Details</label>
        <p><input type="text" id="issue_report_contact" v-model="contact"></p>
        <template v-if="type === 'broken mod'">
            <br>
            <label for="issue_report_mod">Link to mod</label>
            <p><input type="text" id="issue_report_mod" v-model="mod"></p>
        </template>
        <br>
        <label for="issue_report_body">Message</label>
        <p><textarea style="resize: none;"
                     id="issue_report_body"
                     rows="5"
                     v-model="body"></textarea></p>
        <br>
        <p>
            <button class="primary" :disabled="sending" @click="sendAndClose">
                <i class="fas fa-paper-plane fa-fw"></i>
                Send Report
            </button>
            <button class="secondary" @click="close"><i class="fas fa-times fa-fw"></i> Cancel</button>
        </p>
    </Dialog>
</template>

<script>

    import Dialog from "./base/Dialog";

    export default {
        name: "IssueReportDialog",
        components: {Dialog},
        data() {
            return {
                type: "bug",
                body: "",
                mod: "",
                contact: "",
                sending: false
            }
        },
        methods: {
            close() {
                this.$store.commit("hide_modal", {modal: "issue_report"});
            },
            sendAndClose() {
                this.sending = true;
                fetch("https://ddmm-issues.shinomiya.group/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: this.type,
                        contact: this.contact,
                        body: this.body,
                        mod: this.type === "broken mod" ? this.mod : null
                    })
                }).then(() => {
                    this.sending = false;
                    this.close();
                });
            }
        }
    }
</script>

<style scoped>

</style>
