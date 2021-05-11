const {execSync} = require('child_process');

const ArtifactPathBuilder = require('detox/src/artifacts/utils/ArtifactPathBuilder');

function getCurrentGitBranch() {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
    if (err) {
      return 'Unknown';
    } else if (typeof stdout === 'string') {
      return stdout;
    }
  });
  return `${branch}`.replace(/\//g, '@').trim();
}

class CustomPathBuilder extends ArtifactPathBuilder {
  constructor({rootDir}) {
    super({rootDir});
    this._rootDir = `${this._rootDir}`.replace(/\b\./g, `.${getCurrentGitBranch()}.`);
  }
}

module.exports = CustomPathBuilder;
