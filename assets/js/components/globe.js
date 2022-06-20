---
    layout: blank
---

import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as topojson from 'https://cdn.skypack.dev/topojson';
import {transpose} from "../util.js";

import {icons} from "../organization-page.js";

class Icon {
    static size = [30, 45]
    static icons = {}
    static getIcon(icon) {
        if (icon in Icon.icons) {
            return Icon.icons[icon]
        }
        let image = new Image()
        image.src = icons[icon]?.options?.iconUrl
        Icon.icons[icon] = image
        return image
    }
}

class CollaborationGlobe {

    constructor(canvas_id, collaboration) {
        this.globe = new GlobeVisualization(canvas_id, this.render)
        this.collaboration = collaboration
        this.initiateScrollSpy()

    }

    initiateScrollSpy = () => {
        document.addEventListener('scroll', (e) => {
            this.lastKnownScrollPosition = window.scrollY;
            let ticking;

            if (!ticking) {
                window.requestAnimationFrame(() => {

                    // Check that the map is centered on the screen
                    let boundingRect = this.globe.canvas.getBoundingClientRect()
                    if(window.innerHeight - (boundingRect.height + boundingRect.y) > boundingRect.y){
                        this.globe.canvas.classList.add("center")
                        console.log(this.lastKnownScrollPosition)
                    }

                    ticking = false
                });

                ticking = true;
            }
        });
    }

    centerMap = () => {

    }

    render = () => {

        if(true){
            let points = this.collaboration.ces.map(ce => [ce.longitude, ce.latitude])

            this.globe.context.beginPath(), this.globe.geoPath({type: "MultiPoint", coordinates: points}), this.globe.context.fillStyle = "#D100C5", this.globe.context.fill();

            points.forEach( c => {
                c = this.globe.projection(c)
                let adjusted_coordinates = [c[0] - Icon.size[0]/2, c[1] - Icon.size[1]]

                this.globe.context.drawImage(Icon.getIcon('greenIcon'), ...adjusted_coordinates, ...Icon.size)
            })
        }

    }
}


class GlobeVisualization {

    constructor(canvas_id, renderFunction) {
        this.canvas = document.getElementById(canvas_id);
        this.canvas.height = this.canvas.offsetHeight
        this.canvas.width = this.canvas.offsetWidth
        this.projection = d3["geoNaturalEarth1"]().translate([this.canvas.width/2,this.canvas.height/2]).scale(this.canvas.width/6).precision(0.1)
        this.context = this.canvas.getContext('2d');
        this.geoPath = d3.geoPath(this.projection, this.context);
        this.topo = undefined
        this.renderFunction = renderFunction
        this.initialize()
    }

    initialize = async () => {
        this.frame_generator = this.globe()
        this.topo = await this.get_topo("110")
        this.create_frame()
        this.get_topo("50").then(d => this.topo = d)
    }

    create_frame = () => {
        this.frame_generator.next()
        setTimeout(() => this.create_frame(), 10)
    }

    * globe() {const render = () => {
            this.context.clearRect(0, 0, 1920, 1080);
            this.context.beginPath(), this.geoPath(this.sphere), this.context.fillStyle = "#f1f1f1", this.context.fill();
            this.context.beginPath(), this.geoPath(this.topo), this.context.fillStyle = "#5a5a5a", this.context.fill();

            this.renderFunction()

            return this.context.canvas
        }

        while(true){
            yield render(this.topo)
        }

        return d3.select(this.context.canvas).node();
    }

    sphere = {type: "Sphere"}

    get_topo = async (resolution) => {
        return await fetch(`{{ '/assets' | relative_url }}/data/land-${resolution}m.json`).then(t => t.json()).then(j => topojson.feature(j, j.objects.land))
    }
}

class Arc {
    constructor(duration, lines) {
        this.submit_locations = lines.map(p => p[0])
        this.host_locations = lines.map(p => p[1])
        this.interpolated_points = lines.map(p => d3.geoInterpolate(p[0], p[1]))
        this.startTime = Date.now()
        this.duration = duration
        this.lines = lines
    }

    get_arc(){
        let t_dx = (Date.now() - this.startTime) / this.duration;
        let arcs;

        if( t_dx < .5 ){
            arcs = transpose([
                this.submit_locations,
                this.interpolated_points.map(ip => ip(t_dx * 2))
            ])
        } else if (t_dx < 1) {
            arcs = transpose([
                this.interpolated_points.map(ip => ip((t_dx - .5) * 2)),
                this.host_locations
            ])
        }  else {
            return [null, null, null]
        }
        return [this.submit_locations, this.host_locations, arcs]
    }
}

export {GlobeVisualization, CollaborationGlobe}