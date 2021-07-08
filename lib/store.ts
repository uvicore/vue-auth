import { defineStore } from 'pinia';
import { User } from './models';

export const useUserStore = defineStore({
  // unique id of the store across your application
  id: 'user',

  state: () => ({
    _adapter: null as any,
    //authenticated: false,
    profile: {
      id: 1,
      uuid: '11c28e64-cefb-418a-9981-573613dbec8f',  // doesn't matter what this is? I think?
      username: 'anonymous',
      email: 'anonymous@example.com',
      firstName: 'Anonymous',
      lastName: 'User',
      title: 'Anonymous',
      avatar: 'something',
      groups: [],
      roles: [],
      permissions: [],
      superadmin: false,
    } as User
  }),

  getters: {
    // Computed
    name: (state) => state.profile.firstName + ' ' + state.profile.lastName,
    authenticated: (state) => state._adapter.isAuthenticated,
    token: (state) => state._adapter.accessToken,

    // Aliases
    admin: (state) => state.profile.superadmin,
    isAdmin: (state) => state.profile.superadmin,
    isSuperadmin: (state) => state.profile.superadmin,
    isNotAdmin: (state) => !state.profile.superadmin,

    isAuthenticated(state) { this.authenticated },
    check(state) { this.authenticated },
    loggedIn(state) { this.authenticated },
    isLoggedIn(state) { this.authenticated },
    isNotAuthenticated(state) { !this.authenticated },
    isNotLoggedIn(state) { !this.authenticated },
  },

  actions: {

    init(auth: any) {
      this._adapter = auth
    },

    login() {
      this._adapter.login()
    },

    logout() {
      this._adapter.logout()
    },

    onUserLoaded(user: any) {
      console.log('xxxxxxxxxxxxxxxxxxxxxxx store onUserLoaded: ', user);
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
