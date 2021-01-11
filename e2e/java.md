## Install Java 8

From:
https://github.com/AdoptOpenJDK/homebrew-openjdk

```
$ brew tap AdoptOpenJDK/openjdk
$ brew install --cask <version>
```

See available versions at the link above, but you probably want `adoptopenjdk8`

## Setup jdk switching

This will enable you to switch between Java versions when you have multiple versions installed.

Add the following to `~/.zshrc` (or `~/.bashrc`):

```
jdk() {
  version=$1
  export JAVA_HOME=$(/usr/libexec/java_home -v"$version");
  java -version
}
```

run `source ~/.zshrc`

now you can switch jdk by typing `jdk <version>` (note that to get Java versions below 8 we type in 1.X) ie:

```
$ jdk 1.8
openjdk version "1.8.0_275"
OpenJDK Runtime Environment (AdoptOpenJDK)(build 1.8.0_275-b01)
OpenJDK 64-Bit Server VM (AdoptOpenJDK)(build 25.275-b01, mixed mode)
```

```
$ jdk 14
java version "14.0.2" 2020-07-14
Java(TM) SE Runtime Environment (build 14.0.2+12-46)
Java HotSpot(TM) 64-Bit Server VM (build 14.0.2+12-46, mixed mode, sharing)
```
