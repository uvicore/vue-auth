import { AuthInterface } from './interface';
//import { AuthInterface } from './interface';

export function createAuth(config: any): AuthInterface {

    // Narrow config to this drivers config
    config = config[config.driver];

    // Instantiate the drivers adapter class
    const adapter = new config.adapter(config);

    // Initialize the adapter
    adapter.init();

    return adapter
}

