module.exports = {
  notification: {
    delay: 500,
    interval: 2000,
    message: {
      seen: false,
      date: Date.now(),
      text: 'I am a notification'
    }
  },
  randomNumber: {
    interval: 3000,
    message: async () => {
      const items = [12, 3, 52, 23, 55]
      return items[Math.floor(Math.random() * items.length)]
    }
  },
  users: {
    interval: 3500,
    message: [
      {name: 'Jane Doe', email: 'jane@gmail.com', age: 44},
      {name: 'John Doe', email: 'john@gmail.com', age: 35}
    ]
  }
}
