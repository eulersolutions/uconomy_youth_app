import React, { Component } from "react";
import axios from "axios";
import { api,token } from "../constants/Constants";

/**
 * This was not meant to stay like this.
 * Requests for each component was meant to be broken down into
 * their own respective files.
 * Suggest changing this method to something more readable.
 */

class Requests {
  static async performLogin(formData) {
    return await axios.post(api + "login", formData);
  }

  static async performSignup(formData) {
    return await axios.post(api + "signup", formData);
  }

  static async retrieveFeed(token) {
    let config = {
      headers: {
        Authorization: `Token ${token}`
    }
  }
    gToken = token;
    return await axios.get(api+'feed/', config)
  }


  static async retrieveStickyPost(token) {
    let config = {
      headers: {
        Authorization: `Token ${token}`
    }
  }
    return await axios.get(api+'feed/post/sticky', config)
  }

  static async retrieveFeedPaginated(token, offset) {
    let config = {
      headers: {
        Authorization: `Token ${token}`
    }
    }
    return await axios.get(api+`feed/?offset=${offset}`,config)
  }

  static async reportFeedPost(token,formData) {
    
    let config = {
      headers: {
        Authorization: `Token ${token}`
    }
  }
  
  return await axios.post(api+'report/',formData,config)

  }
  

  static async retrieveUserProfile(token) {
    let config = {
      headers: {
        Authorization: `Token ${token}`
    }
  }

    return await axios.get(api+'get-user-profile',config)
  }

  static async viewUserProfile(token,userId) {
    let config = {
      headers: {
        Authorization: `Token ${token}`
    }
  }

  return await axios.get(api+`user/${userId}`,config)
  }

  static async createFeedPost(token,formValues) {
    let config = {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
    let formData = new FormData();
    if (formValues.unl_feed_post_image !== null) {
      let localUri = formValues.unl_feed_post_image;
      let filename = localUri.split('/').pop();
    
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
  
      
      formData.append('unl_feed_post_image',
      {
         uri:localUri,
         name:filename, type
      });
    }

    formData.append('unl_feed_post_body',formValues.unl_feed_post_body);
    formData.append('unl_feed_post_tags',formValues.unl_feed_post_tags);
    return await axios.put(api+'feed/',formData,config);
  }

  static async retrieveFeedPost(token,postId){

    let config = {
      headers: {
        Authorization: `Token ${token}`
    }
  }

    return await axios.get(api+`feed/post/${postId}`,config);

  }

  static async createPostComment(token,formData) {
    let config = {
      headers: {
        Authorization: `Token ${token}`
    }
  }

  return await axios.post(api+'feed/post/comment',formData,config);
  }

  static async retrieveOwnProfileData(token) {
    let config = {
      headers: {
        Authorization: `Token ${token}`
    }
  }

  return await axios.get(api+'get-user-profile',config)
  }


static async retrieveDocuments(token) {
  let config = {
    headers: {
      Authorization: `Token ${token}`
  }
}

return await axios.get(api+'manage-documents',config)
}


static async retrievePostHistory(token) {
  let config = {
    headers: {
      Authorization: `Token ${token}`
  }
}

return await axios.get(api+'history',config)

}

static async deletePost(token,postId) {
  let config = {
    headers: {
      Authorization: `Token ${token}`
  }
}

return await axios.get(api+`delete-post/${postId}`,config)

}

static async uploadDocument(token, formValues) {
  let config = {
    headers: {
      Authorization: `Token ${token}`
  }
}
let formData = new FormData();
let localUri = formValues.document;
let filename = localUri.split('/').pop();

// Infer the type of the image
let match = /\.(\w+)$/.exec(filename);
let type = match ? `image/${match[1]}` : `image`;


formData.append('unl_document',
{
   uri:localUri,
   name:filename, type
});
formData.append('unl_document_name',formValues.documentName)



return await axios.put(api+'manage-documents',formData,config)
}


static async updateProfile(token,formValues,hasNewImage) {
  let config = {
    headers: {
      Authorization: `Token ${token}`
  }
}


const formData = new FormData();
  
for ( const key of Object.keys(formValues) ) {
  if (key !== 'unl_avatar') {
    const value = formValues[key];
    formData.append(key, value);
  }

}

if (hasNewImage) {
  let localUri = formValues.unl_avatar;
  let filename = localUri.split('/').pop();
  
  // Infer the type of the image
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  formData.append('unl_avatar',
{
   uri:localUri,
   name:filename, type
});

}

return await axios.patch(api+'edit-user-profile',formData,config)

}

static async getProfileCompletion(token) {
  let config = {
    headers: {
      Authorization: `Token ${token}`
  }
}

return await axios.get(api+'profile',config)

}

static async retrieveFaq(token) {
  let config = {
    headers: {
      Authorization: `Token ${token}`
  }
}

return await axios.get(api+'faq',config)
}

static async retrieveKnowledgeDocuments(token) {
  let config = {
    headers: {
      Authorization: `Token ${token}`
  }
}

return await axios.get(api+'documents',config)
}

static async retrieveBlogs(token) {
  let config = {
    headers: {
      Authorization: `Token ${token}`
  }
}

return await axios.get(api+'blogs',config)
}

static async retrieveSingleBlog(token,blogId) {
  let config = {
    headers: {
      Authorization: `Token ${token}`
  }
}

return await axios.get(api+`blogs/${blogId}`,config)
}

static async createTicket(token,formValues) {
  let config = {
    headers: {
      Authorization: `Token ${token}`
  }
}


return await axios.post(api+'contact-us',formValues,config)
}




}

export default Requests;
