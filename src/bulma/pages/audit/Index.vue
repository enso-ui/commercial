<template>
    <div>
        <div class="columns is-multiline is-centered"
            v-if="ready">
            <div class="column is-5">
                <client-filter :params="params"
                    :filters="filters.client_stocks"/>
            </div>
            <div class="column is-3-desktop">
                <enso-select-filter class="box raises-on-hover"
                    source="commercial.audit.suppliers"
                    :title="i18n('Supplier')"
                    v-model="filters.client_stocks.supplier_id"/>
            </div>
            <div class="column is-3-desktop">
                <enso-select-filter class="box raises-on-hover"
                    source="products.options"
                    disable-filtering
                    :title="i18n('Product')"
                    v-model="filters.client_stocks.product_id"/>
            </div>
        </div>
        <filter-state :api-version="apiVersion"
            name="stocks_filters"
            :params="params"
            :filters="filters"
            @ready="ready = true"
            ref="filterState"/>
        <div class="has-margin-bottom-large" v-if="params.client !== 'person'">
            <p class="title is-5 has-text-centered">
                {{ i18n('Client Stocks') }}
            </p>
            <enso-table class="box is-paddingless raises-on-hover"
                id="stocks"
                :path="route('commercial.audit.stocks.initTable')"
                :filters="stockFilters"
                @import="openUploader"
                @reset="$refs.filterState.reset()"/>

            <import-uploader v-show="false"
                :path="route('import.store')"
                :params="uploaderParams"
                v-if="stockFilters.client_stocks.client_id"
                ref="uploader"/>
        </div>
        <div class="columns is-centered has-margin-top-large"
            v-if="ready">
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    v-model="saleDateParams.dateInterval"
                    default="thirtyDays"
                    :title="i18n('Date')"
                    :interval="saleIntervals.sales.date"
                    @update="
                        saleIntervals.sales.date.min = $event.min;
                        saleIntervals.sales.date.max = $event.max;
                        saleReturnIntervals.sale_returns.date.min = $event.min;
                        saleReturnIntervals.sale_returns.date.max = $event.max;
                    "/>
            </div>
        </div>
        <filter-state :api-version="apiVersion"
            name="sale_intervals"
            :params="saleDateParams"
            :intervals="saleIntervals"
            ref="saleIntervalsState"/>
        <filter-state :api-version="apiVersion"
            name="sale_return_intervals"
            :params="saleDateParams"
            :intervals="saleReturnIntervals"
            ref="saleReturnIntervalsState"/>
        <div class="columns">
            <div class="column">
                <p class="title is-5 has-text-centered">
                    {{ i18n('Sales') }}
                </p>
                <enso-table class="box is-paddingless raises-on-hover"
                    id="stock-sales"
                    :path="route('commercial.audit.sales.initTable')"
                    :filters="productFilter('sale_lines')"
                    :params="saleParams"
                    :intervals="saleIntervals"
                    @reset="
                        $refs.saleIntervalsState.reset();
                        $refs.saleReturnIntervalsState.reset();
                    "/>
            </div>
            <div class="column">
                <p class="title is-5 has-text-centered">
                    {{ i18n('Sale Returns') }}
                </p>
                <enso-table class="box is-paddingless raises-on-hover"
                    id="stocks-saleReturns"
                    :path="route('commercial.audit.saleReturns.initTable')"
                    :filters="productFilter('sale_return_lines')"
                    :params="saleParams"
                    :intervals="saleReturnIntervals"
                    @reset="
                        $refs.saleIntervalsState.reset();
                        $refs.saleReturnIntervalsState.reset();
                    "/>
            </div>
        </div>

        <div class="columns is-centered"
            v-if="ready">
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    v-model="purchaseDateParams.dateInterval"
                    default="thirtyDays"
                    :title="i18n('Date')"
                    :interval="purchaseIntervals.purchases.date"
                    @update="
                        purchaseIntervals.purchases.date.min = $event.min;
                        purchaseIntervals.purchases.date.max = $event.max;
                        purchaseReturnIntervals.purchase_returns.date.min = $event.min;
                        purchaseReturnIntervals.purchase_returns.date.max = $event.max;
                    "/>
            </div>
        </div>
        <filter-state :api-version="apiVersion"
            name="purchase_intervals"
            :params="purchaseDateParams"
            :intervals="purchaseIntervals"
            ref="purchaseIntervalsState"/>
        <filter-state :api-version="apiVersion"
            name="purchase_return_intervals"
            :params="purchaseDateParams"
            :intervals="purchaseReturnIntervals"
            ref="purchaseReturnIntervalsState"/>
        <div class="columns">
            <div class="column">
                <p class="title is-5 has-text-centered has-margin-top-large">
                    {{ i18n('Purchases') }}
                </p>
                <enso-table class="box is-paddingless raises-on-hover"
                    id="stocks-purchases"
                    :path="route('commercial.audit.purchases.initTable')"
                    :filters="productFilter('purchase_lines')"
                    :intervals="purchaseIntervals"
                    :params="purchaseParams"
                    @reset="
                        $refs.purchaseIntervalsState.reset();
                        $refs.purchaseReturnIntervalsState.reset();
                    "/>
            </div>
            <div class="column">
                <p class="title is-5 has-text-centered has-margin-top-large">
                    {{ i18n('Purchase Returns') }}
                </p>
                <enso-table class="box is-paddingless raises-on-hover"
                    id="stocks-purchaseReturns"
                    :path="route('commercial.audit.purchaseReturns.initTable')"
                    :filters="productFilter('purchase_return_lines')"
                    :intervals="purchaseReturnIntervals"
                    :params="purchaseParams"
                    @reset="
                        $refs.purchaseIntervalsState.reset();
                        $refs.purchaseReturnIntervalsState.reset();
                    "/>
            </div>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { EnsoDateFilter, EnsoSelectFilter } from '@enso-ui/bulma';
