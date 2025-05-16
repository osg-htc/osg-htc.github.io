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
        this.parentNode.addEventListener("hidden.bs.modal", () => {
            const url = new URL(window.location.href);
            url.searchParams.delete("repository")
            history.pushState({}, '', url)
        })
    }

    setUrl() {
        const url = new URL(window.location.href);
        url.searchParams.set("repository", this.id)
        history.pushState({}, '', url)
    }

    updateTextValue(className, value){
        [...this.parentNode.getElementsByClassName(className)].forEach(x => {
            x.innerHTML = value;
        });
    }

    updateBigNumberValue(id, value, label = null){
        const node = document.getElementById(id)

        // Check that the data exists
        if (!value) {

            // If you can see the parent
            if (!node.parentNode.parentNode.classList.contains("d-none")) {
                // If the value is empty, hide the parent
                node.parentNode.parentNode.classList.add("d-none")
            }

            return
        }

        // If there is a label swap it
        if (label) {
            node.nextElementSibling.innerText = label
        }

        node.innerText = value
        node.parentNode.parentNode.classList.remove("d-none")

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
       oneYearReads,
       publicObject,
       organizationUrl,
       id
    }) {
        this.id = id
        this.name = name;
        this.organization = organization;
        this.description = description;
        this.fieldOfScience = fieldOfScience;

        this.updateTextValue("data-name", name);
        this.updateTextValue("data-fieldOfScience", fieldOfScience);
        this.updateTextValue("data-description", description);
        this.updateTextValue("data-organization", organization)

        // If there is a organizationURL then make it a link
        if(organizationUrl) {
            this.updateTextValue("data-organization-url", `<a class="btn btn-secondary" href="${organizationUrl}" target="_blank">Read More</a>`)
        }

        // If there is a publicObject then update those pieces
        document.getElementById("data-public-object").style.display = publicObject ? "block" : "none"
        document.getElementById("data-pelican-download").innerText = `pelican object get osdf://${publicObject} ./`
        document.getElementById("data-browser-download").href = `https://osdf-director.osg-htc.org${publicObject}`
        document.getElementById("data-browser-download").innerText = `https://osdf-director.osg-htc.org${publicObject}`

        // Update the big value numbers
        let [readsValue, readsLabel] = formatBytes(oneYearReads, true)?.split(" ") || [null, null]
        if (oneYearReads < 1000000000) {
            readsValue = null
            readsLabel = null
        }
        this.updateBigNumberValue("oneYearReads", readsValue, readsLabel);

        this.updateBigNumberValue("numberOfDatasets", numberOfDatasets?.toLocaleString());

        let [sizeValue, sizeLabel] = formatBytes(size, true)?.split(" ") || [null, null]
        this.updateBigNumberValue("size", sizeValue, sizeLabel);

        this.setUrl();
        this.display_modal.show();
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
                formatter: (cell) => gridjs.html(`${cell}<i class="bi bi-box-arrow-up-right ms-2 mb-2"></i>`),
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
                id: 'organizationUrl',
                name: '',
                formatter: (cell, row, _) => {

                    const id = row["_cells"][0]['data']
                    const data = this.data_function()[id]

                    // If there is a dataRepostioryUrl then make it a link
                    if(data?.["repositoryUrl"]){
                        return gridjs.html(`<a class="btn btn-secondary" href="${data["repositoryUrl"]["url"]}" target="_blank">${data["repositoryUrl"]["label"] || "View Datasets"}</a>`)
                    }

                    return gridjs.html(`<a class="btn btn-outline-dark" href="${data["organizationUrl"]}" target="_blank">Learn More</a>`)
                },
                sort: false,
                attributes: {
                    className: "m-0"
                },
                width: "124px"
            },
        ]

        let table = this;
        this.grid =  new gridjs.Grid({
            columns: table.columns,
            search: true,
            className: {
                container: "",
                table: "table table-hover",
                td: "pointer",
                paginationButton: "mt-2 mt-sm-0"
            },
            data: () => {


                const order = (d) => {
                    return d?.rank * 100 + !!d?.publicObject * 10 + !!d?.size * 1 + !!d?.oneYearReads * 1 + !!d?.numberOfDatasets * 1
                }

                const data = Object.values(table.data_function())

                return data.sort((a, b) => order(b) - order(a))

            },
            pagination: {
                enabled: true,
                limit: 15
            },
            width: "970px",
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
            data: Object.values(table.data_function()).sort((a, b) => b.jobs - a.jobs)
        }).forceRender();
    }
    row_click = async (PointerEvent, e) => {
        let data = await this.data_function()
        let row_name = e["cells"][0].data
        let project = data[row_name]
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

    getData = () => {

        let data = {
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
    getFilteredData = () => {
        let filteredData = this.getData()
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

        let urlProject = new URLSearchParams(window.location.search).get('repository')
        if (urlProject) {
            this.projectDisplay.update((this.dataManager.getData()[urlProject]))
        }

        // Update the repository count
        document.getElementById("repository-count").innerText = Object.values(this.dataManager.getData()).length
        counter("connected", Object.values(this.dataManager.getData()).length, 20)
    }
}

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

const project_page = new DataPage()


let counter = async (id, endValue, numIncrements, decimals=0) => {
    let node = document.getElementById(id)

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
    counter("transferred", 127, 20)
    counter("delivered", 129, 20)
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
