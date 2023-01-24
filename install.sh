#!/usr/bin/env bash

set -e

if [ "$UID" = "0" ]; then
    echo 'This should not be run as root'
    exit 101
fi

NAME=useless-gaps\@pimsnel.com

function pack-extension {
echo "Packing extension..."
gnome-extensions pack src \
  --force \
  --podir="../po" \
  --extra-source="ui.js" \
  --extra-source="../LICENSE" \
  --extra-source="../CHANGELOG.md"
}

function compile-preferences {
    if [ -d src/schemas ]; then
        echo 'Compiling preferences...'
        glib-compile-schemas --targetdir=src/schemas src/schemas
    else
        echo 'No preferences to compile... Skipping'
    fi
}

function usage() {
    echo 'Usage: ./install.sh COMMAND'
    echo 'COMMAND:'
    echo "  local-install  install the extension in the user's home directory"
    echo '                 under ~/.local'
    echo '  zip            Creates a zip file of the extension'
}

case "$1" in
    "local-install" )
        pack-extension
        gnome-extensions install --force $NAME.shell-extension.zip
        ;;

    "zip" )
        pack-extension
        ;;

    * )
        usage
        ;;
esac
exit
