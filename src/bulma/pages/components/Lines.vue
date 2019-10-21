<template>
    <div class="wrapper">
        <div class="columns">
            <div class="column">
                <products @selected="showOrAdd"
                    v-if="!fulfilling()"/>
            </div>
            <slot name="mappings"/>
            <div class="column">
                <search @change="order.page = 1; fetch()"/>
            </div>
        </div>
        <div class="table-responsive order-table"
            v-if="order.partner && hasLines()">
            <table class="table is-fullwidth is-striped is-marginless is-narrow is-hoverable">
                <header-line v-bind="$attrs"/>
                <transition-group name="lines"
                    tag="tbody">
                    <tr is="row-line"
                        class="line"
                        v-for="(line,index) in lines"
                        :line="line"
                        :index="index"
                        :key="line.id"
                        @version-error="fetch"
                        v-on="$listeners"
                        ref="line"/>
                    <tr key="more"
                        v-if="lines.length < order.lineCount">
                        <td colspan="100%">
                            <div class="has-text-centered has-padding-medium">
                                <a @click="order.page++; fetch()">
                                    {{ i18n ('load more') }}... ({{ lines.length }} / {{ order.lineCount }})
                                </a>
                            </div>
                        </td>
                    </tr>
                </transition-group>
                <footer-line v-bind="$attrs"/>
            </table>
        </div>
    </div>
</template>

<script>
import { debounce } from 'lodash';
import Products from './Products.vue';
import Search from './Search.vue';
import HeaderLine from './HeaderLine.vue';
import RowLine from './RowLine.vue';
import FooterLine from './FooterLine.vue';

export default {
    name: 'Lines',

    inject: [
        'errorHandler', 'i18n', 'route', 'order', 'updateOrder', 'hasLines',
        'version', 'fulfilling', 'loadMore',
    ],

    components: {
        Products, Search, HeaderLine, RowLine, FooterLine,
    },

    computed: {
        lines() {
            return this.order.lines;
        },
    },

    created() {
        this.fetch = debounce(this.fetch, 300);
        this.fetch();
    },

    methods: {
        fetch() {
            this.order.processing = true;

            if (this.order.page === 1) {
                this.order.lines.splice(0);
            }

            axios.get(this.route(
                `commercial.${this.order.form.param('type')}s.lines.index`,
                this.$route.params,
            ), { params: { page: this.order.page, search: this.order.query } })
                .then(({ data }) => {
                    this.updateOrder(data.order);
                    this.lines.push(...data.data);
                    this.order.processing = false;
                }).catch(this.errorHandler);
        },
        showOrAdd(product) {
            if (!product) {
                return;
            }

            this.order.query = '';

            const index = this.productIndex(product.id);

            if (index > -1) {
                const line = this.lines.splice(index, 1);
                this.lines.splice(0, 0, ...line);
                return;
            }

            this.fetchOrAdd(product);
        },
        fetchOrAdd(product) {
            if(this.lines.length === this.order.lineCount) {
                this.add(product);
                return;
            }

            this.order.processing = true;
            this.order.page = 1;

            axios.get(this.route(
                `commercial.${this.order.form.param('type')}s.lines.index`,
                this.$route.params,
                ), { params: { page: this.order.page, search: product.partNumber } })
                .then(({ data }) => {
                    if(data.data.length === 0) {
                        this.add(product);
                        return;
                    }

                    this.updateOrder(data.order);
                    this.lines.splice(0, 0, ...data.data);
                    this.order.processing = false;
                }).catch(this.errorHandler);
        },
        add(product) {
            this.order.processing = true;

            const call = () => axios.post(
                this.route(
                    `commercial.${this.order.form.param('type')}s.lines.store`,
                    { ...this.$route.params, product: product.id },
                ), { version: this.version() },
            ).then(({ data }) => {
                const { line, order } = data;
                this.updateOrder(order);
                this.lines.splice(0, 0, line);
                this.order.lineCount++;
                this.order.processing = false;
            }).catch((error) => {
                this.order.processing = false;
                this.errorHandler(error);
            });

            this.chainRequest(call);
        },
        chainRequest(call) {
            if (!this.order.promise) {
                this.order.promise = call();
                return;
            }

            this.order.promise = this.order.promise.then(call);
        },
        productIndex(productId) {
            return this.lines.findIndex(({ product }) => product.id === productId);
        },
    },

    provide() {
        return {
            chainRequest: this.chainRequest,
        };
    },
};
</script>

<style lang="scss">
    .order-table {
        overflow-x: auto;

        th {
            vertical-align: middle;
        }

        .line {
            transition: all 0.5s;
        }

        .lines-move {
            transition: transform 0.333s;
        }

        .lines-enter, .lines-leave-to {
            opacity: 0;
        }
    }
</style>
