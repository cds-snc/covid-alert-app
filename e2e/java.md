# Java setup

## jdk switching (optional)

This is useful but not required for the Detox tests to run. From your current terminal session, it lets you switch between Java versions, when you have multiple versions installed.

Add the following to `~/.zshrc` (or `~/.bashrc`):

```bash
jdk() {
  version=$1
  export JAVA_HOME=$(/usr/libexec/java_home -v"$version");
  java -version
}
```

run `source ~/.zshrc`

## Installing Java 8

https://github.com/AdoptOpenJDK/homebrew-openjdk

see available versions at the link above, but you probably want `adoptopenjdk8`

```bash
brew tap AdoptOpenJDK/openjdk

brew install --cask <version>
```

now you can switch jdk by typing `jdk <version>` (to get Java versions below 8, we type 1.X ) example:

```bash
$ jdk 1.8
openjdk version "1.8.0_275"
OpenJDK Runtime Environment (AdoptOpenJDK)(build 1.8.0_275-b01)
OpenJDK 64-Bit Server VM (AdoptOpenJDK)(build 25.275-b01, mixed mode)
```

```bash
$ jdk 14
java version "14.0.2" 2020-07-14
Java(TM) SE Runtime Environment (build 14.0.2+12-46)
Java HotSpot(TM) 64-Bit Server VM (build 14.0.2+12-46, mixed mode, sharing)
```
