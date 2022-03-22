import { nanoid } from 'nanoid';
import { DnD } from './dnd';

class Card {
  position = {
    top: 0,
    left: 0,
  }

  cardFormElement = document.querySelector('#cardFormCreate')
  containerElement  = document.querySelector('.wrapper')
  activeElement = null

  storage = localStorage.getItem('data')
  data = this.storage ? JSON.parse(this.storage) : []

  constructor() {
    this.init()
  }

  init() {
    this.cardFormElement.addEventListener('submit', this.handleCardCreateSubmit.bind(this))
    this.containerElement.addEventListener('dblclick', this.handleDoubleClickEdit.bind(this))
    this.containerElement.addEventListener('click', this.handleCardDelete.bind(this))
    this.containerElement.addEventListener('click', this.handleCardSave.bind(this))
    this.containerElement.addEventListener('mousedown', this.handleCardMouseDown.bind(this))
    window.addEventListener('drag.end', this.handleDragEnd.bind(this))

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('cardData', JSON.stringify(this.data))
    });
    document.addEventListener('DOMContentLoaded', () => {
      this.render(this.data)
    })
  }

  handleCardCreateSubmit(event) {
    event.preventDefault();
    const colorElement = this.cardFormElement.querySelector('#color').value

    const card = {
      id: nanoid(),
      content: 'Hello World',
      background: colorElement,
      position: {
        top: 0,
        left: 0,
      },
    }
    this.data.push(card)
    this.render(this.data)
  }

  handleDoubleClickEdit() {
    this.activeElement.classList.add('edit')
  }

  handleCardSave(event) {
    if (event.target.dataset.role != 'save') return
    const { id } = this.activeElement.dataset

    this.activeElement.classList.remove('edit')

    this.data.forEach((item) => {
      if (item.id == id) {
        item.content = this.activeElement.querySelector('.card__textarea').value
        this.render(this.data)
      }
    })
  }

  handleCardDelete(event) {
    if (event.target.dataset.role != 'remove') return
    const { id } = this.activeElement.dataset
    this.data = this.data.filter((item) => item.id != id)
    this.render(this.data)
  }

  handleCardMouseDown(event) {
    this.activeElement = event.target.closest('.card')

    if (this.activeElement.dataset.role != 'card') return

    const instanceCard = new DnD(this.activeElement)
  }

  handleDragEnd(event) {
    const { data } = event.detail
    const { id } = this.activeElement.dataset

    this.data.forEach((item) => {
      if (item.id == id) {
        item.position.top = data.top
        item.position.left = data.left
      }
    })
  }

  buildTemplate(card) {
    const  top  = card.position
    const  left  = card.position

    return `
      <div class="card" data-id="${card.id}" data-role="card"
      style=" background-color:${card.background}; top: ${top}px; left: ${left}px">
      <button class="btn__remove" data-role="remove"></button>
      <h2 class="card__title">${card.content}</h2>
      <textarea class="card__textarea" cols="10" rows="5">${card.content}</textarea>
      <button class="card__save btn" data-role="save">Сохранить</button>
    </div>
  `
  }

  render(card) {
    const template = card.map((item) => this.buildTemplate(item))

    this.containerElement.innerHTML = ''
    this.containerElement.innerHTML += template.join('')
  }
}

export { Card }
