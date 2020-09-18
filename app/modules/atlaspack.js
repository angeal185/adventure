

function Rect(x, y, w, h) {
  this.x = x; this.y = y;
  this.w = w; this.h = h;
}

Rect.prototype = {
  fitsIn(outer) {
    return outer.w >= this.w && outer.h >= this.h;
  },
  sameSizeAs(other) {
    return this.w === other.w && this.h === other.h;
  }
}

function Atlas(x, y, w, h) {
  if (arguments.length === 1) {
    this.canvas = x;
    x = y = 0;
    w = this.canvas.width;
    h = this.canvas.height;
  }
  if (arguments.length === 2) {
    w = x; h = y; x = y = 0;
  }
  this.left = this.right = null;
  this.rect = new Rect(x, y, w, h);
  this.filled = false;
  this.tilepad = false;
  this._cache = [];
  this._uvcache = Object.create(null);
}


Atlas.prototype = {
  pack(rect) {
    this._cache = [];
    this._uvcache = Object.create(null);
    rect = this._toRect(rect);

    if (this.img && this.tilepad) {
      rect = this._tilepad(rect);
    }

    if (this.left !== null) {
      return this._ontoCanvas(this.left.pack(rect) || this.right.pack(rect));
    }
    // if atlas filled or wont fit
    if (this.filled || !rect.fitsIn(this.rect)) {
      return false;
    }
    // if this atlas has been filled
    if (rect.sameSizeAs(this.rect)) {
      this.filled = true;
      return this._ontoCanvas(this);
    }
    if ((this.rect.w - rect.w) > (this.rect.h - rect.h)) {
      this.left = new Atlas(this.rect.x, this.rect.y, rect.w, this.rect.h);
      this.right = new Atlas(this.rect.x + rect.w, this.rect.y, this.rect.w - rect.w, this.rect.h);
    } else {
      this.left = new Atlas(this.rect.x, this.rect.y, this.rect.w, rect.h);
      this.right = new Atlas(this.rect.x, this.rect.y + rect.h, this.rect.w, this.rect.h - rect.h);
    }
    return this._ontoCanvas(this.left.pack(rect));
  },
  expand(rect) {
    let self = this;
    rect = this._toRect(rect);

    if (this.img && this.tilepad) {
      rect = this._tilepad(rect);
    }

    let atlas;
    if (this.rect.w < this.rect.h) {
      atlas = new Atlas(0, 0, this.rect.w + rect.w, this.rect.h);
      atlas.right = new Atlas(this.rect.w, 0, rect.w, this.rect.h);
      atlas.left = this;
    } else {
      atlas = new Atlas(0, 0, this.rect.w, this.rect.h + rect.h);
      atlas.right = new Atlas(0, this.rect.h, this.rect.w, rect.h);
      atlas.left = this;
    }

    ['canvas', 'context', 'img'].forEach(function(p) {
      if (self[p]) {
        atlas[p] = self[p];
        self[p] = null;
      }
    });

    // resize canvas
    if (atlas.canvas) {
      if (!atlas.context) {
        atlas.context = atlas.canvas.getContext('2d');
      }
      let old = atlas.context.getImageData(0, 0, atlas.canvas.width, atlas.canvas.height);
      atlas.canvas.width = atlas.rect.w;
      atlas.canvas.height = atlas.rect.h;
      atlas.context.putImageData(old, 0, 0);
    }

    return (atlas.pack(rect) === false) ? atlas.expand(rect) : atlas;
  },
  index() {
    let self = this;
    if (self._cache.length > 0) {
      return self._cache;
    }
    (function loop(atlas) {
      if (atlas.left !== null) {
        loop(atlas.left);
        loop(atlas.right);
      } else if (atlas.rect.name) {
        self._cache.push(atlas.rect);
      }
    }(self));
    return self._cache;
  },
  uv(w, h) {
    let self = this;
    w = w || self.rect.w;
    h = h || self.rect.h;
    let isPad = this.tilepad;
    (function loop(atlas) {
      if (atlas.left !== null) {
        loop(atlas.left);
        loop(atlas.right);
      } else if (typeof atlas.rect.name !== 'undefined') {
        let p = (isPad) ? atlas.rect.w / 4 : 0;
        self._uvcache[atlas.rect.name] = [
          [atlas.rect.x + p, atlas.rect.y + p],
          [(atlas.rect.x + p) + (atlas.rect.w - (p * 2)), atlas.rect.y + p],
          [(atlas.rect.x + p) + (atlas.rect.w - (p * 2)), (atlas.rect.y + p) + (atlas.rect.h - (p * 2))],
          [(atlas.rect.x + p), (atlas.rect.y + p) + (atlas.rect.h - (p * 2))],
        ].map(function(uv) {
          if (uv[0] !== 0) {
            uv[0] = uv[0] / w;
          }
          if (uv[1] !== 0) {
            uv[1] = uv[1] / h;
          }
          return uv;
        });
      }
    }(self));
    return self._uvcache;
  },
  json(input) {
    let self = this;
    if (input) {
      if (typeof input === 'string') input = JSON.parse(input);
      return (function loop(obj) {
        if (!obj || !obj.rect) return;
        let atlas = new Atlas(obj.rect.x, obj.rect.y, obj.rect.w, obj.rect.h);
        if (obj.left) atlas.left = loop(obj.left);
        if (obj.right) atlas.right = loop(obj.right);
        return atlas;
      }(input));
    } else {
      return JSON.stringify(function loop(atlas) {
        let obj = {
          left: null, right: null,
          rect: atlas.rect, filled: atlas.filled
        };
        if (atlas.left !== null) {
          obj.left = loop(atlas.left);
          obj.right = loop(atlas.right);
        }
        return obj;
      }(self), null, 2);
    }
  },
  _tilepad(rect) {
    let img = this.img;
    if (!img) return rect;

    let p = img.width / 2;

    let canvas = document.createElement('canvas');
    canvas.name = img.name || img.src;
    canvas.id = img.id || '';
    canvas.width = img.width + img.width;
    canvas.height = img.height + img.height;
    let ctx = canvas.getContext('2d');

    let pattern = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = pattern;
    ctx.translate(p, p);
    ctx.fillRect(-p, -p, canvas.width + p, canvas.height + p);
    ctx.translate(-p, -p);

    this.img = canvas;

    return new Rect(rect.x, rect.y, this.img.width, this.img.height);
  },
  _ontoCanvas(node) {
    if (node && this.img && this.canvas) {
      if (!this.context) {
        this.context = this.canvas.getContext('2d');
      }
      this.context.clearRect(node.rect.x, node.rect.y, node.rect.w, node.rect.h);
      this.context.drawImage(this.img, node.rect.x, node.rect.y, node.rect.w, node.rect.h);
      node.rect.name = this.img.id || this.img.name || this.img.src || null;
    }
    return node;
  },
  _toRect(rect) {
    // if rect is an image
    if (rect.nodeName && (rect.nodeName === 'IMG' || rect.nodeName === 'CANVAS')) {
      this.img = rect;
      rect = new Rect(rect.x, rect.y, rect.width, rect.height);
    }
    // if rect is an object
    if (!(rect instanceof Rect)) {
      rect = new Rect(rect.x || 0, rect.y || 0, rect.w || rect.width, rect.h || rect.height);
    }
    return rect;
  },
  _debug() {
    if (!this.canvas) { return; }
    let context = this.canvas.getContext('2d');
    this.index().forEach(function(rect) {
      context.lineWidth = 1;
      context.strokeStyle = 'red';
      context.strokeRect(rect.x, rect.y, rect.w, rect.h);
    });
  }
}

module.exports = function() {
  return new Atlas(...arguments);
};
