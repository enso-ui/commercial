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
                    :title="i18n('Product')"
                    v-model="filters.client_stocks.product_id"/>
            </div>
        </div>
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
                v-if="filters.client_stocks.client_id"
                ref="uploader"/>
        </div>
        <div class="columns is-centered has-margin-top-large"
             v-if="ready">
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    v-model="params.sales.dateInterval"
                    default="thirtyDays"
                    :title="i18n('Date')"
                    :interval="intervals.sales.date"/>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <p class="title is-5 has-text-centered">
                    {{ i18n('Sales') }}
                </p>
                <enso-table class="box is-paddingless raises-on-hover"
                    id="stock-sales"
                    :path="route('commercial.audit.sales.initTable')"
                    :filters="productFilter"
                    :params="saleParams"
                    @reset="$refs.saleIntervalsState.reset();"/>
            </div>
            <div class="column">
                <p class="title is-5 has-text-centered">
                    {{ i18n('Sale Returns') }}
                </p>
                <enso-table class="box is-paddingless raises-on-hover"
                    id="stocks-sale-returns"
                    :path="route('commercial.audit.saleReturns.initTable')"
                    :filters="productFilter"
                    :params="saleParams"
                    @reset="$refs.saleIntervalsState.reset();"/>
            </div>
        </div>
        <div class="columns is-centered"
             v-if="ready">
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    v-model="params.purchases.dateInterval"
                    default="thirtyDays"
                    :title="i18n('Date')"
                    :interval="intervals.purchases.date"/>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <p class="title is-5 has-text-centered has-margin-top-large">
                    {{ i18n('Purchases') }}
                </p>
                <enso-table class="box is-paddingless raises-on-hover"
                    id="stocks-purchases"
                    :path="route('commercial.audit.purchases.initTable')"
                    :filters="productFilter"
                    :params="purchaseParams"/>
            </div>
            <div class="column">
                <p class="title is-5 has-text-centered has-margin-top-large">
                    {{ i18n('Purchase Returns') }}
                </p>
                <enso-table class="box is-paddingless raises-on-hover"
                    id="stocks-purchase-returns"
                    :path="route('commercial.audit.purchaseReturns.initTable')"
                    :filters="productFilter"
                    :params="purchaseParams"/>
            </div>
        </div>
        <filter-state :api-version="apiVersion"
            name="intervals"
            :params="params"
            :filters="filters"
            :intervals="intervals"
            @ready="ready = true"
            ref="intervalsState"/>
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
            apiVersion: 1.3,
            ready: false,
            filters: {
                client_stocks: {
                    supplier_id: null,
                    company_id: null,
                    person_id: null,
                    product_id: null,
                },
            },
            intervals: {
                sales: {
                    date: {
                        min: null,
                        max: null,
                        dbDateFormat: 'Y-m-d',
                    },
                },
                purchases: {
                    date: {
                        min: null,
                        max: null,
                        dbDateFormat: 'Y-m-d',
                    },
                },
            },
            params: {
                client: null,
                sales: {
                    dateInterval: 'thirtyDays',
                },
                purchases: {
                    dateInterval: 'thirtyDays',
                },

            },
        };
    },

    computed: {
        stockFilters() {
            return {
                client_stocks: {
                    supplier_id: this.filters.client_stocks.supplier_id,
                    client_id: this.filters.client_stocks.company_id,
                    product_id: this.filters.client_stocks.product_id,
                },
            };
        },
        uploaderParams() {
            return {
                type: 'clientStocks',
                client: this.filters.client_stocks.client_id,
            };
        },
        productFilter() {
            return {
                products: {
                    id: this.filters.client_stocks.product_id,
                },
            };
        },
        saleParams() {
            return {
                company_id: this.filters.client_stocks.company_id,
                person_id: this.filters.client_stocks.person_id,
                supplier_id: this.filters.client_stocks.supplier_id,
                startDate: this.intervals.sales.date.min,
                endDate: this.intervals.sales.date.max,
            };
        },
        purchaseParams() {
            return {
                supplier_id: this.filters.client_stocks.supplier_id,
                startDate: this.intervals.purchases.date.min,
                endDate: this.intervals.purchases.date.max,
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
    },

};
</script>
