---
layout: none
---
"";
import { getProjects } from "./adstash.mjs"

const ROTATING_PROJECTS = ["UTAustin_Auslen", "Caltech_Drummond", "BiomedInfo"]

async function getData() {
    let topologyRes;
    try {
        topologyRes = await fetch("https://topology.opensciencegrid.org/miscproject/json");
    } catch (error) {
        console.error("Topology data fetch failed, trying backup", error);
        topologyRes = await fetch("{{ '/assets/data/project.json' | relative_url }}")
    }

    const topologyData = await topologyRes.json();
    const usageJson = await getProjects();

    return Object.entries(topologyData).reduce((p, [k,v]) => {
        if(k in usageJson){
            p[k] = {...v, ...usageJson[k]}
        }
        return p
    }, {});
}

function getWeekOfYear() {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    return Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

function formatNumber(num, decimals = 1) {
    const SCALES = ["", "K", "M", "B", "T"];
    let scaleIndex = 0;
    while (num >= 1000 && scaleIndex < SCALES.length - 1) {
        num /= 1000;
        scaleIndex++;
    }
    return `${Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)}${SCALES[scaleIndex]}`;
}

function formatBytes(num, decimals = 1) {
    if (num === 0) return '0B';
    const SCALES = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(num) / Math.log(1024));
    const value = num / Math.pow(1000, i);
    return `${Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)}${SCALES[i]}`;
}

function updateSpotlight(projectData) {
    const mapping = {
        "project-spotlight-title": "Name",
        "project-spotlight-fos": "FieldOfScience",
        "project-spotlight-pi": "PIName",
        "project-spotlight-organization": "Organization",
        "project-spotlight-description": "Description",
        "project-spotlight-jobs-ran": "numJobs",
        "project-spotlight-cpu-hours": "cpuHours",
        "project-spotlight-gpu-hours": "gpuHours",
        "project-spotlight-osdf-objects": "osdfFileTransferCount",
        "project-spotlight-osdf-bytes": "osdfByteTransferCount",
    }
    
    for (const [elementId, field] of Object.entries(mapping)) {
        const el = document.getElementById(elementId);
        if (!el) continue;
        
        let value = projectData[field];
        if (value === undefined || value === null) {
            value = "N/A";
        } else switch (field) {
            case "numJobs":
            case "cpuHours":
            case "gpuHours":
            case "osdfFileTransferCount":
                value = formatNumber(value);
                break;
            case "osdfByteTransferCount":
                value = formatBytes(value).replace(/\s/g, ''); // remove whitespace
                break;
            default:
                value = value.toString();
                break;
        }

        el.textContent = value;
    }
}

function setup() {
    const weekOfTheYear = getWeekOfYear();
    const project = ROTATING_PROJECTS[weekOfTheYear % ROTATING_PROJECTS.length];

    getData().then((data) => {
        console.log(data);
        console.log(data[project]);
        updateSpotlight(data[project]);
    });
}

setup();