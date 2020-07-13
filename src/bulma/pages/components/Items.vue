<template>
    <div class="columns">
        <div class="column">
            <div class="field">
                <div class="control">
                    <div class="field has-addons">
                        <enso-typeahead class="product-selector"
                            source="commercial.products"
                            :params="params"
                            :paginate="10"
                            @selected="clear()"
                            v-on="$listeners"
                            v-if="mode === enums.lineItems.Product"
                            ref="typeahead">
                            <template v-slot:option="{ item, highlight }">
                                <article class="media has-vertically-centered-content">
                                    <figure class="media-left">
                                        <p class="image is-64x64 has-vertically-centered-content">
                                            <img :src="route('core.files.show', item.picture.file.id)"
                                                v-if="item.picture">
                                            <img src="/images/not-available-circle.svg"
                                                v-else>
                                        </p>
                                    </figure>
                                    <div class="media-content has-padding-left-medium">
                                        <p v-html="highlight(item.name)"/>
                                        <p v-html="highlight(item.partNumber)"/>
                                        <p>
                                            <span class="icon is-small has-text-info">
                                                <fa icon="ron-sign"
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
                                    </div>
                                </article>
                            </template>
                        </enso-typeahead>
                        <enso-typeahead class="product-selector"
                            source="commercial.services"
                            :paginate="10"
                            @selected="$refs.services.clear()"
                            v-on="$listeners"
                            v-else-if="mode === enums.lineItems.Service"
                            ref="services"/>
                        <a class="button is-info"
                            @click="toggleMode"
                            :disabled="
                                order.form && order.form.field('fulfilled_at').value !== null
                            "
                            v-if="type === enums.orders.Purchase || type === enums.orders.Sale">
                            <span class="icon is-small">
                                <fa :icon="['fab', 'product-hunt']"
                                    v-if="mode === enums.lineItems.Product"/>
                                <fa icon="handshake"
                                    v-else-if="mode === enums.lineItems.Service"/>
                            </span>
                        </a>
                        <a :class="['button', {'is-primary': mappings}]"
                           v-tooltip="
                               mappings ? i18n('Only mapped products') : i18n('All products')
                           "
                           @click="mappings = !mappings"
                           :disabled="order.form && order.form.field('fulfilled_at').value !== null"
                           v-if="type === enums.orders.Purchase">
                            <span class="icon is-small">
                                <fa icon="project-diagram"/>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { VTooltip } from 'v-tooltip';
import { EnsoTypeahead } from '@enso-ui/typeahead/bulma';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faDollarSign, faHandPaper, faProjectDiagram, faHandshake,
} from '@fortawesome/free-solid-svg-icons';
import { faInventory } from '@fortawesome/pro-solid-svg-icons';

const faRonSign = {
    prefix: 'fas',
    iconName: 'ron-sign',
    icon: [100, 100, [], 'e001', 'M 10 5 L 10 100 L 85 100 L 85 85 L 25 85 L 25 5 Z'],
};

library.add(faRonSign, faInventory, faHandPaper, faProjectDiagram, faHandshake);

export default {
    name: 'Items',

    directives: { tooltip: VTooltip },

    components: { EnsoTypeahead },

    inject: ['i18n', 'order', 'route'],

    data: () => ({
        mappings: true,
        mode: null,
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

    created() {
        this.mode = this.enums.lineItems.Product;
    },

    methods: {
        toggleMode() {
            this.mode = this.mode === this.enums.lineItems.Product
                ? this.enums.lineItems.Service
                : this.enums.lineItems.Product;
        },
        clear() {
            setTimeout(() => this.$refs.typeahead.clear(), 500);
        }
    },
};
</script>

<style lang="scss">
    .product-selector.dropdown.typeahead {
        .dropdown-menu {
            .dropdown-content {
                .items {
                    max-height: 23.8em;

                    .image.is-64x64 {
                        img {
                            width: auto;
                            height: auto;
                            max-width: 64px;
                            max-height: 64px;
                        }
                    }

                    .media-content {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
</style>
