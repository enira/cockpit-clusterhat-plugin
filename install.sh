#!/bin/bash

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit
fi

PKG_OK=$(dpkg-query -W --showformat='${Status}\n' cockpit | grep "install ok installed")
   
if [ "" == "$PKG_OK" ]; then
    echo "Cockpit is not installed, please install cockpit first."
    exit
else
    version=`apt-cache policy cockpit | grep -i "Installed" | awk '{ print $2 }' | awk -F'-' '{ print $1 }'`
    echo "Installed version: $version"
    mkdir /usr/share/cockpit/clusterhat
    wget https://raw.githubusercontent.com/enira/cockpit-clusterhat-plugin/master/manifest.json -O /usr/share/cockpit/clusterhat/manifest.json
    wget https://raw.githubusercontent.com/enira/cockpit-clusterhat-plugin/master/clusterhat.js -O /usr/share/cockpit/clusterhat/clusterhat.js
    wget https://raw.githubusercontent.com/enira/cockpit-clusterhat-plugin/master/index.html -O /usr/share/cockpit/clusterhat/index.html
    wget https://raw.githubusercontent.com/enira/cockpit-clusterhat-plugin/master/clusterhat.css.gz -O /usr/share/cockpit/clusterhat/clusterhat.css.gz      
fi
