const fs = require('fs')

exports.selectAPI = () => {
  return new Promise(function (resolve, reject) {
    fs.readFile('endpoints.json', (err, api) => {
      if (err) return reject(err)
      const apiParse = JSON.parse(api)
      return resolve(apiParse)
    })
  })
}
