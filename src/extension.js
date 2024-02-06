/*********************************************************************
 * Useless Gaps is Copyright (C) 2021-2024 Pim Snel
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

import { Extension, gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";
import Meta from 'gi://Meta';

const _handles = [];
const _windowids_size_change = {};

export default class UselessGapsExtension extends Extension {

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

  addWindowMargins(window){
    const rects = this.getRectangles(window);

    const newWidth = rects.window.w - (this.gapSize*2) - this.marginLeft - this.marginRight;
    const newHeight = rects.window.h - (this.gapSize*2) - this.marginTop - this.marginBottom;

    const xStart = this.marginLeft + rects.workspace.x + this.gapSize;
    const yStart = this.marginTop + rects.workspace.y + this.gapSize;


    if (window.get_maximized() === Meta.MaximizeFlags.BOTH){
      window.unmaximize(Meta.MaximizeFlags.BOTH);
      window.move_resize_frame(false, xStart, yStart, newWidth, newHeight);
    }
  }

  addSplitWindowMargins(window){

    const rects = this.getRectangles(window);

    let yStart = this.marginTop + rects.workspace.y + this.gapSize;
    let newHeight = rects.window.h - (this.gapSize*2) - this.marginTop - this.marginBottom;

    let xStart;
    let newWidth = rects.window.w - (this.gapSize*3/2) - (this.marginLeft/2) - (this.marginRight/2);

    // LEFT WINDOW
    if(rects.workspace.x === rects.window.x){
      xStart = this.marginLeft + this.gapSize + rects.window.x;
    }
    // RIGHT WINDOW
    else{
      xStart = rects.window.x + rects.window.w - this.marginRight - this.gapSize - newWidth;
    }

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
      if (win.get_maximized() === Meta.MaximizeFlags.BOTH)
      {
        //  global.log("uselessgaps change","=== Meta.MaximizeFlags.BOTH");
        _windowids_size_change[win.get_id()]="gapmax";
      }
      else if(win.get_maximized() === Meta.MaximizeFlags.VERTICAL){
        _windowids_size_change[win.get_id()]="gapvert";

      }
    }
  }
  window_manager_size_changed(act)
  {
    const win = act.meta_window;

    if (win.get_id() in _windowids_size_change) {
      if (!this.noGapsForMaximizedWindows && _windowids_size_change[win.get_id()]=="gapmax") {
        delete _windowids_size_change[win.get_id()];
        this.addWindowMargins(win);
      }
      else if (_windowids_size_change[win.get_id()]=="gapvert") {
        delete _windowids_size_change[win.get_id()];
        this.addSplitWindowMargins(win);
      }
    }
  }

  initSettings(){
    this.gapSize = this._settings.get_int("gap-size");
    this.noGapsForMaximizedWindows = this._settings.get_boolean("no-gap-when-maximized");
    this.marginTop = this._settings.get_int("margin-top");
    this.marginBottom = this._settings.get_int("margin-bottom");
    this.marginLeft = this._settings.get_int("margin-left");
    this.marginRight = this._settings.get_int("margin-right");
  }

  enable() {
    this._settings = this.getSettings();
    this._settings.connect("changed::gap-size", ()=>{this.initSettings();} );
    this._settings.connect("changed::no-gap-when-maximized", ()=>{this.initSettings();} );
    this._settings.connect("changed::margin-top", ()=>{this.initSettings();} );
    this._settings.connect("changed::margin-bottom", ()=>{this.initSettings();} );
    this._settings.connect("changed::margin-left", ()=>{this.initSettings();} );
    this._settings.connect("changed::margin-right", ()=>{this.initSettings();} );
    this.initSettings();

    _handles.push(global.window_manager.connect('size-changed', (_, act) => {this.window_manager_size_changed(act);}));
    _handles.push(global.window_manager.connect('size-change', (_, act, change,rectold) => {this.window_manager_size_change(act,change,rectold);}));
  }

  disable() {
    this._settings = null;
    _handles.splice(0).forEach(h => global.window_manager.disconnect(h));
  }
}

