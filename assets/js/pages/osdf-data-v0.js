---
    layout: blank
---

import ElasticSearchQuery, {ENDPOINT, DATE_RANGE, SUMMARY_INDEX, OSPOOL_FILTER} from "/assets/js/elasticsearch-v1.js";
import {
    GraccDisplay,
    locale_int_string_sort,
    string_sort,
    hideNode,
    sortByteString,
    formatBytes, byteStringToBytes
} from "/assets/js/util.js";
import {PieChart} from "/assets/js/components/pie-chart.js";

/**
 * A node wrapping the project information break down
 */
class ProjectDisplay{
    constructor(parentNode) {
        this.parentNode = parentNode
        this.display_modal = new bootstrap.Modal(parentNode, {
            keyboard: true
        })
    }

    setUrl() {
        const url = new URL(window.location.href);
        url.searchParams.set("project", this.name)
        history.pushState({}, '', url)
    }

    updateTextValue(className, value){
        this.parentNode.getElementsByClassName(className)[0].innerHTML = value
    }

    update({
       description,
       organization,
       dataVisibility,
       size,
       bytesXferd,
       url,
       fieldOfScience,
       numberOfDatasets,
       rank,
       inProgress,
       display,
       name,
       namespace,
       id
    }) {
        this.name = name;
        this.organization = organization;
        this.description = description;
        this.fieldOfScience = fieldOfScience;

        this.updateTextValue("data-name", name);
        this.updateTextValue("data-organization", organization);
        this.updateTextValue("data-fieldOfScience", fieldOfScience);
        this.updateTextValue("data-description", description);
        this.setUrl();
        this.display_modal.show();
    }
}

class Search {
    constructor(data, listener) {
        this.node = document.getElementById("project-search")
        this.listener = listener
        this.timer = undefined
        this.node.addEventListener("input", this.search)
        this.lunr_idx = lunr(function () {
            this.ref('name')
            this.field('fieldOfScience')
            this.field('organization')
            this.field('description')
            this.field('name')

            data.forEach(function (doc) {
                this.add(doc)
            }, this)
        })
    }
    search = () => {
        clearTimeout(this.timer)
        this.timer = setTimeout(this.listener, 250)
    }
    filter = (data) => {
        if(this.node.value == ""){
            return data
        } else {
            console.log(this.node.value)
            let table_keys = this.lunr_idx.search(`*${this.node.value}* ${this.node.value} ${this.node.value}~2`).map(r => r.ref)
            return table_keys.reduce((pv, k) => {
                pv[k] = data[k]
                return pv
            }, {})
        }
    }
}

class Table {
    constructor(wrapper, data_function, updateProjectDisplay){
        this.grid = undefined
        this.data_function = data_function
        this.wrapper = wrapper
        this.updateProjectDisplay = updateProjectDisplay
        this.columns = [
            {
                id: "id",
                name: "ID",
                hidden: true
            },  {
                id: 'name',
                name: 'Name',
                sort: { compare: string_sort },
                attributes: {
                    className: "gridjs-th gridjs-td pointer gridjs-th-sort text-start"
                }
            }, {
                id: 'organization',
                name: 'Organization',
                sort: { compare: string_sort },
                attributes: {
                    className: "gridjs-th gridjs-td pointer gridjs-th-sort text-start"
                }
            },  {
                id: 'fieldOfScience',
                name: 'Field Of Science',
                sort: { compare: string_sort },
                attributes: {
                    className: "gridjs-th gridjs-td pointer gridjs-th-sort text-start"
                }
            },  {
                id: 'numberOfDatasets',
                name: 'Number Of Datasets',
                sort: { compare: string_sort },
                attributes: {
                    className: "gridjs-th gridjs-td pointer gridjs-th-sort text-start"
                }
            }
        ]

        let table = this;
        this.grid =  new gridjs.Grid({
            columns: table.columns,
            sort: true,
            className: {
                container: "",
                table: "table table-hover",
                td: "pointer",
                paginationButton: "mt-2 mt-sm-0"
            },
            data: async () => Object.values(await table.data_function()),
            pagination: {
                enabled: true,
                limit: 15,
                buttonsCount: 1
            },
            width: "1000px",
            style: {
                td: {
                    'text-align': 'right'
                }
            }
        }).render(table.wrapper);
        this.grid.on('rowClick', this.row_click);
    }
    update = async () => {
        let table = this
        this.grid.updateConfig({
            data: Object.values(await table.data_function()).sort((a, b) => b.jobs - a.jobs)
        }).forceRender();
    }
    row_click = async (PointerEvent, e) => {
        let data = await this.data_function()
        let row_name = e["cells"][0].data
        let project = data[row_name]
        console.log(project)
        this.updateProjectDisplay(project)
    }
}

