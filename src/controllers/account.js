const line = require('../utils/line')
let { firestore } = require('../utils/firebase')
let documentRef = firestore.collection('account')
let commandDocRef = firestore.collection('command')
const { URL_COPY_PASSWORD, URL_LOGO, BOT_MSG } = require('../constants')

const account = async (req, res) => {
  try {
    const cmd = await getCommandDocument()
    let commandStr = cmd.command
    let params = commandStr ? commandStr.split('>') : ''
    const replyToken = req.body.events[0].replyToken || 'no replyToken'
    const value = req.body.events[0].message.text || 'no text'
    let mode = ''
    let name = ''
    switch (value.toLocaleUpperCase()) {
      case 'บัญชี':
      case 'ALL':
        await setCommandDocument({ command: '' })
        const allData = await getAllDocument()
        if (allData) {
          body = getBodyAll(allData, replyToken)
          line.sendReplyBodyToLine(replyToken, body)
        }
        break
      case 'CLEAR':
        commandStr = ''
        params = []
        await setCommandDocument({ command: '' })
        break
      default:
        mode = commandStr ? params[0] : value
        name = params[1]
    }

    const password = randomPassword()
    let data
    if (!commandStr) {
      switch (mode.toLocaleUpperCase()) {
        case 'NEW':
        case 'สร้าง':
        case 'EDIT':
        case 'แก้ไข':
        case 'GET':
        case 'ดู':
        case 'DELETE':
        case 'ลบ':
          line.sendTextReplyToLine(replyToken, BOT_MSG.ACCOUNT)
          await setCommandDocument({ command: mode })
          break
        case 'CLEAR':
          await setCommandDocument({ command: '' })
          break
      }
    } else {
      commandStr += `>${value}`
      await setCommandDocument({ command: commandStr })
      switch (value.toLocaleUpperCase()) {
        case 'CLEAR':
          await setCommandDocument({ command: '' })
      }
      if (params.length == 1)
        line.sendTextReplyToLine(replyToken, BOT_MSG.CONFIRM)
    }

    if (params.length == 2) {
      await setCommandDocument({ command: '' })
    }

    if (
      params.length == 2 &&
      (value == 'ใช่' || value.toLocaleUpperCase() == 'YES')
    ) {
      switch (mode.toLocaleUpperCase()) {
        case 'NEW':
        case 'สร้าง':
          data = await getDocument(name)
          if (!data) {
            setDocument(name, {
              name: name,
              password: password
            })
            url = URL_COPY_PASSWORD + Buffer.from(password).toString('base64')
            body = getBody(url, name, password, replyToken)
            line.sendReplyBodyToLine(replyToken, body)
          }

          break
        case 'EDIT':
        case 'แก้ไข':
          data = await getDocument(name)
          if (data) {
            setDocument(name, {
              name: name,
              password: password
            })
            url = URL_COPY_PASSWORD + Buffer.from(password).toString('base64')
            body = getBody(url, name, password, replyToken)
            line.sendReplyBodyToLine(replyToken, body)
          }
          break
        case 'GET':
        case 'ดู':
          data = await getDocument(name)
          if (data) {
            url =
              URL_COPY_PASSWORD + Buffer.from(data.password).toString('base64')
            body = getBody(url, name, data.password, replyToken)
            line.sendReplyBodyToLine(replyToken, body)
          }
          break
        case 'DELETE':
        case 'ลบ':
          data = await getDocument(name)
          if (data) {
            deleteDocument(name)
            line.sendTextReplyToLine(
              replyToken,
              BOT_MSG.DELETE.replace(`{name}`, name)
            )
          }
          break
        case 'ALL':
        case 'บัญชี':
          const allData = await getAllDocument()
          if (allData) {
            body = getBodyAll(allData, replyToken)
            line.sendReplyBodyToLine(replyToken, body)
          }
          break
      }
    }

    res.sendStatus(200)
    res.send('success')
  } catch (e) {
    console.log(e)
    res.sendStatus(200)
    res.send('success')
  }
}

String.prototype.pick = function(min, max) {
  var n,
    chars = ''

  if (typeof max === 'undefined') {
    n = min
  } else {
    n = min + Math.floor(Math.random() * (max - min + 1))
  }

  for (var i = 0; i < n; i++) {
    chars += this.charAt(Math.floor(Math.random() * this.length))
  }
  return chars
}

