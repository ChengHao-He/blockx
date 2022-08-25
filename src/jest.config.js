module.exports = {
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.jsx?$": "babel-jest' //这个是jest的默认配置
  }
}
