<template>
    <modal show
        portal="payment-modal"
        v-on="$listeners">
        <enso-form class="box has-background-light payment-form"
            disable-state
            :path="route('commercial.sales.payments.create')"
            v-on="$listeners"
            @ready="$refs.form.field('version').value = order.form.field('version').value; ready = true;"
            :params="params"
            ref="form">
            <template v-slot:type="{ field }">
                <form-field :field="field"
                    @input="update"/>
            </template>
        </enso-form>
    </modal>
</template>

<script>
import { mapState } from 'vuex';
import { Modal, EnsoForm, FormField } from '@enso-ui/bulma';
import clientPayment from '@enso-ui/financials/src/bulma/pages/financials/clients/mixins/clientPayment';

export default {
    name: 'PaymentConfigurator',

    inject: ['i18n', 'route', 'order'],

    components: { Modal, EnsoForm, FormField },

    mixins: [clientPayment],

    data: () => ({
        attributes: ['date', 'number', 'serial', 'due_date'],
    }),

    computed: {
        ...mapState(['enums']),
        params() {
            return { ...this.$route.params };
        },
    },

    methods: {
        update() {
            this.updateIsCollected();
            this.readonlyAndClear('serial', this.usesAutoSerial || this.hasNoSerial)
                .readonlyAndClear('number', `${this.type}` === this.enums.paymentTypes.Receipt)
                .readonly('date', this.isImmediatelyCollected)
                .readonlyAndClear('due_date', this.isImmediatelyCollected);
        },
    },
};
</script>

<style lang="scss">
    .payment-modal {
        .modal {
            .modal-content {
                width: 350px;
                overflow: scroll;
                .box {
                    min-height: 400px;
                }
            }
        }
    }
</style>
