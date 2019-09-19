<template>
    <div class="field">
        <p class="control has-icons-left has-icons-right is-expanded">
            <input class="input"
                v-model="order.query"
                v-select-on-focus
                :placeholder="i18n('Filter by name or code')"
                @keydown.esc="order.query='';$emit('change')"
                @input="$emit('change')">
            <span class="icon is-small is-left">
                <fa icon="search"/>
            </span>
            <span v-if="order.query"
                class="icon is-small is-right clear-button"
                @click="order.query = ''">
                <a class="delete is-small"/>
            </span>
        </p>
    </div>
</template>

<script>
import { selectOnFocus } from '@enso-ui/directives';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

library.add(faSearch);

export default {
    name: 'Search',

    directives: { selectOnFocus },

    inject: ['i18n', 'order'],
};
</script>
