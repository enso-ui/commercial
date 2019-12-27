<template>
    <div class="wrapper">
        <div class="quick-view-control is-pulled-right">
            <slot name="actions"/>
            <a class="button"
               @click="quickView = true">
                <span class="icon is-large">
                    <fa icon="ellipsis-h"/>
                </span>
            </a>
        </div>
        <enso-form disable-state
            @ready="
                order.form = $event.form;
                order.lineCount = order.form.param('lineCount');
            "
            @error="order.form.fetch()"
            @submit="form.field('version').value = $event.version"
            ref="order">
            <template v-slot:general="{ sectionBindings }"
                v-if="order.form">
                <form-content/>
            </template>
        </enso-form>
        <quick-view
            @close="quickView = false"
            v-if="quickView">
            <p class="title is-5">{{i18n('Accessories')}}</p>
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
import {
    QuickView, Accessories, Comments, Documents,
} from '@enso-ui/accessories/bulma';
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

    inject: ['errorHandler', 'i18n', 'route', 'order'],

    data: () => ({
        quickView: false,
    }),

    computed: {
        ...mapState(['enums']),
        form() {
            return this.order.form;
        },
        type() {
            return this.form && this.form.param('type');
        },
        id() {
            return this.form && this.$route.params[this.type];
        },
        lines() {
            return this.order.lines;
        },
    },

    methods: {
        destroy() {
            this.order.deleteModal = false;
            this.order.processing = true;

            axios.delete(this.route(
                `commercial.${this.type}s.destroy`,
                this.$route.params,
            )).then(({ data }) => {
                this.order.processing = false;
                this.$toastr.success(data.message);
                this.$router.push({ name: data.redirect });
            }).catch((error) => {
                this.order.processing = false;
                this.errorHandler(error);
            });
        },
        updateOrder(order) {
            Object.keys(order)
                .forEach(attribute => (this.form
                    .field(attribute).value = order[attribute]));
        },
        email() {
            this.order.processing = true;

            axios.post(
                this.route(
                    `commercial.${this.type}s.email`,
                    this.$route.params,
                ), { version: this.version() },
            ).then(({ data }) => {
                this.order.processing = false;
                const { emailed_at, emailer, version } = data;
                this.form.field('emailed_at').value = emailed_at;
                this.form.field('emailer').value = emailer;
                this.form.field('version').value = version;
            }).catch((error) => {
                this.order.processing = false;
                this.errorHandler(error);
            });
        },
        toggleFulfilling() {
            const field = this.form.field(this.form.param('fulfillingAttribute'));

            field.value = field.value
                ? null
                : format(new Date(), 'Y-m-d H:i:s');

            this.form.submit();
        },
        toggleLock() {
            this.form.field('is_finalized').value = !this.finalized();
            this.form.submit();
            this.form.field('date').meta.readonly = this.finalized();
        },
        hasLines() {
            return this.lines.length > 0;
        },
        fulfilling() {
            return this.form
             && this.form.field(this.form.param('fulfillingAttribute')).value !== null;
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
        linesProcessing() {
            return this.hasLines()
                && this.lines.some(({ processing }) => processing);
        },
        processing() {
            return this.$refs.order.state.loading
                || this.order.processing
                || this.linesProcessing();
        },
        finalized() {
            return this.form
                && this.form.field('is_finalized').value;
        },
        version() {
            return this.form && this.form.field('version').value;
        },

        allRecent() {
            return true;
        },

        emailedAt() {
            return this.form.field('emailed_at').value;
        },
        emailer() {
            return this.form.field('emailer').value;
        },
    },

    provide() {
        return {
            updateOrder: this.updateOrder,
            email: this.email,
            toggleFulfilling: this.toggleFulfilling,
            toggleLock: this.toggleLock,
            lines: this.lines,
            hasLines: this.hasLines,
            fulfilling: this.fulfilling,
            noneOrdered: this.noneOrdered,
            someOrdered: this.someOrdered,
            allOrdered: this.allOrdered,
            hasIns: this.hasIns,
            hasOuts: this.hasOuts,
            processing: this.processing,
            finalized: this.finalized,
            version: this.version,
            allRecent: this.allRecent,
            loadMore: this.loadMore,
            emailedAt: this.emailedAt,
            emailer: this.emailer,
        };
    },
};

</script>


<style lang="scss">
    .wrapper {
        position: relative;

        .quick-view-control {
            z-index: 3;
            position: absolute;
            top: .3em;
            right: .3em;
        }
    }

</style>
