/*********************************************************************
 * Useless Gaps is Copyright (C) 2021 Pim Snel
 *
 * Useless Gaps is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Useless Gaps is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Useless Gaps.  If not, see <http://www.gnu.org/licenses/>.
 **********************************************************************/

const Gettext = imports.gettext;
const ExtensionUtils = imports.misc.extensionUtils;
const Shell = imports.gi.Shell;
const Meta = imports.gi.Meta;
const Main = imports.ui.main;

let _settings;

/* exported init */
function init() {
  ExtensionUtils.initTranslations();
}

/* exported enable */
/* Enables the plugin by adding listeners and icons as necessary */
function enable() {

  _settings = ExtensionUtils.getSettings();
  _settings.connect("changed::gap-size", _gapSizeChanged );

  //Main.wm.setCustomKeybindingHandler('maximize', Shell.ActionMode.NORMAL, maximize);
  let flag = Meta.KeyBindingFlags.IGNORE_AUTOREPEAT;
  Main.wm.addKeybinding("keybinding-withgaps-maximize",_settings, flag, Shell.ActionMode.NORMAL, () => {
    maximize();
  })

  _gapSizeChanged();

}

/* Removes all traces of the listeners and icons that the extension created */
/* exported disable */
function disable() {
  _setting = null;
  let mode = Shell.ActionMode ? Shell.ActionMode : Shell.KeyBindingMode;
  //Main.wm.setCustomKeybindingHandler('maximize', Shell.ActionMode.NORMAL, Lang.bind(Main.wm, Main.wm._startSwitcher));
  Main.wm.removeKeybinding("keybinding-show-popup");
}

function _gapSizeChanged(){
  let gapSize = _settings.get_int("gap-size");
  log("gab size changed"+gapSize.toString());
}

function maximize()(){
  let gapSize = _settings.get_int("gap-size");
  log("maxize with gapsize "+gapSize.toString());
}

function unmaximaze(){
  let gapSize = _settings.get_int("gap-size");
  log("unmaxize with gapsize "+gapSize.toString());
}




