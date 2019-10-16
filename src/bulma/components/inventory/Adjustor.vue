<template>
    <div class="columns">
        <div class="column is-narrow">
            <label class="label has-margin-top-medium has-margin-left-medium">
                {{ i18n('Difference') }}
            </label>
        </div>
        <div class="column is-one-fifth">
            <input class="input has-text-right"
                v-model.number="quantity"
                v-select-on-focus
                @keyup.enter="adjust"
                @input="errors.clear('quantity')">
            <p class="help is-danger has-text-centered"
               v-if="errors.has('quantity')">
                {{ errors.get('quantity') }}
            </p>
        </div>
        <div class="column has-text-centered is-narrow">
            <div class="has-margin-top-small">
                <button class="button is-small is-success"
                    :class="{'is-loading' : loading}"
                    @click="adjust"
                    v-if="quantity && !errors.has('quantity')">
                    <span class="icon is-small">
                        <fa icon="check"/>
                    </span>
                </button>
                <button class="button is-small is-warning"
                    :class="{'is-loading' : loading}"
                    v-if="quantity"
                    @click="quantity = null; errors.clear('quantity')">
                    <span class="icon is-small">
                        <fa icon="ban"/>
                    </span>
                </button>
            </div>
        </div>
        <div class="column has-text-right">
            <button class="button is-small is-info has-margin-top-small"
                :class="{'is-loading' : loading}"
                @click="updateAdjustmentOrders"
                v-if="
                    canAccess('inventory.updateAdjustmentOrders')
                    && (quantity === null || quantity === '')
                ">
                <span>{{ i18n('Update Adjustments') }}</span>
                <span class="icon is-small">
                    <fa icon="sync"/>
                </span>
            </button>
        </div>
    </div>
</template>

<script>

import { library } from '@fortawesome/fontawesome-svg-core/index.js';
import { faSync, faBan, faCheck } from '@fortawesome/free-solid-svg-icons/index.js';
import { selectOnFocus } from '@enso-ui/directives';
import Errors from '@enso-ui/forms/src/classes/Errors';

library.add(faSync, faBan, faCheck);

export default {
    name: 'Adjustor',

    directives: { selectOnFocus },

    inject: ['errorHandler', 'i18n', 'route', 'canAccess'],

    props: {
        productId: {
            type: Number,
            required: true,
        },
    },

    data: () => ({
        quantity: null,
        loading: false,
        errors: new Errors(),
    }),

    methods: {
        adjust() {
            this.loading = true;
            axios.post(
                this.route('inventory.adjust', { product: this.productId }),
                { quantity: this.quantity },
            )
                .then(() => {
                    this.loading = false;
                    this.quantity = null;
                    this.$emit('adjusted');
                })
                .catch((error) => {
                    const { status, data } = error.response;

                    if (status === 422) {
                        this.errors.set(data.errors);
                        return;
                    }

                    this.errorHandler(error);
                });
        },
        updateAdjustmentOrders() {
            this.loading = true;
            axios.post(this.route('inventory.updateAdjustmentOrders'))
                .then(({data}) => {
                    this.loading = false;
                    this.$toastr.info(data.message);
                })
                .catch(this.errorHandler);
        },
    },
};
</script>
