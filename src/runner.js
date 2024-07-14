const exec = require('@actions/exec');

module.exports = {execute_unity , getSerialFromLicenseFile};

async function execute(command, ignoreReturnCode) {
    let stdout = '';
    await exec.exec(command, [], {
        ignoreReturnCode: ignoreReturnCode, listeners: {stdout: buffer => stdout += buffer.toString()}
    });
    return stdout;
}

async function execute_unity(unityPath, args) {
    let linux = '';
    let default_cli = '-batchmode -nographics -quit';
    if (process.platform === 'linux') linux = 'xvfb-run --auto-servernum';
    return await execute(`${linux} "${unityPath}" ${default_cli} ${args}`, true);
}



function getSerialFromLicenseFile(license) {
    const startKey = `<DeveloperData Value="`;
    const endKey = `"/>`;
    const startIndex = license.indexOf(startKey) + startKey.length;

    if (startIndex < startKey.length) {
        throw new Error(`License File was corrupted, unable to locate serial`);
    }

    const endIndex = license.indexOf(endKey, startIndex);

    // Slice off the first 4 characters as they are garbage values
    return Buffer.from(license.slice(startIndex, endIndex), 'base64').toString('binary').slice(4);
}