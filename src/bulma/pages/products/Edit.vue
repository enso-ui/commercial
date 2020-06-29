<template>
    <div class="columns is-centered">
        <div class="column is-three-quarters-desktop is-full-touch">
            <enso-form class="box has-background-light raises-on-hover"
                ref="form"/>
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
                                    compact
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
import { EnsoForm } from '@enso-ui/forms/bulma';
import PositionsManager from '../../components/inventory/PositionsManager.vue';

export default {
    name: 'Edit',

    components: {
        EnsoForm, PositionsManager, Accessories, Documents, Comments, Tab,
    },

    computed: {
        id() {
            return Number.parseInt(this.$route.params.product, 10);
        },
    },
};
</script>
