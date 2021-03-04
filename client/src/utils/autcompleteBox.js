/// marker functions--------------------------------------------------------------------
  /**
   * shows a position marker for where a user has selected input content
   * @param {object} e - mouseup event for text selection
   */
  const getSelectionArea = e => {
    // grab the input element
    // console.log('get selection area');
    const { currentTarget: input } = e
    // grab the properties of the input we are interested in
    const {
      offsetLeft,
      offsetWidth,
      scrollLeft,
      scrollTop,
      selectionStart,
      selectionEnd,
    } = input
    // grab styling properties we are interested in
    const { paddingRight } = getComputedStyle(input)
    // create a function that will handle clicking off of the input and hide the marker
    const processClick = evt => {
      if (e !== evt && evt.target !== e.target) {
        toggleMarker()
      }
    }
    // create a function that will toggle the showing of the marker
    const toggleMarker = () => {
      input.__IS_SHOWING_MARKER = !input.__IS_SHOWING_MARKER

      if (input.__IS_SHOWING_MARKER && !input.__MARKER) {
        // assign a created marker to input
        input.__MARKER = createMarker('Here\'s your selection! 🎉', 'selection')
        // append it to the body
        document.body.appendChild(input.__MARKER)
        document.addEventListener('click', processClick)
      } else {
        // console.log('removing 2222222222222222');
        // document.body.removeChild(input.__MARKER)
        // document.removeEventListener('click', processClick)
        // input.__MARKER = null
      }
    }
    // if selectionStart === selectionEnd then there is no actual selection, hide the marker and return
    if (selectionStart === selectionEnd) {
      if (input.__IS_SHOWING_MARKER) toggleMarker()
      return
    }
    // we need to get the start and end positions so we can work out a midpoint to show our marker
    // first, get the starting top and left using selectionStart
    const { y: startTop, x: startLeft } = getCursorXY(input, selectionStart);
        // console.log('starttop',startTop);
    // then get the ending top and left using selectionEnd
    const { y: endTop, x: endLeft } = getCursorXY(input, selectionEnd)
    // if the marker isn't showing and there's a selection, show the marker
    if (!input.__IS_SHOWING_MARKER && selectionStart !== selectionEnd) {
      toggleMarker()
    }
    // if the marker is showing then update its position
    if (input.__IS_SHOWING_MARKER) {
      // we don't care about the value of endTop as our marker will always show at the top point and this will always be startTop
      // account for scroll position by negating scrollTop
      // as for left positioning, we need to first work out if the end point is on the same line or we have multiline selection
      // in the latter case, the endpoint will be the furthest possible right selection point
      const endPoint =
        startTop !== endTop ? offsetLeft + (offsetWidth - parseInt(paddingRight, 10)) : endLeft;
        // console.log('starttop',startTop);
      // we want the marker to show above the selection and in the middle of the selection so start point plus halve the endpoint minus the start point
      const newLeft = startLeft + ((endPoint - startLeft) / 2)
      // console.log('startLEFT',newLeft);
      // set the marker positioning
      input.__MARKER.setAttribute('style', `left: ${newLeft - scrollLeft}px; top: ${startTop - scrollTop}px`)
    }
  }


  // create enumeration object for repeated class names
  const CLASSES = {
    marker: 'input__marker',
    visible: 'input__marker--visible',
  }

  const createMarker = (content, modifier) => {
    console.log('---JUST CREATED THE MARKER!!')
    // create a marker for the input
    let marker = document.querySelector('.input__marker.input__marker--position');
    if (!marker) {
      marker = document.createElement('div')
      marker.classList.add(CLASSES.marker, `${CLASSES.marker}--${modifier}`)
      marker.id = 'autocompleteSuggestionBox' // needed to remove it when we route to somewhere else
      marker.textContent = content
    }
    return marker
  }

  /**
   * returns x, y coordinates for absolute positioning of a span within a given text input
   * at a given selection point
   * @param {object} input - the input element to obtain coordinates for
   * @param {number} selectionPoint - the selection point for the input
   */
  const getCursorXY = (input, selectionPoint) => {
    // console.log('------CURSOR');
    const {
      offsetLeft: inputX,
      offsetTop: inputY,
    } = input
    // create a dummy element that will be a clone of our input
    const div = document.createElement('div')
    // get the computed style of the input and clone it onto the dummy element
    const copyStyle = getComputedStyle(input)
    for (const prop of copyStyle) {
      div.style[prop] = copyStyle[prop]
    }
    // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>
    const swap = '.'
    const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value
    // set the div content to that of the textarea up until selection
    const textContent = inputValue.substr(0, selectionPoint)
    // set the text content of the dummy element div
    div.textContent = textContent
    if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
    // if a single line input then the div needs to be single line and not break out like a text area
    if (input.tagName === 'INPUT') div.style.width = 'auto'
    // create a marker element to obtain caret position
    const span = document.createElement('span')
    // give the span the textContent of remaining content so that the recreated dummy element is as close as possible
    span.textContent = inputValue.substr(selectionPoint) || '.'
    // append the span marker to the div
    div.appendChild(span)
    // append the dummy element to the body
    document.body.appendChild(div)
    // get the marker position, this is the caret position top and left relative to the input
    const { offsetLeft: spanX, offsetTop: spanY } = span
    // lastly, remove that dummy element
    // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
    document.body.removeChild(div)
    // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input
    // console.log('inputY',inputY, 'and spanY', spanY);
    return {
      x: inputX + spanX,
      y: inputY + spanY,
    }
  }


  /**
   * shows a position marker that highlights where the cursor is
   * @param {object} e - the input or click event that has been fired
   */
  const showPositionMarker = e => {
    // console.log('show position marker');
    // grab the input element
    const { currentTarget: input } = e
    // console.log(input);
    // create a function that will handle clicking off of the input and hide the marker
    const processClick = evt => {
      if (e !== evt && evt.target !== e.target) {
        toggleMarker()
      }
    }
    // create a function that will toggle the showing of the marker
    const toggleMarker = () => {
      input.__IS_SHOWING_MARKER = !input.__IS_SHOWING_MARKER

      if (input.__IS_SHOWING_MARKER && !input.__MARKER) {
        // assign a created marker to input
        input.__MARKER = createMarker('', 'position'); // input.__MARKER = createMarker('Here I am! 😜', 'position')
        // append it to the body
        document.body.appendChild(input.__MARKER)
        document.addEventListener('click', processClick)
      } else {
        // console.log('remooooooooooooving');
        // document.body.removeChild(input.__MARKER)
        // document.removeEventListener('click', processClick)
        // input.__MARKER = null
      }
    }
    // if the marker isn't showing, show it
    if (!input.__IS_SHOWING_MARKER) toggleMarker()
    // if the marker is showing, update its position
    if (input.__IS_SHOWING_MARKER) {
      // console.log('updating');
      // grab the properties from the input that we are interested in
      const {
        offsetLeft,
        offsetTop,
        offsetHeight,
        offsetWidth,
        scrollLeft,
        scrollTop,
        selectionEnd,
      } = input
      // get style property values that we are interested in
      const { lineHeight, paddingRight } = getComputedStyle(input)
      // get the cursor X and Y from our helper function
      const { x, y } = getCursorXY(input, selectionEnd)
      // console.log('-------------------y', y);
      // set the marker positioning
      // for the left positioning we ensure that the maximum left position is the width of the input minus the right padding using Math.min
      // we also account for current scroll position of the input
      const newLeft = Math.min(
        x - scrollLeft,
        (offsetLeft + offsetWidth) - parseInt(paddingRight, 10)
      )
      // for the top positioning we ensure that the maximum top position is the height of the input minus line height
      // we also account for current scroll position of the input
      // console.log('--------------y', y);
      const newTop = Math.min(
        y - scrollTop,
        (offsetTop + offsetHeight) - parseInt(lineHeight, 10) // TODO ADDED remove this, causing problems
      )
      // console.log(parseInt(lineHeight, 10));
      // console.log('toooop',input.__MARKER.style.top);
      input.__MARKER.setAttribute('style', `left: ${newLeft}px; top: ${newTop}px`); // SOLVE TODO remove the harcoded 135
      // console.log('now',input.__MARKER.style.top);
    }
  }
///--------------------------------------------------------------------
const removeSuggestionBox = () => {
  const suggestionBoxElement = document.getElementById('autocompleteSuggestionBox');
  if (suggestionBoxElement) suggestionBoxElement.remove();
};

export {
  showPositionMarker,
  getSelectionArea,
  removeSuggestionBox
}