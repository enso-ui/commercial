import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter(require.context('./settings', false, /.*\.js$/));
const RouterView = () => import('@enso-ui/ui/src/bulma/pages/Router.vue');

export default {
    path: 'settings',
    component: RouterView,
    meta: {
        breadcrumb: 'settings',
        route: 'commercial.settings.index',
    },
    children: routes,
};