String.prototype.shuffle = function() {
  var array = this.split('')
  var tmp,
    current,
    top = array.length

  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1))
      tmp = array[current]
      array[current] = array[top]
      array[top] = tmp
    }

  return array.join('')
}

function randomPassword() {
  let specials = '!@#$%^&*()_+{}:<>?|[];,./~'
  let lowercase = 'abcdefghijklmnopqrstuvwxyz'
  let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let numbers = '0123456789'

  let all = specials + lowercase + uppercase + numbers

  let password = ''
  password += specials.pick(2)
  password += lowercase.pick(2)
  password += uppercase.pick(2)
  password += numbers.pick(2)
  password += all.pick(10)
  password = password.shuffle()
  return password
}

function getBody(url, name, password, replyToken) {
  body = {
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: 'User Account',
        contents: {
          type: 'bubble',
          hero: {
            type: 'image',
            url: URL_LOGO,
            action: {
              type: 'uri',
              uri: url
            }
          },
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            action: {
              type: 'uri',
              uri: url
            },
            contents: [
              {
                type: 'text',
                text: 'User Account',
                size: 'xl',
                weight: 'bold',
                align: 'center'
              },
              {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    contents: [
                      {
                        type: 'text',
                        text: 'Name',
                        weight: 'bold',
                        margin: 'sm',
                        flex: 0
                      },
                      {
                        type: 'text',
                        text: name,
                        size: 'sm',
                        align: 'end',
                        color: '#aaaaaa'
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    contents: [
                      {
                        type: 'text',
                        text: 'Password',
                        weight: 'bold',
                        margin: 'sm',
                        flex: 0
                      },
                      {
                        type: 'text',
                        text: password,
                        size: 'sm',
                        align: 'end',
                        color: '#aaaaaa'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'spacer',
                size: 'xxl'
              },
              {
                type: 'button',
                style: 'primary',
                color: '#3949ab',
                action: {
                  type: 'uri',
                  label: 'Open Copy Password',
                  uri: url
                }
              }
            ]
          }
        }
      }
    ]
  }
  return body
}

function getBodyAll(data, replyToken) {
  let contents = []
  for (let i in data) {
    contents.push({
      type: 'box',
      layout: 'baseline',
      contents: [
        {
          type: 'text',
          text: 'Name',
          weight: 'bold',
          margin: 'sm',
          flex: 0
        },
        {
          type: 'text',
          text: data[i].name,
          size: 'sm',
          align: 'end',
          color: '#aaaaaa'
        }
      ]
    })
  }

  body = {
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: 'User Account',
        contents: {
          type: 'bubble',
          hero: {
            type: 'image',
            url: URL_LOGO
          },
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            contents: [
              {
                type: 'text',
                text: 'User Account',
                size: 'xl',
                weight: 'bold',
                align: 'center'
              },
              {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: contents
              }
            ]
          }
        }
      }
    ]
  }
  return body
}

async function setCommandDocument(params) {
  await commandDocRef
    .doc('command')
    .set(params)
    .then(function() {
      console.log('Document successfully written!')
      return true
    })
    .catch(function(error) {
      console.error('Error writing document: ', error)
      return false
    })
}

function getCommandDocument() {
  return new Promise(async (resolve, reject) => {
    await commandDocRef
      .doc('command')
      .get()
      .then(function(doc) {
        if (doc.exists) {
          resolve(doc.data())
        } else {
          resolve(false)
        }
      })
      .catch(function(error) {
        reject(error)
        console.log('Error getting document:', error)
      })
  })
}

async function setDocument(name, params) {
  await documentRef
    .doc(name)
    .set(params)
    .then(function() {
      console.log('Document successfully written!')
      return true
    })
    .catch(function(error) {
      console.error('Error writing document: ', error)
      return false
    })
}

async function getAllDocument() {
  const snapshot = await documentRef.get()
  return snapshot.docs.map(doc => doc.data())
}

function deleteDocument(name) {
  documentRef
    .doc(name)
    .delete()
    .then(function() {
      console.log('Document successfully deleted!')
    })
    .catch(function(error) {
      console.error('Error removing document: ', error)
    })
}

function getDocument(name) {
  return new Promise(async (resolve, reject) => {
    await documentRef
      .doc(name)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          resolve(doc.data())
        } else {
          resolve(false)
        }
      })
      .catch(function(error) {
        reject(error)
        console.log('Error getting document:', error)
      })
  })
}
module.exports = {
  account
}
