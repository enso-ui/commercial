<template>
    <div class="columns">
        <div class="column">
            <div class="field">
                <div class="control">
                    <enso-typeahead class="product-selector"
                        source="commercial.products"
                        :params="params"
                        :paginate="10"
                        @selected="$refs.typeahead.clear()"
                        v-on="$listeners"
                        v-if="addsProducts"
                        ref="typeahead">
                        <template v-slot:option="{ item, highlight }">
                            <p v-html="highlight(item.name)"/>
                            <p v-html="highlight(item.partNumber)"/>
                            <p v-html="highlight(item.author)"/>
                            <p v-html="highlight(item.publisher.name)" v-if="item.publisher"/>
                            <p>
                                <span class="icon is-small has-text-info">
                                    <fa icon="dollar-sign"
                                        size="xs"/>
                                </span>
                                :
                                <strong>{{ item.price }}</strong>
                                <span class="icon is-small"
                                    :class="item.quantity ? 'has-text-success' : 'has-text-danger'">
                                    <fa icon="inventory"
                                        size="xs"/>
                                </span>
                                :
                                <strong>{{ item.quantity }}</strong>
                                <span class="icon is-small has-text-info">
                                    <fa icon="hand-paper"
                                        size="xs"/>
                                </span>
                                :
                                <strong>{{ item.reservedQuantity }}</strong>
                            </p>
                        </template>
                    </enso-typeahead>
                    <enso-typeahead class="product-selector"
                        source="commercial.services"
                        :params="params"
                        :paginate="10"
                        @selected="$refs.services.clear()"
                        v-on="$listeners"
                        v-if="!addsProducts"
                        ref="services"/>
                </div>
            </div>
        </div>
        <div class="column is-narrow"
             v-if="type === enums.orders.Purchase || type === enums.orders.Sale">
            <div class="is-flex has-padding-medium">
                <vue-switch class="is-medium"
                            :disabled="order.form && order.form.field('fulfilled_at').value !== null"
                            v-model="addsProducts"/>
                <span class="icon is-small has-text-info"
                      v-tooltip="
                        addsProducts ? i18n('Products') : i18n('Services')
                    ">
                    <fa icon="info-circle"/>
                </span>
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
import { EnsoTypeahead } from '@enso-ui/typeahead/bulma';
import VueSwitch from '@enso-ui/switch/bulma';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHandPaper } from '@fortawesome/free-solid-svg-icons';
import { faInventory } from '@fortawesome/pro-solid-svg-icons';

library.add(faDollarSign, faInventory, faHandPaper);

export default {
    name: 'Products',

    directives: { tooltip: VTooltip },

    components: { EnsoTypeahead, VueSwitch },

    inject: ['i18n', 'order'],

    data: () => ({
        mappings: true,
        addsProducts: false,
    }),

    computed: {
        ...mapState(['enums']),
        form() {
            return this.order.form;
        },
        type() {
            return this.form.param('type');
        },
        params() {
            return {
                custom: this.customParams,
                pivot: this.pivotParams,
            };
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
