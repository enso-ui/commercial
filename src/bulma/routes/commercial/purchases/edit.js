const PurchaseEdit = () => import('../../../pages/purchases/Edit.vue');

export default {
    name: 'commercial.purchases.edit',
    path: ':purchase/edit',
    component: PurchaseEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Purchase',
    },
};
