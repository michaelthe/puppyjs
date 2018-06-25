const users = [
  {name: 'Andrew', email: '9pitop@gmail.com', age: 44},
  {name: 'Kostis', email: 'yolo@gmail.com', age: 35}
]

const Events = [
  {
    label: 'notifications',
    delay: 1000,
    interval: 1000,
    messages: [
      users,
      {seen: false, createdAt: Date.now(), text: 'I am a notification'}
    ]
  },
  {
    messages: async () => {
      const items = [12,3,52,23]
      return items[Math.floor(Math.random()*items.length)]
    }
  }
]

module.exports = Events