
const ProjectPage = () => {

    this.projects = undefined
    this.lunr_idx = undefined
    this.grid = undefined
    this.active_row = undefined
    this.display_card = document.getElementById("project-display")
    this.search_input = document.getElementById("project-search")
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
        }
    ]
    this.build_lunr_idx = async (data) => {

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
    this.build_table = (data) => {
        this.grid =  new gridjs.Grid({
            columns: columns,
            className: {
                container: "table-responsive",
                table: "table-hover table table-responsive",
                td: "pointer"
            },
            data: data
        }).render(document.getElementById("wrapper"));

        this.grid.on('rowClick', this.row_click);
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
    this.show_row = (row, project) => {
        row.classList.add("table-active")

        this.populate_card(project)

        this.display_card.hidden = false
    }
    this.hide_row = (row) => {
        if(this.active_row){
            row.classList.remove("table-active")
            this.display_card.hidden = true
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
    this.load_projects = async () => {

        let response;

        try{
            response = await fetch("http://127.0.0.1:5000/miscproject/json") // Todo
        } catch(error) {
            try{
                response = await fetch("TODO: Backup") // Todo
            } catch(error){
                console.error("Double Failure :/")
            }
        }

        let json = await response.json()

        this.projects = json

        let data = Object.values(json)


        this.build_table(data)
        this.build_lunr_idx(data)
    }
    this.initialize = () => {
        this.load_projects()
        this.search_input.addEventListener("input", e => this.search(e.currentTarget.value))
    }

    this.initialize()
}

const project_page = ProjectPage()
