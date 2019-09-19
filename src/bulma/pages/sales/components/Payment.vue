<template>
    <modal show
        portal="payment-modal"
        v-on="$listeners">
        <enso-form class="box has-background-light payment-form"
            disable-state
            :path="route('commercial.sales.payments.create')"
            v-on="$listeners"
            @ready="$refs.form.field('version').value = order.form.field('version').value"
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

export default {
    name: 'PaymentConfigurator',

    inject: ['i18n', 'route', 'order'],

    components: { Modal, EnsoForm, FormField },

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
        update(type) {
            if (`${type}` !== this.enums.paymentTypes.Receipt) {
                this.enableInputs();
                return;
            }

            this.disableInputs();
        },
        enableInputs() {
            this.attributes.forEach(attribute => (this.$refs.form
                .field(attribute).meta.hidden = false));
        },
        disableInputs() {
            this.attributes.forEach((attribute) => {
                this.$refs.form.field(attribute).value = null;
                this.$refs.form.field(attribute).meta.hidden = true;
            });
        },
    },
};
</script>

<style lang="scss">
    .payment-modal {
        .modal {
            overflow: visible;

            .modal-content {
                width: 350px;
                overflow: scroll;
            }
        }
    }
</style>
