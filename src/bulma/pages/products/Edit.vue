<template>
    <div class="columns is-centered">
        <div class="column is-three-quarters-desktop is-full-touch">
            <base-form/>
            <accessories>
                <template slot-scope="{ count }">
                    <tab keep-alive
                        id="Stock">
                        <positions-manager :product-id="id"
                            @update="$set(count, 'Stock', $event)"/>
                    </tab>
                    <tab keep-alive
                        id="Comments">
                        <div class="columns is-centered">
                            <div class="column is-two-thirds">
                                <comments :id="id"
                                    type="product"
                                    @update="$set(count, 'Comments', $refs.comments.count)"
                                    ref="comments"/>
                            </div>
                        </div>
                    </tab>
                    <tab keep-alive
                        id="Documents">
                        <div class="columns is-centered">
                            <div class="column is-two-thirds">
                                <documents :id="id"
                                    type="product"
                                    @update="$set(count, 'Documents', $refs.documents.count)"
                                    ref="documents"/>
                            </div>
                        </div>
                    </tab>
                </template>
            </accessories>
        </div>
    </div>
</template>

<script>
import { Accessories, Documents, Comments } from '@enso-ui/bulma';
import { Tab } from '@enso-ui/tabs/bulma';
import BaseForm from './components/BaseForm.vue';
import PositionsManager from '@enso-ui/commercial/src/bulma/components/inventory/PositionsManager.vue';

export default {
    name: 'Edit',

    components: {
        Accessories, BaseForm, Comments, Documents, PositionsManager, Tab,
    },

    computed: {
        id() {
            return this.$route.params.product;
        },
    },
};
</script>
