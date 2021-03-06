import * as express from 'express'; // eslint-disable-line no-unused-vars
import * as fs from 'fs';
import * as multiparty from 'multiparty';
import * as stripBom from 'strip-bom';
import * as stripComments from 'strip-json-comments';
import { promisify } from 'util';

import { debug as d } from './debug';
import { ConfigSource } from '../enums/configsource';
import { RequestData } from '../types/requestdata'; // eslint-disable-line no-unused-vars

const debug: debug.IDebugger = d(__filename);
const _readFileAsync = promisify(fs.readFile);

/** Max size for uploaded files. */
const maxFilesSize = 1024 * 100; // 100KB.
// This limit avoid people to upload very big files from the scanner. It is expected
// that users just upload a sonar configuration files so 100KB is more than
// enough.

/** Convenience wrapper for asynchronously reading file contents. */
export const readFileAsync = async (filePath: string): Promise<string> => {
    const content: string = await _readFileAsync(filePath, 'utf8');

    return stripBom(content);
};

/** Read multipart data from request. */
export const getDataFromRequest = (req: express.Request): Promise<RequestData> => {
    return new Promise((resolve, reject) => {
        const form = new multiparty.Form({ maxFilesSize });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return reject(err);
            }

            // TODO: check if it is a valid URL
            if (!fields.url) {
                return reject('Url is required');
            }

            try {
                const file = files['config-file'] ? files['config-file'][0] : null;
                const data: RequestData = {
                    config: file && file.size > 0 ? JSON.parse(await readFileAsync(file.path)) : null, // elsint-disable-line no-sync
                    rules: fields.rules,
                    source: fields.source ? fields.source[0] : ConfigSource.default,
                    url: fields.url ? fields.url[0] : null
                };

                return resolve(data);
            } catch (e) {
                return reject('Error parsing form');
            }
        });
    });
};

/** Convenience wrapper for synchronously reading file contents. */
const readFile = (filePath: string): string => {
    return stripBom(fs.readFileSync(filePath, 'utf8')); // eslint-disable-line no-sync
};

/** Loads a JSON a file. */
export const loadJSONFile = (filePath: string) => {
    debug(`Loading JSON file: ${filePath}`);

    return JSON.parse(stripComments(readFile(filePath)));
};
