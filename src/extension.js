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
      workspace: {
        x: monitorWorkArea.x,
        y: monitorWorkArea.y,
        h: monitorWorkArea.height,
        w: monitorWorkArea.width,
      },
    };
  }

  addWindowMargins(win){
    const rects = this.getRectangles(win);
    global.log(JSON.stringify(rects));
    const xStart = rects.workspace.x + this.gapSize;
    const yStart = rects.workspace.y + this.gapSize;
    const newWidth = rects.window.w - (this.gapSize*2);
    const newHeight = rects.window.h - (this.gapSize*2);

    win.unmaximize(Meta.MaximizeFlags.BOTH);

    /*
    GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
      win.move_resize_frame(false, xStart, yStart, newWidth, newHeight);
      //metaWindow.move_resize_frame(false, x, y, width, height);
      return GLib.SOURCE_REMOVE;
    });
    */

    win.move_resize_frame(false, xStart, yStart, newWidth, newHeight);
    global.log('new margins window-created', win.title);
    global.log('newHeight', newHeight);
    global.log('newWidth', newWidth);
    global.log('gapSize', this.gapSize);
  }

  addSplitWindowMargins(window){

    const rects = this.getRectangles(window);
    let xStart, newWidth;

    if(rects.window.x > 0){
      xStart = rects.window.x;
      newWidth = rects.window.w - this.gapSize;
    }
    else{
      xStart = rects.window.x + this.gapSize;
      newWidth = rects.window.w - (this.gapSize*2);
    }

    const yStart = rects.window.y + this.gapSize;
    const newHeight = rects.window.h - (this.gapSize*2);

    window.unmaximize(Meta.MaximizeFlags.BOTH);
    window.move_resize_frame(false, xStart, yStart, newWidth, newHeight);
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
    //const win = act1;
    //let win = global.display.focus_window;
    if (win == null) {
      return;
    }
    if (win.window_type !== Meta.WindowType.NORMAL){
      return;
    }

    const rects = this.getRectangles(win);

    //global.log(JSON.stringify(rects));

    global.log(rects.window.h);
    global.log(rects.workspace.h);

    if(rects.window.h === rects.workspace.h && rects.window.w === rects.workspace.w){
      global.log("reiszing");
      _windowids_size_change[win.get_id()]="gapmax";
      this.window_do_resize(win);
    }

    //this.check_and_mark_maximized(win);
  }


  window_manager_size_changed(act)
  {
    const win = act.meta_window;
    this.window_do_resize(win);
  }

  check_and_mark_maximized(win){
    //global.log(win.get_maximized() );
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

    _handles.push(global.display.connect('window-created', (act1, act) => {this.window_created(act);}));
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
