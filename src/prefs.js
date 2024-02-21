/*********************************************************************
 * Useless Gaps is Copyright (C) 2021-2024 Pim Snel
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

import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import * as UI from './ui.js'

export default class UselessGapsPrefs extends ExtensionPreferences {

  getPreferencesWidget() {
    const settings = this.getSettings();
    const widget = new UselessGapsPrefsWidget(settings);
    return widget;
  }
}

const UselessGapsPrefsWidget = new GObject.Class({
  Name: 'Shortcuts.Prefs.Widget',
  GTypeName: 'UselessGapsPrefsWidget',
  Extends: Gtk.ScrolledWindow,

   _init: function(settings) {

    this.parent(
      {
        valign: Gtk.Align.FILL,
        vexpand: true
      }
    );

    this._settings = settings;

    this.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);

    this._grid = new UI.ListGrid();

    this.set_child(new UI.Frame(this._grid));

    let mainSettingsLabel = new UI.LargeLabel("Main Settings");
    this._grid._add(mainSettingsLabel)

    this._spinGapsize = new Gtk.SpinButton;
    this._spinGapsize.set_range(0, 300);
    this._spinGapsize.set_increments(1, 1);

    let label_gapsize = new UI.Label('Gap Size')
    this._grid._add(label_gapsize, this._spinGapsize);

    this._settings.bind("gap-size", this._spinGapsize, "value", Gio.SettingsBindFlags.DEFAULT);

    let noGapsForMaximizedWindowsCheckBox = new UI.Check("No gaps for maximized windows");
    this._settings.bind('no-gap-when-maximized', noGapsForMaximizedWindowsCheckBox, 'active', Gio.SettingsBindFlags.DEFAULT);
    this._grid._add(noGapsForMaximizedWindowsCheckBox);

    this._spinMarginTop = new Gtk.SpinButton;
    this._spinMarginTop.set_range(0, 300);
    this._spinMarginTop.set_increments(1, 1);

    let label_margin_top = new UI.Label('Extra margin top')
    this._grid._add(label_margin_top, this._spinMarginTop);

    this._settings.bind("margin-top", this._spinMarginTop, "value", Gio.SettingsBindFlags.DEFAULT);

    this._spinMarginBottom = new Gtk.SpinButton;
    this._spinMarginBottom.set_range(0, 300);
    this._spinMarginBottom.set_increments(1, 1);

    let label_margin_bottom = new UI.Label('Extra margin bottom')
    this._grid._add(label_margin_bottom, this._spinMarginBottom);

    this._settings.bind("margin-bottom", this._spinMarginBottom, "value", Gio.SettingsBindFlags.DEFAULT);

    this._spinMarginLeft = new Gtk.SpinButton;
    this._spinMarginLeft.set_range(0, 300);
    this._spinMarginLeft.set_increments(1, 1);

    let label_margin_left = new UI.Label('Extra margin left')
    this._grid._add(label_margin_left, this._spinMarginLeft);

    this._settings.bind("margin-left", this._spinMarginLeft, "value", Gio.SettingsBindFlags.DEFAULT);

    this._spinMarginRight = new Gtk.SpinButton;
    this._spinMarginRight.set_range(0, 300);
    this._spinMarginRight.set_increments(1, 1);

    let label_margin_right = new UI.Label('Extra margin right')
    this._grid._add(label_margin_right, this._spinMarginRight);

    this._settings.bind("margin-right", this._spinMarginRight, "value", Gio.SettingsBindFlags.DEFAULT);
  }
});
