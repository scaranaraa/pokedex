/**
 * @module
 */
import fs from 'fs';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function get_data_from<T>(filename: string): Promise<T[]> {
    const filePath = path.join(__dirname,`./data/${filename}`);
    const data: T[] = [];

    try {
        const fileStream = fs.createReadStream(filePath);
        return await new Promise<T[]>((resolve, reject) => {
            fileStream
                .pipe(csv())
                .on('data', row => {
                    const cleanedRow: T = {} as T;
                    Object.keys(row).forEach(key => {
                        const trimmedKey = key.trim();
                        const value = row[key].trim();
                        (cleanedRow as Record<string, any>)[trimmedKey] = isnumber(value)
                            ? parseInt(value)
                            : value;
                    });

                    data.push(cleanedRow);
                })
                .on('end', () => {
                    resolve(data);
                })
                .on('error', error => {
                    console.error('Error reading CSV file:', error.message);
                    reject(error);
                });
        });
    } catch (error: any) {
        console.error('Error opening CSV file:', error.message);
        throw error;
    }
}

function isnumber(value: string) {
    return /^-?\d+\.?\d*$/.test(value);
}

function comma_formatted(iterable: string[]) {
    if (iterable.length === 0) {
        return '';
    }
    if (iterable.length === 1) {
        return String(iterable[0]);
    }

    return `${iterable.slice(0, -1).join(', ')} and ${iterable[iterable.length - 1]}`;
}

export { comma_formatted, get_data_from, isnumber };
