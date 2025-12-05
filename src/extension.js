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

    /* Compatibility helper: older GNOME exposes get_maximized() returning
   * Meta.MaximizeFlags, newer versions may instead provide boolean helpers
   * or different method names. Feature-detect and normalize to flags so the
   * rest of the code can continue to use Meta.MaximizeFlags checks.
   */
  _getMaximizedFlags(win) {
    try {
      if (typeof win.get_maximized === 'function') {
        return win.get_maximized();
      }

      // Newer APIs may have boolean checks; combine them into flags.
      let flags = 0;
      if (typeof win.get_maximized_horizontally === 'function' && win.get_maximized_horizontally())
        flags |= Meta.MaximizeFlags.HORIZONTAL;
      if (typeof win.get_maximized_vertically === 'function' && win.get_maximized_vertically())
        flags |= Meta.MaximizeFlags.VERTICAL;

      // Some versions expose is_maximized or similar
      if (typeof win.is_maximized === 'function' && win.is_maximized())
        flags = Meta.MaximizeFlags.BOTH;

      return flags;
    }
    catch (e) {
      // If anything unexpected, assume not maximized
      return 0;
    }
  }

  addWindowMargins(window){
    const rects = this.getRectangles(window);

    const newWidth = rects.window.w-(this.gapSize*2)-this.marginLeft-this.marginRight;
    const newHeight = rects.window.h-(this.gapSize*2)-this.marginTop-this.marginBottom;
    
    const xStart = this.marginLeft + rects.workspace.x + this.gapSize;
    const yStart = this.marginTop + rects.workspace.y + this.gapSize;
 
    if (this._getMaximizedFlags(window) === Meta.MaximizeFlags.BOTH) {
      window.unmaximize();
      window.move_resize_frame(false, xStart, yStart, newWidth, newHeight);
    }
  }

  addSplitWindowMargins(window){

    const rects = this.getRectangles(window);
    
    const yStart = this.marginTop + rects.workspace.y + this.gapSize;
    const newHeight = rects.workspace.h-(this.gapSize*2)-this.marginTop-this.marginBottom;
    const newWidth = (rects.workspace.w/2)-(this.gapSize*3/2)-(this.marginLeft/2)-(this.marginRight/2);

    // LEFT WINDOW: window center is left of workspace center
    if (rects.window.x+(rects.window.w/2)<workspaceMidX) {
      xStart = rects.workspace.x+this.marginLeft+this.gapSize;
    }
    // RIGHT WINDOW
    else {
      xStart = workspaceMidX+(this.gapSize/2);
    }

    window.unmaximize();
    window.move_resize_frame(false, xStart, yStart, newWidth, newHeight);
  }


  window_manager_size_change(act, change, rectold)
  {
    const win = act.meta_window;

    if (win.window_type !== Meta.WindowType.NORMAL)
      return;

    // Mark all size changes, we'll determine the type in size-changed
    _windowids_size_change[win.get_id()] = true;
  }
  window_manager_size_changed(act)
  {
    const win = act.meta_window;
    const winId = win.get_id();

    if (!(winId in _windowids_size_change))
      return;

    delete _windowids_size_change[winId];

    const maxFlags = this._getMaximizedFlags(win);

    // Full maximize
    if (maxFlags === Meta.MaximizeFlags.BOTH) {
      if (!this.noGapsForMaximizedWindows) {
        this.addWindowMargins(win);
      }
      return;
    }

    // Tiled (left/right)
    if (maxFlags === Meta.MaximizeFlags.VERTICAL || maxFlags === Meta.MaximizeFlags.HORIZONTAL) {
      this.addSplitWindowMargins(win);
      return;
    }

    // Fallback: geometry check
    try {
      const rect = win.get_frame_rect();
      const workspace = win.get_workspace();
      const monitorWorkArea = workspace.get_work_area_for_monitor(win.get_monitor());

      const heightFull = rect.height >= monitorWorkArea.height*0.95;
      const widthHalf = rect.width >= monitorWorkArea.width*0.45 && rect.width <= monitorWorkArea.width*0.55;

      if (heightFull && widthHalf) {
        this.addSplitWindowMargins(win);
      }
    } catch (e) { }
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

