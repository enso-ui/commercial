const PurchaseReturnEdit = () => import('../../../pages/purchaseReturns/Edit.vue');

export default {
    name: 'commercial.purchaseReturns.edit',
    path: ':purchaseReturn/edit',
    component: PurchaseReturnEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Purchase Return',
    },
};
