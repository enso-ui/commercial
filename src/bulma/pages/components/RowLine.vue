<template>
    <tr class="order-line">
        <td class="is-numeric">
            {{ index + 1 }}.
        </td>
        <td>
            {{ name }}
        </td>
        <td class="is-numeric">
            {{ code }}
        </td>
        <td class="is-numeric quantity">
            {{ stock }}
        </td>
        <td class="is-numeric quantity">
            <span class="reserved"
                v-if="isProduct">
                <template v-if="[enums.orders.Sale, enums.orders.PurchaseReturn].includes(type)">
                    <span :class="['tag', line.fullyReserved ? 'is-success': 'is-warning']">
                        {{ line.reserved }}
                    </span>
                    :
                </template>
                <order-reservations classes="is-clickable"
                    :product="line.product"/>
            </span>
        </td>
        <td class="has-text-right">
            <input class="input is-numeric quantity"
                :class="{'is-danger': errors.has('quantity')}"
                v-model.number="line.quantity"
                v-select-on-focus
                :readonly="fulfilling() || line.processing"
                :placeholder="i18n('qty')"
                @input="errors.clear('quantity'); update()">
            <p class="help is-danger has-text-centered"
                v-if="errors.has('quantity')">
                {{ errors.get('quantity') }}
            </p>
        </td>
        <td class="is-numeric"
            v-if="!order.warehouse">
            {{ line.listPrice | numberFormat(2) }}
        </td>
        <td v-if="!order.warehouse">
            <p class="control has-icons-right has-text-right">
                <input class="input is-numeric discount"
                    :class="{'is-danger': errors.has('discountPercent')}"
                    v-model.number="line.discountPercent"
                    v-select-on-focus
                    :readonly="fulfilling() || line.processing"
                    @input="errors.clear('discountPercent'); update()">
                <span class="icon is-small is-right">
                    <fa icon="percentage"
                        size="xs"/>
                </span>
            </p>
            <p class="help is-danger has-text-centered"
                v-if="errors.has('discountPercent')">
                {{ errors.get('discountPercent') }}
            </p>
        </td>
        <td class="is-numeric"
            v-if="!order.warehouse">
            {{ line.unitaryPrice | numberFormat(2) }}
        </td>
        <td class="is-numeric price"
            v-if="!order.warehouse">
            {{ line.amount | numberFormat(2) }}
        </td>
        <td class="is-numeric price"
            v-if="!order.warehouse">
            {{ line.vat | numberFormat(2) }}
        </td>
        <td class="has-text-right is-numeric price"
            v-if="!order.warehouse">
            {{ line.total | numberFormat(2) }}
        </td>
        <td class="has-text-centered"
            v-if="order.warehouse">
            <div v-if="isProduct">
                <div class="select"
                    v-if="positionSelector">
                    <select :disabled="line.inStock || line.processing"
                        v-model="line.positionId">
                        <option class="option"
                            v-for="position in line.positions"
                            :key="position.id"
                            :selected="line.positionId === position.id"
                            :value="position.id">
                            {{ position.quantityLabel || position.label }}
                        </option>
                        <option v-if="line.positions.length === 0"
                            :value="null">
                            {{ i18n('No position') }}
                        </option>
                    </select>
                </div>
                <div v-else>
                    <span class="tag is-info is-bold"
                        v-for="position in positionsQuantity"
                        :key="position">
                            {{ position }}
                    </span>
                </div>
            </div>
        </td>
        <td class="has-text-centered"
            v-if="order.warehouse">
            <input class="input position"
                :class="{'is-danger': errors.has('position') || position && !validPosition}"
                v-select-on-focus
                v-model="position"
                :readonly="line.processing"
                :placeholder="i18n('Add new position')"
                @input="errors.clear('position')"
                @keypress.enter="addPosition"
                @keydown.esc="position = null; errors.clear('position')"
                v-if="isProduct && notInStock">
            <p class="help is-danger has-text-centered"
               v-if="errors.has('position')">
                {{ errors.get('position') }}
            </p>
        </td>
        <td class="has-text-centered">
            <a class="button is-naked"
               :class="{'is-loading' : line.processing}"
               v-if="!fulfilling() || line.quantity === 0"
               @click="destroy">
                <span class="icon is-small">
                    <fa icon="trash-alt"
                        size="xs"/>
                </span>
            </a>
            <a class="button is-naked"
                :class="{'is-loading' : line.processing}"
               v-if="isProduct && !finalized() && order.warehouse && notInStock"
               v-show="line.positionId"
               @click="insertInStock">
                <span class="icon is-small"
                    :class="{ 'has-text-danger': hasOuts() }">
                    <fa icon="download"
                        size="xs"/>
                </span>
            </a>
            <a class="button is-naked"
               :class="{'is-loading' : line.processing}"
               v-if="isProduct && !finalized() && order.warehouse && !notInStock"
               @click="removeFromStock">
                <span class="icon is-small"
                    :class="{ 'has-text-danger': hasIns() }">
                    <fa icon="upload"
                        size="xs"/>
                </span>
            </a>
        </td>
    </tr>
</template>

<script>
import { mapState } from 'vuex';
import debounce from 'lodash/debounce';
import { selectOnFocus } from '@enso-ui/directives';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faTrashAlt, faPercentage, faUpload, faDownload, faEnvelope, faHandPaper,
} from '@fortawesome/free-solid-svg-icons';
import Errors from '@enso-ui/forms/src/classes/Errors';
import OrderReservations from './OrderReservations.vue';


