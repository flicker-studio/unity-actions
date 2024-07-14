const core = require('@actions/core');
const fs = require('fs')
const path = require('path')

const {execute_unity, getSerialFromLicenseFile} = require("./runner");

function activate_cli() {
    let cli = '';

    const username = core.getInput('unity-username', {required: true});
    const password = core.getInput('unity-password', {required: true});

    cli += ` -username "${username}" -password "${password}"`;

    let serial = core.getInput('unity-serial', {required: false});
    const license = core.getInput('unity-license', {required: false});

    if (serial) {

    } else if (license) {
        serial = getSerialFromLicenseFile(license);
    } else {
        throw new Error('serial or license is not found !');
    }


    cli += ` -serial ${serial}`;


    return cli;
}

async function activate() {
    const unityPath = core.getInput('unity-path', {required: true});
    if (!unityPath) throw new Error('Unity path not found');

    let action_cli = activate_cli();

    const projectPath = core.getInput('project-path', {required: true});
    if (!projectPath) throw new Error('Project path is null!')
    action_cli += ` -projectPath "${projectPath}"`;

    const executeMethod = core.getInput('execute-method');
    if (executeMethod) action_cli += ` -executeMethod "${executeMethod}`;

    const stdout = await execute_unity(unityPath, `${action_cli}`);

    if (!stdout.includes('Next license update check is after')) {
        //  throw new Error('Activation failed');
    }
}

async function run() {
    try {
        await activate();
    } catch (error) {
        core.setFailed(error.message);
    }
}

run().then(() => {
});
