import { AuthInterface } from './interface';
//import { AuthInterface } from './interface';

export function createAuth(config: any): AuthInterface {

    // config is just the auth config, all drivers, not your entire config
    // Narrow config to this drivers config
    let driverConfig = config[config.driver];

    // Add some root auth configs to driverConfig
    driverConfig.appUrl = config.appUrl;
    driverConfig.uvicoreUserInfoUrl = config.uvicoreUserInfoUrl;
    driverConfig.storage = config.storage;
    driverConfig.storageKey = config.storageKey;

    // Instantiate the drivers adapter class
    const adapter = new driverConfig.adapter(driverConfig);

    // Initialize the adapter
    adapter.init();

    return adapter;
}

