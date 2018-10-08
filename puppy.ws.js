module.exports = {
  connected: {
    activate: async message => message === 'connected',
    message: 'hello friend'
  },
  notification: {
    delay: 300,
    interval: 1000,
    message: {
      seen: false,
      date: Date.now(),
      text: 'I am a notification'
    }
  },
  randomNumber: {
    delay: 600,
    interval: 1000,
    message: async () => {
      const numbers = [1, 2, 3, 4, 5]
      return numbers[Math.floor(Math.random() * numbers.length)]
    }
  },
  users: {
    delay: 900,
    interval: 1000,
    message: [
      { name: 'Jane Doe', email: 'jane@gmail.com', age: 44 },
      { name: 'John Doe', email: 'john@gmail.com', age: 35 }
    ]
  }
}
