const fs = require('fs');
const envConfig = require('../config/env');
const ginga = require('./ginga');
const appState = require('./appState');

const userEvents = ["selection", "voiceRecognition", "handPoseRecognition", "faceExpressionRecognition",
    "eyeGaze", "touch"];

function validateAppId(appid) {
    return appid == ginga.appId;
}

function validateNodeId(nodeid) {
    return appState.hasNode(nodeid);
}

function validateTransition(nodeid, transition) {
    let node = appState.getNodeState(nodeid);
    return validateNodeTransition(node, transition);
}

function validateNodeTransition(node, transition) {
    if (transition.interface) {
        let interface = appState.getInterfaceState(node, transition.interface);
        return validateInterfaceTransition(node, interface, transition);
    }

    if (transition.eventType == "presentation") {
        return validateAction(transition.action, node.presentationEvent.state);
    }
    else if (transition.eventType == "preparation" && node.preparationEvent) {
        return validateAction(transition.action, node.preparationEvent.state);
    }
    else if (userEvents.indexOf(transition.eventType) > -1) {
        return node.presentationEvent.state == "occurring";
    }
    return false;
}

function validateInterfaceTransition(node, interface, transition) {
    if (interface.type == 'area') {
        if (transition.eventType == "presentation") {
            return validateAction(transition.action, interface.presentationEvent.state);
        }
        else if (transition.eventType == "preparation") {
            return validateAction(transition.action, interface.preparationEvent.state);
        }
    }
    else if (interface.type == 'property' && transition.eventType == "attribution") {
        return node.presentationEvent.state != 'sleeping';
    }
    return false;
}

function validateAction(action, state) {
    if (state == "sleeping") {
        return action == "start" || action == "set" || action == "select";
    }
    else if (state == "occurring") {
        return action == "stop" || action == "abort" || action == "pause"
    }
    else if (state == "paused") {
        return action == "stop" || action == "abort" || action == "resume"
    }
}

function generateResponse(action) {
    let node = appState.getNodeState(action.nodeid);
    action.transition = action.action;

    return appState.updateNodeState(node, action);
}

function sendActionToGinga(nodeid, transition) {
    let action = {
        nodeid: nodeid,
        eventType: transition.eventType
    };
    if (transition.interface && transition.eventType != "selection") {
        action.interface = transition.interface;
    }
    if (transition.value) action.value = transition.value;
    if (transition.user) action.user = transition.user;

    if (transition.action == "select" || transition.action == "set") {
        action.action = "starts";
        ginga.sendAction(action);
        action.action = "stops";
        ginga.sendAction(action);
    }
    else {
        action.action = transition.action + "s";
        ginga.sendAction(action);
    }

    return action;
}

module.exports = {
    validateAppId,
    validateNodeId,
    validateTransition,
    generateResponse,
    sendActionToGinga
}