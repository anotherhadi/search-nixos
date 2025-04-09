import Axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

const instance = Axios.create()
const axios = setupCache(instance)

export default axios
