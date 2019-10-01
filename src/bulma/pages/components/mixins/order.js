export default {
    data: () => ({
        order: {
            form: null,
            lines: [],
            promise: null,
            query: '',
            partner: null,
            warehouse: false,
            processing: false,
            deleteModal: false,
            page: 1,
        },
    }),

    computed: {
        enums() {
            return this.$store.state.enums;
        },
        form() {
            return this.order.form;
        },
        type() {
            return this.form && this.form.param('type');
        },
        lines() {
            return this.order.lines;
        },
        hasLines() {
            return this.lines.length > 0;
        },
        version() {
            return this.form && this.form.field('version').value;
        },
    },
};
