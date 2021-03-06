class DnD {
  position = {
    top: 'auto',
    left: 'auto',
  };

  shifts = {
    x: 0,
    y: 0,
  };

  constructor(element) {
    this.element = element
    this.init()
  }

  init() {
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.element.addEventListener('mouseup', this.handleMouseUp.bind(this))
  }

  handleMouseDown({ clientX, clientY }) {
    document.addEventListener('mousemove', this.handleMouseMove)
    this.calcShifts(clientX, clientY)
    const customEvent = new CustomEvent('dnd.start', {
      detail: { element: this.position }
    });
    window.dispatchEvent(customEvent)
  }

  handleMouseMove({ clientX, clientY }) {
    console.log('mousemove')
    this.setPosition(clientX, clientY)
  }

  handleMouseUp() {
    document.removeEventListener('mousemove', this.handleMouseMove)
    const customEvent = new CustomEvent('dnd.end', {
      detail: { position: this.position }
    });
    window.dispatchEvent(customEvent)
  }

  calcShifts(x, y) {
    const rect = this.element.getBoundingClientRect()
    const { left, top } = rect

    this.shifts.x = x - left
    this.shifts.y = y - top
  }

  setPosition(left, top) {
    this.position.left = left - this.shifts.x
    this.position.top = top - this.shifts.y
    this.element.style.top = `${this.position.top-198}px`
    this.element.style.left = `${this.position.left-20}px`
  }
}

export { DnD };
