## Syncing with upstream

Upstream repo [CovidShield mobile](https://github.com/CovidShield/mobile)

#### To pull in all upstream changes

```
git remote add upstream git@github.com:CovidShield/mobile.git
git pull upstream master
```
or
```
git remote add upstream https://github.com/CovidShield/mobile.git
git pull upstream master
```

<hr>

### Cherry-pick a PR from upstream

Find the upstream pull request you want to pull in i.e. https://github.com/CovidShield/mobile/pull/147

1) **Create a new branch**

```
git checkout -b upstream-147
```

2) **Cherry pick the commits from the upstream pull request**

```
git cherry-pick 375efbfc87c79c3abc5f216aa1ce9571ddc7008a
git cherry-pick 095d659b9d9d9bc26ac60159421bce27294e000a
git cherry-pick 81d99c34049f7dd4fd98549ab71b811a1e12e214
```

3) **Test the updates**
4) **Push up the new branch**

```
git push origin upstream-147
```

5) **Create a pull request**
