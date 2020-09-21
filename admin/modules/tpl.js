const x = require('../../app/utils/xscript');

const tpl = {
  build(utils){
    return x('app-main',
      this.nav(),
      x('div', {class: 'container-fluid'},
        this.characters(utils),
        x('hr'),
        this.doors(),
        x('hr'),
        this.portals(),
        x('hr')
      )
    )
  },
  nav(){
    return x('nav', {class: 'navbar navbar-expand-lg navbar-dark bg-dark mb-4'},
      x('div', {class: 'navbar-brand'}, 'Admin')
    )
  },
  characters(utils){
    let obj = {
      name: utils.nameGen(),
      g: utils.addGold()
    },
    pos = x('input', {class: 'form-control', readOnly: ''}),
    prev = x('textarea', {class: 'form-control', rows: 4, readOnly: ''}),
    gold = x('input', {
      class: 'form-control',
      value: obj.g,
      onkeyup(evt){
        let val = parseInt(evt.target.value) || '';
        if(typeof val === 'number'){
          obj.g = val;
        } else {
          this.value = 0;
        }
        prev.value = js(obj);
      }
    }),
    nameInp = x('input', {
      class: 'form-control',
      value: obj.name,
      onkeyup(evt){
        obj.name = val;
        prev.value = js(obj);
      }
    }),
    action = x('input', {
      class: 'form-control',
      onkeyup(evt){
        let val = jp(evt.target.value) || '';
        if(typeof val === 'object'){
          obj.action = val;
          obj.position = val[0]
          obj.position[1]++;
          pos.value = js(obj.position);
        } else {
          pos.value = ''
        }
        prev.value = js(obj);
      }
    }),
    rotation = x('input', {
      class: 'form-control',
      onkeyup(evt){
        let val = parseInt(evt.target.value) || '';
        if(typeof val === 'number'){
          obj.rt = val;
        } else {
          obj.rt = 0;
        }
        prev.value = js(obj);
      }
    })


    return x('div', {class: 'card mt-4'},
      x('div', {class: 'card-header'},
        x('h5', {class: 'card-title'},'Add character')
      ),
      x('div', {class: 'card-body'},
        x('div', {class: 'row'},
          this.rowGroup('Name', nameInp, '6'),
          this.rowGroup('Action', action, '6'),
          this.rowGroup('Position', pos, '6'),
          this.rowGroup('Rotation', rotation, '6'),
          this.rowGroup('Gold', gold, '6'),
          this.rowGroup('Preview', prev, '12')
        )

      ),
      x('div', {class: 'card-footer'},
        x('button', {
          class: 'btn btn-outline-secondary float-right',
          type: 'button',
          onclick(){
            utils.addChar(obj, function(err){
              if(err){return cl(err)}
              cl('new character added');

              obj.name = nameInp.value = utils.nameGen();
              obj.g  = gold.value =  utils.addGold();
              obj.action = obj.position = obj.rt = action.value = pos.value = rotation.value = ''
              obj.id++
            })
          }
        },'submit')
      )
    )
  },
  rowGroup(lbl, i, e){
    return x('div', {class: 'col-lg-'+ e},
      x('div', {class: 'form-group'},
        x('label', lbl),
        i
      )
    )
  },
  doors(){
    let arr = []
    return x('div', {class: 'card mt-4'},
      x('div', {class: 'card-header'},
        x('h5', {class: 'card-title'},'Add door')
      ),
      x('div', {class: 'card-body'}),
      x('div', {class: 'card-footer'},
        x('button', {
          class: 'btn btn-outline-secondary float-right',
          type: 'button',
          onclick(){

          }
        },'submit')
      )
    )
  },
  portals(){
    let arr = []
    return x('div', {class: 'card mt-4'},
      x('div', {class: 'card-header'},
        x('h5', {class: 'card-title'},'Add portal')
      ),
      x('div', {class: 'card-body'}),
      x('div', {class: 'card-footer'},
        x('button', {
          class: 'btn btn-outline-secondary float-right',
          type: 'button',
          onclick(){

          }
        },'submit')
      )
    )
  }
}

module.exports = tpl;
