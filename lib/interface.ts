import { Router } from 'vue-router';


export interface AuthInterface {
  config: any
  isAuthenticated: boolean

  startup(): Promise<boolean>
  useRouter(router: Router): void
  login(): void
  logout(): void

}
