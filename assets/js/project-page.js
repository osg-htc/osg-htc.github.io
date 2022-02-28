const columns = [{
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
}]

const get_projects = async () => {
    let response = await fetch("https://topology.opensciencegrid.org/miscproject/json", {mode:"no-cors"})
    console.log(response)
    let data = await response.json()

    console.log(data)

    new gridjs.Grid({
        columns: columns,
        data: [data]
    }).render(document.getElementById("wrapper"));;

}

console.log()

new gridjs.Grid({
    columns: columns,
    data: []
}).render(document.getElementById("wrapper"));

get_projects()