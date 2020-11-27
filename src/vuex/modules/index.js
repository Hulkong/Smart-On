const files = require.context('.', false, /\.js$/)
const modules = {}

// index.js를 제외한 모든 js를 file명을 키로 modules에 담아 리턴
files.keys().forEach(key => {
  if (key === './index.js') return
  modules[key.toLowerCase().replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default modules
