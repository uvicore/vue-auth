import { Router } from 'vue-router';


//import { UnwrapRef } from 'vue';
//import { Results } from '@uvicore/vue-orm';
import { UserInfo } from './user_info';

export interface AuthInterface {

  // Auth config object passed in the Vue plugin
  config: any

  // Auth system has successfully authenticated the user
  isAuthenticated: boolean

  // Token from IDP (set to '' for adapters that have no JWT or tokens)
  token: string

  // Profile returned from IDP
  profile: any

  // Access to the underlying Pinia UserInfo store
  userStore: any

  // Storage facility (local or session)
  storage: Storage

  // Storage key to hold user object
  storageKey: string

  // Required adapter methods
  startup(): Promise<boolean>
  login(): void
  logout(): void
  init(): void
  getStorage(): UserInfo|null
  hasStorage(): boolean
  setStorage(data: any): void
  removeStorage(): void;

  // NO, this is OIDC specific, does not belong in an generic interface
  // useRouter(router: Router): void
}
