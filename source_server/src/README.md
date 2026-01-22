# Wiki

Headers are not necessary for logins.

All request you do to the server that needs any authentication needs this header:
```
'session': '123...'
```
The wrong session will return the 401 error

### Pointers
``/drive/login (POST)``: login in the storage
```json
body: {
    "username": "test",
    "password": "supersecret",
}

returns: {
    "error": false,
    "session": "123123123..."
}
```

``/drive/requestfile (GET)``: request the file to enable downloading, example: address/requestfile?directory=/test.mp4
```json
headers: {
    "session": "123..."
}

returns: {
    "error": false,
    "message": "The File has been requested, you can now access it"
}
```

``/drive/getfile (GET)``: download the file, example: address/getfile?directory=/test.mp4
```json
query: {
    "directory": "/test.mp4"
}

returns: stream pipe
```

``/drive/getfolders (GET)``: returns "folder": [], "files": [], example: address/getfolders?directory=/myfolder
```json
query: {
    "directory": "/test.mp4"
}

headers: {
    "session": "123..."
}

returns: {
    "folders": [],
    "files": []
}
```

``/drive/requestImage (GET)``: request the image to enable in your ip address (returns a success code, use getImage after), example: address/requestImage?directory=/image/test.png
```json
query: {
    "directory": "/test.png"
}

headers: {
    "session": "123..."
}

returns: {
    "error": false,
    "message": "The Image has been requested, you can now access it"
}
```

``/drive/getImage (GET)``: returns the image array bytes via stream, if avaiable to your ip address, address/getImage?directory=/image/test.png
```json
query: {
    "directory": "/test.png"
}

returns: stream pipe
```

``/drive/requestVideo (GET)``: request the video to enable in your ip address (returns a success code, use getVideo after), example: address/requestVideo?directory=/movies/dereguejhonsons.mp4
```json
query: {
    "directory": "/test.mp4"
}

headers: {
    "session": "123..."
}

returns: {
    "error": false,
    "message": "The video has been requested, you can now access it"
}
```

``/drive/getVideo (GET)``: stream the requested video, if avaiable to your ip address, example: address/getVideo?directory=/movies/
```json
query: {
    "directory": "/test.png"
}

returns: stream pipe
```

``/drive/createfolder (GET)``: create a folder in selected location, example: { directory: "/myfolder" }
```json
query: {
    "directory": "/test.mp4"
}

headers: {
    "session": "123..."
}

returns: {
    "error": false,
    "message": "Success"
}
```

``/drive/uploadfile (POST)``: upload a file in selected folder, example: formData Body: { saveDirectory: "/movies/jhonsons.mp4 }, you need to send the files as the form data default
```json
headers: {
    "session": "123..."
}

formData: {
    "saveDirectory": "/",
}

returns: {
    "error": false,
    "message": "Success"
}
```

``/drive/delete (DELETE)``: delete a folder or file selected, example: address/delete?item=/movies/jhonsons.mp4 OR address/delete?item=/movies
```json
query: {
    "item": "/test.mp4"
}

headers: {
    "session": "123..."
}

returns: {
    "error": false,
    "message": "Success"
}
```

``/drive/downloadvideo (POST)``: download a video from a specific url
```json
headers: {
    "session": "123..."
}

body: {
    "videoLink": "https://youtube.com/123",
    "videoName": "myvideo.mp4",
    "directory": "/"
}

returns: {
    "error": false,
    "message": "Success"
}
```

Success pointers will reset the internal DDOS protection