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

  static saveImage (file) {

    let params = {
      name: file.name,
      data: file.dataURL
    }
    console.log(params);

    return axios.put(url, params)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(err);
      });

    // return url;
  }

  static signedUpload (params) {
    //path to S3 signature

  }
}

export default MicroPostsService
