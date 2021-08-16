import axios from 'axios';
import { BaseAuth } from './base';
import { Router } from 'vue-router';
import { UserInfo } from '../user_info';
import { AuthInterface } from '../interface';
import { OidcAuth as BaseOidcAuth } from 'vue-oidc-client/vue3';
import {createOidcAuth, LogLevel, SignInType} from 'vue-oidc-client/vue3';
import { User, UserManagerSettings, WebStorageStateStore } from 'oidc-client';


/**
 * Uvicore Auth OIDC Adapter vue-oidc-client
 * See https://github.com/soukoku/vue-oidc-client
 */
export class OidcAuth extends BaseAuth implements AuthInterface {

  /**
   * Private base, not meant for user consumption
   * This is the actual vue-oidc-client which we are adapting
   */
  private base: BaseOidcAuth = null!;

  /**
   * User is currently logged in
   */
   public get isAuthenticated(): boolean {
    return this.base.isAuthenticated
  }

  /**
   * JWT access token from IDP
   */
  public get token(): string {
    return this.base.accessToken;
  }

  /**
   * IDP user profile in JWT or from IDP profile endpoint
   */
  public get profile() {
    return this.base.userProfile;
  }

  /**
   * Startup event promise
   * @returns Promise<boolean>
   */
  public startup(): Promise<boolean> {
    return this.base.startup();
  }

  /**
   * Login to IDP via OIDC
   */
   public login(): void {
    this.base.signIn();
  }

  /**
   * Logout of IDP via OIDC
   */
  public logout(): void {
    this.base.signOut();
  }

  /**
   * OIDC specific useRouter method
   * @param router
   */
  public useRouter(router: Router): void {
    this.base.useRouter(router)
  }

  /**
   * Initialize this adapter
   */
  public init(): void {
    let appUrl: string = this.config.appUrl;  // Fix to ensure / at end
    let authUrl: string = this.config.authUrl;  // Fix to ensure NO / at end

    let authConfig = {
      authority: authUrl,
      client_id: this.config.appId,
      response_type: 'code',
      //scope: 'openid offline_access',
      scope: 'openid profile',

      // Login redirect - NO this breaks the JWT receive, must be OIDCs defaults
      // OIDC also redirects to the proper access denied URL once logged in
      //redirect_uri: `${appUrl}${this.config.loginRedirectPath}`,

      // Logout redirect
      post_logout_redirect_uri: `${appUrl}${this.config.logoutRedirectPath}`,

      // Advanced control (not needed by default with fusionauth, but could merge with config
      metadata: {
        issuer: authUrl,
        authorization_endpoint: `${authUrl}/oauth2/authorize`,
        token_endpoint: `${authUrl}/oauth2/token`,

        userinfo_endpoint: `${authUrl}/oauth2/userinfo`,
        //userinfo_endpoint: `${appUrl}/oauth2/userinfo`,

        jwks_uri: `${authUrl}/.well-known/jwks.json`,
        end_session_endpoint: `${authUrl}/oauth2/logout?client_id=${this.config.appId}`,
        introspect_endpoint: `${authUrl}/oauth2/introspect`,
      },

      automaticSilentRenew: true,

      userStore: new WebStorageStateStore({ store: window[this.config.storage] }),
      //userStore: new WebStorageStateStore({ store: window.sessionStorage }),
      //userStore: new WebStorageStateStore({ store: window.localStorage }),

      //metadataUrl: "https://auth-local.triglobal.io/.well-known/openid-configuration/a7f35245-83d3-7261-4f33-535925ec58c8",

    } as UserManagerSettings;

    const auth: BaseOidcAuth = createOidcAuth(
      this.config.appName,
      SignInType.Window,
      this.config.appUrl + '/',  // Requires a / at end
      authConfig,
      console,
      // @ts-ignore
      LogLevel[this.config.logLevel],
    );
    this.base = auth;


    auth.events.addAccessTokenExpiring(() => {
      // eslint-disable-next-line no-console
      console.debug("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuth Event: access token expiring");
    });

    auth.events.addAccessTokenExpired(() => {
      // eslint-disable-next-line no-console
      console.debug("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuth Event: access token expired");
    });

    auth.events.addSilentRenewError((err: Error) => {
      // eslint-disable-next-line no-console
      console.error("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuth Event: silent renew error", err);
      //this.removeStorage()
    });

    /**
     * User logged in and JWT received from OIDC
     */
    auth.events.addUserLoaded((user: User) => {
      // eslint-disable-next-line no-console
      console.debug("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuth Event: user loaded", user);
      //this.user.onUserLoaded(user);

      // Get the jwt access token from the IDP response
      const jwt = user.access_token;

      // Add this jwt to axios default headers so all future axios requests include this header
      axios.defaults.headers.Authorization = 'Bearer ' + jwt;

      // Query the uvicore userinfo endpoint with our jwt
      axios.get(this.config.uvicoreUserInfoUrl).then((res) => {
        const data = res.data
        data.token = jwt

        // Translate understores to camelCase
        data.firstName = data.first_name
        data.lastName = data.last_name
        delete data.first_name
        delete data.last_name

        // Convert JSON data into actual UserInfo class instance
        const userInfo = new UserInfo(data);

        // Set user store
        this.userStore.set(userInfo);

        //storage.setItem(storageKey, JSON.stringify(user));
      }).catch((error) => {
        console.error('AXIOS ERROR on uvicore userinfo');
      })

    });

    /**
     * EVENT User logged out
     */
    auth.events.addUserUnloaded(() => {
      // eslint-disable-next-line no-console
      console.debug("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuth Event: user unloaded");
      //this.userStore.onUserUnloaded();
      this.removeStorage()
    });

    auth.events.addUserSignedOut(() => {
      // eslint-disable-next-line no-console
      console.debug("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuth Event: user signed out");
      this.removeStorage()
    });

    auth.events.addUserSessionChanged(() => {
      // eslint-disable-next-line no-console
      console.debug("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuth Event: user session changed");
    });

    //return auth;
    //return this;
  }

}


