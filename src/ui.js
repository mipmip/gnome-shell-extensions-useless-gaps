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

'use strict';

import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';

const Uuid = "useless-gaps@pimsnel.com".replace(/[^a-zA-Z]/g, '_');

/* exported ListGrid */
export var ListGrid = GObject.registerClass({
  GTypeName: 'Gjs_%s_UI_ListGrid'.format(Uuid),
} ,class ListGrid extends Gtk.Grid {
  _init() {
    super._init({
      hexpand: true,
      margin_end: 10,
      margin_top: 10,
      margin_start: 10,
      margin_bottom: 10,
      column_spacing: 18,
      row_spacing: 12,
    });
    this._count = 0;
  }

  _add(x, y, z) {
    this.attach(new Box().appends([x, y, z]), 0, this._count++, 2, 1);
    if(!(x instanceof Gtk.CheckButton)) return;
    if(y) x.bind_property('active', y, 'sensitive', GObject.BindingFlags.GET), y.set_sensitive(x.active);
    if(z) x.bind_property('active', z, 'sensitive', GObject.BindingFlags.GET), z.set_sensitive(x.active);
  }

  _att(x, y, z) {
    let r = this._count++;
    if(z) {
      this.attach(x, 0, r, 1, 1);
      this.attach(new Box().appends([y, z]), 1, r, 1, 1);
    } else if(y) {
      this.attach(x, 0, r, 1, 1);
      this.attach(y, 1, r, 1, 1);
    } else {
      this.attach(x, 0, r, 2, 1)
    }
  }
});

/* exported Box */
export var Box = GObject.registerClass({
  GTypeName: 'Gjs_%s_UI_Box'.format(Uuid),
}, class Box extends Gtk.Box {
  _init(params) {
    super._init();
    if(params?.margins) this.set_margins(params.margins);
    if(params?.spacing) this.set_spacing(params.spacing);
    if(params?.vertical) this.set_orientation(Gtk.Orientation.VERTICAL);
  }

  set_margins(margins) {
    let set_mgns = mgns => {
      this.set_margin_top(mgns[0]);
      this.set_margin_end(mgns[1]);
      this.set_margin_bottom(mgns[2]);
      this.set_margin_start(mgns[3]);
    };
    switch(margins.length) {
      case 4: set_mgns(margins); break;
      case 3: set_mgns(margins.concat(margins[1])); break;
      case 2: set_mgns(margins.concat(margins)); break;
      case 1: set_mgns(Array(4).fill(margins[0])); break;
    }
  }

  appends(widgets) {
    widgets.forEach(w => { if(w) this.append(w); });
    return this;
  }

  appendS(widgets) {
    widgets.forEach((w, i, arr) => {
      if(!w) return;
      this.append(w);
      if(!Object.is(arr.length - 1, i)) this.append(new Gtk.Separator());
    });
    return this;
  }
});

/* exported Frame */
export var Frame = GObject.registerClass({
  GTypeName: 'Gjs_%s_UI_Frame'.format(Uuid),
}, class Frame extends Gtk.Frame {
  _init(widget, label) {
    super._init({
      margin_end: 60,
      margin_top: 30,
      margin_start: 60,
      margin_bottom: 30,
    });

    this.set_child(widget);
    if(!label) return;
    this.set_label_widget(new Gtk.Label({ use_markup: true, label: '<b><big>' + label + '</big></b>', }));
  }
});

/* exported Check */
export var Check = GObject.registerClass({
  GTypeName: 'Gjs_%s_UI_Check'.format(Uuid),
}, class Check extends Gtk.CheckButton {
  _init(x, y) {
    super._init({
      label: x,
      hexpand: true,
      halign: Gtk.Align.START,
      tooltip_text: y ? y : '',
    });
  }
});

/* exported Label */
export var Label = GObject.registerClass({
  GTypeName: 'Gjs_%s_UI_Label'.format(Uuid),
}, class Label extends Gtk.Label {
  _init(x, y) {
    super._init({
      label: x,
      hexpand: true,
      halign: Gtk.Align.START,
      tooltip_text: y ? y : '',
    });
  }
});

/* exported LargeLabel */
export var LargeLabel = GObject.registerClass({
  GTypeName: 'Gjs_%s_UI_LargeLabel'.format(Uuid),
}, class LargeLabel extends Gtk.Label {
  _init(x, y) {
    super._init({
      label: '<span size="x-large">'+x+'</span>',
      use_markup: true,
      hexpand: true,
      halign: Gtk.Align.START,
      tooltip_text: y ? y : '',
    });
  }
});
