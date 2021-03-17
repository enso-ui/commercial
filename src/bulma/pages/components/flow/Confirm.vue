<template>
    <button class="button is-naked"
        v-tooltip="tooltip"
        :disabled="processing()"
        @click="update"
        v-if="visible">
        <span :class="['icon', cssClass]">
            <fa icon="clipboard-check"/>
        </span>
    </button>
</template>

<script>
import { mapState } from "vuex";
import { VTooltip } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

library.add(faClipboardCheck);

export default {
    name: 'Confirm',

    directives: { tooltip: VTooltip },

    inject: ['i18n',  'updateFlow', 'order', 'processing'],

    computed: {
        ...mapState(['enums']),
        cssClass() {
            return this.done ? 'has-text-success' : 'has-text-danger';
        },
        done() {
            return this.status === this.statuses.Confirmed;
        },
        status() {
            return this.order.form.field('status').value;
        },
        statuses() {
            return this.enums.orderStatuses;
        },
        tooltip() {
            return this.done ? this.i18n('Undo confirm') : this.i18n('Confirm');
        },
        visible() {
            return [this.statuses.New, this.statuses.Confirmed]
                .includes(this.status);
        },
    },

    methods: {
        update() {
            const action = this.done
                ? this.enums.flowActions.UndoConfirm
                :  this.enums.flowActions.Confirm; 

            this.updateFlow(action);
        }
    },
};
</script>
