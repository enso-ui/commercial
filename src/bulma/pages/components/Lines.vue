<template>
    <div class="wrapper">
        <div class="columns">
            <div class="column">
                <items @selected="showOrAdd"/>
            </div>
            <slot name="mappings"/>
            <div class="column">
                <search @change="order.page = 1; fetch()"/>
            </div>
        </div>
        <div class="table-responsive order-table"
            v-if="order.partner && order.lines.length">
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
                        @update-order="updateOrder"
                        v-on="$listeners"
                        ref="line"/>
                    <tr key="more"
                        v-if="lines.length < order.lineCount">
                        <td colspan="100%">
                            <div class="has-text-centered has-padding-medium">
                                <a @click="order.page++; fetch()">
                                    {{ i18n ('load more') }}...
                                    ({{ lines.length }} / {{ order.lineCount }})
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
import { mapState } from 'vuex';
import { debounce } from 'lodash';
import Items from './Items.vue';
import Search from './Search.vue';
import HeaderLine from './HeaderLine.vue';
import RowLine from './RowLine.vue';
import FooterLine from './FooterLine.vue';

export default {
    name: 'Lines',

    inject: [
        'errorHandler', 'i18n', 'route', 'order', 'version', 'loadMore', 'toastr',
    ],

    components: {
        Items, Search, HeaderLine, RowLine, FooterLine,
    },

    computed: {
        ...mapState(['enums']),
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
                .then(({ data: { order, data } }) => {
                    this.updateOrder(order);
                    this.lines.push(...data);
                }).catch(this.errorHandler)
                .finally(() => (this.order.processing = false));
        },
        showOrAdd(item) {
            if (!item) {
                return;
            }

            this.order.query = '';
            const index = this.itemIndex(item);

            if (index > -1) {
                const line = this.lines.splice(index, 1);
                this.lines.splice(0, 0, ...line);
            } else {
                this.fetchOrAdd(item);
            }

        },
        fetchOrAdd(item) {
            if (this.lines.length === this.order.lineCount) {
                this.add(item);
                return;
            }

            this.order.processing = true;
            this.order.page = 1;

            axios.get(this.route(
                `commercial.${this.order.form.param('type')}s.lines.index`,
                this.$route.params,
            ), { params: { page: this.order.page, search: item.partNumber || item.code } })
                .then(({ data }) => {
                    if (data.data.length === 0) {
                        this.add(item);
                    } else {
                        this.updateOrder(data.order);
                        this.lines.splice(0, 0, ...data.data);
                    }
                }).catch(this.errorHandler)
                .finally(() => (this.order.processing = false));;
        },
        add(item) {
            this.order.processing = true;

            const call = () => axios.post(
                this.route(this.postRoute(item), this.postParams(item)),
                { version: this.version() },
            ).then(({ data }) => {
                const { line, order } = data;
                this.updateOrder(order);
                this.lines.splice(0, 0, line);
                this.order.lineCount++;
            }).catch(error => {
                const { status, data } = error.response;

                if (status === 409) {
                    this.toastr.warning(data.message);
                    this.fetch();
                } else {
                    this.errorHandler(error);
                }
            }).finally(() => (this.order.processing = false));;

            this.chainRequest(call);
        },
        postRoute(item) {
            const type = this.order.form.param('type');

            return [this.enums.orders.Purchase, this.enums.orders.Sale].includes(type)
                ? `commercial.${type}s.lines.store${item.type}`
                : `commercial.${type}s.lines.store`;
        },
        postParams(item) {
            return { ...this.$route.params, product: item.id, service: item.id };
        },
        chainRequest(call) {
            if (this.order.promise) {
                this.order.promise = this.order.promise.then(call);
            } else {
                this.order.promise = call();
            }

        },
        itemIndex(item) {
            return item.type === this.enums.lineItems.Product
                ? this.lines.findIndex(({ product }) => product && product.id === item.id)
                : this.lines.findIndex(({ service }) => service && service.id === item.id);
        },
        updateOrder(order) {
            Object.keys(order)
                .forEach(attribute => (this.order.form
                    .field(attribute).value = order[attribute]));
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
