import { User, UserManagerSettings, WebStorageStateStore } from "oidc-client";
import {
  createOidcAuth,
  LogLevel,
  OidcAuth as BaseOidcAuth,
  SignInType,
} from "vue-oidc-client/vue3";
import { Router } from 'vue-router';


import { useUserStore } from '../store'

import { AuthInterface } from '../interface';

// // vue-oidc-client
// // https://github.com/soukoku/vue-oidc-client

export class OidcAuth implements AuthInterface {
  public config: any;
  private base: BaseOidcAuth = null!;

  public constructor(config: any) {
    this.config = config;
  }

  public startup(): Promise<boolean> {
    return this.base.startup();
  }

  public useRouter(router: Router): void {
    this.base.useRouter(router)
  }

  public login(): void {
    //this.base.signIn();
    console.log('OIDC adapter login()')
    this.base.signIn();

    // mainOidc.isAuthenticated; // if logged in
    // mainOidc.accessToken;     // if applicable and valid
    // mainOidc.userProfile;     // user claims object

    // mainOidc.appUrl;   // value passed in createOidcAuth()
    // mainOidc.authName; // value passed in createOidcAuth()
    // signIn()
    // signOut()
    // startSilentRenew()
    // stopSilentRenew()
  }

  public get isAuthenticated(): boolean {
    return this.base.isAuthenticated
  }

  public logout(): void {
    console.log('OIDC adapter logout()');
    this.base.signOut();
  }

  private get user() {
    return useUserStore()
  }

  public init(): this {
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
      LogLevel.Debug
    );
    this.base = auth;


    auth.events.addAccessTokenExpiring(() => {
      // eslint-disable-next-line no-console
      console.debug("Auth Event: access token expiring");
    });

    auth.events.addAccessTokenExpired(() => {
      // eslint-disable-next-line no-console
      console.debug("Auth Event: access token expired");
    });

    auth.events.addSilentRenewError((err: Error) => {
      // eslint-disable-next-line no-console
      console.error("Auth Event: silent renew error", err);
    });

    auth.events.addUserLoaded((user: User) => {
      // eslint-disable-next-line no-console
      console.debug("Auth Event: user loaded", user);
      this.user.onUserLoaded(user);
    });

    auth.events.addUserUnloaded(() => {
      // eslint-disable-next-line no-console
      console.debug("Auth Event: user unloaded");
    });

    auth.events.addUserSignedOut(() => {
      // eslint-disable-next-line no-console
      console.debug("Auth Event: user signed out");
    });

    auth.events.addUserSessionChanged(() => {
      // eslint-disable-next-line no-console
      console.debug("Auth Event: user session changed");
    });

    //return auth;
    return this;
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