// let config = {
//   appName: 'wiki',
//   appId: '7cc7d2a5-cc02-43ca-93bc-8476370ebf9d',
//   appUrl: 'https://wiki-local.triglobal.io/',
//   redirectPath: '/login',
//   authUrl: 'https://auth-local.triglobal.io',
// }
// export const auth = new OidcAuth(config).init().base



// // FIXME: from config file
// const auth_name = "wiki";
// const auth_type = SignInType.Window;
// const auth_url = "https://auth-local.triglobal.io";
// const app_url = "https://wiki-local.triglobal.io/";
// const client_id = "7cc7d2a5-cc02-43ca-93bc-8476370ebf9d";
// const response_type = "code";
// const scope = "openid offline_access";

// const metadata = {
//   issuer: `${auth_url}`,
//   authorization_endpoint: `${auth_url}/oauth2/authorize`,
//   token_endpoint: `${auth_url}/oauth2/token`,
//   userinfo_endpoint: `${auth_url}/oauth2/userinfo`,
//   jwks_uri: `${auth_url}/.well-known/jwks.json`,
//   end_session_endpoint: `${auth_url}/oauth2/logout?client_id=${client_id}`,
//   introspect_endpoint: `${auth_url}/oauth2/introspect`,
// };

// const auth_config = {
//   authority: auth_url,
//   client_id,
//   response_type,
//   scope,
//   metadata,
//   automaticSilentRenew: true,
//   redirect_uri: `${app_url}login`,
//   // userStore: new WebStorageStateStore({ store: window.sessionStorage }),
//   //metadataUrl:
//   //  "https://auth-local.triglobal.io/.well-known/openid-configuration/a7f35245-83d3-7261-4f33-535925ec58c8",
// } as UserManagerSettings;

// export const OidcAuth: Auth = createOidcAuth(
//   auth_name,
//   auth_type,
//   app_url,
//   auth_config,
//   console,
//   LogLevel.Debug
// );


// // Authentication Event Examples

// // auth.events.addAccessTokenExpiring(() => {
// //   // eslint-disable-next-line no-console
// //   console.log("access token expiring");
// // });

// // auth.events.addAccessTokenExpired(() => {
// //   // eslint-disable-next-line no-console
// //   console.log("access token expired");
// // });

// // auth.events.addSilentRenewError((err: Error) => {
// //   // eslint-disable-next-line no-console
// //   console.error("silent renew error", err);
// // });

// // auth.events.addUserLoaded((user: User) => {
// //   // eslint-disable-next-line no-console
// //   console.log("user loaded", user);
// // });

// // auth.events.addUserUnloaded(() => {
// //   // eslint-disable-next-line no-console
// //   console.log("user unloaded");
// // });

// // auth.events.addUserSignedOut(() => {
// //   // eslint-disable-next-line no-console
// //   console.log("user signed out");
// // });

// // auth.events.addUserSessionChanged(() => {
// //   // eslint-disable-next-line no-console
// //   console.log("user session changed");
// // });

