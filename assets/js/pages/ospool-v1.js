
import { fetchWithBackup, fetchForBackup } from "../backup.js";
import { getInstitutionsOverview } from "../adstash.mjs";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let counter = async (id, endValue, numIncrements, decimals=0) => {
    let node = document.getElementById(id)
    if (!node) {
        console.error(`Could not find node with id ${id}`)
        return
    }

    let valueArray = [...Array(numIncrements).keys()].map((value, index) => {
        return Math.floor(endValue * (Math.sqrt((index+1)/numIncrements)))
    })

    let index = 0;
    let interval = setInterval(() => {
        if (index >= valueArray.length) {
            clearInterval(interval)
        } else {
            node.textContent = int_to_small_format(valueArray[index], decimals)
        }
        index += 1;
    }, 50)
}

async function initialize_ospool_report () {
    try {

        let json = undefined

        while (!foundDate) {

        }

        const now = Date.now()
        const start = now - 48 * 60 * 60 * 1000
        const end = now - 24 * 60 * 60 * 1000

        let json = await fetchWithBackup(getInstitutionsOverview, start, end);

        let dataDate = new Date(json['date'])
        let dateString = `${months[dataDate.getUTCMonth()]} ${dataDate.getUTCDate()}`
        document.getElementById("ospool-date").textContent = dateString

        counter("ospool-jobs", json['numJobs'], 20)
        counter("ospool-file-transfers", json['fileTransferCount'], 20)
        counter("ospool-core-hours", json['cpuHours'], 20)
        counter("ospool-users", json['numProjects'], 20)
        counter("ospool-sites", json['numInstitutions'], 20)
    } catch(e) {
        console.error("Error fetching OSPool statistics: ", e)
    }
}

/**
 * A function to convert large numbers into a < 4 char format, i.e. 100,000 to 100k or 10^^9 to 1b
 *
 * It would be interesting to find a solution to this that is better than O(N)
 * @param int An integer
 * @param decimals The amount of decimal places to include
 */
function int_to_small_format(int, decimals=0) {
    if(int < 10**3) {
        return int.toFixed(decimals)
    } else if ( int < 10**6 ) {
        return (int / 10**3).toFixed(decimals) + "K"
    } else if ( int < 10**9 ) {
        return (int / 10**6).toFixed(decimals) + "M"
    } else if ( int < 10**12 ) {
        return (int / 10**9).toFixed(decimals) + "B"
    } else {
        return int.toFixed(decimals)
    }
}


initialize_ospool_report()