class DataManager {
    constructor(filters, consumerToggles, errorNode) {
        this.filters = filters ? filters : {}
        this.consumerToggles = consumerToggles ? consumerToggles : []
        this.errorNode = errorNode ? errorNode : document.getElementById("error")
        this.error = undefined
    }

    toggleConsumers = () => {
        this.consumerToggles.forEach(f => f())
    }

    addFilter = (name, filter) => {
        this.filters[name] = filter
        this.toggleConsumers()
    }

    getData = async () => {

        const data = {
            {% for d in site.data.osdf_namespace_metadata %}
                {{ d[0] | jsonify }}: {
                    {% for k in d[1] %}
                        {% if k[0] == "description" %}
                            {{ k[0] }}: {{ k[1] | markdownify | jsonify }},
                        {% else %}
                            {{ k[0] }}: {{ k[1] | jsonify }} ,
                        {% endif %}
                    {% endfor %}
                },
            {% endfor %}
        }

        const visibleData = Object.entries(data).reduce((reduced, v) => {
            if(v[1]['display'] && v[1]['name'] ){
                reduced[v[0]] = v[1]
                reduced[v[0]]['id'] = v[0]
            }
            return reduced
        }, {})
        return visibleData
    }

    set error(error){
        if(error){
            this.errorNode.textContent = error
            this.errorNode.style.display = "block"
        } else {
            this.errorNode.style.display = "none"
        }
    }

    /**
     * Filters the original data and returns the remaining data
     * @returns {Promise<*>}
     */
    getFilteredData = async () => {
        let filteredData = await this.getData()
        for(const filter of Object.values(this.filters)) {
            filteredData = filter(filteredData)
        }
        return filteredData
    }

    reduceByKey = async (key, value) => {
        let data = await this.getFilteredData()
        let reducedData = Object.values(data).reduce((p, v) => {
            if(v[key] in p) {
                p[v[key]] += v[value]
            } else {
                p[v[key]] = v[value]
            }
            return p
        }, {})
        let sortedData = Object.entries(reducedData)
            .filter(([k,v]) => v > 0)
            .map(([k,v]) => {return {label: k, [value]: Math.round(v)}})
            .sort((a, b) => b[value] - a[value])
        return {
            labels: sortedData.map(x => x.label),
            data: sortedData.map(x => x[value])
        }
    }

}

class DataPage{
    constructor() {
        this.initialize()
    }

    /**
     * Initializes the project page objects
     *
     * Easier to do this all in an async environment so I can wait on data grabs
     * @returns {Promise<void>}
     */
    initialize = async () => {
        this.mode = undefined
        this.dataManager = new DataManager()

        let projectDisplayNode = document.getElementById("project-display")
        this.projectDisplay = new ProjectDisplay(projectDisplayNode)

        this.wrapper = document.getElementById("wrapper")
        this.table = new Table(this.wrapper, this.dataManager.getFilteredData, this.projectDisplay.update.bind(this.projectDisplay))
        this.dataManager.consumerToggles.push(this.table.update)

        this.search = new Search(Object.values(await this.dataManager.getData()), this.dataManager.toggleConsumers)
        this.dataManager.addFilter("search", this.search.filter)

        let urlProject = new URLSearchParams(window.location.search).get('project')
        if (urlProject) {
            this.projectDisplay.update((await this.dataManager.getData())[urlProject])
        }
    }
}

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

const project_page = new DataPage()

