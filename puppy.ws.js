const users = [
  {name: 'Jane Doe', email: 'jane@gmail.com', age: 44},
  {name: 'John Doe', email: 'john@gmail.com', age: 35}
]

module.exports = [
  {
    delay: 500,
    interval: 2000,
    messages: [
      users,
      {seen: false, date: Date.now(), text: 'I am a notification'}
    ]
  },
  {
    messages: async () => {
      const items = [12, 3, 52, 23, 55]
      return items[Math.floor(Math.random() * items.length)]
    },
    interval: 3000
  },
  {
    messages: [
      users
    ],
    interval: 3500
  }
}
