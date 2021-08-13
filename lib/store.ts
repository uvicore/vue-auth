import { defineStore } from 'pinia';
import { UserInfo } from './user_info';
import { AuthInterface } from './interface';


/**
 * Pinia User Store
 */
export const useUserStore = defineStore({
  // unique id of the store across your application
  id: 'user',

  // State matched API Client return (reactive UnwrapRef<Results<E>)
  //state: () => User.newRef(),
  //state: () => User.newRef() as UnwrapRef<Results<User>>,

  state: () => ({
    // Auth adapter for internal use only (thus the _)
    _adapter: {} as AuthInterface,

    // UserInfo
    id: 1,
    uuid: '11c28e64-cefb-418a-9981-573613dbec8f',  // doesn't matter what this is? I think?
    username: 'anonymous',
    email: 'anonymous@example.com',
    firstName: 'Anonymous',
    lastName: 'User',
    title: 'Anonymous',
    avatar: 'something',
    groups: [] as string[],
    roles: [] as string[],
    permissions: [] as string[],
    superadmin: false,
    token: '',

  }),

  getters: {
    // Computed
    //name: (state) => state.profile.firstName + ' ' + state.profile.lastName,
    name: (state) => state.firstName + ' ' + state.lastName,
    authenticated: (state) => state._adapter.isAuthenticated,
    //token: (state) => state._adapter.token,
    profile: (state) => state._adapter.profile,

    // Aliases
    // admin: (state) => state.profile.superadmin,
    // isAdmin: (state) => state.profile.superadmin,
    // isSuperadmin: (state) => state.profile.superadmin,
    // isNotAdmin: (state) => !state.profile.superadmin,
    admin: (state) => state.superadmin,
    isAdmin: (state) => state.superadmin,
    isSuperadmin: (state) => state.superadmin,
    isNotAdmin: (state) => !state.superadmin,

    isAuthenticated: (state) => state._adapter.isAuthenticated,
    check: (state) => state._adapter.isAuthenticated,
    loggedIn: (state) => state._adapter.isAuthenticated,
    isLoggedIn: (state) => state._adapter.isAuthenticated,
    isNotAuthenticated: (state) => !state._adapter.isAuthenticated,
    isNotLoggedIn: (state) => !state._adapter.isAuthenticated,
  },

  actions: {

    /**
     * Initialize store (called from your main.ts)
     * @param auth AuthInterface
     */
    init(auth: AuthInterface) {
      // Initialized from your main.ts
      this._adapter = auth

      // On page reload, pull user from storage and set pinia store
      if (this._adapter.hasStorage()) {
        const user = this._adapter.getStorage();
        if (user) this.set(user);
      }
    },

    /**
     * Set entire pinia store (except _adapter)
     * @param userInfo
     */
    set(userInfo: UserInfo) {
      this.id = userInfo.id;
      this.uuid = userInfo.uuid;
      this.username = userInfo.username;
      this.email = userInfo.email;
      this.firstName = userInfo.firstName;
      this.lastName = userInfo.lastName;
      this.title = userInfo.title;
      this.avatar = userInfo.avatar;
      this.groups = userInfo.groups;
      this.roles = userInfo.roles;
      this.permissions = userInfo.permissions;
      this.superadmin = userInfo.superadmin;
      this.token = userInfo.token;

      // Set user info to storage
      this._adapter.setStorage(userInfo);
    },

    /**
     * Logout (passthrough to auth adapter)
     */
    login() {
      this._adapter.login()
    },

    /**
     * Login (passthrough to auth adapter)
     */
    logout() {
      this._adapter.logout()
    },

    can(permissions: string[]): boolean {
      // Check if user has ALL of these permissions
      return true;
    },

    canAny(permissions: string[]): boolean {
      // Check if user has any one of these permissions
      return true;
    },

    cant(permissions: string[]): boolean {
      // Check if user does not have one of these permissions
      return !this.can(permissions);
    },

    cannot(permissions: string[]): boolean {
      // Alias to cant()
      return this.cant(permissions);
    }

  }

});








// def cant(self, permissions: Union[str, List]) -> bool:
//     """Check if user does not have one of these permissions"""
//     return not self.can(permissions)

// def cannot(self, permissions: Union[str, List]) -> bool:
//     """Alias to cant"""
//     return not self.cant(permissions)
