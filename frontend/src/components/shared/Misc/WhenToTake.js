import React from 'react';

export default class WhenToTake extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const list = () => {
      return this.props.data.map((value,index) => {
        let styles = {
          ...this.props.styles,
          marginRight: "10px",
          borderRadius: "2px",
          padding: "5px"
        }
        if (value == "morning") {
          styles.backgroundColor = "rgba(0,185,251,0.1)"
          styles.color = "#00b9fb";
        } else if (value == "afternoon") {
          styles.backgroundColor = "rgba(255,165,0,0.1)"
          styles.color = "orange";
        } else {
          styles.backgroundColor = "rgba(191,0,255,0.1)";
          styles.color = "#bf00ff";
        }
        return (
          <span style={styles} key={"whenToTake"+index}>{value}</span>
        )
      });
    }

    return (
      <>
        {this.props.data && this.props.data.length > 0 ?
          list()
          : null}
      </>
    )
  }
}
