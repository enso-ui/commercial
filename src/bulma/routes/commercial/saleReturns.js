import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter(require.context('./saleReturns', false, /.*\.js$/));
const RouterView = () => import('@enso-ui/ui/src/bulma/pages/Router.vue');

export default {
    path: 'saleReturns',
    component: RouterView,
    meta: {
        breadcrumb: 'sale returns',
        route: 'commercial.saleReturns.index',
    },
    children: routes,
};
