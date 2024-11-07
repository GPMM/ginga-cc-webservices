const fs = require('fs');
const envConfig = require('../config/env');

var nodes = null;
var idMap = {};

function setNodes(appNodes) {
    nodes = appNodes;

    for (let i = 0; i < nodes.length; i++) {
        idMap[nodes[i].id] = i;
        for (let j = 0; j < nodes[i].interfaces.length; j++) {
            idMap[nodes[i].id + '.' + nodes[i].interfaces[j].id] = j;
        }
    }

    saveState();
}

function hasNode(nodeid) {
    return idMap[nodeid] !== undefined;
}

function getNodeState(nodeid) {
    if (!hasNode(nodeid))
        return null;

    return nodes[idMap[nodeid]];
}

function getInterfaceState(node, interface) {
    let index =idMap[node.id + '.' + interface];
    return node.interfaces[index];
}

function updateAppState(t) {
    let index = idMap[t.nodeid];
    let node = nodes[index];
    nodes[index] = updateNodeState(node, t);

    saveState();
}

function updateNodeState(node, t) {
    if (t.interface) {
        let index =idMap[node.id + '.' + t.interface];
        let interface = node.interfaces[index];
        node.interfaces[index] = updateInterfaceState(interface, t);
    }
    else {
        if (t.eventType == "presentation") {
            node.presentationEvent = updateEventState(node.presentationEvent, t.transition);
        }
        else if (t.eventType == "preparation") {
            node.preparationEvent = updateEventState(node.preparationEvent, t.transition);
        }
    }
    
    return node;
}

function updateInterfaceState(interface, t) {
    if (interface.type == 'area') {
        if (t.eventType == "presentation") {
            interface.presentationEvent = updateEventState(interface.presentationEvent, t.transition);
        }
        else if (t.eventType == "preparation") {
            interface.preparationEvent = updateEventState(interface.preparationEvent, t.transition);
        }
    }
    return interface;
}

function updateEventState(event, transition) {
    let state = event.state;
    event.state = changeState(state, transition);
    event.occurrences = incrementOccurrences(event.occurrences, state, transition);
    return event;
}

function changeState(state, transition) {
    if (state == "sleeping" && transition == "starts"){
        return "occurring";
    }
    else if ((state == "occurring" || state == "paused") && (transition == "stops" || transition == "aborts")) {
        return "sleeping";
    }
    else if (state == "occurring" && transition == "pauses") {
        return "paused";
    }
    else if (state == "paused" && transition == "resumes") {
        return "occurring";
    }
    else {
        return state;
    }
}

function incrementOccurrences(occurrences, state, transition) {
    if ((state == "occurring" || state == "paused") && transition == "stops") {
        
        return (Number(occurrences) + 1).toString();
    }
    return occurrences;
}

function saveState() {
    fs.writeFile(envConfig.client.appStateFilePath,
		JSON.stringify(nodes, null, 4),
		'utf8',
		(err) => {
		   if (err) throw err;
		   console.log('saved state');
		});
}

module.exports = {
    setNodes,
    hasNode,
    getNodeState,
    getInterfaceState,
    updateAppState,
    updateNodeState
}