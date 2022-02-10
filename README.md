# Useless Gaps

Useless Gaps is a GNOME Shell Extension which for aesthetic purposes adds
"useless gaps" around windows.

This extension is intended to be used with Gnome's orininal Grid functions.
These functions are simple, but very useful for most users.

The gaps will appear when a window is Tiled Left <kbd>Super</kbd> +
<kbd>Left</kbd>, Tiled Right <kbd>Super</kbd> +
<kbd>Right</kbd> or Maximized <kbd>Super</kbd> +
<kbd>Up</kbd>.

Better not use this extension together with a specialized tiling extension like
[Forge](https://extensions.gnome.org/extension/4481/forge/),
[gTile](https://extensions.gnome.org/extension/28/gtile/) or
[Tactile](https://extensions.gnome.org/extension/4548/tactile/).

In Gnome 3.38 the gaps size can only be set with dconf.

```
dconf write /org/gnome/shell/extensions/useless-gaps/gap-size 25
```

## Features

- Gaps size is configurable
- Create useless gaps around maximized windows
- Create useless gaps around left and right split windows

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
served as great example how to listen to and act on maximized signals from
mutter.
