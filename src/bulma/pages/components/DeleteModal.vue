<template>
    <modal show
        v-on="$listeners">
        <div class="box">
            <h5 class="subtitle is-5">
                {{ i18n("Do you want to delete this order?") }}
            </h5>
            <hr>
            <div class="level">
                <div class="level-left">
                    <div class="level-item">
                        <button class="button is-outlined"
                            @click="$emit('close')">
                            {{ i18n('Cancel') }}
                        </button>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                        <button class="button is-danger has-margin-left-small"
                            @click="$emit('confirm')">
                            {{ i18n('Yes') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import { Modal } from '@enso-ui/bulma';

export default {
    components: { Modal },

    inject: ['i18n'],
};
</script>
