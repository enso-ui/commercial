<template>
    <div class="columns">
        <div class="column">
            <div class="field">
                <div class="control">
                    <enso-select class="product-selector"
                        label="label"
                        :placeholder="i18n('Pick a product')"
                        source="commercial.products"
                        :pivot-params="pivotParams"
                        :custom-params="customParams"
                        :paginate="100"
                        disable-filtering
                        v-on="$listeners">
                        <template v-slot:option="{ option, highlight }">
                            <p v-html="highlight(option.name)"/>
                            <p v-html="highlight(option.partNumber)"/>
                            <p v-html="highlight(option.author)"/>
                            <p v-html="highlight(option.publisher.name)" v-if="option.publisher"/>
                            <p>
                                <span class="icon is-small has-text-info">
                                    <fa icon="dollar-sign"
                                        size="xs"/>
                                </span>
                                :
                                <strong>{{ option.price }}</strong>
                                <span class="icon is-small"
                                    :class="option.quantity ? 'has-text-success' : 'has-text-danger'">
                                    <fa icon="inventory"
                                        size="xs"/>
                                </span>
                                :
                                <strong>{{ option.quantity }}</strong>
                                <span class="icon is-small has-text-info">
                                    <fa icon="hand-paper"
                                        size="xs"/>
                                </span>
                                :
                                <strong>{{ option.reservedQuantity }}</strong>
                            </p>
                        </template>
                    </enso-select>
                </div>
            </div>
        </div>
        <div class="column is-narrow"
            v-if="type === enums.orders.Purchase">
            <div class="is-flex has-padding-medium">
                <vue-switch class="is-medium"
                    :disabled="order.form && order.form.field('fulfilled_at').value !== null"
                    v-model="mappings"/>
                <span class="icon is-small has-text-info"
                    v-tooltip="
                        mappings ? i18n('Only mapped products') : i18n('All products')
                    ">
                    <fa icon="info-circle"/>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { VTooltip } from 'v-tooltip';
import { EnsoSelect, VueSwitch } from '@enso-ui/bulma';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDollarSign, faHandPaper } from '@fortawesome/free-solid-svg-icons';
import { faInventory } from '@fortawesome/pro-solid-svg-icons';

library.add(faDollarSign, faInventory, faHandPaper);

export default {
    name: 'Products',

    directives: { tooltip: VTooltip },

    components: { EnsoSelect, VueSwitch },

    inject: ['i18n', 'order'],

    data: () => ({
        mappings: true,
    }),

    computed: {
        ...mapState(['enums']),
        form() {
            return this.order.form;
        },
        type() {
            return this.form.param('type');
        },
        customParams() {
            switch (this.type) {
            case this.enums.orders.PurchaseReturn:
                return { type: this.type, supplierId: this.order.partner.id };
            case this.enums.orders.SaleReturn:
                return {
                    type: this.type,
                    person_id: this.form.field('person_id').value,
                    company_id: this.form.field('company_id').value,
                };
            default:
                return { type: this.type };
            }
        },
        pivotParams() {
            switch (this.type) {
            case this.enums.orders.Purchase:
                return this.mappings && this.form.field('supplier_id').value !== null
                    ? { suppliers: { id: this.form.field('supplier_id').value } }
                    : {};
            default:
                return {};
            }
        },
    },
};
</script>

<style lang="scss">
    .product-selector.dropdown.vue-select {
        .dropdown-menu {
            .dropdown-content {
                .options {
                    max-height: 20.5em;
                }
            }
        }
    }
</style>
