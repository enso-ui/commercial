<template>
    <button class="button is-naked"
        v-tooltip="tooltip"
        :disabled="processing()"
        @click="update"
        v-if="visible">
        <span :class="['icon', cssClass]">
            <fa icon="box"/>
        </span>
    </button>
</template>

<script>
import { mapState } from "vuex";
import { VTooltip } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBox } from '@fortawesome/free-solid-svg-icons';

library.add(faBox);

export default {
    name: 'Prepare',

    directives: { tooltip: VTooltip },

    inject: ['allRemovedFromStock', 'i18n',  'updateFlow', 'order', 'processing'],

    computed: {
        ...mapState(['enums']),
        cssClass() {
            return this.done ? 'has-text-success' : 'has-text-danger';
        },
        done() {
            return this.status === this.statuses.Prepared;
        },
        status() {
            return this.order.form.field('status').value;
        },
        statuses() {
            return this.enums.orderStatuses;
        },
        tooltip() {
            return this.done
                ? this.i18n('Undo prepare')
                : this.i18n('Prepare products');
        },
        visible() {
            return this.status === this.statuses.Prepared
                || this.status === this.statuses.Fulfilling &&
                this.allRemovedFromStock();
        },
    },

    methods: {
        update() {
            const action = this.done
                ? this.enums.flowActions.UndoPrepare
                : this.enums.flowActions.Prepare;

            this.updateFlow(action);
        }
    },
};
</script>
