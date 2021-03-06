import React from "react";
import { LangContext } from "../../services/context";

//PROPS: Number section, Function setTranslation, Function changeTranslation, Fuction cancelEdit, String originalTranslation, Number startingX
//Note: state is kept in the parent "Studio" Element, whenever the textarea content is changed, the parent state is changed.
function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  document.querySelector(
    "#" + elmnt.id + " .editDragSection"
  ).onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    const docContainer = document.querySelector("#studio-container");
    const docContainerBottom =
      docContainer.offsetTop + docContainer.offsetHeight;
    console.log(docContainer.offsetTop);
    console.log(docContainer.offsetHeight);
    console.log(docContainerBottom);
    //+/- 40 because of the 20px translate y
    // if (elmnt.offsetTop - pos2 + elmnt.offsetHeight + 40 > docContainerBottom) {
    //   elmnt.style.top = docContainerBottom - elmnt.offsetHeight - 40 + "px";
    // } else if (elmnt.offsetTop - pos2 < docContainer.offsetTop) {
    //   elmnt.style.top = docContainer.offsetTop;
    // } else {
    //   elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    // }

    if (
      elmnt.offsetTop - pos2 + elmnt.offsetHeight >
      document.querySelector("body").offsetHeight
    ) {
      console.log(elmnt.offsetTop - pos2);
      const lowerBound =
        document.querySelector("body").offsetHeight - elmnt.offsetHeight;
      console.log("Lower Bounds", lowerBound);
      elmnt.style.top = lowerBound + "px";
      console.log("Then set to: ", elmnt.style.top);
    } else {
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    }
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var startingY = 0;//this is just here so it will ONLY be set when the componenet mounts, not everytime it updates. Make it var because the component can mount multiple times

class editTranslation extends React.Component {
  constructor(props) {
    super();
  }

  saveText = () => {
    this.props.setTranslation();
  };

  changeState = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  changeTranslationProxy = (e) => {
    const t = e.target.value;
    this.props.changeTranslation(t);
  }

  componentDidMount() {
    this.props.changeTranslation(this.props.originalTranslation);
    startingY = this.props.startingY;
    var thisElement = document.querySelector(
      "#edit-translation-container textarea"
    );
    if (document.querySelector("#edit-translation-container textarea")) {
      console.log("Orginal Translation: ", this.props.originalTranslation);
      document.querySelector(
        "#edit-translation-container textarea"
      ).value = this.props.originalTranslation;
      dragElement(document.querySelector("#edit-translation-container"));
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.section !== prevProps.section){
      this.props.changeTranslation(this.props.originalTranslation)
      startingY = this.props.startingY;
      if (document.querySelector("#edit-translation-container textarea")) {
        console.log("Orginal Translation: ", this.props.originalTranslation);
        document.querySelector(
          "#edit-translation-container textarea"
        ).value = this.props.originalTranslation;
    }

    if (this.props.originalTranslation !== prevProps.originalTranslation) {
      
      }
    }
  }

  // componentDidUpdate() {
  //   var thisElement = document.querySelector(
  //     "#edit-translation-container textarea"
  //   );
  //   if (document.querySelector("#edit-translation-container textarea")) {
  //     console.log("Orginal Translation: ", this.props.originalTranslation);
  //     document.querySelector(
  //       "#edit-translation-container textarea"
  //     ).value = this.props.originalTranslation;
  //   }
  // }

  render() {
    var percent = Number(this.context.textEnd) / 100;
    if (percent > 0.7) percent = 0.7;
    if (percent < 0.3) percent = 0.3;
    var xValue = percent * window.outerWidth - 2;
    var widthValue = window.outerWidth - xValue;
    return (
      <div
        id="edit-translation-container"
        style={
          this.context.isMobile
            ? { bottom: "5px", left: "0px", width: "100%" }
            : {
                top: startingY + "px",
                left: xValue + "px",
                width: widthValue,
              }
        }
      >
        <div className="edit-translation-header">
          <h4>Section {this.props.section + 1}</h4>
          <div className="editDragSection">Click Here to Drag</div>
        </div>
        <textarea
          style={
            this.context.isMobile
              ? { width: "95%", maxWidth: "95%", minWidth: "95%" }
              : {
                  width: widthValue * 0.95,
                  maxWidth: widthValue * 0.95,
                  minWidth: widthValue * 0.95,
                }
          }
          onChange={this.changeTranslationProxy}
          name="translation"
          className="edit-translation-textarea"
          placeholder="No Translation Here"
        ></textarea>
        <div></div>
        <button onClick={this.saveText} className="confirm-button">
          Save Changes
        </button>
        <button onClick={this.props.cancelEdit} className="cancel-button">
          Cancel
        </button>
      </div>
    );
  }
}

editTranslation.contextType = LangContext;

export default editTranslation;
