<template>
    <div class="columns order-form">
        <div class="column is-5-tablet is-6-widescreen">
            <partners/>
        </div>
        <div class="column">
            <div class="columns">
                <div class="column is-narrow">
                    <div class="columns">
                        <div class="column is-narrow">
                            <form-field v-bind="$attrs"
                                :field="field('date')"/>
                        </div>
                        <div class="column is-narrow">
                            <form-field class="warehouse"
                                v-bind="$attrs"
                                :field="field('warehouse_id')"/>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column is-narrow">
                            <form-field v-bind="$attrs"
                                :field="field('number')"/>
                        </div>
                        <div class="column is-narrow"
                            v-if="partner">
                            <form-field v-bind="$attrs"
                                :field="field('external_reference')"/>
                        </div>
                        <div class="column is-narrow"
                             v-else-if="enums.orders.Sale === form.param('type')">
                            <emag-order
                                v-if="field('external_reference').value"/>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <controls v-on="$listeners"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { FormField } from '@enso-ui/forms/bulma';
import EmagOrder from '@enso-ui/emag/src/bulma/components/Order.vue';
import Partners from './Partners.vue';
import Controls from './Controls.vue';

export default {
    name: 'FormContent',

    components: { Controls, EmagOrder, FormField, Partners },

    inject: ['order'],

    computed: {
        ...mapState(['enums']),
        form() {
            return this.order.form;
        },
        field() {
            return this.form.field;
        },
        partner() {
            const orders = this.enums.orders;
            const withSupplier = [orders.Purchase, orders.PurchaseReturn];

            return withSupplier.includes(this.form.param('type'))
                ? !!this.field('supplier_id').value
                : !!this.field('person_id').value || !!this.field('company_id').value;
        },
        readonlyDate() {
            return this.order.lines.length > 0;
        },
    },

    watch: {
        readonlyDate: {
            handler(readonly) {
                this.field('date').meta.readonly = readonly;
            },
            immediate: true,
        },
    },

};
</script>

<style lang="scss">
    .order-form {
        .button {
            padding-left: 0.6em;
            padding-right: 0.6em;
        }

        .field > .control > .input, .field.warehouse > .vue-select {
            width: 10.5em;
        }
    }
</style>
