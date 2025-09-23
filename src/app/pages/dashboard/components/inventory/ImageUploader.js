import React from "react";
import ImageUploaderThumbnails from './ImageUploaderThumbnails';
import './imageUploaderStyle.css';

class ImageUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            previewIndex: 0,
            showDropArea: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.showDropArea = this.showDropArea.bind(this);
        this.hideDropArea = this.hideDropArea.bind(this);
        this.showNextImage = this.showNextImage.bind(this);
        this.showPreviousImage = this.showPreviousImage.bind(this);
        this.removeCurrentImage = this.removeCurrentImage.bind(this);
    }
    readFileData(file) {
        const promise = new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = () => {
                reject("Something went wrong when reading the file");
            };
            reader.readAsDataURL(file);
        });
        return promise;
    }
    selectImageForPreview(previewIndex, relative) {
        if (relative) {
            this.setState((prevState) => {
                let newState = Object.assign({}, prevState)
                let imageCount = this.state.files.length
                newState.previewIndex = (prevState.previewIndex + previewIndex + imageCount) % (imageCount)
                return newState
            })
        } else {
            this.setState({ previewIndex });
        }
    }
    showNextImage() {
        this.selectImageForPreview(1, true)
    }
    showPreviousImage() {
        this.selectImageForPreview(-1, true)
    }
    removeCurrentImage(e) {
        e && e.preventDefault()
        let indexToRemove = this.state.previewIndex
        this.setState((prevState) => {
            let nextState = Object.assign({}, prevState)
            nextState.files = prevState.files.filter((_, index) => (
                index !== indexToRemove
            ))
            nextState.previewIndex = Math.max(Math.min(nextState.files.length - 1, prevState.previewIndex), 0)
            return nextState
        })
    }
    handleInputChange(e) {
        e && e.stopPropagation()
        let files = e.target.files;
        let fileReadProcesses = Array.prototype.map.call(files, file =>
            this.readFileData(file)
        );
        Promise.all(fileReadProcesses).then(thumbnails => {
            let filesData = thumbnails.map((thumbnail, index) => ({
                file: files[index],
                thumbnail
            }));
            this.setState(prevState => {
                let newState = Object.assign({}, prevState);
                newState.files = prevState.files.concat(filesData);
                this.props.getUrl(newState.files.map(item => item.thumbnail));
                return newState;
            });
        });
    }
    showDropArea(e) {
        e && e.preventDefault()
        this.setState({ showDropArea: true })
    }
    hideDropArea(e) {
        e && e.preventDefault()
        this.setState({ showDropArea: false })
    }
    render() {
        
        let Input = () => (
            <input
                type="file"
                disabled={this.props?.products?.length === 5}
                accept="image/png, image/jpg, image/jpeg"
                multiple={this.props.multiple || false}
                onChange={this.handleInputChange}
                className="image-upload-button"
            />
        );
        let { previewIndex } = this.state
        let previewImage = this.state.files.length
            ? this.state.files[previewIndex].thumbnail
            : "";
        return (
            <div className="image-uploader">
                <div className="image-uploader-container">
                    {(!this.state.files.length || this.state.showDropArea) ? (
                        <div className="image-upload-button-container image-upload-button-view-full">
                            <Input />
                            <p className="text-center text-white"><i className="fas fa-camera text-white"></i><br />
                                Click here or drag images here to upload</p>
                        </div>
                    ) : [
                        <div
                            key="1"
                            className="image-upload-preview"
                            style={{ "backgroundImage": `url(${previewImage})` }}
                        >
                            {this.props.multiple ? (
                                <div className="image-preview-index">
                                    {previewIndex + 1} &#x2f;  {this.state.files.length}
                                </div>
                            ) : null}
                            {this.props.multiple && this.state.files.length && (
                                <div className="image-navigation-buttons">
                                    <button className="image-navigation-button"
                                        onClick={this.showPreviousImage}
                                    >
                                        &#10092;
                                    </button>
                                    <button className="image-navigation-button"
                                        onClick={this.showNextImage}
                                    >
                                        &#10093;
                                    </button>
                                </div>
                            )}
                        </div>,
                        <div className="image-action-buttons" key="2">
                            <button className="image-action-button"><i class="fas fa-eye"></i></button>
                            <button className="image-action-button" onClick={this.removeCurrentImage}><i class="fas fa-trash"></i></button>
                        </div>
                    ]}
                </div>
                {this.props.multiple && this.state.files.length ? (
                    <ImageUploaderThumbnails
                        thumbnails={this.state.files.map(image => image.thumbnail)}
                        current={previewIndex}
                        onSelect={index => {
                            this.selectImageForPreview(index);
                        }}
                        input={Input}
                        products={this.props.products}
                    />
                ) : null}
            </div>
        );
    }
}

export default ImageUploader;