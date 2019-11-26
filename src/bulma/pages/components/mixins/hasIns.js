export default {
    methods: {
        insertInStock() {
            this.$refs.order
                .$refs.lines
                .$refs.line
                .filter(comp => comp.line.product)
                .filter(comp => !comp.line.inStock && comp.line.positionId)
                .forEach(comp => comp.insertInStock());
        },
        undoStockInsertion() {
            this.$refs.order
                .$refs.lines
                .$refs.line
                .filter(comp => comp.line.product)
                .filter(comp => comp.line.inStock)
                .forEach(comp => comp.removeFromStock());
        },
        noneInStock() {
            return this.hasLines && !this.someInStock();
        },
        someInStock() {
            return this.hasLines
                && this.lines
                    .filter(line => line.product)
                    .some(({ inStock }) => inStock);
        },
        allInStock() {
            return this.hasLines
                && this.lines
                    .filter(line => line.product)
                    .every(({ inStock }) => inStock);
        },
        insertable() {
            return this.hasLines
                && this.lines
                    .filter(line => line.product)
                    .some(line => !line.inStock && line.positionId);
        },
    },
};
