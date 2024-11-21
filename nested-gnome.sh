#!/bin/sh -e

export G_MESSAGES_DEBUG=error
# export MUTTER_DEBUG_DUMMY_MODE_SPECS=1366x768
export SHELL_DEBUG=error

dbus-run-session -- \
    gnome-shell --nested \
                --wayland
