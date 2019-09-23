import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./audit', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'audit',
    component: RouterView,
    meta: {
        breadcrumb: 'audit',
        route: 'commercial.audit.index',
    },
    children: routes,
};
