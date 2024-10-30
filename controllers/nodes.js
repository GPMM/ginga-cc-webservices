var Errors = require("../models/errors");
const nodesService = require('../service/nodes');

const acceptedActions = ["start", "stop", "abort", "pause", "resume", "select", "set"];
const acceptedEvents = ["presentation", "preparation", "attribution", "selection", "voiceRecognition",
    "handPoseRecognition", "faceExpressionRecognition", "eyeGaze", "touch"];

const defaultActions = ["start", "stop", "abort", "pause", "resume"];
const userEvents = ["selection", "voiceRecognition", "handPoseRecognition", "faceExpressionRecognition",
    "eyeGaze", "touch"];

exports.POSTNodes = (req, res, next) => {
    const appId = req.params.appid;
    const nodeId = req.params.nodeid;
    const body = req.body;

    if (check101(body)) res.status(400).json(Errors.getError(101));
    if (check105(body)) res.status(400).json(Errors.getError(105));
    if (!nodesService.validateAppId(appId)) res.status(400).json(Errors.getError(305));
    if (!nodesService.validateNodeId(nodeId)) res.status(400).json(Errors.getError(305));

    // Build the complete transition for checking other errors and executing it
    let transition = buildTransition(body);
    console.log(transition);

    // If “eventType” has the value ‘attribution’ or "action" is 'set', the “value” field shall be
    // specified with the value to be assigned
    if (transition.eventType == "attribution" && !transition.value) {
        res.status(400).json(Errors.getError(101));
    }
    if (transition.eventType == "attribution" && !transition.interface) {
        res.status(400).json(Errors.getError(105));
    }

    // If "eventType" has the values 'selection, voiceRecognition, handPoseRecognition,
    // faceExpressionRecognition, eyeGaze, touch', the "key" field shall be specified with the corresponding
    // key_value
    if (userEvents.indexOf(transition.eventType) > -1 && !transition.value) {
        res.status(400).json(Errors.getError(101));
    }

    // if the combination of “action” and “eventType” is not applicable.
    if (transition.eventType != "selection" && transition.action == "select") {
        res.status(400).json(Errors.getError(101));
    }
    if (transition.eventType != "attribution" && transition.action == "set") {
        res.status(400).json(Errors.getError(101));
    }
    // the “action” cannot be performed due to the node’s current state or other preconditions
    if (!nodesService.validateTransition(nodeId, transition)) {
        res.status(400).json(Errors.getError(101));
    }

    // executes the transition sending actions to Ginga
    nodesService.sendActionToGinga(nodeId, transition);
    
    // build the response
    response = nodesService.generateResponse(nodeId, transition);
    res.status(200).json(response);
};

function check101(body) {
    // the message body is not a valid JSON object
    if (!body) return true;

    // the value of “eventType”, “action”, “interface”, “value”, "key" or “user” is not a string
    if (body.eventType && typeof body.eventType != "string") return true;
    if (body.action && typeof body.action != "string") return true;
    if (body.interface && typeof body.interface != "string") return true;
    if (body.value && typeof body.value != "string") return true;
    if (body.user && typeof body.user != "string") return true;

    // the value of “action” is different from “start”, “stop”, “pause”, “resume”, “abort”, "select", "set”
    if (body.action && acceptedActions.indexOf(body.action) == -1) return true;

    // the value of “eventType” is different from “presentation”, “preparation”, “attribution”, “selection”, “voiceRecognition”, “handPoseRecognition”, “faceExpressionRecognition”, “eyeGaze” or “touch”
    if (body.eventType && acceptedEvents.indexOf(body.eventType) == -1) return true;

    // the “interface” value contains the characters ‘<’, ‘&’ or ‘”’
    if (body.interface && body.interface.includes('<')) return true;
    if (body.interface && body.interface.includes('&')) return true;
    if (body.interface && body.interface.includes('"')) return true;

    return false;
}

function check105(body) {
    if (body.eventType == "attribution" && !value) return true;
    if (userEvents.indexOf(body.eventType) > -1 && !value) return true;
    return false;
}

function buildTransition(body) {
    let transition = {};

    /* Where "eventType" specifies the corresponding event type for the action to be performed.
    If it is not specified, it is assumed to be "presentation", if action is "start, stop, pause,
    resume, abort" */
    if (body.eventType) {
        transition.eventType = body.eventType;
    }
    else if (defaultActions.indexOf(body.action) != -1) {
        transition.eventType = "presentation";
    }
    else if (body.action == "select") {
        transition.eventType = "selection";
    }
    else if (body.action == "set") {
        transition.eventType = "attribution";
    }

    /* “action” specifies the control action to be performed */
    transition.action = body.action;

    /* “interface” identifies the anchor, port, or property on which the action will be performed,
    in accordance with Annex A */
    if (body.interface) {
        transition.interface = body.interface;
    }

    /* "user" specifies the user id that has interacted if eventType is '"selection, voiceRecognition,
    handPoseRecognition, faceExpressionRecognition, eyeGaze, touch'" or if "action" is 'select' */
    if (body.user && userEvents.indexOf(transition.eventType) > -1) {
        transition.user = body.user;
    }

    /* If “eventType” has the value ‘attribution’ or "action" is 'set', the “value” field shall be
    specified with the value to be assigned */
    if (transition.eventType == "attribution") {
        transition.value = body.value;
    }

    /* If "eventType" has the values 'selection, voiceRecognition, handPoseRecognition, 
    faceExpressionRecognition, eyeGaze, touch', the "key" attribute shall be specified in the value
    “field”. */
    if (userEvents.indexOf(transition.eventType) > -1) {
        transition.value = body.value;
    }

    if (transition.eventType == "selection" && !body.value) {
        transition.value = "ENTER";
    }

    return transition;
}