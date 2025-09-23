import React from "react";
import './imageUploaderStyle.css';

class ImageUploaderThumbnails extends React.Component {
    render() {
      let Input = this.props.input || null;
      return (
        <div className="image-thumbnails">
          <div className="image-thumbnail image-upload-button-container">
            <Input />
            <span className="text-white">+</span>
          </div>
          {this.props.thumbnails.map((thumbnail, index) => (
            <div
              className={"image-thumbnail" + (index === this.props.current ? " image-thumbnail-selected" : "")}
              style={{ "backgroundImage": `url(${thumbnail})` }}
              onClick={e => {
                this.props.onSelect && this.props.onSelect(index);
              }}
              disabled={this.props.prducts === 5}
            />
          ))}
        </div>
      );
    }
  }

export default ImageUploaderThumbnails;