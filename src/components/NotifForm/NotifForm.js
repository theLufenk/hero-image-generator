import React from "react";
import styles from "../../index.css"

class NotifForm extends React.Component {

    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange (e) {
        this.props.handleInputChange(e)
    }

    render() {
        const title = this.props.title;
        const body = this.props.body;
        const impressions = this.props.impressions;
        const revenue = this.props.revenue;
        const clicks = this.props.clicks;
        return (
            <div className={styles["form-container"]}>
                <h4>Notification Configuration</h4>
                <div>
                    <label>
                        <span>Title:</span>
                        <input type='text'
                               name="title"
                               value={title}
                               onChange={this.handleInputChange}/>
                    </label>
                </div>
                <div>
                    <label>
                        <span>Body:</span>
                        <input type='text'
                               name="body"
                               value={body}
                               onChange={this.handleInputChange}/>
                    </label>
                </div>
                <hr style={{display:'block', borderTopColor: '#eee', width:'70%',margin:'30px auto'}} />
                <h4>Hero Image Configuration</h4>
                <div>
                    <label>
                        <span>Revenue:</span>
                        <input type='text'
                               name="revenue"
                               value={revenue}
                               onChange={this.handleInputChange}/>
                    </label>
                </div>
                <div>
                    <label>
                        <span>Impressions:</span>
                        <input type='text'
                               name="impressions"
                               value={impressions}
                               onChange={this.handleInputChange}/>
                    </label>
                </div>
                <div>
                    <label>
                        <span>Clicks:</span>
                        <input type='text'
                               name="clicks"
                               value={clicks}
                               onChange={this.handleInputChange}/>
                    </label>
                </div>
            </div>
        )
    }
}

export default NotifForm