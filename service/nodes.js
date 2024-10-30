const fs = require('fs');
const envConfig = require('../config/env');
const ginga = require('./ginga');

function getNodeState(nodeid) {
	let rawdata = fs.readFileSync(envConfig.client.appStateFilePath);
	let json_file = JSON.parse(rawdata);

    for (let index = 0; index < json_file.nodes.length; index++) {
        if (json_file.nodes[index].id != nodeid) continue;

        return json_file.nodes[index];
    }

	return null;
}

function validateAppId(appid) {
    return appid == ginga.appId;
}

function validateNodeId(nodeid) {
    return getNodeState(nodeid) != null;
}

function validateTransition(nodeid, transition) {
    let node = getNodeState(nodeid);

    if (transition.eventType == "presentation" && node.presentationEvent) {
        return validateAction(transition.action, node.presentationEvent.state);
    }
    else if (transition.eventType == "preparation" && node.preparationEvent) {
        return validateAction(transition.action, node.preparationEvent.state);
    }
    else if (transition.eventType == "attribution" && node.attributionEvent
            && node.presentationEvent && node.presentationEvent.state == "occurring") {
        return validateAction(transition.action, node.attributionEvent.state);
    }
    else if (transition.eventType == "selection" && node.selectionEvent
            && node.presentationEvent && node.presentationEvent.state == "occurring") {
        return validateAction(transition.action, node.selectionEvent.state);
    }
    else if (transition.eventType == "voiceRecognition" && node.voiceRecognitionEvent
            && node.presentationEvent && node.presentationEvent.state == "occurring") {
        return validateAction(transition.action, node.voiceRecognitionEvent.state);
    }
    else if (transition.eventType == "handPoseRecognition" && node.handPoseRecognitionEvent
            && node.presentationEvent && node.presentationEvent.state == "occurring") {
        return validateAction(transition.action, node.handPoseRecognitionEvent.state);
    }
    else if (transition.eventType == "faceExpressionRecognition" && node.faceExpressionRecognitionEvent
            && node.presentationEvent && node.presentationEvent.state == "occurring") {
        return validateAction(transition.action, node.faceExpressionRecognitionEvent.state);
    }
    else if (transition.eventType == "eyeGaze" && node.eyeGazeEvent
            && node.presentationEvent && node.presentationEvent.state == "occurring") {
        return validateAction(transition.action, node.eyeGazeEvent.state);
    }
    else if (transition.eventType == "touch" && node.touchEvent
            && node.presentationEvent && node.presentationEvent.state == "occurring") {
        return validateAction(transition.action, node.touchEvent.state);
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

function generateResponse(nodeid, transition) {
    let node = getNodeState(nodeid);

    if (transition.eventType == "presentation") {
        node.presentationEvent.state = changeState(transition.action, node.presentationEvent.state);
        node.presentationEvent.occurrences += incrementOccurrences(transition.action, node.presentationEvent.state);
    }
    else if (transition.eventType == "preparation") {
        node.preparationEvent.state = changeState(transition.action, node.preparationEvent.state);
        node.preparationEvent.occurrences += incrementOccurrences(transition.action, node.preparationEvent.state);
    }
    else if (transition.eventType == "attribution") {
        node.attributionEvent.state = changeState(transition.action, node.attributionEvent.state);
        node.attributionEvent.occurrences += incrementOccurrences(transition.action, node.attributionEvent.state);
        node.attributionEvent.value = transition.value;
    }
    else if (transition.eventType == "selection") {
        node.selectionEvent.state = changeState(transition.action, node.selectionEvent.state);
        node.selectionEvent.occurrences += incrementOccurrences(transition.action, node.selectionEvent.state);
    }
    else if (transition.eventType == "voiceRecognition") {
        node.voiceRecognitionEvent.state = changeState(transition.action, node.voiceRecognitionEvent.state);
        node.voiceRecognitionEvent.occurrences += incrementOccurrences(transition.action, node.voiceRecognitionEvent.state);
    }
    else if (transition.eventType == "handPoseRecognition") {
        node.handPoseRecognitionEvent.state = changeState(transition.action, node.handPoseRecognitionEvent.state);
        node.handPoseRecognitionEvent.occurrences += incrementOccurrences(transition.action, node.handPoseRecognitionEvent.state);
    }
    else if (transition.eventType == "faceExpressionRecognition") {
        node.faceExpressionRecognitionEvent.state = changeState(transition.action, node.faceExpressionRecognitionEvent.state);
        node.faceExpressionRecognitionEvent.occurrences += incrementOccurrences(transition.action, node.faceExpressionRecognitionEvent.state);
    }
    else if (transition.eventType == "eyeGaze") {
        node.eyeGazeEvent.state = changeState(transition.action, node.eyeGazeEvent.state);
        node.eyeGazeEvent.occurrences += incrementOccurrences(transition.action, node.eyeGazeEvent.state);
    }
    else if (transition.eventType == "touch") {
        node.touchEvent.state = changeState(transition.action, node.touchEvent.state);
        node.touchEvent.occurrences += incrementOccurrences(transition.action, node.touchEvent.state);
    }

    return node;
}

function changeState(action, state) {
    if (state == "sleeping" && action == "start"){
        return "occurring";
    }
    else if ((state == "occurring" || state == "paused") && 
        (action == "stop" || action == "abort" || action == "pause")) {
        return "sleeping";
    }
    else if (state == "occurring" && action == "pause") {
        return "paused";
    }
    else if (state == "paused" && action == "resume") {
        return "occurring";
    }
    else {
        return state;
    }
}

function incrementOccurrences(action, state) {
    if (state == "sleeping" && (action == "set" || action == "select")) {
        return 1;
    }
    else if ((state == "occurring" || state == "paused") && action == "stop") {
        
        return 1;
    }
    return 0;
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
        action.action = "start";
        ginga.sendAction(action);
        action.action = "stop";
        ginga.sendAction(action);
    }
    else {
        action.action = transition.action;
        ginga.sendAction(action);
    }
}

module.exports = {
    validateAppId,
    validateNodeId,
    validateTransition,
    generateResponse,
    sendActionToGinga
}