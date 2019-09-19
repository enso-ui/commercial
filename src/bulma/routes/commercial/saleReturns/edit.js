const SaleReturnEdit = () => import('../../../pages/saleReturns/Edit.vue');

export default {
    name: 'commercial.saleReturns.edit',
    path: ':saleReturn/edit',
    component: SaleReturnEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Sale Return',
    },
};
