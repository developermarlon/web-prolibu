import Vue from 'vue'

Vue.directive('touchscroll',
  {
    bind(el, binding, vnode){
        if(el.querySelector('table')) {
          el = el.querySelector('table').parentElement
          el.style.cursor = 'pointer'
          let down=false;
          let scrollLeft=0;
          let x = 0;
    
          el.addEventListener('mousedown', (e) => {
            down = true;
            scrollLeft = el.scrollLeft;
            x = e.clientX;
          })
    
          el.addEventListener('mouseup', (e) => {
            down = false;
          })
    
          el.addEventListener('mousemove', (e) => {
            if (down) {
              el.scrollLeft = scrollLeft + x - e.clientX;
            }
          })
    
          el.addEventListener('mouseleave', () => {
            down = false;
          })
        }
        
    }
  }
)

Vue.directive('goTo',
  {
    bind(el, binding, vnode) {
      let routePath = binding.value

      el.style.setProperty('cursor', 'pointer', 'important')
      el.addEventListener('click', (e) => {
        vnode.context.$router.push({path: routePath})
      })
    }
  }
)

Vue.directive('scroll_table', {
  bind(el, binding, vnode) {
        el = el.querySelector('table').parentElement
        el.style.setProperty('overflow-y', 'scroll', 'important')
        el.style.setProperty('max-height', '500px', 'important')
        el.onscroll = (e) => {
          var translate = 'translate(0,' + e.target.scrollTop + 'px)'
          let table = e.target.querySelector('table')
          if(table) {
            table.querySelector('thead').style.transform = translate
            table.querySelector('thead').style.setProperty('background', '#fff', 'important')
            table.querySelector('thead').style.setProperty('position', 'relative', 'important')
            table.querySelector('thead').style.setProperty('z-index', '2', 'important')
          }
        }
    }
})

Vue.directive('format-number', {
  bind(el, binding, vnode) {
      el = el.querySelector('input')
      const replaceInput = () => {
        
        let arrayInput = el.value.split('')
        for(let a = 0; a < arrayInput.length; a++){
          if(arrayInput[a] !== '1' && arrayInput[a] !== '2' && arrayInput[a] !== '3' && arrayInput[a] !== '4' && arrayInput[a] !== '5' && arrayInput[a] !== '6' && arrayInput[a] !== '7' && arrayInput[a] !== '8' && arrayInput[a] !== '9' && arrayInput[a] !== '0' && arrayInput[a] !== '.') el.value = el.value.replace(arrayInput[a], '')
        }
        let num = el.value.replace(/\./g,'');
        if(!isNaN(num)){
          num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
          num = num.split('').reverse().join('').replace(/^[\.]/,'');
          eval(`vnode.context.`+binding.expression+` = '`+num+`'`)
          // el.value = num
        }
      }
  
      replaceInput()
  
      el.addEventListener('keyup',(e) => {
        replaceInput()
      })
      el.addEventListener('input',(e) => {
        replaceInput()
      })
    }
  })

  Vue.directive('format-tel', {
    bind(el, binding, vnode) {
      el = el.querySelector('input')
      el.max = '12'
      el.type = 'text'
      
      const replaceInput = () => {
        let x = el.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        let num = !x[2] ? x[1] : '' + x[1] + ' ' + x[2] + (x[3] ? ' ' + x[3] : '')
        eval(`vnode.context.${binding.expression} = '${num}'`)
        // binding.value = num
        el.value = num
      }

      replaceInput()
  
      el.addEventListener('keyup',(e) => {
        replaceInput()
      })
      el.addEventListener('input',(e) => {
        replaceInput()
      })
    }
  })

Vue.directive('visible', {
  bind(el, binding, vnode) {
    el.style.visibility = 'hidden'
  },
  update(el, binding, vnode) {
    el.style.visibility = !!binding.value ? 'visible' : 'hidden';
  }
})