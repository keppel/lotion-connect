let connect = require('../index.js')

async function main() {
  let { state } = await connect(process.env.GCI)
  console.log(await state)
}

main()

process.on('unhandledRejection', function(err) {
  console.log(err)
})
