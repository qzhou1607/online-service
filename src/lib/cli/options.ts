/**
 * @fileoverview Options configuration for optionator.
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import * as optionator from 'optionator';

// ------------------------------------------------------------------------------
// Initialization and Public Interface
// ------------------------------------------------------------------------------

export const options = optionator({
    defaults: {
        concatRepeatedArrays: true,
        mergeRepeatedObjects: true
    },
    mutuallyExclusive: ['file', 'activate', 'list', 'help'],
    options: [
        { heading: 'Basic configuration' },
        {
            alias: 'm',
            description: 'Microservice to run',
            enum: ['job-manager', 'config-manager', 'sync', 'worker', 'all'],
            option: 'microservice',
            type: 'String'
        }, {
            alias: 'v',
            description: 'Output the version number',
            option: 'version',
            type: 'Boolean'
        }, {
            alias: 'h',
            description: 'Show help',
            option: 'help',
            type: 'Boolean'
        },
        { heading: 'Config Manager options' },
        {
            alias: 'n',
            description: 'Name for the configuration',
            option: 'name',
            type: 'String'
        }, {
            alias: 'c',
            description: 'Cache time in seconds for jobs',
            option: 'cache',
            type: 'Int'
        }, {
            alias: 'f',
            dependsOn: ['and', 'name', 'cache'],
            description: 'Path to the sonar configuration file to store in database',
            example: 'online-service --microservice config-manager --name new-config-name --sonar-file config-file.json --cache 3000',
            option: 'file',
            type: 'path::String'
        }, {
            alias: 'a',
            dependsOn: 'name',
            description: 'Activate a configuration by name',
            example: 'online-service --microservice config-manager --activate --name config-name',
            option: 'activate',
            type: 'Boolean'
        }, {
            alias: 'l',
            description: 'List all the configuration available',
            example: 'online-service --microservice config-manager --list',
            option: 'list',
            type: 'Boolean'
        }
    ],
    prepend: 'online-service --microservice job-manager|config-manager|sync|worker|all [options]'
});
