// Script that backs up data and provides a function to use those backups


import {generateHash} from './util.js';
import {getProjects, getInstitutions, getInstitutionOverview, getProjectOverview} from './adstash.mjs';

const BACKUP_DIRECTORY = '/assets/data/backups/'

/**
 * Fetch data from a URL for backup purposes
 *
 * Takes a url and returns json, you have to use this function name specifically
 * to key it to the hash used in the backup system
 *
 * @param url
 * @returns {Promise<any>}
 */
const fetchForBackup = (url) => fetch(url).then(res => res.json())

const backupMap = async () => {
  return [
    {
      function: fetchForBackup,
      args: ["https://topology.opensciencegrid.org/miscproject/json"],
    },
    {
      function: getProjects,
    },
    {
      function: getInstitutions,
    },
    ...(
      Object.values(await getProjects()).map( project => ({
        function: getProjectOverview,
        args: [project.projectName],
      }) )
    ),
    ...(
      Object.values(await getInstitutions()).map( institution => ({
        function: getInstitutionOverview,
        args: [institution.institutionName],
      }) )
    ),
  ]
}

const fetchBackup = async (fetcher, ...args) => {

  const fs = await import('fs')
  const path = await import('path')

  const backupFunctionHash = generateHash(String(fetcher) + JSON.stringify(args));

  const data = await fetcher(...args);

  const backupPath = path.join('./', BACKUP_DIRECTORY, `${backupFunctionHash}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
}

const fetchWithBackup = async (fetcher, ...args) => {
  try {
    return await fetcher(...args);
  } catch (error) {
    const backupFunctionHash = generateHash(String(fetcher) + JSON.stringify(args));
    const response = await fetch(`${BACKUP_DIRECTORY}${backupFunctionHash}.json`);
    if (!response.ok) {
      throw new Error(`Backup not found: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
}


/**
 * Run on the backend to generate backups
 *
 * Bins the backups in groups of 10 to avoid overwhelming the server
 *
 * @returns {Promise<void>}
 */
export async function main() {
  const backupTasks = await backupMap();

  const BATCH_SIZE = 10;
  for (let i = 0; i < backupTasks.length; i += BATCH_SIZE) {
    const batch = backupTasks.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(task => fetchBackup(task.function, ...(task.args || [])))
    );
    console.log(`Completed batch ${i / BATCH_SIZE + 1} of ${Math.ceil(backupTasks.length / BATCH_SIZE)}`);
  }
}

export { fetchWithBackup, fetchForBackup };
