import React, {Component} from 'react';
import style from './index.css';
import axios from 'axios';
import NotifForm from "./components/NotifForm/NotifForm";
import Preview from "./components/Preview/Preview";

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            title: 'Title for the notification',
            body: 'Notification body',
            revenue: '',
            impressions: '',
            clicks: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.createNotif = this.createNotif.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, () => {
            this.preview.updateCanvas()
        });
    }

    render() {
        const title = this.state.title;
        const body = this.state.body;
        const revenue = this.state.revenue;
        const impressions = this.state.impressions;
        const clicks = this.state.clicks;
        return (
            <div>
                <h2 className={style["text-center"]} state={this.state}>
                    Hero Image Generator
                </h2>
                <div className={style["page-container"]}>
                    <NotifForm title={title}
                               body={body}
                               revenue={revenue}
                               impressions={impressions}
                               clicks={clicks}
                               handleInputChange={this.handleInputChange}/>
                    <Preview title={title}
                             body={body}
                             revenue={revenue}
                             impressions={impressions}
                             clicks={clicks}
                             onRef={ref => (this.preview = ref)}/>
                </div>
                <div style={{marginTop: '100px', textAlign: 'center'}}>
                    <button onClick={this.createNotif}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#777',
                                border: 'solid #eee 1px',
                                borderRadius: '3px',
                                color: '#fff',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}> Send Notification
                    </button>
                </div>
            </div>
        );
    }

    createNotif(e) {

        this.preview.getImageBlob()
            .then((blob) => {
                // this.heroImageUploading = true
                blob.lastModifiedDate = new Date();
                blob.name = "hero-image.png";

                document.querySelector('#loadingOverlay').style.display='block';
                this.uploadFile(blob)
                    .then((fileUrl) => {
                        const redir_url = "https://pushowl.com";
                        window.pushowlUrl = (`https://dashboard-dev.pushowl.com/create-campaign?title=${this.state.title}&description=${this.state.body}&redirect_url=${redir_url}&image=`+fileUrl);
                    }, (err) => {
                        console.log('Error in hero Image Upload', err)
                    })
                    .finally(() => {
                        document.querySelector('#loadingMessage').innerText='Done';
                        setTimeout(() => {
                            document.querySelector('#redirectButton').style.display='inline-block';
                            document.querySelector('#redirectMessage').style.display='block';
                            document.querySelector('#loadingMessage').style.display='none';
                        }, 1000)
                    })
            });
    }

    uploadFile(file) {
        let promise = new Promise((resolve, reject) => {
            axios
                .get('https://api.pushowl.com/api/private/v1/playground/sign-s3/?filename=' + file.name + '&filetype=' + file.type)
                .then((resp) => {
                    let s3Response = (resp.data.result)
                    this.uploadToS3(file, s3Response.data, s3Response.url)
                        .then((url) => {
                            console.log('Upload success.', url)
                            resolve(url)
                        }, (err) => {
                            console.log('S3 upload failed.', err)
                            reject(err)
                        })
                }, () => {
                    reject('Error in Getting S3 Token')
                })
        })

        return promise
    }

    uploadToS3(file, s3Data, s3Url) {
        // Prepare post data for upload to s3
        let postData = new FormData()
        for (let key in s3Data.fields) {
            postData.append(key, s3Data.fields[key])
        }
        postData.append('file', file)

        // Process the upload to S3 in async
        let promise = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open('POST', s3Data.url)

            let postData = new FormData()
            for (let key in s3Data.fields) {
                postData.append(key, s3Data.fields[key])
            }
            postData.append('file', file)

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 204) {
                        console.log('File Uploaded to S3', new Date())
                        resolve(s3Url)
                    } else {
                        reject('S3 upload returned a non-20x status code')
                    }
                }
            }
            xhr.send(postData)
        })

        return promise
    }


}


export default App;