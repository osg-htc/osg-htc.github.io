---
    layout: blank
---

const ProjectPage = () => {

    this.projects = undefined
    this.lunr_idx = undefined
    this.grid = undefined
    this.active_row = undefined
    this.data = undefined
    this.search_input = document.getElementById("project-search")
    this.display_card = document.getElementById("project-display")
    this.display_modal = new bootstrap.Modal(document.getElementById("project-display"), {
        keyboard: false
    })
    this.columns = [
        {
            id: 'Name',
            name: 'Name'
        }, {
            id: 'PIName',
            name: 'PI Name'
        }, {
            id: 'Organization',
            name: 'Organization'
        }, {
            id: 'FieldOfScience',
            name: 'Field Of Science'
        }, {
            id: "Department",
            name: "Department",
            hidden: true
        }, {
            id: "Description",
            name: "Description",
            hidden: true
        }, {
            id: "ID",
            name: "ID",
            hidden: true
        }, {
            id:  "Organization",
            name: "Organization",
            hidden: true
        }, {
            id: "ResourceAllocations",
            name: "Resource Allocations",
            hidden: true
        }
    ]
    this.build_table = async () => {

        let project_page_save = this

        this.grid =  new gridjs.Grid({
            columns: columns,
            sort: true,
            className: {
                container: "table-responsive",
                table: "table",
                td: "pointer",
                paginationButton: "mt-2 mt-sm-0"
            },
            data: async () => {
                let projects = await project_page_save.get_projects()
                project_page_save.build_lunr_idx()
                return Object.values(projects)
            },
            pagination: {
                enabled: true,
                limit: 50,
                buttonsCount: 1
            }
        }).render(document.getElementById("wrapper"));

        this.grid.on('rowClick', this.row_click);
    }
    this.build_lunr_idx = async () => {

        let data = Object.values(this.projects)

        this.lunr_idx = lunr(function () {
            this.ref('Name')
            this.field('Department')
            this.field('Description')
            this.field('FieldOfScience')
            this.field('ID')
            this.field('Name')
            this.field('Organization')
            this.field('PIName')
            this.field('ResourceAllocations')

            data.forEach(function (doc) {
                this.add(doc)
            }, this)
        })
    }
    this.search = (input) => {
        let table_keys = this.lunr_idx.search(input).map(r => r.ref)

        this.filter_table_by_keys(table_keys)
    }
    this.filter_table_by_keys = (keys) => {

        let data = keys.map(key => this.projects[key])

        this.grid.updateConfig({
            data: data
        }).forceRender();
    }
    this.toggle_row = (toggled_row, project) => {
        let previously_active_row = this.active_row
        this.hide_row(this.active_row)
        if(!toggled_row.isEqualNode(previously_active_row)){
            this.show_row(toggled_row, project)
            this.active_row = toggled_row
        }
    }
    this.show_row = async (row, project) => {
        row.classList.add("table-active")

        this.populate_card(project)

        this.display_modal.show()
    }
    this.hide_row = () => {
        if(this.active_row){
            this.active_row.classList.remove("table-active")
            this.display_modal.hide()
        }
        this.active_row = undefined
    }
    this.populate_card = (project) => {
        this.display_card.getElementsByClassName("project-Name")[0].textContent = project["Name"]
        this.display_card.getElementsByClassName("project-PIName")[0].textContent = project["PIName"]
        this.display_card.getElementsByClassName("project-FieldOfScience")[0].textContent = project["FieldOfScience"]
        this.display_card.getElementsByClassName("project-Organization")[0].textContent = project["Organization"]
        this.display_card.getElementsByClassName("project-Description")[0].textContent = project["Description"]
    }
    this.row_click = async (PointerEvent, e) => {
        let row_name = e["cells"][0].data
        let project = this.projects[row_name]
        this.toggle_row(PointerEvent.currentTarget, project)
    }
    this.get_projects = async () => {
        if( this.projects ){ return this.projects }
        await this.load_projects()
        return this.projects
    }
    this.load_projects = async () => {

        if( this.projects ){ return }

        let response;

        try{
            response = await fetch("https://topology.opensciencegrid.org/miscproject/json")
        } catch(error) {
            try{
                response = await fetch("{{ '/assets/data/project.json' | relative_url }}")
            } catch(error){
                console.error("Topology and Back Up data fetch failed: " + error)
            }
        }

        let json = await response.json()

        this.projects = json
    }
    this.initialize = async () => {
        this.build_table()
        this.search_input.addEventListener("input", e => this.search(e.currentTarget.value))
        this.display_card.addEventListener('hidden.bs.modal', () => this.hide_row())
    }

    this.initialize()
}

const project_page = ProjectPage()
