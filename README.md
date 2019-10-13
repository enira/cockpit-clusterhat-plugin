# What does this plugin do?
This plugin is an extension to the [Cockpit Project](https://cockpit-project.org/). It allows you to manage your clusterhat machines through the Cockpit Project user interface.

![image](https://raw.githubusercontent.com/enira/cockpit-clusterhat-plugin/master/doc/image.png)


# Requirements
- A Raspberry Pi cluster hat
- Some Pi Zero's

## Compatibility

Compatible with the following images:

- ClusterCTRL-2019-07-10-lite-4-CBRIDGE
- ClusterCTRL-2019-07-10-lite-4-CNAT
- ClusterCTRL-2019-07-10-lite-4-p[1-4]
- SD cardless boot

Download at: https://dist1.8086.net/clusterctrl/buster/

## Cockpit Project
As this is a Cockpit plugin, you will need that as well. (The automatic install script will check this.)
WARNING: the package 'cockpit' installs the 'modemmanager' package which will destroy the booting of Raspberry Pi's from the clusterhat. When installing, use the following command to block the installation of modemmanager.
```
sudo apt-get install cockpit modemmanager-
```

# Installation

## Automatic install 
Just run the following command to let a script to download the files and install the software.
```
wget -O - https://raw.githubusercontent.com/enira/cockpit-clusterhat-plugin/master/install.sh | sudo bash
```

## Manual install
Run as root:
```
mkdir /usr/share/cockpit/clusterhat
wget https://raw.githubusercontent.com/enira/cockpit-clusterhat-plugin/master/manifest.json -O /usr/share/cockpit/clusterhat/manifest.json
wget https://raw.githubusercontent.com/enira/cockpit-clusterhat-plugin/master/clusterhat.js -O /usr/share/cockpit/clusterhat/clusterhat.js
wget https://raw.githubusercontent.com/enira/cockpit-clusterhat-plugin/master/index.html -O /usr/share/cockpit/clusterhat/index.html
wget https://raw.githubusercontent.com/enira/cockpit-clusterhat-plugin/master/clusterhat.css.gz -O /usr/share/cockpit/clusterhat/clusterhat.css.gz      
```

# Version 

Version log:
- 2: update for multiple IPs
- 1: first release

# License
Simple, it's GNU General Public License v2.1