library.add(faTrashAlt, faPercentage, faUpload, faDownload, faEnvelope, faHandPaper);

export default {
    name: 'RowLine',

    inject: [
        'i18n', 'route', 'order', 'fulfilling', 'finalized', 'processing',
        'hasIns', 'hasOuts', 'errorHandler', 'updateOrder', 'version',
        'chainRequest',
    ],

    directives: { selectOnFocus },

    components: { OrderReservations },

    props: {
        line: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
    },

    data: () => ({
        errors: new Errors(),
        position: '',
    }),

    computed: {
        ...mapState(['enums']),
        isProduct() {
            return this.line.product !== null;
        },
        name() {
            return this.isProduct
                ? this.line.product.name
                : this.line.service.name
        },
        code() {
            return this.isProduct
                ? this.line.product.partNumber
                : this.line.service.partNumber
        },
        stock() {
            return this.isProduct
                ? this.line.product.stockQuantity
                : ''
        },
        lines() {
            return this.order.lines;
        },
        type() {
            return this.order.form.param('type');
        },
        validPosition() {
            return this.position.split('-').length === 4
                && !this.line.positions
                    .some(({ label }) => label.split(':').shift()
                        .toLowerCase() === this.position.toLowerCase());
        },
        positionsQuantity() {
            return this.line.positionsQuantity
                .map(item => `${item.position}: ${item.quantity}`);
        },
        positionSelector() {
            return this.hasIns()
                || this.hasOuts() && this.line.removedFromStock;
        },
        notInStock() {
            return this.hasIns() && !this.line.inStock
                || this.hasOuts() && this.line.removedFromStock;
        },
    },

    created() {
        this.update = debounce(this.update, 350);
        this.destroy = debounce(this.destroy, 350);
        this.insertInStock = debounce(this.insertInStock, 350);
        this.removeFromStock = debounce(this.removeFromStock, 350);
    },

    methods: {
        update() {
            this.line.processing = true;

            const call = () => axios.patch(this.route(
                `commercial.${this.type}s.lines.destroy`,
                { line: this.line.id },
            ), { ...this.line, version: this.version() })
                .then(({ data }) => {
                    const { line, order } = data;
                    this.replace(line);
                    this.updateOrder(order);
                }).catch(error => this.rowError(error, this.reload));

            this.chainRequest(call);
        },
        destroy() {
            this.line.processing = true;

            const call = () => axios.delete(
                this.route(
                    `commercial.${this.type}s.lines.destroy`,
                    { line: this.line.id },
                ), { params: { version: this.version() } },
            ).then(({ data }) => {
                this.lines.splice(this.index, 1);
                this.updateOrder(data.order);
                this.order.lineCount--;
            }).catch(error => this.rowError(error, this.reload));

            this.chainRequest(call);
        },
        reload() {
            this.line.processing = true;

            axios.get(this.route(
                `commercial.${this.type}s.lines.show`,
                { line: this.line.id },
            )).then(({ data }) => {
                this.replace(data);
                this.order.promise = null;
            }).catch(this.errorHandler);
        },
        insertInStock() {
            this.line.processing = true;

            axios.post(
                this.route(
                    `commercial.${this.type}s.lines.insertInStock`,
                    { line: this.line.id },
                ), { ...this.line, version: this.version },
            ).then(({ data }) => this.replace(data.line))
                .catch(this.rowError);
        },
        removeFromStock() {
            this.line.procesing = true;

            axios.post(
                this.route(
                    `commercial.${this.type}s.lines.removeFromStock`,
                    { line: this.line.id },
                ), { ...this.line, version: this.version },
            ).then(({ data }) => this.replace(data.line))
                .catch(this.rowError);
        },
        addPosition() {
            if (!this.validPosition) {
                return;
            }

            this.line.processing = true;

            axios.get(this.route('inventory.positions.show'), this.positionRequest())
                .then(({ data }) => {
                    this.line.positions.push(data);
                    this.line.processing = false;
                    this.line.positionId = data.id;
                    this.position = null;
                }).catch(error => this.rowError(error, () => (this.position = null)));
        },
        positionRequest() {
            const [warehouse, row, shelf, position] = this.position.split('-');

            return {
                params: {
                    warehouse, row, shelf, position,
                },
            };
        },
        replace(line) {
            this.lines.splice(this.index, 1, line);
        },
        rowError(error, callback = null) {
            this.line.processing = false;

            const { status, data } = error.response;

            if (status === 422) {
                this.errors.set(data.errors);
                return;
            }

            if (status === 409) {
                this.$toastr.warning(data.message);
                this.order.form.fetch();
                this.$emit('version-error');
                return;
            }

            if (callback) {
                callback();
            }

            this.errorHandler(error);
        },
    },
};
</script>

<style lang="scss">
    tr.order-line {
        td.is-numeric, .is-numeric {
            font-family: monospace;
            font-size: 1.2em;
            text-align: right;
        }

        .position-selector, .new-position {
            width: 10.2em;

            .option {
                padding: 0.8em;
            }
        }

        .reserved {
            justify-content: center;
            align-items: center;
            display: flex;
        }

        td {
            vertical-align: middle;

            &.price {
                width: 7em;
            }

            &.discount {
                width: 5em;
            }

            &.quantity {
                width: 4.8em;
            }

            .position {
                min-width: 10.2em;
            }

            .input {
                width: 4.8em;
            }

            .tag {
                padding: 0 5px;
                font-size: 0.9em;
                height: unset;
            }
        }
    }
</style>
