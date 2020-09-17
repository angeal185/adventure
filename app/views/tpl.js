const x = require('../utils/xscript');

const tpl = {
  counter(){
    return x('div', {id: 'counter'})
  },
  minmap(){
    return x('div', {id: 'minmap'})
  },
  compas(){
    return x('div', {id: 'compas'})
  },
  contact(){
    return x('div', {id: 'contact'},
      x('div'),x('div')
    )
  },
  container(){
    return x('app-main',
      x('div', {id: 'crosshair'},
        x('img', {src: './app/img/crosshair.png'})
      ),
      game.view.element
    )
  },
  currentBlock(blockarr){
    return x('img', {
      title: blockarr[0],
      src: blockarr[1]
    })
  },
  dialogue(){
    let head_txt = x('h5', {class: 'modal-title'}),
    body_txt = x('p'),
    mdl = x('div', {class: 'modal fade'},
      x('div', {class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg'},
        x('div', {class: 'modal-content'},
          x('div', {class: 'modal-header'},head_txt),
          x('div', {class: 'modal-body'},body_txt),
          x('div', {class: 'modal-footer'},
            x('button', {
              class: 'btn btn-outline-secondary btn-sm',
              onclick(){
                mdl.classList.remove('show');
                game.view.element.requestPointerLock();
                setTimeout(function(){
                  head_txt.textContent = '';
                  body_txt.innerHTML = '';
                },500)
              }
            }, 'Close')
          )
        )
      )
    )

    window.addEventListener('show-dialogue', function (evt) {
      evt = evt.detail;
      head_txt.textContent = evt.head;
      if(typeof evt.data.body === 'string'){
        body_txt.textContent = evt.data.body;
      } else {
        body_txt.append(evt.data.body);
      }
      mdl.classList.add('show');
    })

    return mdl;
  },
  inventory(){
    let body = x('div',{class: 'row'}),
    mdl = x('div', {class: 'modal fade'},
      x('div', {class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg'},
        x('div', {class: 'modal-content'},
          x('div', {class: 'modal-header'},
            x('h5', {class: 'modal-title'}, 'Inventory')
          ),
          x('div', {class: 'modal-body'},
            x('div', {class: 'container-fluid'},
                body
            )
          ),
          x('div', {class: 'modal-footer'},
            x('button', {
              class: 'btn btn-outline-secondary btn-sm',
              onclick(){
                mdl.classList.remove('show');
                game.view.element.requestPointerLock();
                setTimeout(function(){
                  body.innerHTML = '';
                },500)
              }
            }, 'Close')
          )
        )
      )
    )

    window.addEventListener('show-inventory', function (evt) {
      console.log(db.get('user.inventory').value())
      //db.get('user.inventory').value()
      //body_txt.append(evt.data.body);
      mdl.classList.add('show');
    })

    return mdl;
  }
}

module.exports = tpl;
