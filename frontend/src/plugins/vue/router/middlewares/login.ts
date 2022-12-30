import { isNil } from 'lodash-es';
import {
  RouteLocationNormalized,
  RouteLocationPathRaw,
  RouteLocationRaw
} from 'vue-router';
import { useRemote } from '@/composables';

const serverAddUrl = '/server/add';
const serverSelectUrl = '/server/select';
const serverLoginUrl = '/server/login';
const routes = new Set([serverAddUrl, serverSelectUrl, serverLoginUrl]);

/**
 * Redirects to login page if there's no user logged in.
 */
export default function loginGuard(
  to?: RouteLocationNormalized
): boolean | RouteLocationRaw {
  const remote = useRemote();
  let destinationRoute: RouteLocationPathRaw | undefined;

  if (to) {
    if (remote.auth.servers.value.length <= 0) {
      destinationRoute = { path: serverAddUrl, replace: true };
    } else if (!routes.has(to.path)) {
      if (isNil(remote.auth.currentServer.value)) {
        destinationRoute = { path: serverSelectUrl, replace: true };
      } else if (isNil(remote.auth.currentUser.value)) {
        destinationRoute = { path: serverLoginUrl, replace: true };
      }
    }

    return destinationRoute && to.path !== destinationRoute.path
      ? destinationRoute
      : true;
  } else {
    return false;
  }
}