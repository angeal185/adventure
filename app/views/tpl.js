const x = require('../utils/xscript'),
utils = require('../utils')

const tpl = {
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
                utils.focus();
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
                utils.focus();
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
