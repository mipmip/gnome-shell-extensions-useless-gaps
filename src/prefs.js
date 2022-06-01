/*********************************************************************
 * Useless Gaps is Copyright (C) 2021, 2022 Pim Snel
 *
 * Useless Gaps is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation
 *
 * Useless Gaps is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Useless Gaps.  If not, see <http://www.gnu.org/licenses/>.
 **********************************************************************/

const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const Gettext = imports.gettext;
const _ = Gettext.gettext;

const Config = imports.misc.config;
const shellVersion = parseFloat(Config.PACKAGE_VERSION);

if(shellVersion >= 40){

  const ExtensionUtils = imports.misc.extensionUtils;
  const Me = ExtensionUtils.getCurrentExtension();
  const UI = Me.imports.ui;
  const _settings = ExtensionUtils.getSettings();

  /**
   * Initialises the preferences widget
   */
  /* exported init */
  function init() {
    ExtensionUtils.initTranslations();
  }

  /**
   * Builds the preferences widget
   */
  /* exported buildPrefsWidget */
  function buildPrefsWidget() {

    let widget = new UselessGapsPrefsWidget();
    return widget;
  }


  /**
   * Describes the widget that is shown in the extension settings section of
   * GNOME tweek.
   */
  const UselessGapsPrefsWidget = new GObject.Class({
    Name: 'Shortcuts.Prefs.Widget',
    GTypeName: 'UselessGapsPrefsWidget',
    Extends: Gtk.ScrolledWindow,

    /**
     * Initalises the widget
     */
    _init: function() {
      this.parent(
        {
          valign: Gtk.Align.FILL,
          vexpand: true
        }
      );

      this.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);

      this._grid = new UI.ListGrid();

      this.set_child(new UI.Frame(this._grid));

      let mainSettingsLabel = new UI.LargeLabel("Main Settings");
      this._grid._add(mainSettingsLabel)

      this._spin = new Gtk.SpinButton;
      this._spin.set_range(0, 300);
      this._spin.set_increments(1, 1);

      let label_gapsize = new UI.Label('Gap Size')
      this._grid._add(label_gapsize, this._spin);

      _settings.bind("gap-size", this._spin, "value", Gio.SettingsBindFlags.DEFAULT);

      let noGapsForMaximizedWindowsCheckBox = new UI.Check("No gaps for maximized windows");
      _settings.bind('no-gap-when-maximized', noGapsForMaximizedWindowsCheckBox, 'active', Gio.SettingsBindFlags.DEFAULT);
      this._grid._add(noGapsForMaximizedWindowsCheckBox);
    }
  });


}
else{
  function buildPrefsWidget() {
    let widget = new MyPrefsWidget();
    widget.show_all();
    return widget;
  }

  const MyPrefsWidget = GObject.registerClass(
    class MyPrefsWidget extends Gtk.ScrolledWindow{
      _init(params){

        super._init(params);
        this.label = new Gtk.Label({
          label: "Set Gap Size with dconf, e.g.:\n\n   dconf write /org/gnome/shell/extensions/useless-gaps/gap-size 25 \n\n\n",
          halign: Gtk.Align.FILL
        });
        this.add_with_viewport(this.label);
      }

    }
  )

  function init(){}


}



