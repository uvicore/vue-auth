import { AuthInterface } from './interface';
//import { AuthInterface } from './interface';

/**
 * Vue plugin for Uvicore Auth Library
 * @param config any
 * @returns
 */
export function createAuth(authConfig: any, apiConfig: any): AuthInterface {

    // config is just the auth config, all drivers, not your entire config
    // Narrow config to this drivers config
    let driverConfig = authConfig[authConfig.driver];

    // Add some root auth configs to driverConfig
    driverConfig.appUrl = authConfig.appUrl;
    driverConfig.uvicoreUserInfoUrl = authConfig.uvicoreUserInfoUrl;
    driverConfig.storage = authConfig.storage;
    driverConfig.storageKey = authConfig.storageKey;

    // Add in our apiConfig to this driverConfig
    driverConfig.apis = apiConfig;

    // Instantiate the drivers adapter class
    const adapter = new driverConfig.adapter(driverConfig);

    // Initialize the adapter
    adapter.init();

    return adapter;
}

