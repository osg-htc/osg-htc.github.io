// This is run on all the pages

// Compute children

let child_watchers = document.getElementsByClassName("watch-child-height")

for(const node of child_watchers){
    node.style.height = node.getElementsByClassName("watch-parent-height")[0].offsetHeight + "px"
}