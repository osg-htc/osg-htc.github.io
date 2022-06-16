import {GlobeVisualization} from "./components/globe.js";
import {Collaborations} from "../organization-page.js";

const main = async () => {
    const collaborations = new Collaborations()
    await collaborations.initializeASYNC()

    const collaboration =


    const globe = new GlobeVisualization("globe", institutions, ces, aps)
}

