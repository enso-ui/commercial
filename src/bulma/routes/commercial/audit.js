import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter(require.context('./audit', false, /.*\.js$/));
const RouterView = () => import('@enso-ui/ui/src/bulma/pages/Router.vue');

export default {
    path: 'audit',
    component: RouterView,
    meta: {
        breadcrumb: 'audit',
        route: 'commercial.audit.index',
    },
    children: routes,
};
