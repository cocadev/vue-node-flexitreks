import Vue from 'vue'

Vue.directive('tap-menu', {
  bind: function (el, binding) {
    
    let value = binding.value
    let isTouch = false
    const handler = function (ev) {
      const elem = ev.currentTarget
      
      if (ev.type === 'click') {
        if (!elem.classList.contains('tap-menu-open')) {
          if (value && window.innerWidth < value) return
          ev.preventDefault();
          elem.dispatchEvent(new Event('tap-menu-open'))
        } else {
          if (ev.target.nodeName === 'A') {
            elem.dispatchEvent(new Event('tap-menu-close'))
          }
        }
        isTouch = false

      } else if (ev.type === "mouseenter" || ev.type === "mouseleave") {
        if (!isTouch) {
          elem.dispatchEvent(new Event(ev.type === 'mouseenter' ? 'tap-menu-open' : 'tap-menu-close'))
          isTouch = false
        }

      } else if (ev.type === "touchstart" || window.TouchEvent && ev instanceof TouchEvent) {
        isTouch = true;
      } else if (event.pointerType) {
        isTouch = ev.pointerType !== (ev.MSPOINTER_TYPE_MOUSE !== undefined ? ev.MSPOINTER_TYPE_MOUSE : "mouse");
      } else {
        isTouch = false;
      }

    }
    
    el.addEventListener('MSPointerOver', handler)
    el.addEventListener('pointerover', handler)
    el.addEventListener('touchstart', handler)
    el.addEventListener('mouseenter', handler)
    el.addEventListener('mouseleave', handler)
    el.addEventListener('click', handler)
  }
})
