<template>
    <div>
        <div class="columns is-multiline is-centered">
            <div class="column is-4-desktop">
                <enso-select-filter class="box raises-on-hover"
                    source="commercial.stocks.suppliers"
                    :title="i18n('Supplier')"
                    v-model="filters.client_stocks.supplier_id"/>
            </div>
            <div class="column is-4-desktop">
                <enso-select-filter class="box raises-on-hover"
                    source="commercial.stocks.clients"
                    :title="i18n('Client')"
                    v-model="filters.client_stocks.client_id"/>
            </div>
            <div class="column is-4-desktop">
                <enso-select-filter class="box raises-on-hover"
                    source="products.options"
                    disable-filtering
                    :title="i18n('Product')"
                    v-model="filters.client_stocks.product_id"/>
            </div>
        </div>
        <p class="title is-5 has-text-centered">
            {{ i18n('Client Stocks') }}
        </p>
        <enso-table class="box is-paddingless raises-on-hover"
            id="stocks"
            :filters="filters"
            @import="openUploader"/>
        <import-uploader v-show="false"
            :path="route('import.store')"
            :params="uploaderParams"
            v-if="filters.client_stocks.client_id"
            ref="uploader"/>
        <div class="columns is-centered">
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    :title="i18n('Date')"
                    default="thirtyDays"
                    @update="
                        saleIntervals.sales.date.min = $event.min;
                        saleIntervals.sales.date.max = $event.max;
                        saleReturnIntervals.sale_returns.date.min = $event.min;
                        saleReturnIntervals.sale_returns.date.max = $event.max;
                    "/>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <p class="title is-5 has-text-centered">
                    {{ i18n('Sales') }}
                </p>
                <enso-table class="box is-paddingless raises-on-hover"
                    id="stock-sales"
                    :path="route('commercial.stocks.sales.initTable')"
                    :filters="productFilter('sale_lines')"
                    :params="saleParams"
                    :intervals="saleIntervals"/>
            </div>
            <div class="column">
                <p class="title is-5 has-text-centered">
                    {{ i18n('Returns') }}
                </p>
                <enso-table class="box is-paddingless raises-on-hover"
                    id="stocks-saleReturns"
                    :path="route('commercial.stocks.saleReturns.initTable')"
                    :filters="productFilter('sale_return_lines')"
                    :params="saleParams"
                    :intervals="saleReturnIntervals"/>
            </div>
        </div>
        <div class="columns is-centered">
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    :title="i18n('Date')"
                    default="thirtyDays"
                    @update="
                        purchaseIntervals.purchases.date.min = $event.min;
                        purchaseIntervals.purchases.date.max = $event.max;
                        purchaseReturnIntervals.purchase_returns.date.min = $event.min;
                        purchaseReturnIntervals.purchase_returns.date.max = $event.max;
                    "/>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <p class="title is-5 has-text-centered has-margin-top-large">
                    {{ i18n('Purchases') }}
                </p>
                <enso-table class="box is-paddingless raises-on-hover"
                    id="stocks-purchases"
                    :path="route('commercial.stocks.purchases.initTable')"
                    :filters="productFilter('purchase_lines')"
                    :intervals="purchaseIntervals"
                    :params="purchaseParams"/>
            </div>
            <div class="column">
                <p class="title is-5 has-text-centered has-margin-top-large">
                    {{ i18n('Returns') }}
                </p>
                <enso-table class="box is-paddingless raises-on-hover"
                    id="stocks-purchaseReturns"
                    :path="route('commercial.stocks.purchaseReturns.initTable')"
                    :filters="productFilter('purchase_return_lines')"
                    :intervals="purchaseReturnIntervals"
                    :params="purchaseParams"/>
            </div>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { EnsoDateFilter, EnsoSelectFilter } from '@enso-ui/bulma';
import { EnsoTable } from '@enso-ui/tables/bulma';
import ImportUploader from '@core-pages/dataImport/components/ImportUploader.vue';

library.add(faFileImport);

export default {
    name: 'Index',

    components: {
        EnsoDateFilter, EnsoSelectFilter, EnsoTable, ImportUploader,
    },

    inject: ['i18n', 'route'],

    data() {
        return {
            filters: {
                client_stocks: {
                    supplier_id: null,
                    client_id: null,
                    product_id: null,
                },
            },
            saleIntervals: {
                sales: {
                    date: {
                        min: null,
                        max: null,
                        dbDateFormat: 'Y-m-d',
                    },
                },
            },
            saleReturnIntervals: {
                sale_returns: {
                    date: {
                        min: null,
                        max: null,
                        dbDateFormat: 'Y-m-d',
                    },
                },
            },
            purchaseIntervals: {
                purchases: {
                    date: {
                        min: null,
                        max: null,
                        dbDateFormat: 'Y-m-d',
                    },
                },
            },
            purchaseReturnIntervals: {
                purchase_returns: {
                    date: {
                        min: null,
                        max: null,
                        dbDateFormat: 'Y-m-d',
                    },
                },
            },
        };
    },

    computed: {
        uploaderParams() {
            return {
                type: 'clientStocks',
                client: this.filters.client_stocks.client_id,
            };
        },
        saleParams() {
            return {
                client_id: this.filters.client_stocks.client_id,
                supplier_id: this.filters.client_stocks.supplier_id,
            };
        },
        purchaseParams() {
            return {
                supplier_id: this.filters.client_stocks.supplier_id,
            };
        },
    },

    methods: {
        openUploader() {
            if (!this.filters.client_stocks.client_id) {
                this.$toastr.warning(this.i18n('Please select a client first'));
                return;
            }
            this.$refs.uploader.browseFiles();
        },
        productFilter(table) {
            return {
                [table]: { product_id: this.filters.client_stocks.product_id },
            };
        },
    },

};
</script>
