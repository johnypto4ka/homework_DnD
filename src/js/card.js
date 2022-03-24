import { nanoid } from 'nanoid';
import { DnD } from './dnd';

class Card {
  cardFormElement = document.querySelector('#cardFormCreate')
  containerElement  = document.querySelector('.wrapper')
  activeElement = null

  storage = localStorage.getItem('data')
  data = this.storage ? JSON.parse(this.storage) : []

  constructor() {
    this.init()
  }

  init() {
    this.cardFormElement.addEventListener('submit', this.handleClickButton.bind(this))
    this.containerElement.addEventListener('click', this.handleCardSave.bind(this))
    this.containerElement.addEventListener('mousedown', this.handleCardMouseDown.bind(this))
    window.addEventListener('dnd.start', this.handleDnDStart.bind(this))
    window.addEventListener('dnd.end', this.handleDnDEnd.bind(this))
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('data', JSON.stringify(this.data))
    });
    document.addEventListener('dblclick', this.handleCardEdit.bind(this))
    document.addEventListener('click', this.handleRemoveCard.bind(this))
    document.addEventListener('DOMContentLoaded', () => {
      this.render(this.data)
    })
  }
//-------------------------
  handleClickButton(event) {
    event.preventDefault();
    const colorElement = this.cardFormElement.querySelector('#color').value
    const card = {
      id: nanoid(),
      content: 'Hello World',
      background: colorElement,
      position: {
        top: 'auto',
        left: 'auto'
      },
    }
    this.data.push(card)
    this.render(this.data)
  }

  handleDnDStart({detail}) {
    this.activeElement = detail.element
  }

  handleDnDEnd({detail}) {
    const { position } = detail

    if(this.activeElement) {
      const  id  = this.activeElement.dataset
      console.log(id)
      this.data.forEach(item => {
        if (item.id==id) {
          item.position = position
        }
      })
    }
    this.activeStick = null
  }

  handleRemoveCard(event) {
    const { target } = event
    if (target.dataset.role != 'remove') return

    const { id } = this.activeElement.dataset
    this.data.forEach((item, index) => {
      if (item.id == id) {
        this.data.splice(index, 1)
      }
    })
    this.render(this.data)
  }

// ------------------------------

  handleCardEdit(event) {
    const { target } = event
    const cardElement = target.closest('.card')
    if(cardElement) {
      this.activeElement.classList.add('card_edit')
    }
  }

  handleCardSave(event) {
    event.preventDefault()
    const { target } = event
    if (target.dataset.role != 'save') return

    const { id } = this.activeElement.dataset
    console.log(id)
    this.activeElement.classList.remove('edit')
    this.data.forEach((item) => {
      if (item.id == id) {
        item.content = this.activeElement.querySelector('.card__textarea').value
        this.render(this.data)
      }
    })
  }
  handleCardMouseDown(event) {
    this.activeElement = event.target.closest('.card');

    if (this.activeElement.dataset.role != 'card') return;

    new DnD(this.activeElement);
  }

  /* buildCardElement (data) {
    const cardWrapperElement = document.createElement('div')
    cardWrapperElement.classList.add('card')
    cardWrapperElement.setAttribute('data-id', data.id)
    cardWrapperElement.style.top = data.position.top + 'px'
    cardWrapperElement.style.left = data.position.left + 'px'
    cardWrapperElement.style.backgroundColor = data.color

    const templateInnerCard = `
    <div class="card" data-id="${data.id}" data-role="card"
      style=" background-color:${data.background};">
      <button class="btn__remove" data-role="remove"></button>
      <h2 class="card__title">${data.content}</h2>
      <textarea class="card__textarea" cols="10" rows="5">${data.content}</textarea>
      <button class="card__save btn" data-role="save">Сохранить</button>
    </div>
`
    cardWrapperElement.innerHTML = templateInnerCard
    new DnD(cardWrapperElement)

    return cardWrapperElement // html element!!!
  }

  render () {
    this.containerElement.innerHTML = ''

    this.data.forEach((data) => {
      const cardElement = this.buildCardElement(data)

      this.containerElement.append(cardElement)
    })
  } */
  buildCardElement(data) {
    const  top  = data.position
    const  left  = data.position
    return `
      <div class="card" data-id="${data.id}" data-role="card"
      style=" background-color:${data.background}; top: ${top}px; left: ${left}px">
      <button class="btn__remove" data-role="remove"></button>
      <h2 class="card__title">${data.content}</h2>
      <textarea class="card__textarea" cols="10" rows="5">${data.content}</textarea>
      <button class="card__save btn" data-role="save">Сохранить</button>
    </div>
  `
  }

  render(card) {
    const template = card.map((item) => this.buildCardElement(item))

    this.containerElement.innerHTML = ''
    this.containerElement.innerHTML += template.join('')
  }
}

export { Card }
