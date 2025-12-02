# Useless Gaps

## _[looking for a new maintainer](https://github.com/mipmip/gnome-shell-extensions-useless-gaps/issues/45)_

https://user-images.githubusercontent.com/658612/199604411-f50fc915-ce67-432e-bdec-50d7eec8a9fb.mp4

Useless Gaps is a GNOME Shell Extension which for aesthetic purposes, adds
"useless gaps" around windows.

[<img src="./get-it-on-ego.png" height="100">](https://extensions.gnome.org/extension/4684/useless-gaps/)

This extension is intended to be used with Gnome's original Grid functions.
These functions are simple but very useful for most users.

The gaps will appear when a window is Tiled Left <kbd>Super</kbd> +
<kbd>Left</kbd>, Tiled Right <kbd>Super</kbd> +
<kbd>Right</kbd> or Maximized <kbd>Super</kbd> +
<kbd>Up</kbd>.

Better not use this extension together with a specialized tiling extension like
[Forge](https://extensions.gnome.org/extension/4481/forge/),
[gTile](https://extensions.gnome.org/extension/28/gtile/) or
[Tactile](https://extensions.gnome.org/extension/4548/tactile/).

## Features

- Gaps size is configurable
- Create useless gaps around maximized windows
- Create useless gaps around left and right split windows

## Development and manual install

After upgrading gnome-shell often complains about incompatibility issues. This is caused by version requirements set in src/metadata.json.

You can install the extension manually by cloning the repo and then run

```
git clone https://github.com/mipmip/gnome-shell-extensions-useless-gaps.git
cd gnome-shell-extensions-useless-gaps
./install.sh local-install
```

The update the metadata.json with the Gnome version you are running.

## Troubleshooting

**Auto-maximization issue**:

Sometimes when opening large applications, the window will be fully maximized without gaps.  This might be due to a setting in Gnome which is adjustable using the dconf editor:

`/org/gnome/mutter/auto-maximize` (defaults is `true`. If you're experiencing this issue, try setting this to `false`)

The description for the setting is `Auto maximize nearly monitor sized windows. If enabled, new windows that are initially the size of the monitor automatically get maximized.`

## Contributing

1. Fork it ( https://github.com/mipmip/gnome-shell-extensions-useless-gaps/fork )
1. Create your feature branch (git checkout -b my-new-feature)
1. Commit your changes (git commit -am 'Add some feature')
1. Push to the branch (git push origin my-new-feature)
1. Create a new Pull Request

## Credits

The idea of having useless gaps come from window managers like
[AwesomeWM](awesomewm.org) and
[DWM](https://dwm.suckless.org/patches/uselessgap/).

The extension
[maximize-to-empty-workspace](https://extensions.gnome.org/extension/3100/maximize-to-empty-workspace/)
served as a great example of how to listen to and act on maximized signals from
mutter.


### Install

You may need to restart GNOME (Alt + F2, r) before you see Shortcuts in your
list of extensions
