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

const ExtensionUtils = imports.misc.extensionUtils;
const Meta = imports.gi.Meta;
const GLib = imports.gi.GLib;

const _handles = [];
const _windowids_size_change = {};

class Extension {

  constructor() {
  }

  getRectangles(window) {
    const rect = window.get_frame_rect();
    const monitor = window.get_monitor();
    const workspace = window.get_workspace();
    const monitorWorkArea = workspace.get_work_area_for_monitor(monitor);

    return {
      window: {
        x: rect.x,
        y: rect.y,
        h: rect.height,
        w: rect.width,
      },
      /*      workspace: {
        x: monitorWorkArea.x,
        y: monitorWorkArea.y,
        h: monitorWorkArea.height,
        w: monitorWorkArea.width,
      },
      */
      newBoth: {
        x: monitorWorkArea.x + this.gapSize,
        y: monitorWorkArea.y + this.gapSize,
        h: monitorWorkArea.height - (this.gapSize * 2),
        w: monitorWorkArea.width - (this.gapSize * 2),
      },
      newVert: {
        xleft: monitorWorkArea.x + this.gapSize,
        xright: (monitorWorkArea.width / 2 ) + (this.gapSize / 2),
        y: monitorWorkArea.y + this.gapSize,
        h: monitorWorkArea.height - (this.gapSize * 2),
        w: (monitorWorkArea.width / 2) - (this.gapSize * 1.5),
      }
    };
  }

  addWindowMargins(window){
    const rects = this.getRectangles(window);
    window.unmaximize(Meta.MaximizeFlags.BOTH);
    window.move_resize_frame(false, rects.newBoth.x, rects.newBoth.y, rects.newBoth.w, rects.newBoth.h);
  }

  addSplitWindowMargins(window){

    const rects = this.getRectangles(window);
    let xStart

    if(rects.window.x <= this.gapSize){
      xStart = rects.newVert.xleft;
    }
    else{
      xStart = rects.newVert.xright;
    }

    window.unmaximize(Meta.MaximizeFlags.BOTH);
    window.move_resize_frame(false, xStart, rects.newVert.y, rects.newVert.w, rects.newVert.h);
  }

  window_manager_size_change(act, change, rectold)
  {
    const win = act.meta_window;

    if (win.window_type !== Meta.WindowType.NORMAL)
      return;

    if (change === Meta.SizeChange.MAXIMIZE)
    {
      this.check_and_mark_maximized(win);
    }
  }

  window_created(win)
  {
    if (win == null) {
      return;
    }
    if (win.window_type !== Meta.WindowType.NORMAL){
      return;
    }

    const rects = this.getRectangles(win);

    if(rects.window.h >= rects.newBoth.h && rects.window.w >= rects.newBoth.w){
      win.maximize(Meta.MaximizeFlags.BOTH);

      GLib.timeout_add(GLib.PRIORITY_DEFAULT, 500, () => {
        win.unmaximize(win.get_maximized());
        win.move_resize_frame(false, rects.newBoth.x, rects.newBoth.y, rects.newBoth.w, rects.newBoth.h);
      });
    }
    else if(rects.window.h >= rects.newBoth.h && rects.window.y <= rects.newBoth.y){
      this.addSplitWindowMargins(win);
    }
  }

  window_manager_size_changed(act)
  {
    const win = act.meta_window;
    this.window_do_resize(win);
  }

  check_and_mark_maximized(win){
    if (win.get_maximized() === Meta.MaximizeFlags.BOTH)
    {
      _windowids_size_change[win.get_id()]="gapmax";
    }
    else if(win.get_maximized() === Meta.MaximizeFlags.VERTICAL){
      _windowids_size_change[win.get_id()]="gapvert";
    }
  }

  window_do_resize(win){

    if (win.get_id() in _windowids_size_change) {
      if (_windowids_size_change[win.get_id()]=="gapmax") {
        delete _windowids_size_change[win.get_id()];
        this.addWindowMargins(win);
      }
      else if (_windowids_size_change[win.get_id()]=="gapvert") {
        delete _windowids_size_change[win.get_id()];
        this.addSplitWindowMargins(win);
      }
    }
  }

  setGapSize(){
    this.gapSize = this._settings.get_int("gap-size");
  }

  enable() {
    this._settings = ExtensionUtils.getSettings();
    this._settings.connect("changed::gap-size", ()=>{this.setGapSize();} );
    this.setGapSize();

    _handles.push(global.display.connect('window-created', (_, act) => {this.window_created(act);}));
    _handles.push(global.window_manager.connect('size-changed', (_, act) => {this.window_manager_size_changed(act);}));
    _handles.push(global.window_manager.connect('size-change', (_, act, change,rectold) => {this.window_manager_size_change(act,change,rectold);}));
  }

  disable() {
    this._settings = null;
    _handles.splice(0).forEach(h => global.window_manager.disconnect(h));
  }
}

function init() {
  return new Extension();
}
