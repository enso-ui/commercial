export default {
    methods: {
        removeFromStock() {
            this.$refs.order
                .$refs.lines
                .$refs.line
                .filter(comp => !comp.line.removedFromStock)
                .forEach(comp => comp.removeFromStock());
        },
        undoStockRemoval() {
            this.$refs.order
                .$refs.lines
                .$refs.line
                .filter(comp => comp.line.removedFromStock && comp.line.positionId)
                .forEach(comp => comp.insertInStock());
        },
        noneRemovedFromStock() {
            return !this.someRemovedFromStock();
        },
        someRemovedFromStock() {
            return this.hasLines
                && this.lines.some(({ removedFromStock }) => removedFromStock);
        },
        someInStock() {
            return this.someRemovedFromStock()
                && !this.allRemovedFromStock();
        },
        allRemovedFromStock() {
            return this.hasLines
                && this.lines.every(({ removedFromStock }) => removedFromStock);
        },
        insertable() {
            return !this.form.field('is_finalized').value
                && this.hasLines
                && this.lines.some(line => line.removedFromStock && line.positionId);
        },
        removable() {
            return this.hasLines
                && this.lines.some(line => !line.removedFromStock && line.fullyReserved);
        },
        fullyReserved() {
            return this.hasLines
                && this.lines.every(({ fullyReserved }) => fullyReserved);
        },
    },
};
