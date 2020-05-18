const captcha = require('captchapng')

const generateNumbers = () => ({
  pre: parseInt(Math.random() * 9000 + 1000, 10),
  challenge: parseInt(Math.random() * 9000 + 1000, 10),
  post: parseInt(Math.random() * 9000 + 1000, 10),
})

const generateCode = (challenge) => {
  const p = captcha(100, 30, challenge)
  // p.color(0, 152, 242)
  p.color(0, 97, 154)
  p.color(164, 221, 255)
  return p.getBase64()
}

const generateChallenge = () => {
  const { pre, challenge, post } = generateNumbers()
  return {
    numbers: `${pre}${challenge}${post}`,
    validationCode: generateCode(challenge),
  }
}

const getChallenge = (numbers) => numbers.slice(4, 8)

module.exports = {
  generateChallenge,
  getChallenge,
}
