---
    layout: blank
---

const ProjectPage = () => {
    this.mode = undefined
    this.lunr_idx = undefined
    this.grid = undefined
    this.active_row = undefined
    this.data = undefined
    this.wrapper = document.getElementById("wrapper")
    this.search_input = document.getElementById("project-search")
    this.display_card = document.getElementById("project-display")
    this.display_modal = new bootstrap.Modal(document.getElementById("project-display"), {
        keyboard: false
    })
    this.template_card = document.getElementById("template-card")
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
                table: "table table-hover",
                td: "pointer",
                paginationButton: "mt-2 mt-sm-0"
            },
            data: async () => {
                let projects = await project_page_save.get_searched_project_array()
                project_page_save.build_lunr_idx()
                return projects
            },
            pagination: {
                enabled: true,
                limit: 50,
                buttonsCount: 1
            }
        }).render(project_page_save.wrapper);

        this.grid.on('rowClick', this.row_click);
    }
    this.build_cards = async () => {
        this.remove_wrapper_children()

        let projects = await this.get_searched_project_array()
        for(const project of projects){
            let clone = this.template_card.cloneNode(true)
            clone.removeAttribute('id')

            this.populate_node(project, clone)

            let card_key = project['Name'].replace(/\s|\./g, '')

            clone.setAttribute("href", "#" + card_key)
            clone.setAttribute("aria-controsl", card_key)
            clone.getElementsByClassName("project-Description-container")[0].setAttribute("id", card_key)

            this.wrapper.appendChild(clone)

            clone.hidden = false
        }
        this.build_lunr_idx()
    }
    this.build_lunr_idx = async () => {

        if(this.lunr_idx){return}

        let data = await this.get_searched_project_array()

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
    this.search = () => {
        if(this.mode == "mobile"){
            this.build_cards()
        } else {
            this.update_table_data()
        }
    }
    this.update_table_data = () => {

        let data = this.get_searched_project_array

        this.grid.updateConfig({
            data: data
        }).forceRender();
    }
    this.remove_wrapper_children = () => {
        while(this.wrapper.hasChildNodes()){
            this.wrapper.removeChild(this.wrapper.firstChild)
        }
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

        this.populate_node(project, this.display_card)

        this.display_modal.show()
    }
    this.hide_row = () => {
        if(this.active_row){
            this.active_row.classList.remove("table-active")
            this.display_modal.hide()
        }
        this.active_row = undefined
    }
    this.populate_node = (project, node) => {
        node.getElementsByClassName("project-Name")[0].textContent = project["Name"]
        node.getElementsByClassName("project-PIName")[0].textContent = project["PIName"]
        node.getElementsByClassName("project-FieldOfScience")[0].textContent = project["FieldOfScience"]
        node.getElementsByClassName("project-Organization")[0].textContent = project["Organization"]
        node.getElementsByClassName("project-Description")[0].textContent = project["Description"]

    }
    this.row_click = async (PointerEvent, e) => {
        let row_name = e["cells"][0].data
        let project = this.projects[row_name]
        this.toggle_row(PointerEvent.currentTarget, project)
    }
    this.get_searched_project_array = async () => {

        if(this.search_input.value == ""){
            return Object.values(await this.get_projects())
        }

        let table_keys = this.lunr_idx.search(this.search_input.value).map(r => r.ref)

        return table_keys.map(key => this.projects[key])
    }
    this.get_projects = async () => {

        if( this.projects ){ return this.projects }

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

        this.projects = await response.json()

        return this.projects
    }
    this.populate_wrapper = () => {
        let new_mode = window.innerWidth < 576 ? "mobile" : "desktop";
        if( new_mode != this.mode){
            this.mode = new_mode

            this.remove_wrapper_children()

            if(this.mode == "mobile"){
                this.build_cards()
            } else {
                this.build_table()
            }
        }
    }
    this.initialize = async () => {
        this.populate_wrapper()
        this.search_input.addEventListener("input", this.search)
        this.display_card.addEventListener('hidden.bs.modal', () => this.hide_row())
        this.window.addEventListener("resize", () => this.populate_wrapper())
    }

    this.initialize()
}

const project_page = ProjectPage()
