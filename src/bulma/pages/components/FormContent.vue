<template>
    <div class="columns order-form">
        <div class="column is-5-tablet is-6-widescreen">
            <partners v-bind="$attrs"/>
        </div>
        <div class="column">
            <div class="columns">
                <div class="column is-narrow">
                    <div class="columns">
                        <div class="column is-narrow">
                            <form-field v-bind="$attrs"
                                :field="form.field('date')"/>
                        </div>
                        <div class="column is-narrow">
                            <form-field v-bind="$attrs"
                                :field="form.field(form.param('fulfillingAttribute'))"/>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column is-narrow">
                            <form-field v-bind="$attrs"
                                :field="form.field('number')"/>
                        </div>
                        <div class="column is-narrow"
                             v-if="[enums.orders.Purchase, enums.orders.PurchaseReturn]
                                .includes(form.param('type'))">
                            <form-field v-bind="$attrs"
                                :field="form.field('supplier_order_reference')"/>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <actions v-on="$listeners"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { FormField } from '@enso-ui/forms/bulma';
import Partners from './Partners.vue';
import Actions from './Actions.vue';

export default {
    name: 'FormContent',

    components: { Actions, FormField, Partners, },

    inject: ['order', 'hasLines'],

    computed: {
        ...mapState(['enums']),
        form() {
            return this.order.form;
        },
        readonlyDate() {
            return this.hasLines();
        },
    },

    watch: {
        readonlyDate: {
            handler(readonly) {
                this.form.field('date').meta.readonly = readonly;
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

        .field > .control > .input {
            width: 10.5em;
        }
    }
</style>
