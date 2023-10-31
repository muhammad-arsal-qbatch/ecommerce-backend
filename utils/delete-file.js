import fs from 'fs';

const DeleteFile = (path) => {

  fs.unlink(path , (error) => {
    if(error){
      console.log('error while deleting image from folder');
    }

  });
}

export default DeleteFile;
