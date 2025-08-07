import {formatBytes} from "../util.js";
import {PieChart} from "./pie-chart.js";
import {getProjectOverview} from "../adstash.mjs";
import Count from "./Count.mjs";

class ProjectDisplay{
	constructor(parentNode) {
		this.parentNode = parentNode
		this.display_modal = new bootstrap.Modal(parentNode, {
			keyboard: true
		})
	}

	setUrl(Name) {
		const url = new URL(window.location.href);
		url.searchParams.set("project", Name)
		history.pushState({}, '', url)
	}

	updateTextValue(className, value){
		Array.from(this.parentNode.getElementsByClassName(className)).forEach(e => {
			e.textContent = value
		})
	}

	async update({Name, PIName, FieldOfScience, Organization, Description}) {
		this.updateTextValue("project-Name", Name)
		this.updateTextValue("project-PIName", PIName)
		this.updateTextValue("project-FieldOfScience", FieldOfScience)
		this.updateTextValue("project-Organization", Organization)
		this.updateTextValue("project-Description", Description)
		this.setUrl(Name)
		this.clearGraphSlots()
		this.parentNode.addEventListener("shown.bs.modal", () => {
			this.updateGraphs(Name)
		}, {once : true})
		this.display_modal.show()
	}

	/**
	 * Replace the graph slot children with placeholders
	 */
	clearGraphSlots(){
		Array.from(document.getElementsByClassName("graph-slot")).forEach((n) => {
			while(n.firstChild){
				n.removeChild(n.firstChild)
			}
			let placeholder = document.createElement("span")
			placeholder.className = "placeholder bg-light w-100"
			n.appendChild(placeholder)
		})
	}

	async updateGraphs(Name){

		const data = await this.getData(Name)
		this.updateInstitutionPieChart(data)
		Count("project-institution-count", Object.keys(data).length, 300)
		Count("project-job-count", Math.round(Object.values(data).reduce((p, v) => p + v.numJobs, 0)), 100)
		Count("project-cpu-count", Math.round(Object.values(data).reduce((p, v) => p + v.cpuHours, 0)), 100)
		Count("project-gpu-count", Math.round(Object.values(data).reduce((p, v) => p + v.gpuHours, 0)), 100)
	}

	async updateInstitutionPieChart(data) {
		new PieChart(
			"project-institution-pie-chart",
			async () => {
				return Object.entries(data)
						.filter(([k,v]) => v.numJobs > 0)
						.sort((a, b) => b[1]['numJobs'] - a[1]['numJobs'])
						.reduce((p, [k,v]) => {
							return {
								labels: [...p.labels, k],
								data: [...p.data, v.numJobs]
							}
						}, {labels: [], data: []})
			},
			"# of Jobs by Institution"
		)
	}

	async getData(Name){
		return await getProjectOverview(Name)
	}
}

class OSDFProjectDisplay extends ProjectDisplay {
	async update(data) {
		const {Name, PIName, FieldOfScience, Organization, Description} = data;
		console.log(data);
		this.updateTextValue("project-Name", Name)
		this.updateTextValue("project-PIName", PIName)
		this.updateTextValue("project-FieldOfScience", FieldOfScience)
		this.updateTextValue("project-Organization", Organization)
		this.updateTextValue("project-Description", Description)
		this.setUrl(Name)
		this.clearGraphSlots()
		this.parentNode.addEventListener("shown.bs.modal", () => {
			this.updateGraphs(Name)
		}, {once : true})
		this.display_modal.show()
	}

	async updateGraphs(Name){
		const data = await this.getData(Name)
		console.log(data);

		const objects = Math.round(Object.values(data).reduce((p, v) => p + v.osdfFileTransferCount, 0));
		const bytes = Math.round(Object.values(data).reduce((p, v) => p + v.osdfByteTransferCount, 0));
		Count("project-osdf-objects", objects, 100)
		Count("project-osdf-bytes", formatBytes(bytes), 100)
	}

	async updateInstitutionPieChart(_) {
		throw new Error("updateInstitutionPieChart not implemented for OSDFProjectDisplay")
	}
}

export { OSDFProjectDisplay };
export default ProjectDisplay;