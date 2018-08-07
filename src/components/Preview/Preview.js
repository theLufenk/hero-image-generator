import React from "react";

import style from "../../index.css";

const HeroImage = require("../../assets/hero-image.png");

class Preview extends React.Component {

    constructor(props) {
        super(props)
        this.imageUrl = HeroImage;
    }

    componentDidMount() {
        this.canvas = this.refs.canvas
        this.ctx = this.canvas.getContext("2d")
        this.ctx.scale(2, 2)
        this.img = this.refs.image

        this.img.onload = () => {
            this.ctx.drawImage(this.img, 0, 0, 720, 480,     // source rectangle
                0, 0, 360, 240)
        }

        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    updateCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.img, 0, 0, 720, 480,     // source rectangle
            0, 0, 360, 240)

        if (this.props.revenue) {
            this.ctx.font = "bold 42px Roboto";
            this.ctx.fillStyle = "#7bb938";
            this.ctx.textAlign = "center";
            this.ctx.fillText("$" + this.props.revenue, this.canvas.width / 4, 120)
        }

        this.ctx.font = "normal 16px Roboto";
        this.ctx.fillStyle = "#4a4a4a";
        this.ctx.textAlign = "left";

        if (this.props.impressions) {
            this.ctx.fillText(this.props.impressions, 72, 198)
        }
        if (this.props.clicks) {
            this.ctx.fillText(this.props.clicks, 255, 197)
        }


    }

    getImageBlob() {
        let convertCanvasToBlob = new Promise((resolve, reject) => {
            this.canvas.toBlob((blob) => {
                resolve(blob)
            });
        });

        return convertCanvasToBlob;
    }

    render() {
        return (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <canvas ref="canvas" width={720} height={480} style={{width: '360px', height: '240px'}}/>
                <img ref="image" src={this.imageUrl} className={style.hidden}/>
            </div>
        )
    }
}

export default Preview
