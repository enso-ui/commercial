<template>
    <button class="button is-naked"
        v-tooltip="tooltip"
        :disabled="processing() || disabled"
        @click="update"
        v-if="visible">
        <span :class="['icon', cssClass]">
            <fa icon="warehouse"/>
        </span>
    </button>
</template>

<script>
import { mapState } from "vuex";
import { VTooltip } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWarehouse } from '@fortawesome/free-solid-svg-icons';

library.add(faWarehouse);

export default {
    name: 'Fulfill',

    directives: { tooltip: VTooltip },

    inject: ['i18n',  'order', 'processing', 'updateFlow'],

    props: {
        disabled: {
            type: Boolean,
            required: true,
        },
        done: {
            type: Boolean,
            required: true,
        },
        visibleWith: {
            type: String,
            required: true,
        },
    },

    computed: {
        ...mapState(['enums']),
        cssClass() {
            if (!this.started) {
                return 'has-text-danger';
            }

            return this.done ? 'has-text-success' : 'has-text-warning';
        },
        started() {
            return this.status === this.statuses.Fulfilling;
        },
        status() {
            return this.order.form.field('status').value;
        },
        statuses() {
            return this.enums.orderStatuses;
        },
        tooltip() {
            return this.started ? this.i18n('Undo fulfill') : this.i18n('Fulfill');
        },
        visible() {
            return [this.statuses.Fulfilling, this.visibleWith]
                .includes(this.status);
        },
    },

    methods: {
        update() {
            const action = this.started
                ? this.enums.flowActions.UndoFulfill
                : this.enums.flowActions.Fulfill;

            this.updateFlow(action);
        }
    },
};
</script>
