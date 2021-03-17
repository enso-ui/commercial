<template>
    <div class="wrapper">
        <div class="controls is-pulled-right">
            <div class="level">
                <div class="level-left"></div>
                <div class="level-right">
                    <div class="level-item">
                        <slot name="controls"/>
                    </div>
                    <div class="level-item">
                        <span class="tag channel is-warning is-medium is-bold"
                            v-if="form">
                            {{ status }}
                        </span>
                    </div>
                    <div class="level-item">
                        <a class="button"
                        @click="quickView = true">
                            <span class="icon is-large">
                                <fa icon="ellipsis-h"/>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <enso-form disable-state
            @ready="order.form = $event.form;
                order.lineCount = order.form.param('lineCount')"
            @error="form.fetch()"
            @submit="form.field('version').value = $event.version"
            ref="order">
            <template v-slot:general
                v-if="form">
                <form-content/>
            </template>
        </enso-form>
        <quick-view @close="quickView = false"
            v-if="quickView">
            <p class="title is-5">
                {{ i18n('Accessories') }}
            </p>
            <accessories class="has-margin-top-medium">
                <template slot-scope="{ count }">
                    <tab keep-alive
                        id="Comments">
                        <comments :id="id"
                            :type="type"
                            @update="$set(count, 'Comments', $refs.comments.count)"
                            ref="comments"/>
                    </tab>
                    <tab keep-alive
                        id="Documents">
                        <documents :id="id"
                            :type="type"
                            compact
                            @update="$set(count, 'Documents', $refs.documents.count)"
                            ref="documents"/>
                    </tab>
                </template>
            </accessories>
        </quick-view>
        <lines v-if="order.partner"
            ref="lines"/>
        <delete-modal @confirm="destroy"
            @close="order.deleteModal = false"
            v-if="order.deleteModal"/>
        <slot/>
    </div>
</template>

<script>

import { mapState } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { Accessories, Comments, Documents } from '@enso-ui/bulma';
import QuickView from '@enso-ui/quick-view/bulma';
import { Tab } from '@enso-ui/tabs/bulma';
import { EnsoForm } from '@enso-ui/forms/bulma';
import format from '@enso-ui/ui/src/modules/plugins/date-fns/format';
import FormContent from './FormContent.vue';
import Lines from './Lines.vue';
import DeleteModal from './DeleteModal.vue';

library.add(faEllipsisH);

export default {
    name: 'Order',

    components: {
        EnsoForm,
        FormContent,
        Lines,
        DeleteModal,
        QuickView,
        Accessories,
        Tab,
        Comments,
        Documents,
    },

    inject: ['errorHandler', 'i18n', 'route', 'order', 'toastr'],

    data: () => ({
        quickView: false,
    }),

    computed: {
        ...mapState(['enums', 'preferences']),
        form() {
            return this.order.form;
        },
        id() {
            return this.form && this.$route.params[this.type];
        },
        lines() {
            return this.order.lines;
        },
        status() {
            return this.form && this.form.field('status').value;
        },
        type() {
            return this.form && this.form.param('type');
        },
    },

    methods: {
        destroy() {
            this.order.deleteModal = false;
            this.order.processing = true;

            axios.delete(this.path('destroy'))
                .then(({ data }) => {
                    this.toastr.success(data.message);
                    this.$router.push({ name: data.redirect });
                }).catch(this.errorHandler)
                .finally(() => (this.order.processing = false));
        },
        email() {
            this.order.processing = true;

            axios.post(this.path('email'), { version: this.version() })
                .then(({ data }) => {
                    const { emailed_at, emailer, version } = data;
                    this.form.field('emailed_at').value = emailed_at;
                    this.form.field('emailer').value = emailer;
                    this.form.field('version').value = version;
                }).catch(this.errorHandler)
                .finally(() => (this.order.processing = false));
        },
        path(action) {
            return this.route(
                `commercial.${this.type}s.${action}`,
                this.$route.params,
            );
        },
        updateFlow(action) {
            const timestamp = this.enums.flowTimestamps._get(action);
            this.order.processing = true;

            return axios.patch(this.path(action), { version: this.version() })
                .then(({ data }) => {
                    const { [timestamp]: date, version, status } = data;

                    this.form.field(timestamp).value = date;
                    this.form.field('version').value = version;
                    this.form.field('status').value = status;
                }).catch(this.errorHandler)
                .finally(() => (this.order.processing = false));
        },
        //TODO remove after refactor - flow
        toggleLock() {
            this.form.field('is_finalized').value = !this.finalized();
            this.form.submit();
            this.form.field('date').meta.readonly = this.finalized();
        },
        hasLines() {
            return this.lines.length > 0;
        },
        noneOrdered() {
            return this.hasLines()
                && this.lines.every(({ quantity }) => !quantity);
        },
        someOrdered() {
            return this.hasLines()
                && this.lines.some(({ quantity }) => quantity);
        },
        allOrdered() {
            return this.hasLines()
                && this.lines.every(({ quantity }) => quantity !== 0);
        },
        hasIns() {
            return [this.enums.orders.Purchase, this.enums.orders.SaleReturn]
                .includes(this.type);
        },
        hasOuts() {
            return [this.enums.orders.Sale, this.enums.orders.PurchaseReturn]
                .includes(this.type);
        },
        processing() {
            return this.$refs.order.state.loading
                || this.order.processing
                || this.lines.some(({ processing }) => processing);
        },
        version() {
            return this.form && this.form.field('version').value;
        },
        //TODO remove after encapsulation
        emailedAt() {
            return this.form.field('emailed_at').value;
        },
        //TODO remove after encapsulation
        emailer() {
            return this.form.field('emailer').value;
        },
        //TODO remove after encapsulation
        formatDateTime(stringDate) {
            const date = new Date(stringDate);
            return date.toLocaleString(this.preferences.global.lang);
        },
    },

    provide() {
        return {
            reloadOrder: this.reloadOrder,
            email: this.email,
            updateFlow: this.updateFlow,
            toggleLock: this.toggleLock,
            lines: this.lines,
            noneOrdered: this.noneOrdered,
            someOrdered: this.someOrdered,
            allOrdered: this.allOrdered,
            hasIns: this.hasIns,
            hasOuts: this.hasOuts,
            processing: this.processing,
            version: this.version,
            loadMore: this.loadMore,
            emailedAt: this.emailedAt,
            emailer: this.emailer,
            formatDateTime: this.formatDateTime,
            //Bleah
            updateFulfilment: () => null,
        };
    },
};

</script>

<style lang="scss">
    .wrapper {
        position: relative;

        .controls {
            z-index: 3;
            position: absolute;
            top: .3em;
            right: .3em;

            .channel {
                margin: 1px;
            }
        }
    }

</style>
