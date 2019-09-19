const SaleEdit = () => import('../../../pages/sales/Edit.vue');

export default {
    name: 'commercial.sales.edit',
    path: ':sale/edit',
    component: SaleEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit Sale',
    },
};
