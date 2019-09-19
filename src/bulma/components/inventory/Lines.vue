<template>
    <div class="has-padding-large">
        <adjustor :product-id="productId"
            @adjusted="fetch"
            v-if="adjustMode"/>
        <div class="table-responsive"
             v-if="lines.length">
            <table class="table is-striped table-hover is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th class="has-text-centered">
                            #
                        </th>
                        <th class="has-text-centered">
                            {{ i18n('Position') }}
                        </th>
                        <th class="has-text-centered">
                            {{ i18n('Quantity') }}
                        </th>
                        <th class="has-text-centered">
                            {{ i18n('Action') }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr :is="component(line)"
                        :key="`${line.id}-${index}`"
                        :index="index"
                        :line="line"
                        :product-id="productId"
                        :is-editing="isEditing"
                        @edit="move(line, index)"
                        @moved="updateFrom"
                        @remove="remove"
                        @cancel="cancelEdit(index)"
                        v-for="(line, index) in lines"/>
                </tbody>
            </table>
        </div>
        <div class="has-text-centered"
             v-else>
            {{ i18n('Nothing to display') }}
        </div>
    </div>
</template>

<script>
import Lines from '@enso-ui/inventory/src/bulma/components/Lines.vue';
import AdjustLine from './AdjustLine.vue';
import Adjustor from './Adjustor.vue';

export default {
    components: {
        AdjustLine, Adjustor,
    },

    extends: Lines,

    props: {
        adjustMode: {
            type: Boolean,
            required: true,
        },
    },

    data: () => ({
    }),

    methods: {
        adjust() {
            this.isEditing = true;
            const line = this.adjustmentFactory();
            line.adjustMode = false;
            this.lines.splice(0, 0, line);
        },
        adjustmentFactory() {
            return {
                quantity: null,
                id: null,
                label: '',
                toId: null,
                adjustMode: true,
                moveMode: false,
            };
        },
        movementFactory(line) {
            const { quantity, id } = line;

            return {
                quantity,
                fromId: id,
                id: null,
                label: '',
                adjustMode: false,
                moveMode: true,
            };
        },
        component(line) {
            if (!this.adjustMode) {
                return line.moveMode ? 'mover' : 'move-line';
            }

            return line.adjustMode ? 'adjustor' : 'adjust-line';
        },

    },
};
</script>

<style lang="scss">
    .right {
        text-align:right;
    }
</style>
