import React, { Component } from 'react';
import { debounce } from 'lodash';
import HighlighterRects from './HighlighterRects';
import { Spin, Tooltip } from 'antd';
import B from 'bluebird';
import styles from './Inspector.css';
import { parseCoordinates } from './shared';

/**
 * Shows screenshot of running application and divs that highlight the elements' bounding boxes
 */
export default class Screenshot extends Component {

  constructor (props) {
    super(props);
    this.containerEl = null;
    this.state = {
      scaleRatio: 1,
      x: null,
      y: null,
    };
    this.updateScaleRatio = debounce(this.updateScaleRatio.bind(this), 1000);
  }

    /**
   * Calculates the ratio that the image is being scaled by
   */
  updateScaleRatio () {
    const screenshotEl = this.containerEl.querySelector('img');

    // now update scale ratio
    try {
      const {x1, x2} = parseCoordinates(this.props.source.children[0].children[0]);
      this.setState({
        scaleRatio: (x2 - x1) / screenshotEl.offsetWidth
      });
    } catch (error) {
        console.log('no screenshot: ' + error);
    }
  }

  async handleScreenshotClick () {
    const {screenshotInteractionMode,
      swipeStart, swipeEnd, setSwipeStart, setSwipeEnd} = this.props;
    const {x, y} = this.state;

    if (screenshotInteractionMode === 'tap') {
    } else if (screenshotInteractionMode === 'swipe') {
      if (!swipeStart) {
        setSwipeStart(x, y);
      } else if (!swipeEnd) {
        setSwipeEnd(x, y);
        await B.delay(500); // Wait a second to do the swipe so user can see the SVG line
        await this.handleDoSwipe();
      }
    }
  }

  handleMouseMove (e) {
    const {screenshotInteractionMode} = this.props;
    const {scaleRatio} = this.state;

    if (screenshotInteractionMode !== 'select') {
      const offsetX = e.nativeEvent.offsetX;
      const offsetY = e.nativeEvent.offsetY;
      const x = offsetX * scaleRatio;
      const y = offsetY * scaleRatio;
      this.setState({
        ...this.state,
        x: Math.round(x),
        y: Math.round(y),
      });
    }
  }

  handleMouseOut () {
    this.setState({
      ...this.state,
      x: null,
      y: null,
    });
  }

  async handleDoSwipe () {
    const {clearSwipeAction} = this.props;
    clearSwipeAction();
  }

  componentDidMount () {
    // When DOM is ready, calculate the image scale ratio and re-calculate it whenever the window is resized
    this.updateScaleRatio();
    window.addEventListener('resize', this.updateScaleRatio);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateScaleRatio);
  }

  // FIXME: Make changeable
  getScreenshotFile () {
    const fs = require('fs');
    try {
      return 'file://' + fs.readFileSync('./tmp/screen_path.txt', 'utf-8');
    } catch (error) {
      console.log('no file:' + error);
    }
  }

  render () {
    const {screenshotInteractionMode, swipeStart, swipeEnd} = this.props;
    const {scaleRatio, x, y} = this.state;

    // If we're tapping or swiping, show the 'crosshair' cursor style
    const screenshotStyle = {};
    if (screenshotInteractionMode === 'tap' || screenshotInteractionMode === 'swipe') {
      screenshotStyle.cursor = 'crosshair';
    }

    let swipeInstructions = null;
    if (screenshotInteractionMode === 'swipe' && (!swipeStart || !swipeEnd)) {
      if (!swipeStart) {
        swipeInstructions = "Click swipe start point";
      } else if (!swipeEnd) {
        swipeInstructions = "Click swipe end point";
      }
    }

    const screenImg = <img src={this.getScreenshotFile()} id="screenshot" />;

      // Show the screenshot and highlighter rects. Show loading indicator if a method call is in progress.
    return <div className={styles.innerScreenshotContainer}>
        <div ref={(containerEl) => { this.containerEl = containerEl; }}
          style={screenshotStyle}
          onClick={this.handleScreenshotClick.bind(this)}
          onMouseMove={this.handleMouseMove.bind(this)}
          onMouseOut={this.handleMouseOut.bind(this)}
          className={styles.screenshotBox}>
          {x !== null && <div className={styles.coordinatesContainer}>
            <p>X: {x}</p>
            <p>Y: {y}</p>
          </div>}
          {swipeInstructions && <Tooltip visible={true} placement="top" title={swipeInstructions}>{screenImg}</Tooltip>}
          {!swipeInstructions && screenImg}
          {screenshotInteractionMode === 'select' && this.containerEl && <HighlighterRects {...this.props} containerEl={this.containerEl} />}
          {screenshotInteractionMode === 'swipe' &&
            <svg className={styles.swipeSvg}>
              {swipeStart && !swipeEnd && <circle
                cx={swipeStart.x / scaleRatio}
                cy={swipeStart.y / scaleRatio}
              />}
              {swipeStart && swipeEnd && <line
                x1={swipeStart.x / scaleRatio}
                y1={swipeStart.y / scaleRatio}
                x2={swipeEnd.x / scaleRatio}
                y2={swipeEnd.y / scaleRatio}
              />}
            </svg>
          }
        </div>
      </div>;
  }
}
