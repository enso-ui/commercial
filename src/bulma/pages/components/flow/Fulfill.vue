<template>
    <button class="button is-naked"
        v-tooltip="tooltip"
        :disabled="processing() || someInStock()"
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

    inject: ['allInStock', 'i18n',  'order', 'processing', 'someInStock', 'updateFlow'],

    computed: {
        ...mapState(['enums']),
        cssClass() {
            if (!this.done) {
                return 'has-text-danger';
            }

            return this.allInStock() ? 'has-text-success' : 'has-text-warning';
        },
        done() {
            return this.status === this.statuses.Fulfilled;
        },
        status() {
            return this.order.form.field('status').value;
        },
        statuses() {
            return this.enums.orderStatuses;
        },
        tooltip() {
            if (this.someInStock()) {
                return null;
            }

            return this.done ? this.i18n('Undo fulfill') : this.i18n('Fulfill');
        },
        visible() {
            return [this.statuses.Received, this.statuses.Fulfilled]
                .includes(this.status);
        },
    },

    methods: {
        update() {
            const action = this.done
                ? this.enums.flowActions.UndoFulfill
                : this.enums.flowActions.Fulfill;

            this.updateFlow(action);
        }
    },
};
</script>
