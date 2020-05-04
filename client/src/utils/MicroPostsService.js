import axios from 'axios'
import {apiUrl} from "../constants/config";
// const url = process.env.BACKEND_URL
const url = apiUrl;

class MicroPostsService {
  static getMicroPosts () {
    return new Promise(async (resolve, reject) => {
      try {
        const serverResponse = await axios.get(url)
        const unparsedData = serverResponse.data
        console.log(unparsedData);

        resolve(unparsedData.map(microPost => ({
          ...microPost,
          createdAt: new Date(microPost.createdAt)
        })))
      } catch (error) {
        reject(error)
      }
    })
  }

  static insertMicroPost (name, image, price) {
    return axios.post(url, {
      name,
      image,
      price
    })
  }
}

export default MicroPostsService
