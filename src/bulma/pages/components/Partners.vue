<template>
    <div>
        <form-field v-bind="$attrs"
            :field="form.field(attribute)"
            :custom-params="partnerParams"
            @selection="order.partner = $event"/>
        <div v-if="order.partner">
            <div class="level is-marginless">
                <div class="level-left">
                    <div class="level-item">
                        <p>
                            {{ type === 'company' ? i18n('Fiscal Code') : i18n('UID') }}
                            : {{ order.partner.fiscalCode }}
                        </p>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-">
                        <p>{{ i18n('Phone') }}: {{ order.partner.phone }}</p>
                    </div>
                </div>
            </div>
            <div class="columns has-margin-top-medium"
                 v-if="[enums.orders.Sale, enums.orders.SaleReturn]
                    .includes(form.param('type'))">
                <div class="column is-narrow">
                    <label class="label has-margin-top-medium">
                        {{ i18n('Address') }}
                    </label>
                </div>
                <div class="column">
                    <select-field :errors="form.errors"
                        :i18n="i18n"
                        :field="form.field('address_id')"
                        :params="addressParams"
                        @changed="form.submit()"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { FormField } from '@enso-ui/forms/bulma';
import SelectField from '@enso-ui/forms/src/bulma/fields/SelectField.vue';

export default {
    name: 'Partners',

    inject: ['errorHandler', 'i18n', 'order'],

    components: { SelectField, FormField },

    computed: {
        ...mapState(['enums']),
        addressParams() {
            return this.order.partner && {
                is_shipping: true,
                addressable_id: this.order.partner.id,
                addressable_type: this.type,
            };
        },
        addressReadonly() {
            return this.form.field('status')
                .value === this.enums.orderStatuses.Finalized;
        },
        attribute() {
            return this.$route.params.type
                ?? this.form.param('partnerAttribute');
        },
        form() {
            return this.order.form;
        },
        partnerReadonly() {
            return this.order.lines.length > 0;
        },
        partnerParams() {
            return { type: this.type };
        },
        type() {
            return this.attribute.replace('_id', '');
        },
    },

    watch: {
        partnerReadonly: {
            handler(readonly) {
                this.form.field(this.attribute).meta.readonly = readonly;
            },
            immediate: true,
        },
        addressReadonly: {
            handler(readonly) {
                if ([this.enums.orders.Sale, this.enums.orders.SaleReturn]
                    .includes(this.form.param('type'))) {
                    this.form.field('address_id').meta.readonly = readonly;
                }
            },
            immediate: true,
        },
    },
};
</script>