import { EnsoTable } from '@enso-ui/tables/bulma';
import ImportUploader from '@enso-ui/data-import/src/bulma/pages/dataImport/components/ImportUploader.vue';
import ClientFilter from '@enso-ui/financials/src/bulma/pages/financials/clients/components/ClientFilter.vue';
import { FilterState } from '@enso-ui/filters/renderless';

library.add(faFileImport);

export default {
    name: 'Index',

    components: {
        EnsoDateFilter, EnsoSelectFilter, EnsoTable, ImportUploader, ClientFilter, FilterState,
    },

    inject: ['i18n', 'route'],

    data() {
        return {
            apiVersion: 2,
            ready: false,
            filters: {
                client_stocks: {
                    supplier_id: null,
                    company_id: null,
                    person_id: null,
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
            params: {
                client: null,
            },
            saleDateParams: {
                dateInterval: 'thirtyDays',
            },
            purchaseDateParams: {
                dateInterval: 'thirtyDays',
            },
        };
    },

    computed: {
        uploaderParams() {
            return {
                type: 'clientStocks',
                client: this.stockFilters.client_stocks.client_id,
            };
        },
        saleFilters() {
            return {
                sales: {
                    company_id: this.filters.client_stocks.company_id,
                    person_id: this.filters.client_stocks.person_id,
                    product_id: this.filters.client_stocks.product_id,
                },
            };
        },
        saleParams() {
            return {
                company_id: this.filters.client_stocks.company_id,
                person_id: this.filters.client_stocks.person_id,
                supplier_id: this.filters.client_stocks.supplier_id,
            };
        },
        purchaseParams() {
            return {
                supplier_id: this.filters.client_stocks.supplier_id,
            };
        },
        stockFilters() {
            return {
                client_stocks: {
                    supplier_id: this.filters.client_stocks.supplier_id,
                    client_id: this.filters.client_stocks.company_id,
                    product_id: this.filters.client_stocks.product_id,
                },
            };
        },
    },

    methods: {
        openUploader() {
            if (!this.stockFilters.client_stocks.client_id) {
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
