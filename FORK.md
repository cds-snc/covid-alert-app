## Syncing with upstream

[CovidShield mobile](https://github.com/CovidShield/mobile)

### Setting the upstream

If you want to pull upstream merges to keep this repository in sync you can do that through the following `git` commands:

```
git remote add upstream git@github.com:CovidShield/mobile.git
git pull upstream master
```

or

```
git remote add upstream https://github.com/CovidShield/mobile.git
git pull upstream master
```

### Setting the upstream

git checkout -b upstream-147

### Cherry-pick a PR from upstream

Find the upstream pull request you want to pull in

i.e. https://github.com/CovidShield/mobile/pull/147

Create a new branch

```
git checkout -b upstream-147
```

Cherry pick the commits from the upstream pull request

```
git cherry-pick 375efbfc87c79c3abc5f216aa1ce9571ddc7008a
git cherry-pick 095d659b9d9d9bc26ac60159421bce27294e000a
git cherry-pick 81d99c34049f7dd4fd98549ab71b811a1e12e214
```

- Test the updates
- Push up the new branch

```
git push origin upstream-147
```

- Create a pull request
