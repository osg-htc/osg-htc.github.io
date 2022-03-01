---
    layout: blank
---

const ProjectPage = () => {

    this.projects = undefined
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
    this.build_table = (data) => {
        this.grid =  new gridjs.Grid({
            columns: columns,
            sort: true,
            search: true,
            className: {
                container: "table-responsive",
                table: "table-hover table table-responsive",
                td: "pointer"
            },
            data: data,
            pagination: {
                enabled: true,
                limit: 50,
            }
        }).render(document.getElementById("wrapper"));

        this.grid.on('rowClick', this.row_click);
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

        this.display_card.hidden = false
        await this.display_card.scrollIntoView();
        window.scrollTo(0, 0);
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

        let data = Object.values(json)


        this.build_table(data)
    }
    this.initialize = () => {
        this.load_projects()
    }

    this.initialize()
}

const project_page = ProjectPage()
